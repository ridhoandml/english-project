import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import initializationFirebase, { ENGLISH_PROGRESS_COLLECTION } from "../initialization"
import type { GlobalConfig } from "@/store/config"

export async function updateUserData(uid: string, {
  email,
  name
}: {
  email: string
  name: string
}) {
  const firebase = initializationFirebase()
  const docRef = doc(firebase.db, ENGLISH_PROGRESS_COLLECTION, uid)
  try {
    const getDocRef = await getDoc(docRef)
    if (getDocRef.exists()) {
      await setDoc(
        docRef,
        {
          name,
          email,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    } else {
      await setDoc(
        docRef,
        {
          name,
          email,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp()
        }
      )
    }
  } catch (e) {
    console.error(`Firestore error update user data: ${e}`)
  }
}

export async function updateUserConfigData(uid: string, {
  configs
}: {
  configs: string
}) {
  const firebase = initializationFirebase()
  const docRef = doc(firebase.db, ENGLISH_PROGRESS_COLLECTION, uid)
  const configsObj = JSON.parse(configs)
  try {
    await setDoc(
      docRef,
      {
        configs: {
          ...configsObj
        },
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )
  } catch (e) {
    console.error(`Firestore error update user config: ${e}`)
  }
}

export async function getUserConfigData(uid: string) {
  const firebase = initializationFirebase()
  const docRef = doc(firebase.db, ENGLISH_PROGRESS_COLLECTION, uid)
  try {
    const getDocRef = await getDoc(docRef)
    if (getDocRef.exists()) {
      return getDocRef.data().configs as GlobalConfig
    }
  } catch (e) {
    console.error(`Firestore error update user config: ${e}`)
  }
}