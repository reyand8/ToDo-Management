import { IErrorResponse, ISuccessDeleteResponse, ISuccessResponse } from './Response.interface';
import { ITask } from './Task.interface';


export interface IMutation {
    createTask: (_: unknown, args: ICreateTaskArgs) => ISuccessResponse<ITask> | IErrorResponse;
    updateTask: (_: unknown, args: IUpdateTaskArgs) => ISuccessResponse<ITask | null> | IErrorResponse;
    deleteTask: (_: unknown, args: IDeleteTaskArgs) => ISuccessDeleteResponse | IErrorResponse;
    markAllCompleted: (_: unknown) => ISuccessResponse<ITask[]> | IErrorResponse;
}

export interface ICreateTaskArgs {
    input: Omit<ITask, 'id'>;
}

export interface IUpdateTaskArgs {
    id: string;
    input: Partial<Omit<ITask, "id">>;
}

export interface IDeleteTaskArgs {
    id: string;
}
