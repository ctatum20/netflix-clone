import React, { useEffect, useState } from 'react'
import axios from './axios';
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer"

const baseUrl= "https://image.tmdb.org/t/p/original/"

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]); // if you don't put this, it wouldn't read nor calculate the useEffect. We also pass it in as a dependancy, is because it's outside the block
    
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,  
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "") 
            .then((url) => {
                // https://www.youtube.com/XuehOEH
                const urlParams = new URLSearchParams(new URL(url).search)
                setTrailerUrl(urlParams.get("v"));
            }) 
            .catch((error) => console.log(error));
        }
    }

    return (
    <div className='row'>
        <h2>{ title }</h2>

        <div className='row-posters'>
            {movies.map((movie) => (
                <img 
                key={movie.id} // this speeds up scrolling!
                onClick={() => handleClick(movie)}
                className={`row-poster ${isLargeRow && "row_posterLarge"}`}
                src={`${baseUrl}${
                    isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                    alt={movie.name} />
            ))}    
        </div>
        {trailerUrl && < Youtube videoId={trailerUrl} opts={opts}/>}
    </div>
  )
}

export default Row