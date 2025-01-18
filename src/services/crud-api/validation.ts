import type {DatabaseRecord} from "../../types/crud-api.ts";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateRequiredFields = (data: DatabaseRecord, requiredFields: string[]) => {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new ValidationError(`Champs requis manquants: ${missingFields.join(', ')}`);
  }
};

export const sanitizeData = (data: DatabaseRecord, allowedFields: string[]) => {
  const sanitizedData: DatabaseRecord = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      sanitizedData[field] = data[field];
    }
  }
  return sanitizedData;
};
