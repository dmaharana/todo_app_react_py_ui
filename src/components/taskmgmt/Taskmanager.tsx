import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getStats,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "../api/api";
import { Check, Clock, AlertCircle, X, Plus, Edit, Trash2 } from "lucide-react";
import type { Task, Stats } from "../types";

export const Taskmanager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState<Stats>({
    data: { by_status: { completed: 0, in_progress: 0, pending: 0 }, total: 0 },
    success: true,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        getTasks(),
        getStats()
      ]);
      setTasks(tasksData.data);
      setStats({ data: statsData.data, success: true });
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task: Task) => {
    if (filter === "all") return true;
    return task.task_status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "cancelled":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleCreateTask = async (task: { task_detail: string }) => {
    try {
      setLoading(true);
      await createTask(task);
      await fetchData();
      setNewTask("");
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    }
  };

  const handleUpdateTask = async (task: { id: string; task_detail: string; task_status: string }) => {
    try {
      setLoading(true);
      await updateTask(task);
      await fetchData();
      setEditingTask(null);
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await deleteTask(id);
      await fetchData();
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      setLoading(true);
      await toggleTaskStatus(task);
      await fetchData();
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.data.total || 0}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-800">
                  {stats.data.by_status?.pending || 0}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-800">
                  {stats.data.by_status?.in_progress || 0}
                </div>
                <div className="text-sm text-blue-600">In Progress</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-800">
                  {stats.data.by_status?.completed || 0}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
            </div>
          </div>

          {/* Add New Task */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    handleCreateTask({ task_detail: newTask });
                  }
                }}
                placeholder="Enter a new task..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => newTask.trim() && handleCreateTask({ task_detail: newTask })}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex gap-2">
              {["all", "pending", "in_progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    filter === status
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError("")}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Task List */}
          <div className="p-6">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {filter === "all"
                    ? "No tasks yet"
                    : `No ${filter.replace("_", " ")} tasks`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Status Icon */}
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="flex-shrink-0"
                    >
                      {getStatusIcon(task.task_status)}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          defaultValue={task.task_detail}
                          onBlur={(e) => {
                            if (
                              e.target.value.trim() &&
                              e.target.value !== task.task_detail
                            ) {
                                handleUpdateTask({
                                id: task.id,
                                task_detail: e.target.value.trim(),
                                task_status: task.task_status,
                              });
                            } else {
                              setEditingTask(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.target.blur();
                            } else if (e.key === "Escape") {
                              setEditingTask(null);
                            }
                          }}
                          className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p
                            className={`font-medium ${
                              task.task_status === "completed"
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.task_detail}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                task.task_status
                              )}`}
                            >
                              {task.task_status.replace("_", " ")}
                            </span>
                            <span className="text-xs text-gray-500">
                              Updated:{" "}
                              {new Date(task.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingTask(task.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
