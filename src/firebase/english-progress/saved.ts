import { FieldValue, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import initializationFirebase, { ENGLISH_PROGRESS_COLLECTION, ENGLISH_PROGRESS_SAVED_COLLECTION } from "../initialization"

interface GetEnglishProgressGrammar {
  userId: string
  createdAt: FieldValue
  updatedAt: FieldValue
  saved: {
    [key: string]: any
  }
}

export async function updateSavedGrammarData(uid: string, {
  key,
  content
} : {
  key: string
  content: string
}) {
  const firebase = initializationFirebase()

  const docRef = doc(firebase.db, ENGLISH_PROGRESS_COLLECTION, uid, ENGLISH_PROGRESS_SAVED_COLLECTION, key)
  try {
    const data = JSON.parse(content)
    await setDoc(
      docRef,
      {
        saved: {
          ...data
        },
        userId: uid,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      },
      { merge: true }
    )
  } catch (e) {
    console.error(`Firestore error update progress data: ${e}`)
  }
}

export async function getSavedGrammarData(uid: string, {
  key
} : {
  key: string
}) {
  const firebase = initializationFirebase()

  const docRef = doc(firebase.db, ENGLISH_PROGRESS_COLLECTION, uid, ENGLISH_PROGRESS_SAVED_COLLECTION, key)
  try {
    const getDocRef = await getDoc(docRef)
    if (getDocRef.exists()) {
      const data = getDocRef.data() as GetEnglishProgressGrammar
      return data.saved
    }
  } catch (e) {
    console.error(`Firestore error update progress data: ${e}`)
  }
}