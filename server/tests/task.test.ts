import { ITask } from '../src/interfaces/Task.interface';
import { TaskStore } from '../src/models/Task';
import { NotFoundError } from '../src/validation/errors';


describe('TaskStore', (): void => {
    let taskStore: TaskStore;

    beforeEach((): void => {
        taskStore = new TaskStore();
    });

    describe('createTask', () => {
        it('should create a task and return it with an id', (): void => {
            const newTask: Omit<ITask, 'id'> = {
                title: 'Title',
                description: 'description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            };

            const createdTask: ITask = taskStore.createTask(newTask);

            expect(createdTask).toHaveProperty('id');
            expect(createdTask.title).toBe('Title');
            expect(createdTask.description).toBe('description');
            expect(createdTask.completed).toBe(false);
        });
    });

    describe('getAllTasks', (): void => {
        it('should return all tasks', (): void => {
            const task1: Omit<ITask, 'id'> = {
                title: 'Task 1',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            };
            const task2: Omit<ITask, 'id'> = {
                title: 'Task 2',
                description: 'Description',
                dueDate: '2022-01-02T00:00:00Z',
                completed: true,
            };
            taskStore.createTask(task1);
            taskStore.createTask(task2);

            const tasks: ITask[] = taskStore.getAllTasks();
            expect(tasks).toHaveLength(2);
            expect(tasks[0].title).toBe('Task 1');
            expect(tasks[1].title).toBe('Task 2');
        });

        it('should filter tasks by due date range', (): void => {
            const task1: Omit<ITask, 'id'> = {
                title: 'Task 1',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            };
            const task2: Omit<ITask, 'id'> = {
                title: 'Task 2',
                description: 'Description',
                dueDate: '2022-01-02T00:00:00Z',
                completed: true,
            };
            taskStore.createTask(task1);
            taskStore.createTask(task2);

            const tasksInRange: ITask[] = taskStore.getAllTasks(undefined,
                ['2022-01-01T00:00:00Z', '2022-01-01T23:59:59Z']);
            expect(tasksInRange).toHaveLength(1);
            expect(tasksInRange[0].title).toBe('Task 1');
        });
    });

    describe('getTaskById', () => {
        it('should return a task by its id', () => {
            const newTask: ITask = taskStore.createTask({
                title: 'Title',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            });

            const foundTask: ITask = taskStore.getTaskById(newTask.id);

            expect(foundTask).toEqual(newTask);
        });

        it('should throw a NotFoundError when the task is not found', (): void => {
            expect(() => taskStore.getTaskById('id')).toThrow(NotFoundError);
            expect(() => taskStore.getTaskById('id')).toThrowError('Task with ID id not found');
        });
    });

    describe('updateTask', (): void => {
        it('should update a task', (): void => {
            const newTask: ITask = taskStore.createTask({
                title: 'Title',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            });

            const updatedTask: ITask | null = taskStore.updateTask(newTask.id, { completed: true });

            expect(updatedTask).not.toBeNull();
            expect(updatedTask?.completed).toBe(true);
        });

        it('should return null if the task to update does not exist', (): void => {
            expect(() => taskStore.updateTask('id', { completed: true }))
                .toThrowError(NotFoundError);
            expect(() => taskStore.updateTask('id', { completed: true }))
                .toThrowError('Task with ID id not found');
        });
    });

    describe('deleteTask', (): void => {
        it('should delete a task', (): void => {
            const newTask: ITask = taskStore.createTask({
                title: 'Title',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            });

            const deleteResult: boolean = taskStore.deleteTask(newTask.id);
            expect(deleteResult).toBe(true);

            const tasks: ITask[] = taskStore.getAllTasks();
            expect(tasks).toHaveLength(0);
        });

        it('should return false if the task to delete does not exist', (): void => {
            const deleteResult: boolean = taskStore.deleteTask('id');
            expect(deleteResult).toBe(false);
        });
    });

    describe('markAllCompleted', (): void => {
        it('should mark all tasks as completed', (): void => {
            const task1: ITask = taskStore.createTask({
                title: 'Title',
                description: 'Description',
                dueDate: '2022-01-01T00:00:00Z',
                completed: false,
            });
            const task2: ITask = taskStore.createTask({
                title: 'Task',
                description: 'Description',
                dueDate: '2022-01-02T00:00:00Z',
                completed: false,
            });

            taskStore.markAllCompleted();

            expect(task1.completed).toBe(true);
            expect(task2.completed).toBe(true);
        });
    });
});
