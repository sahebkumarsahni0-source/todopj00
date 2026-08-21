import React, { useState, useEffect } from "react";

// ==========================================
// COMPONENT 1: SearchBar
// ==========================================
const SearchBar = ({ onSearch, loading }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group input-group-lg shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a movie title (e.g., Inception)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="btn btn-primary px-4" 
          disabled={loading || !inputValue.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
};

// ==========================================
// COMPONENT 2: MovieCard
// ==========================================
const MovieCard = ({ movie }) => {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster";

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 border-0 shadow-sm custom-card-hover">
        <img
          src={posterUrl}
          alt={movie.Title}
          className="card-img-top"
          style={{ height: "350px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold text-truncate" title={movie.Title}>
            {movie.Title}
          </h6>
          <p className="card-text text-muted small mb-3">
            <span>📅 {movie.Year}</span> | <span className="text-capitalize">🎞️ {movie.Type}</span>
          </p>
          <a
            href={`https://www.imdb.com/title/${movie.imdbID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary btn-sm mt-auto"
          >
            More Details
          </a>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: App
// ==========================================
function App() {
  // State Management
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ⚠️ IMPORTANT: Put your ACTIVATED OMDb API key here
  const API_KEY = "5dce4c95"; 

  // Page Title Side Effect
  useEffect(() => {
    document.title = "React Movie Finder";
  }, []);

  // Fetch API Logic
  const searchMovies = async (searchTerm) => {
    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}`
      );
      
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setError(data.Error || "No movies found. Try another search.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      
      {/* Header */}
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container d-flex align-items-center">
          <h2 className="m-0 fw-bold">🎬 MovieFinder</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="container flex-grow-1 py-5">
        <div className="row justify-content-center mb-4">
          <div className="col-md-8 text-center">
            <h1 className="fw-bold mb-3">Find Your Favorite Movies</h1>
            <p className="text-muted mb-4">Search millions of movies, series, and documentaries.</p>
            
            {/* Modular Search Bar */}
            <SearchBar onSearch={searchMovies} loading={loading} />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Fetching movies...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="alert alert-danger text-center shadow-sm" role="alert">
            <strong>Oops!</strong> {error}
          </div>
        )}

        {/* Movie Results Grid */}
        {!loading && !error && movies.length > 0 && (
          <div>
            <h4 className="mb-4 fw-bold">Search Results ({movies.length})</h4>
            <div className="row">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Initial Load */}
        {!loading && !error && movies.length === 0 && (
          <div className="text-center my-5 py-5 text-muted">
            <h1 className="display-1 opacity-50">🍿</h1>
            <h4>Waiting for your search...</h4>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3 mt-auto">
        <p className="m-0 small">&copy; 2026 MovieFinder App. Built with React & OMDb API.</p>
      </footer>
    </div>
  );
}

export default App;