const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userDB } = require("../models/user");

require("dotenv").config();

exports.sign_in = async (req, res) => {
  var { email, password } = req.body;

  // check if user provided email and password, if not throw error
  if (!email || !password) {
    return res
      .status(400)
      .send({ errorCode: 400, errorMsg: "All fields are required!" });
  }

  // try catch block to create user when not found in DB and sign in when found in DB
  try {
    const user = await userDB.findOne({ email: email }); // find user

    if (!user) {
      // when user not found create user and return token
      const new_user = new userDB();

      new_user.email = email;
      new_user.password = await bcrypt.hash(password, 10); // hash password;

      let saved = await new_user.save(); // save new user to DB

      if (saved) {
        // generate token after saving user to DB
        token = await generate_token({ sub: saved._id, email: email });

        // send token back to client
        return res.status(200).send({
          status: 200,
          access_token: token,
        });
      }
    }

    // when user found compare password and return token
    let match = await bcrypt.compare(password, user.password); // compare password provided against hashed password stored in DB

    if (!match) {
      // when password comparison is not a match
      return res.status(401).send({
        errorCode: 401,
        errorMsg: "Email or Password is incorrect!",
      });
    }

    token = await generate_token({ sub: user._id, email: email });

    if (token) {
      return res.status(200).send({
        status: 200,
        access_token: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      errorCode: 500,
      errorMsg: "Oops, we have a slight issue with our server!",
    });
  }
};

exports.sign_out = async (req, res) => {};

async function generate_token(payload) {
  try {
    let token = await jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "24h",
      issuer: process.env.ISSUER,
      algorithm: "HS512",
    });

    return token;
  } catch (error) {
    console.log(error);
    return { status: 500, error: error };
  }
}
