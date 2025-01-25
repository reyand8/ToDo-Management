import {
    IErrorResponse,
    IPageInfo,
    ISuccessDeleteResponse,
    ISuccessResponse
} from '../../interfaces/Response.interface';


export const createSuccessResponse = <T>(data: T, pageInfo?: IPageInfo): ISuccessResponse<T> => ({
    success: true,
    data,
    pageInfo,
});

export const deleteSuccessResponse = (result: boolean): ISuccessDeleteResponse => ({
    success: result,
    message: result ? "Task successfully deleted" : "Failed to delete task",
});

export const createErrorResponse = (error: any): IErrorResponse => {
    const { code, details } = error.extensions.exception;
    return {
        success: false,
        error: {
            message: error.message,
            code: code || 'SERVER_ERROR',
            ...(details && { details: details }),
        },
    };
};
