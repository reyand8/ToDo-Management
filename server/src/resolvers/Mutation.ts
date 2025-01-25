import { ITask } from '../interfaces/Task.interface';
import { ICreateTaskArgs, IDeleteTaskArgs, IMutation, IUpdateTaskArgs }
    from '../interfaces/Mutation.interface';
import { ISuccessDeleteResponse, ISuccessResponse, IErrorResponse } from '../interfaces/Response.interface';
import { taskStore } from '../models/TaskStoreInstance';
import { createSuccessResponse, createErrorResponse,
    deleteSuccessResponse } from './utils/responseUtils';
import { CustomError } from '../validation/errors';
import { validateTaskId, validateTaskInput, validateUpdateTaskInput } from '../validation/validateTask';


const Mutation: IMutation = {

    /**
     * Resolves the 'createTask' mutation to create a new task.
     * @param _ - The parent mutation, unused here.
     * @param {ICreateTaskArgs} args - Arguments containing the task input data.
     * @returns {ISuccessResponse<ITask> | IErrorResponse} - The result of the mutation (created task or an error).
     */
    createTask: (_: unknown, { input }: ICreateTaskArgs): ISuccessResponse<ITask> | IErrorResponse => {
        try {
            validateTaskInput(input);
            const newTask: ITask = taskStore.createTask(input);
            return createSuccessResponse(newTask);
        } catch (error) {
           throw error;
        }
    },

    /**
     * Resolves the 'deleteTask' mutation to delete a task by its ID.
     * @param _ - The parent mutation, unused here.
     * @param {IDeleteTaskArgs} args - Arguments containing the task ID.
     * @returns {ISuccessDeleteResponse | IErrorResponse} - The result of the mutation (delete status or an error).
     */
    deleteTask: (_: unknown, { id }: IDeleteTaskArgs): ISuccessDeleteResponse | IErrorResponse => {
        try {
            validateTaskId(id);
            const result: boolean = taskStore.deleteTask(id);
            if (!result) {
                throw new Error('Task not found');
            }
            return deleteSuccessResponse(result);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Resolves the 'updateTask' mutation to update a task by its ID.
     * @param _ - The parent mutation, unused here.
     * @param {IUpdateTaskArgs} args - Arguments containing the task ID and the input data for the update.
     * @returns {ISuccessResponse<ITask | null> | IErrorResponse} - The result of the mutation (updated task or an error).
     */
    updateTask: (_: unknown, { id, input }: IUpdateTaskArgs): ISuccessResponse<ITask | null> | IErrorResponse => {
        try {
            validateTaskId(id);
            validateUpdateTaskInput({ ...input } as Omit<ITask, "id">);
            const updatedTask: ITask | null = taskStore.updateTask(id, input);
            return createSuccessResponse(updatedTask);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Resolves the 'markAllCompleted' mutation to mark all tasks as completed.
     *
     * @param _ - The parent mutation, unused here.
     * @returns {ISuccessResponse<ITask[]> | IErrorResponse} - The result of the mutation (updated tasks or an error).
     */
    markAllCompleted: (_: unknown): ISuccessResponse<ITask[]> | IErrorResponse => {
        try {
            const tasks: ITask[] = taskStore.markAllCompleted();
            return createSuccessResponse(tasks);
        } catch (error) {
            if (error instanceof CustomError) {
                return createErrorResponse(error);
            }
            return createErrorResponse(error);
        }
    },
};

export default Mutation;