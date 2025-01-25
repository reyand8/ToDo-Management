import { IPaginationResult } from '../../interfaces/Pagination.interface';


export function paginate<T>( items: T[], page: number, pageSize: number ):
    IPaginationResult<T> {

    if (page < 1 || pageSize < 1) {
        throw new Error("Page and pageSize must be more than 0");
    }

    const totalItems: number = items.length;
    const totalPages: number = Math.ceil(totalItems / pageSize);
    const startIndex: number = (page - 1) * pageSize;
    const endIndex: number = startIndex + pageSize;

    if (startIndex >= totalItems) {
        throw new Error("Page exceeds available data");
    }

    const paginatedItems: (T)[] = items.slice(startIndex, endIndex);

    return {
        data: paginatedItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
}
