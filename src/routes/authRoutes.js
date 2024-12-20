const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign_in", authController.sign_in);
router.get("/sign_out", authController.sign_out);

module.exports = router;
