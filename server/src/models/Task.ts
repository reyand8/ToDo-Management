import { NotFoundError } from '../validation/errors';
import { validateTaskId } from '../validation/validateTask';
import { ITask } from '../interfaces/Task.interface';


export class TaskStore {
    private tasks: ITask[] = [];
    private idCounter: number = 1;

    /**
     * Gets all tasks, optionally filtered by completion status and/or due date range.
     * @param completed Optional boolean to filter tasks by completion status.
     * @param dueDateRange Optional date range (start and end) to filter tasks by due date.
     * @returns An array of tasks that match the provided filters.
     */
    getAllTasks(completed?: boolean, dueDateRange?: [string, string]): ITask[] {
        return this.tasks.filter((task: ITask) => {
            return (
                this.isCompletedValid(task.completed, completed) &&
                this.isDueDateInRange(task.dueDate, dueDateRange)
            );
        });
    }

    /**
     * Verify if a task's completion status matches the given filter.
     * @param taskCompleted The task's status.
     * @param filterCompleted Optional boolean to filter tasks by completion status.
     * @returns True if the task matches the completion status filter, false otherwise.
     */
    private isCompletedValid(taskCompleted: boolean, filterCompleted?: boolean): boolean {
        if (typeof filterCompleted === "boolean") {
            return taskCompleted === filterCompleted;
        }
        return true;
    }

    /**
     * Verify if a task's due date falls within the provided date range.
     * @param dueDate The task's due date.
     * @param range Optional date range (start and end) to check against.
     * @returns True if the task's due date is within the range, false otherwise.
     */
    private isDueDateInRange(dueDate: string, range?: [string, string]): boolean {
        if (!range) {
            return true;
        }
        const [startDate, endDate] = range;
        const taskDueDate: Date = new Date(dueDate);
        const start: Date = new Date(startDate);
        const end: Date = new Date(endDate);

        return taskDueDate >= start && taskDueDate <= end;
    }

    /**
     * Retrieves a task by its unique ID.
     * @param id The ID of the task to retrieve.
     * @throws NotFoundError if no task with the given ID exists.
     * @returns The task object with the specified ID.
     */
    getTaskById(id: string): ITask {
        const data: ITask | undefined =
            this.tasks.find((task: ITask): boolean => task.id === id);
        if (!data) {
            throw new NotFoundError(`Task with ID ${id} not found`);
        }
        return data;
    }

    /**
     * Creates a new task.
     * @param input The task data to create (excluding the ID).
     * @returns The newly created task with an ID.
     */
    createTask(input: Omit<ITask, 'id'>): ITask {
        const newTask: ITask = {...input, id: (this.idCounter++).toString(), completed: false};
        this.tasks.push(newTask);
        return newTask;
    }

    /**
     * Updates an existing task's properties.
     * @param id The ID of the task to update.
     * @param input The partial task data to update.
     * @returns The updated task, or null if the task does not exist.
     */
    updateTask(id: string, input: Partial<Omit<ITask, 'id'>>): ITask | null {
        validateTaskId(id);
        const task: ITask | undefined = this.getTaskById(id);
        if (!task) {
            return null;
        }
        Object.assign(task, input);
        return task;
    }

    /**
     * Deletes a task by its ID.
     * @param id The ID of the task to delete.
     * @returns True if the task was successfully deleted, false if the task does not exist.
     */
    deleteTask(id: string): boolean {
        const taskIndex: number = this.tasks.findIndex((task: ITask): boolean => task.id === id);
        if (taskIndex === -1) {
            return false;
        }
        this.tasks.splice(taskIndex, 1);
        return true;
    }

    /**
     * Marks all tasks as completed.
     * @returns An array of all tasks with the 'completed' status set to true.
     */
    markAllCompleted(): ITask[] {
        this.tasks.forEach((task: ITask): boolean => (task.completed = true));
        return this.tasks;
    }
}
