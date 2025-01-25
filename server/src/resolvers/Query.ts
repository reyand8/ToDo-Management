import {ITaskArgs, ITasksListArgs, IQuery} from '../interfaces/Query.interface';
import {ISuccessResponse, IErrorResponse} from '../interfaces/Response.interface';
import { IPaginationResult } from '../interfaces/Pagination.interface';
import { ITask } from '../interfaces/Task.interface';
import { taskStore } from '../models/TaskStoreInstance';
import { createSuccessResponse } from './utils/responseUtils';
import { validateGetTasks, validateTaskId } from '../validation/validateTask';
import { paginate } from './utils/paginationUtils';


const Query: IQuery = {
    /**
     * Resolves the 'tasks' query to fetch tasks with optional filters and pagination.
     * @param _ - The parent query, unused here.
     * @param {ITasksListArgs} args - Arguments containing optional filters and pagination options.
     * @returns {ISuccessResponse<ITask[]> | IErrorResponse} - The result of the query (tasks or an error).
     */
    tasks: (_: unknown, { completed , dueDateRange, page, pageSize }: ITasksListArgs):
        ISuccessResponse<ITask[]> | IErrorResponse => {
        try {
            if (completed || dueDateRange) {
                validateGetTasks(completed, dueDateRange);
            }
            if (page < 1 || pageSize < 1) {
                throw new Error("Page and pageSize must be greater than 0");
            }

            const allTasks: ITask[] = taskStore.getAllTasks(completed, dueDateRange);

            const { data, currentPage, totalPages, totalItems }: IPaginationResult<ITask> =
                paginate(allTasks, page, pageSize);

            return createSuccessResponse<ITask[]>(data, {
                currentPage: currentPage,
                totalPages: totalPages,
                totalItems: totalItems,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Resolves the 'task' query to fetch a single task by its ID.
     * @param _ - The parent query, unused here.
     * @param {ITaskArgs} args - Arguments containing the task ID.
     * @returns {ISuccessResponse<ITask> | IErrorResponse} - The result of the query (task or an error).
     */
    task: (_: unknown, { id }: ITaskArgs): ISuccessResponse<ITask> | IErrorResponse => {
        try {
            validateTaskId(id);
            const task: ITask = taskStore.getTaskById(id);
            return createSuccessResponse(task);
        } catch (error) {
            throw error;
        }
    },
};

export default Query;
