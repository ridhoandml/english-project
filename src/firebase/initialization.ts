import { firebaseConfig } from "@/config"
import { initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { Firestore, getFirestore } from "firebase/firestore"

let firebase: undefined | {
  app: FirebaseApp
  db: Firestore
  auth: Auth
} = undefined

export default function initializationFirebase() {
  if (firebase) return firebase

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const auth = getAuth(app)

  return firebase = {
    app,
    db,
    auth,
  }
}