import {
    validateGetTasks,
    validateTaskId,
    validateTaskInput,
    validateUpdateTaskInput
} from '../src/validation/validateTask';
import { DateRangeError, InvalidInputError, ValidationError } from '../src/validation/errors';


describe('validateTask', (): void => {

    describe('validateGetTasks', (): void => {
        it('should throw a DateRangeError for invalid ISO dates', (): void => {
            try {
                validateGetTasks(false, ['invalid', '2022-02-01T00:00:00Z']);
            } catch (error) {
                const typedError: DateRangeError = error as DateRangeError;
                expect(typedError).toBeInstanceOf(DateRangeError);
                expect(typedError.message).toBe("Start date and end date must be valid ISO dates.");
            }

            try {
                validateGetTasks(false, ['2022-02-01T00:00:00Z', 'invalid']);
            } catch (error) {
                const typedError: DateRangeError  = error as DateRangeError;
                expect(typedError).toBeInstanceOf(DateRangeError);
                expect(typedError.message).toBe("Start date and end date must be valid ISO dates.");
            }
        });

        it('should throw a DateRangeError if start date is after end date', (): void => {
            try {
                validateGetTasks(false, ['2022-02-01T00:00:00Z', '2021-02-01T00:00:00Z']);
            } catch (error) {
                const typedError: DateRangeError  = error as DateRangeError;
                expect(typedError).toBeInstanceOf(DateRangeError);
                expect(typedError.message).toBe("Start date must be earlier than end date.");
            }
        });
    });

    describe('validateTaskId', () => {
        it('should throw an InvalidInputError for undefined ID', (): void => {
            try {
                validateTaskId(undefined);
            } catch (error) {
                const typedError: InvalidInputError = error as InvalidInputError;
                expect(typedError).toBeInstanceOf(InvalidInputError);
                expect(typedError.message).toBe("Task ID is required.");
            }
        });

        it('should throw an InvalidInputError for non-string ID', (): void => {
            try {
                validateTaskId(123);
            } catch (error) {
                const typedError: InvalidInputError = error as InvalidInputError;
                expect(typedError).toBeInstanceOf(InvalidInputError);
                expect(typedError.message).toBe("Task ID must be a string.");
            }
        });
    });

    describe('validateTaskInput', (): void => {
        it('should throw a ValidationError for missing title', (): void => {
            const invalidInput = {
                title: "",
                description: "Hello!!!",
                dueDate: "2022-02-01T00:00:00Z",
                completed: false,
            };
            try {
                validateTaskInput(invalidInput);
            } catch (error) {
                const typedError: InvalidInputError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("Title is required.");
            }
        });

        it('should throw a ValidationError for title exceeding 100 characters', (): void => {
            const invalidInput = {
                title: "q".repeat(101),
                description: "Hello!!!",
                dueDate: "2022-02-01T00:00:00Z",
                completed: false,
            };
            try {
                validateTaskInput(invalidInput);
            } catch (error) {
                const typedError: ValidationError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("Title can not be more than 100 characters.");
            }
        });

        it('should throw a ValidationError for missing dueDate', (): void => {
            const invalidInput = {
                title: "Q".repeat(10),
                description: "Hello!!!",
                dueDate: "",
                completed: false,
            };
            try {
                validateTaskInput(invalidInput);
            } catch (error) {
                const typedError: ValidationError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("DueDate is required.");
            }
        });
    });

    describe('validateUpdateTaskInput', (): void => {
        it('should throw a ValidationError for title exceeding 100 characters', (): void => {
            const invalidInput = {
                title: 'q'.repeat(101),
                description: 'Description',
                dueDate: '2022-02-01T00:00:00Z',
                completed: false,
            };
            try {
                validateUpdateTaskInput(invalidInput);
            } catch (error) {
                const typedError: ValidationError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("Title can not be more than 100 characters.");
            }
        });

        it('should throw a ValidationError for description exceeding 500 characters', (): void => {
            const invalidInput = {
                title: 'Title',
                description: 'q'.repeat(501),
                dueDate: '2022-02-01T00:00:00Z',
                completed: false,
            };
            try {
                validateUpdateTaskInput(invalidInput);
            } catch (error) {
                const typedError: ValidationError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("Description can not be more than 500 characters.");
            }
        });

        it('should throw a ValidationError for invalid dueDate', (): void => {
            const invalidInput = {
                title: 'Title',
                description: 'Description',
                dueDate: 'invalid',
                completed: false,
            };
            try {
                validateUpdateTaskInput(invalidInput);
            } catch (error) {
                const typedError: ValidationError = error as ValidationError;
                expect(typedError).toBeInstanceOf(ValidationError);
                expect(typedError.message).toBe("ValidationError");
                expect(typedError.details).toContain("DueDate must be a valid ISO date.");
            }
        });
    });
});
