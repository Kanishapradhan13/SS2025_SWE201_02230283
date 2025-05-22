import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Type for auth callback
type AuthChangeCallback = (user: FirebaseUser | null) => void;

// User registration
export const registerUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(`Registration failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// User login
export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// User logout
export const signOut = async (): Promise<boolean> => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    throw new Error(`Logout failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

// Get user token
export const getUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback: AuthChangeCallback): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Verify if user is authenticated and has valid token
export const verifyAuth = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  try {
    // This will refresh the token if it's expired
    await user.getIdToken(true);
    return true;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};