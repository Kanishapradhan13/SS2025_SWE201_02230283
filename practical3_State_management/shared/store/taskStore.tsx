import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated, getCurrentUser, subscribeToAuthChanges } from '@/lib/auth';
import * as taskService from '../services/taskService';


// Define types
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: any;
  completed: boolean;
  createdAt?: any;
  updatedAt?: any;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  updateTask: (taskId: string, taskData: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskCompletion: (taskId: string) => Promise<Task>;
  setSelectedTask: (task: Task | null) => void;
  syncTasks: () => Promise<void>;
}

interface TaskProviderProps {
  children: ReactNode;
}

// Local storage keys
const TASKS_STORAGE_KEY = 'todo_tasks';

// Create a store for task state management
export const useTaskStore = (): TaskContextType => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load tasks from local storage
  const loadTasksFromStorage = useCallback(async () => {
    try {
      if (!isAuthenticated()) {
        setTasks([]);
        return;
      }
      
      const userId = getCurrentUser()?.uid;
      if (!userId) return;
      
      const tasksKey = `${TASKS_STORAGE_KEY}_${userId}`;
      const storedTasks = await AsyncStorage.getItem(tasksKey);
      
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (err) {
      console.error('Error loading tasks from storage:', err);
    }
  }, []);

  // Save tasks to local storage
  const saveTasksToStorage = useCallback(async (updatedTasks: Task[]) => {
    try {
      if (!isAuthenticated()) return;
      
      const userId = getCurrentUser()?.uid;
      if (!userId) return;
      
      const tasksKey = `${TASKS_STORAGE_KEY}_${userId}`;
      await AsyncStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
    } catch (err) {
      console.error('Error saving tasks to storage:', err);
    }
  }, []);

  // Sync tasks with Firestore
  const syncTasks = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const remoteTasks = await taskService.getAllTasks();
      setTasks(remoteTasks);
      saveTasksToStorage(remoteTasks);
    } catch (err) {
      console.error('Error syncing tasks:', err);
      setError('Failed to sync tasks. Please try again.');
      
      // Load from local storage as fallback
      await loadTasksFromStorage();
    } finally {
      setLoading(false);
    }
  }, [saveTasksToStorage, loadTasksFromStorage]);

  // Create a new task
  const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    setError(null);
    
    try {
      const newTask = await taskService.createTask(taskData);
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      return newTask;
    } catch (err) {
      setError('Failed to create task. Please try again.');
      throw err;
    }
  };

  // Update a task
  const updateTask = async (taskId: string, taskData: Partial<Task>): Promise<Task> => {
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      );
      
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updatedTask });
      }
      
      return updatedTask;
    } catch (err) {
      setError('Failed to update task. Please try again.');
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string): Promise<boolean> => {
    setError(null);
    
    try {
      await taskService.deleteTask(taskId);
      
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask(null);
      }
      
      return true;
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      throw err;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string): Promise<Task> => {
    setError(null);
    
    try {
      const updatedTask = await taskService.toggleTaskCompletion(taskId);
      
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: updatedTask.completed } : task
      );
      
      setTasks(updatedTasks);
      saveTasksToStorage(updatedTasks);
      
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, completed: updatedTask.completed });
      }
      
      return updatedTask;
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      throw err;
    }
  };

  // Initialize store and set up auth listener
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initialize = async () => {
      await loadTasksFromStorage();
      
      // Listen for auth state changes
      unsubscribe = subscribeToAuthChanges(async (user) => {
        if (user) {
          // User logged in, sync tasks
          await syncTasks();
        } else {
          // User logged out, clear tasks
          setTasks([]);
          setSelectedTask(null);
          setLoading(false);
        }
      });
    };
    
    initialize();
    
    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadTasksFromStorage, syncTasks]);

  return {
    tasks,
    selectedTask,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    setSelectedTask,
    syncTasks,
  };
};

// Create a context provider for tasks
const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const taskStore = useTaskStore();
  
  return (
    <TaskContext.Provider value={taskStore}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};