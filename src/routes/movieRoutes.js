const router = require("express").Router();
const movieController = require("../controllers/moviesController");
const authorizer = require("../middlewares/authorizer");
const multer = require("multer");

const upload = multer({ destination: "uploads/" });

router.post(
  "/create",
  authorizer.verify_token,
  upload.single("file"),
  movieController.add_movie
);
router.get("", authorizer.verify_token, movieController.list_movies);
router.get("/:id", authorizer.verify_token, movieController.get_movie);
router.put(
  "/:id/update",
  authorizer.verify_token,
  upload.single("file"),
  movieController.update_movie
);
router.delete(
  "/:id/delete",
  authorizer.verify_token,
  movieController.delete_movie
);

module.exports = router;
