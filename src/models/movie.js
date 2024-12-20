const mongoose = require("mongoose");

const movie_schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    publishing_year: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const movieDB = mongoose.model("movies", movie_schema);

module.exports = { movieDB };
