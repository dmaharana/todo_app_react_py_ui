import type { Task } from "../types";

const API_BASE = "/api";

export const getTasks = async () => {
    const response = await fetch(`${API_BASE}/tasks`);
    // handle error
    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }
    return response.json();
};

export const getStats = async () => {
    const response = await fetch(`${API_BASE}/tasks/stats`);
    // handle error
    if (!response.ok) {
        throw new Error("Failed to fetch stats");
    }
    return response.json();
}

// get task by id
export const getTaskById = async (id: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    // handle error
    if (!response.ok) {
        throw new Error("Failed to fetch task");
    }
    return response.json();
};

export const createTask = async (task: { task_detail: string }) => {
    const response = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    // handle error
    if (!response.ok) {
        throw new Error("Failed to create task");
    }
    return response.json();
};

export const toggleTaskStatus = async (task: Task) => {
    const statusFlow: { [key: string]: string } = {
        'pending': 'in_progress',
        'in_progress': 'completed',
        'completed': 'pending'
      };
      
      const newStatus = statusFlow[task.task_status] || 'pending';
      await updateTask({ id: task.id, task_detail: task.task_detail, task_status: newStatus });
}

export const updateTask = async (task: { id: string, task_detail: string, task_status: string }) => {
    const response = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });
    // handle error
    if (!response.ok) {
        throw new Error("Failed to update task");
    }
    return response.json();
};

export const deleteTask = async (id: string) => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE",
    });
    // handle error
    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
    return response.json();
};
