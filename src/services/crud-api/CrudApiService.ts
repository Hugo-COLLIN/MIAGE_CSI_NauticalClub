import { db } from '../../db.ts';
import type { DatabaseRecord, TableConfig } from '../../types/crud-api.ts';
import { validateRequiredFields, sanitizeData } from './validation.ts';

export class CrudApiService {
  private config: TableConfig;

  constructor(config: TableConfig) {
    this.config = config;
  }

  private buildInsertQuery(data: DatabaseRecord, tableName: string = this.config.tableName) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`);

    return {
      text: `
        INSERT INTO ${tableName} (${fields.join(', ')})
        VALUES (${placeholders.join(', ')})
      `,
      values
    };
  }

  private buildUpdateQuery(id: string | number, data: DatabaseRecord) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    return {
      text: `
        UPDATE ${this.config.tableName}
        SET ${setClause}
        WHERE ${this.config.idColumn} = $${fields.length + 1}
        RETURNING *
      `,
      values: [...values, id]
    };
  }

  async getAll(orderBy?: string) {
    let query = `SELECT a.* ${this.getJoinedSelectFields()} FROM ${this.config.tableName} a`;

    if (this.config.joinedSelect) {
      const { table, joinField } = this.config.joinedSelect;
      query += ` LEFT JOIN ${table} b ON a.${joinField} = b.${joinField}`;
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    const result = await db.query(query);
    return result.rows;
  }

  async getById(id: string | number) {
    let query = `SELECT a.*, ${this.getJoinedSelectFields()} FROM ${this.config.tableName} a`;

    if (this.config.joinedSelect) {
      const { table, joinField } = this.config.joinedSelect;
      query += ` LEFT JOIN ${table} b ON a.${joinField} = b.${joinField}`;
    }

    query += ` WHERE a.${this.config.idColumn} = $1`;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async create(data: DatabaseRecord) {
    validateRequiredFields(data, this.config.requiredFields);
    let sanitizedData = sanitizeData(data, this.config.allowedFields);

    if (this.config.joinedInsert) {
      const { table, fields, returnField, targetField } = this.config.joinedInsert;

      // Créer l'objet de données pour la table jointe
      const joinData: DatabaseRecord = {};
      fields.forEach(field => {
        if (data[field] !== undefined) {  // Vérifie si la donnée existe
          joinData[field] = data[field];
          delete sanitizedData[field];  // Retire le champ des données principales
        }
      });

      // Vérifier que toutes les données requises pour la table jointe sont présentes
      if (Object.keys(joinData).length === fields.length) {
        const joinQuery = this.buildInsertQuery(joinData, table);
        const joinResult = await db.query(
          joinQuery.text + ` RETURNING ${returnField}`,
          joinQuery.values
        );
        sanitizedData[targetField] = joinResult.rows[0][returnField];
      } else {
        throw new Error('Données manquantes pour la table jointe');
      }
    }

    const { text, values } = this.buildInsertQuery(sanitizedData);
    const result = await db.query(text + ' RETURNING *', values);
    return result.rows[0];
  }


  async update(id: string | number, data: DatabaseRecord) {
    const sanitizedData = sanitizeData(data, this.config.allowedFields);

    if (this.config.joinedSelect && data.quantite) {
      const { table, joinField } = this.config.joinedSelect;
      await db.query(
        `UPDATE ${table} SET quantite = $1 WHERE ${joinField} = (
          SELECT ${joinField} FROM ${this.config.tableName} WHERE ${this.config.idColumn} = $2
        )`,
        [data.quantite, id]
      );
    }

    const { text, values } = this.buildUpdateQuery(id, sanitizedData);
    const result = await db.query(text, values);
    return result.rows[0];
  }

  async delete(id: string | number) {
    const query = `
      DELETE FROM ${this.config.tableName}
      WHERE ${this.config.idColumn} = $1
    `;
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  private getJoinedSelectFields(): string {
    if (!this.config.joinedSelect) return '';
    return ', ' + this.config.joinedSelect.fields.map(field => `b.${field}`).join(', ');
  }
}
