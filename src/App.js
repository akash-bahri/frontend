import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import the CSS file

const App = () => {
    const [userId, setUserId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            // Get movie recommendations for the user
            const response = await axios.get(`http://localhost:5000/api/recommendations/${userId}`);
            const recommendedMovies = response.data;

            // Fetch poster URLs for each movie and add them to the recommendations
            for (let movie of recommendedMovies) {
                const posterUrl = await getPosterUrl(movie.movie_id);
                movie.poster_url = posterUrl;  // Attach the poster URL to the movie object
                console.log(`Movie ID: ${movie.movie_id} Poster URL: ${posterUrl}`);  // Log the poster URL
            }

            setRecommendations(recommendedMovies);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('Failed to fetch recommendations.');
        } finally {
            setLoading(false);
        }
    };

    const getClusterRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:5000/api/cluster_recommendations/${userId}`);
            const recommendedMovies = response.data;

            for (let movie of recommendedMovies) {
                const posterUrl = await getPosterUrl(movie.movie_id);
                movie.poster_url = posterUrl;
            }

            setRecommendations(recommendedMovies);
        } catch (error) {
            console.error('Error fetching cluster recommendations:', error);
            setError('Failed to fetch cluster-based recommendations.');
        } finally {
            setLoading(false);
        }
    };


    const getPosterUrl = async (movieId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/movie/${movieId}/poster`);
            return response.data.poster_url;  // Return the poster URL from the backend
        } catch (error) {
            console.error('Error fetching poster:', error);
            return null; // Return null if no poster is found
        }
    };

    return (
        <div>
            <h1>Movie Recommendations</h1>
            <input
                type="number"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
    <button onClick={getRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
    </button>
    <button onClick={getClusterRecommendations} disabled={loading}>
        {loading ? 'Loading...' : 'Cluster Recommendations'}
    </button>
</div>



            {error && <p>{error}</p>}

            <div className="movie-container">
                {recommendations.length > 0 ? (
                    recommendations.map((movie) => (
                        <div className="movie-card" key={movie.movie_id}>
                            <h2>{movie.title}</h2>
                            <p>Predicted Rating: <strong>{movie.predicted_rating.toFixed(2)}</strong></p>
                            <p>Genres: {Array.isArray(movie.genres) ? movie.genres.join(', ') : 'No genres available'}</p>
                            {movie.poster_url ? (
                                <img
                                    src={movie.poster_url}
                                    alt={`Movie ${movie.movie_id} Poster`}
                                    style={{ width: '100%', borderRadius: '5px' }}
                                />
                            ) : (
                                <p className="no-poster">No poster available</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No recommendations available</p>
                )}
            </div>
        </div>
    );
};

export default App;
