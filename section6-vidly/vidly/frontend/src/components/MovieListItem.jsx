import React from "react";
import "./MovieListItem.css";

function Movie({ movie, onDeleteMovie }) {
  return (
    <li className="MovieListItem">
      {movie.title}
      <button className="MovieListItem__Delete" onClick={onDeleteMovie}>
        <img src="/images/delete.svg" alt="Delete movie" />
      </button>
    </li>
  );
}

export default Movie;
