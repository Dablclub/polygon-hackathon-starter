// src/server/utils/errors.ts
interface ErrorDetails {
  code?: string
  details?: unknown
}

export class AppError extends Error {
  statusCode: number
  details?: ErrorDetails

  constructor(message: string, statusCode = 500, details?: ErrorDetails) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.details = details
  }
}
