import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage, ref } from 'firebase/storage'

export const apiKey = 'AIzaSyALcMLE3Mut9m3EoQo3JLZhaGMjGlFOYcA'

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: 'post-a59be.firebaseapp.com',
  projectId: 'post-a59be',
  storageBucket: 'post-a59be.appspot.com',
  messagingSenderId: '475723990435',
  appId: '1:475723990435:web:71db6fc201a4d034994616',
  measurementId: 'G-BW3EK9S7H2',
}
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

// auth 설정!!!
const auth = getAuth()
const db = getFirestore(firebaseApp)

export { ref, db, storage, auth, firebaseApp }
