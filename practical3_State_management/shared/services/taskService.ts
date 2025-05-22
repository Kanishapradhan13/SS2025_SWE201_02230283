import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { getCurrentUser, verifyAuth } from "@/lib/auth";
import { Task } from "../store/taskStore";

const COLLECTION_NAME = "tasks";

// Define types for task data
interface TaskData extends Partial<Task> {
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  completed?: boolean;
}

// Get tasks collection reference with user ID filter
const getTasksCollection = () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return collection(db, COLLECTION_NAME);
};

// Create a new task
export const createTask = async (taskData: TaskData): Promise<Task> => {
  await verifyAuth();
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const taskWithMetadata = {
    ...taskData,
    userId: user.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completed: false
  };
  
  try {
    const docRef = await addDoc(getTasksCollection(), taskWithMetadata);
    return {
      id: docRef.id,
      ...taskWithMetadata,
      title: taskWithMetadata.title || '',
      completed: false,
      userId: user.uid
    } as Task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

// Get all tasks for the current user
export const getAllTasks = async (): Promise<Task[]> => {
  await verifyAuth();
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  try {
    const q = query(getTasksCollection(), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    
    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        title: data.title || '',
        description: data.description,
        dueDate: data.dueDate,
        completed: !!data.completed,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId
      } as Task);
    });
    
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

// Get a specific task by ID
export const getTaskById = async (taskId: string): Promise<Task> => {
  await verifyAuth();
  
  try {
    const docRef = doc(db, COLLECTION_NAME, taskId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Verify that the task belongs to the current user
      const user = getCurrentUser();
      if (!user || data.userId !== user.uid) {
        throw new Error("Unauthorized access to task");
      }
      
      return {
        id: docSnap.id,
        title: data.title || '',
        description: data.description,
        dueDate: data.dueDate,
        completed: !!data.completed,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: data.userId
      } as Task;
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error(`Failed to fetch task: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Update a task
export const updateTask = async (taskId: string, taskData: TaskData): Promise<Task> => {
  await verifyAuth();
  
  try {
    // First check if the task belongs to the current user
    const task = await getTaskById(taskId);
    
    const docRef = doc(db, COLLECTION_NAME, taskId);
    await updateDoc(docRef, {
      ...taskData,
      updatedAt: serverTimestamp()
    });
    
    return {
      ...task,
      ...taskData,
      updatedAt: new Date()
    } as Task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error(`Failed to update task: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<boolean> => {
  await verifyAuth();
  
  try {
    // First check if the task belongs to the current user
    await getTaskById(taskId);
    
    const docRef = doc(db, COLLECTION_NAME, taskId);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Toggle task completion status
export const toggleTaskCompletion = async (taskId: string): Promise<Task> => {
  await verifyAuth();
  
  try {
    const task = await getTaskById(taskId);
    return await updateTask(taskId, { completed: !task.completed });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    throw new Error(`Failed to toggle task completion: ${error instanceof Error ? error.message : String(error)}`);
  }
};