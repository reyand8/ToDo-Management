import { ValidationError, DateRangeError, InvalidInputError } from './errors';
import { ITask } from '../interfaces/Task.interface';

/**
 * Checks if a string is a valid ISO date.
 * @param {string} date - The date string to be checked.
 * @returns {boolean} - `true` if the date is valid, otherwise `false`.
 */
export function isValidISODate(date: string): boolean {
    return !isNaN(Date.parse(date));
}

/**
 * Validates the filtering arguments for retrieving tasks, including
 * the completion status and due date range.
 * @param {boolean} [completed] - Optional flag to filter tasks by completion status.
 * @param {string[]} [dueDateRange] - Optional array of two ISO date strings for filtering tasks by due date.
 * @throws {DateRangeError} - Throws an error if the date range is invalid.
 */
export function validateGetTasks( completed?: boolean, dueDateRange?: string[]): void {
    if (dueDateRange) {
        const [startDate, endDate] = dueDateRange;
        if (!isValidISODate(startDate) || !isValidISODate(endDate)) {
            throw new DateRangeError("Start date and end date must be valid ISO dates.");
        }
        if (new Date(startDate) > new Date(endDate)) {
            throw new DateRangeError("Start date must be earlier than end date.");
        }
    }
}

/**
 * Validates that the task ID is valid.
 *
 * @param {string | number | undefined} id - The task ID to be validated.
 * @throws {InvalidInputError} - Throws an error if the task ID is not valid.
 */
export function validateTaskId(id: string | number | undefined): void {
    if (!id) {
        throw new InvalidInputError("Task ID is required.");
    }
    if (typeof id !== 'string') {
        throw new InvalidInputError("Task ID must be a string.");
    }
}

/**
 * Validates the input data for creating a new task.
 * @param {Omit<ITask, 'id'>} input - The task input data, excluding the task ID.
 * @throws {ValidationError} - Throws a validation error if any input fields are invalid.
 */
export function validateTaskInput(input: Omit<ITask, 'id'>): void {
    const errors: string[] = [];
    const { title, description, dueDate } = input;
    if (!title) {
        errors.push("Title is required.");
    } else if (title.length > 100) {
        errors.push("Title can not be more than 100 characters.");
    }
    if (description && description.length > 500) {
        errors.push("Description can not be more than 500 characters.");
    }
    if (!dueDate) {
        errors.push("DueDate is required.");
    } else if (isNaN(Date.parse(dueDate))) {
        errors.push("DueDate must be a valid ISO date.");
    }
    if (errors.length > 0) {
        throw new ValidationError("ValidationError" , errors);
    }
}

/**
 * Validates the input data for updating an existing task.
 *
 * @param {Omit<ITask, 'id'>} input - The task input data to be updated, excluding the task ID.
 * @throws {ValidationError} - Throws a validation error if any input fields are invalid.
 */
export function validateUpdateTaskInput(input: Omit<ITask, 'id'>): void {
    const errors: string[] = [];
    const { title, description, dueDate, } = input;
    if (title.length > 100) {
        errors.push("Title can not be more than 100 characters.");
    }
    if (description && description?.length > 500) {
        errors.push("Description can not be more than 500 characters.");
    }
    if (dueDate && isNaN(Date.parse(dueDate))) {
        errors.push("DueDate must be a valid ISO date.");
    }
    if (errors.length > 0) {
        throw new ValidationError("ValidationError", errors);
    }
}
