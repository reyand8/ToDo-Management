export interface IBaseResponse {
    success: boolean;
}

export interface ISuccessResponse<T> {
    success: true;
    data: T;
    pageInfo?: IPageInfo;
}

export interface IPageInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface ISuccessDeleteResponse extends IBaseResponse {
    success: boolean;
    message: string;
}

export interface IErrorResponse extends IBaseResponse {
    success: false;
    error: {
        message: string;
        code: string | number;
        details?: any;
    };
}
