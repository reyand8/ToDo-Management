export interface IPaginationResult<T> {
    data: T[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}