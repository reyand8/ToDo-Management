import { IErrorResponse, ISuccessResponse } from './Response.interface';
import { ITask } from './Task.interface';


export interface IQuery {
    tasks: (_: unknown, args: ITasksListArgs) => ISuccessResponse<ITask[]> | IErrorResponse;
    task: (_: unknown, args: ITaskArgs) => ISuccessResponse<ITask> | IErrorResponse;
}

export interface ITasksListArgs {
    completed?: boolean;
    dueDateRange?: [string, string];
    page: number;
    pageSize: number;
}

export interface ITaskArgs {
    id: string;
}
