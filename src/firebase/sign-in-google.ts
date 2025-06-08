import { useAuth } from "@/store/auth"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import initializationFirebase from "./initialization";

export async function signInWithGoogle () {
  const firebase = initializationFirebase()
  const provider = new GoogleAuthProvider()

  const authStore = useAuth()
  authStore.setAuthError(null)
  try {
    const result = await signInWithPopup(firebase.auth, provider)
    console.log("Sign-in successful. User:", result.user.displayName)
  } catch (error: any) {
    authStore.setAuthError(`Error signing in: ${error.message} (Code: ${error.code})`)
    console.error("Authentication error:", error)
  }
}

export async function signOutUser() {
  const firebase = initializationFirebase()

  const authStore = useAuth()
  try {
    await signOut(firebase.auth)
    console.log("User signed out successfully.")
  } catch (error: any) {
    authStore.setAuthError(`Error signing out: ${error.message}`)
    console.error("Sign-out error:", error);
  }
};