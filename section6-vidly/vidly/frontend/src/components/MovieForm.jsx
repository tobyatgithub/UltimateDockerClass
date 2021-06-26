import React, { useState } from "react";
import Input from "./Input";

function MovieForm({ onAddMovie }) {
  const [title, setTitle] = useState("");

  const handleChange = (e) => setTitle(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) return;

    onAddMovie(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        aria-label="New Movie"
        onChange={handleChange}
        placeholder="Add a new movie..."
        type="text"
        value={title}
      />
    </form>
  );
}

export default MovieForm;
