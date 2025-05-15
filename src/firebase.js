// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC-TgybqB2BUj3zL9r8rgOfv1SBeqdsJvg',
  authDomain: 'recruiter-platform-949a2.firebaseapp.com',
  projectId: 'recruiter-platform-949a2',
  storageBucket: 'recruiter-platform-949a2.firebasestorage.app',
  messagingSenderId: '372155877600',
  appId: '1:372155877600:web:5fb8d268e38a2828d66885',
  measurementId: 'G-MV7RZSRW0M',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const analytics = getAnalytics(app)
const storage = getStorage(app)

export { auth, analytics, storage }
