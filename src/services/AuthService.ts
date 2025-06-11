import { auth } from '../firebaseConfig';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';

/**
 * Initiates the Google Sign-In popup flow.
 * @returns A promise that resolves with the user credential on successful sign-in.
 */
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

/**
 * Signs out the current user.
 * @returns A promise that resolves when the user is signed out.
 */
export const signOutUser = () => {
  return signOut(auth);
};

/**
 * Subscribes to authentication state changes.
 * @param callback The function to call when the auth state changes. It receives the user object or null.
 * @returns The unsubscribe function.
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
