import { auth, db, googleProvider } from "./config";
import {
  getAdditionalUserInfo,
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify'

// Simple mobile detection
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password, username) => {
  try {
    console.log("Creating account with email...");
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });
    
    // Create user profile in Firestore
    await createNewUserProfile({
      displayName: username,
      email: email,
      emailVerified: user.emailVerified,
      uid: user.uid,
      photoURL: "",
    });
    
    toast.success(`Welcome to MovieVerse, ${username}!`);
    return { success: true, user };
    
  } catch (error) {
    console.error("Sign up error:", error);
    let errorMessage = "Sign up failed. Please try again.";
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = "This email is already registered.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Please enter a valid email address.";
        break;
      case 'auth/weak-password':
        errorMessage = "Password should be at least 6 characters.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your connection.";
        break;
    }
    
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    console.log("Signing in with email...");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    toast.success(`Welcome back, ${user.displayName || 'User'}!`);
    return { success: true, user };
    
  } catch (error) {
    console.error("Sign in error:", error);
    let errorMessage = "Sign in failed. Please try again.";
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = "No account found with this email.";
        break;
      case 'auth/wrong-password':
        errorMessage = "Incorrect password.";
        break;
      case 'auth/invalid-email':
        errorMessage = "Please enter a valid email address.";
        break;
      case 'auth/network-request-failed':
        errorMessage = "Network error. Please check your connection.";
        break;
      case 'auth/too-many-requests':
        errorMessage = "Too many failed attempts. Please try again later.";
        break;
    }
    
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

// Google Sign In (existing, but simplified)
export const signinwithGoogle = async () => {
  try {
    console.log("Starting Google login...");
    
    if (isMobile()) {
      await signInWithRedirect(auth, googleProvider);
      return;
    }
    
    const result = await signInWithPopup(auth, googleProvider);
    
    if (result) {
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      const user = result.user;

      if (isNewUser) {
        await createNewUserProfile({
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          uid: user.uid,
          photoURL: user.photoURL ?? "",
        });
        toast.success(`Welcome, New Adventurer ${user.displayName}!`);
      } else {
        toast.success(`Welcome back, ${user.displayName}!`);
      }
    }
    
  } catch (err) {
    console.error("Google auth error:", err);
    if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
      toast.error("Google login failed. Please try again.");
    }
  }
}

export const createNewUserProfile = async (userdetails) => {
  const { displayName, email, photoURL, emailVerified, uid } = userdetails;

  if (!uid) {
    throw new Error("User ID is required.");
  }

  try {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      name: displayName,
      email: email,
      photo: photoURL,
      emailVerified: emailVerified,
      description: "",
      banner: "",
      shortTitle: "",
      episodesWatched: 0,
      moviesWatched: 0,
      createdAt: serverTimestamp(),
    });
    console.log("New user profile created for:", displayName);
  } catch (error) {
    console.error("Error setting user document: ", error);
    throw new Error("Failed to add user. Please try again later.");
  }
};