import { IPaginationResult } from '../../interfaces/Pagination.interface';
import {ITask} from "../../interfaces/Task.interface";


export function paginate( items: ITask[], page: number, pageSize: number ):
    IPaginationResult<ITask> {

    if (page < 1 || pageSize < 1) {
        throw new Error("Page and pageSize must be more than 0");
    }

    const totalItems: number = items.length;
    const totalPages: number = Math.ceil(totalItems / pageSize);
    const startIndex: number = (page - 1) * pageSize;
    const endIndex: number = startIndex + pageSize;

    if (startIndex >= totalItems) {
        throw new Error("Page number exceeds the available data range");
    }

    const paginatedItems: ITask[] = items.slice(startIndex, endIndex);

    return {
        data: paginatedItems,
        currentPage: page,
        totalPages,
        totalItems,
    };
}
