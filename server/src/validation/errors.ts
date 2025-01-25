import { ErrorCodes } from './codes';


const {
    VALIDATION_ERROR,
    NOT_FOUND_ERROR,
    INVALID_INPUT_ERROR,
    DATE_RANGE_ERROR } = ErrorCodes;

export class CustomError extends Error {
    public code: number;
    public details: string[];
    constructor(code: number, message: string, details: string[] = []) {
        super(message);
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends CustomError {
    constructor(message: string, details: string[] = []) {
        super(VALIDATION_ERROR, message, details);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(NOT_FOUND_ERROR, message);
    }
}

export class InvalidInputError extends CustomError {
    constructor(message: string) {
        super(INVALID_INPUT_ERROR, message);
    }
}

export class DateRangeError extends CustomError {
    constructor(message: string) {
        super(DATE_RANGE_ERROR, message);
    }
}
