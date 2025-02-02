import { addMovieToDatabase, getMoviesFromDatabase ,deleteMovieFromDatabase} from './firebase.js';

export async function searchMovies() {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const query = document.getElementById('movieSearch').value;
    const apiKey = '206b632d';
    const url = `https://www.omdbapi.com/?t=${query}&apikey=${apiKey}`;
    console.log("Query:", query);
    try {
        
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
        const data = await response.json();
        console.log("Dati ricevuti dall'API:", data);
        if (data.Response === "True") {
            displayMovies(data.Search);
        } else {
            alert("Nessun film trovato.");
        }
    } catch (error) {
        console.error("Errore durante la ricerca dei film:", error);
    }
}

function displayMovies(movies) {
    const moviesDiv = document.getElementById('movieResults');
    moviesDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
        <div class="movie-container">
            <img src="${movie.Poster}" alt="Poster di ${movie.Title}" />
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
            <p>Rating IMDB: ${movie.imdbRating}</p>
            <label for="rating-${movie.imdbID}">Voto (0-10):</label>
            <input type="number" id="rating-${movie.imdbID}" name="rating" min="0" max="10" required>
            <br>
            <label for="comment-${movie.imdbID}" class="comment-label">Commento:</label>
            <textarea id="comment-${movie.imdbID}" name="comment" class="comment-textarea" required></textarea>
            <br>
            <button onclick="rateMovie('${movie.Title}', '${movie.Poster}', '${movie.Year}', 'rating-${movie.imdbID}', 'comment-${movie.imdbID}')">Vota questo film</button>
        </div>
        `;
      
        moviesDiv.appendChild(movieDiv);
    });
}

function rateMovie(title, poster, year, ratingId, commentId) {
    const rating = document.getElementById(ratingId).value;
    const comment = document.getElementById(commentId).value;

    if (rating === "" || comment.trim() === "") {
        alert("Inserisci un voto e un commento prima di inviare.");
        return;
    }

    console.log(`Title: ${title}, Poster: ${poster}, Year: ${year}, Rating: ${rating}, Comment: ${comment}`);
    addRatedMovie(title, poster, year, rating, comment);
}

async function addRatedMovie(title,poster,year,rating,comment) {
    const movie = {
      title,
      poster,
      year,
      rating,
      comment
    };
    console.log('Movie to add:', movie);

    await addMovieToDatabase(title,poster,year,rating,comment);
    location.reload(); // Ricarica la lista dei film dopo l'aggiunta
  }


function getStars(rating) {
    let stars = '';
    for (let i = 0; i < 10; i++) {
        if (i < rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

async function deleteMovie(movieId) {
    try {
        await deleteMovieFromDatabase(movieId);
        fetchAndDisplayRatedMovies(); // Ricarica la lista dei film dopo l'eliminazione
    } catch (error) {
        console.error("Errore durante l'eliminazione del film:", error);
    }
}
async function fetchAndDisplayRatedMovies() {
    try {
        const movies = await getMoviesFromDatabase();
        displayRatedMovies(movies);
    } catch (error) {
        console.error("Errore durante il recupero dei film dal database:", error);
    }
}
function displayRatedMovies(movies) {
    const ratedMoviesDiv = document.getElementById('ratedMovies');
    ratedMoviesDiv.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('rated-movie');
        movieDiv.innerHTML = `
            <img src="${movie.poster}" alt="Poster di ${movie.title}" />
            <h2>${movie.title}</h2>
            <p>${movie.year}</p>
            <p>Voto: ${getStars(movie.rating)}</p>
            <p>Commento: ${movie.comment}</p>
            <button onclick="deleteMovie('${movie.id}')">Elimina</button>
        `;
        ratedMoviesDiv.appendChild(movieDiv);
    });
}

// Make functions available globally
window.searchMovies = searchMovies;
window.rateMovie = rateMovie;
window.deleteMovie = deleteMovie;
// Make functions available globally
window.fetchAndDisplayRatedMovies = fetchAndDisplayRatedMovies;