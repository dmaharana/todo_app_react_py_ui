
export interface Task {
    id: string;
    task_detail: string;
    task_status: string;
    created_at: string;
    updated_at: string;
}

export interface TaskList {
    count: number;
    next: string | null;
    previous: string | null;
    data: Task[];
}

export interface Stats {
    data: {
        by_status: {
            completed: number;
            in_progress: number;
            pending: number;
        };
        total: number;
    };
    success: boolean;
}
