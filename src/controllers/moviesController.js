const { movieDB } = require("../models/movie");
const cloudinary = require("cloudinary").v2;

const list_movies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const movies = await movieDB.find().skip(skip).limit(limit);

    // Get total count for metadata
    const totalItems = await movieDB.countDocuments();

    if (movies.length < 1) {
      return res.status(200).send({
        status: 200,
        message: "No movie(s) Found!",
        movies: movies,
      });
    }

    return res.status(200).json({
      movies: movies,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errorCode: 500, errorMsg: "" });
  }
};

const get_movie = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "Invalid ID!",
    });
  }

  try {
    const movie = await movieDB.findById(id);

    return res.status(200).send({
      status: 200,
      message: "success!",
      movie: movie,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      errorCode: 500,
      errorMsg: "Something went terribly wrong",
    });
  }
};

const add_movie = async (req, res) => {
  const file = req.file;

  if (!req.file) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "No image provided!",
    });
  }

  const { title, publishing_year } = req.body;

  const new_movie = new movieDB();

  new_movie.title = title;
  new_movie.publishing_year = publishing_year;

  try {
    // Upload the image
    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: "movie_images" },
      (error, result) => {
        if (error) {
          console.error(error);
          return;
        }

        new_movie.image = result.secure_url;

        const saved_movie = new_movie.save();

        if (saved_movie) {
          return res.status(200).send({
            status: 200,
            message: "movie saved successfully!",
            id: saved_movie._id,
          });
        }
      }
    );
    upload_stream.end(file.buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errorCode: 500,
      errorMsg: "Something went terribly wrong with our servers",
    });
  }
};

const update_movie = async (req, res) => {
  const id = req.params.id;
  const file = req.file;

  if (!req.file && !req.body.image) {
    return res.status(400).send({
      errorCode: 400,
      errorMsg: "Kindly upload an image!",
    });
  }

  const { title, publishing_year } = req.body;

  try {
    if (req.file) {
      // Upload the image
      const upload_stream = cloudinary.uploader.upload_stream(
        { folder: "movie_images" },
        async (error, result) => {
          if (error) {
            console.error(error);
            return;
          }

          const updated_movie = await movieDB.findByIdAndUpdate(
            id,
            {
              title: title,
              publishing_year: publishing_year,
              image: result.secure_url,
            },
            { new: true, upsert: true }
          );

          if (updated_movie) {
            return res.status(200).send({
              status: 200,
              message: "updated successfully!",
              id: updated_movie._id,
            });
          }
        }
      );
      upload_stream.end(file.buffer);
    } else if (req.body.image) {
      const updated_movie = await movieDB.findByIdAndUpdate(
        id,
        {
          title: title,
          publishing_year: publishing_year,
          image: req.body.image,
        },
        { new: true, upsert: true }
      );

      if (updated_movie) {
        return res.status(200).send({
          status: 200,
          message: "Updated Successfully!",
          id: updated_movie._id,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      errorCode: 500,
      errorMsg: "Something went haywire in our system!",
    });
  }
};

const delete_movie = async (req, res) => {};

module.exports = {
  list_movies,
  get_movie,
  add_movie,
  update_movie,
  delete_movie,
};
