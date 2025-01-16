import { db } from '../../db.ts';
import type { DatabaseRecord, TableConfig } from '../../types/crud-api.ts';
import { validateRequiredFields, sanitizeData } from './validation.ts';

export class CrudApiService {
  private config: TableConfig;

  constructor(config: TableConfig) {
    this.config = config;
  }

  private buildInsertQuery(data: DatabaseRecord) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, index) => `$${index + 1}`);

    return {
      text: `
        INSERT INTO ${this.config.tableName} (${fields.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
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
    const query = `
      SELECT * FROM ${this.config.tableName}
      ${orderBy ? `ORDER BY ${orderBy}` : ''}
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async getById(id: string | number) {
    const query = `
      SELECT * FROM ${this.config.tableName}
      WHERE ${this.config.idColumn} = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  async create(data: DatabaseRecord) {
    validateRequiredFields(data, this.config.requiredFields);
    const sanitizedData = sanitizeData(data, this.config.allowedFields);
    const { text, values } = this.buildInsertQuery(sanitizedData);
    const result = await db.query(text, values);
    return result.rows[0];
  }

  async update(id: string | number, data: DatabaseRecord) {
    const sanitizedData = sanitizeData(data, this.config.allowedFields);
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
}
