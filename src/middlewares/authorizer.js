require("dotenv").config();
const jwt = require("jsonwebtoken");

const verify_token = async (req, res, next) => {
  if (!req.headers["authorization"]) {
    return res
      .status(401)
      .send({ errorCode: 401, error: "Unauthorized Access!" });
  }

  const token = req.headers["authorization"].split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  verify_token,
};
