import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getFirestore, collection, addDoc,getDocs,deleteDoc,doc } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD-h43Jg-d3HwezRyIPo0QrgjZWQm9yUpk",
  authDomain: "movie-6e286.firebaseapp.com",
  projectId: "movie-6e286",
  storageBucket: "movie-6e286.firebasestorage.app",
  messagingSenderId: "451060986397",
  appId: "1:451060986397:web:31e2f278b6610e7a684cf4",
  measurementId: "G-7SME3C8JPK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function addMovieToDatabase(title,poster,year,rating,comment) {
    try {
        const docRef = await addDoc(collection(db, "ratedMovies"), {
            title: title,
            poster: poster,
            year: year,
            rating: rating,
            comment: comment
            
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function deleteMovieFromDatabase(docId) {
  try {
      await deleteDoc(doc(db, "ratedMovies", docId));
      console.log("Document deleted with ID: ", docId);
  } catch (e) {
      console.error("Error deleting document: ", e);
  }
}

export async function getMoviesFromDatabase() {
  try {
      const querySnapshot = await getDocs(collection(db, "ratedMovies"));
      const movies = [];
      querySnapshot.forEach((doc) => {
          movies.push({ id: doc.id, ...doc.data() });
      });
      return movies;
  } catch (e) {
      console.error("Error getting documents: ", e);
  }
}

