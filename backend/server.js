const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Transaction =
  require("./models/Transaction");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "*",
}));

app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((error) => {

  console.log("MongoDB Error:", error);

});

/* =========================
   USER SCHEMA
========================= */

const UserSchema =
  new mongoose.Schema({

    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    balance: {
      type: Number,
      default: 250000,
    },

  });

const User =
  mongoose.model("User", UserSchema);

/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Capital Community Bank API Running",
  });

});

/* =========================
   REGISTER
========================= */

app.post("/api/register", async (req, res) => {

  try {

    const { username, password } =
      req.body;

    const existingUser =
      await User.findOne({ username });

    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser =
      new User({
        username,
        password: hashedPassword,
      });

    await newUser.save();

    res.json({
      success: true,
      message:
        "Account created successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Registration failed",
    });

  }

});

/* =========================
   LOGIN
========================= */

app.post("/api/login", async (req, res) => {

  try {

    const { username, password } =
      req.body;

    const user =
      await User.findOne({ username });

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!validPassword) {

      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });

    }

    const token = jwt.sign(

      {
        id: user._id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }

    );

    res.json({

      success: true,

      token,

      username: user.username,

      balance: user.balance,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Login failed",
    });

  }

});

/* =========================
   TRANSFER MONEY
========================= */

app.post("/api/transfer", async (req, res) => {

  try {

    const {
      sender,
      recipient,
      bank,
      accountNumber,
      amount,
    } = req.body;

    const newTransaction =
      new Transaction({

        sender,

        recipient,

        bank,

        accountNumber,

        amount,

      });

    await newTransaction.save();

    res.json({

      success: true,

      message:
        "Transfer completed successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Transfer failed",

    });

  }

});

/* =========================
   GET TRANSACTIONS
========================= */

app.get("/api/transactions", async (req, res) => {

  try {

    const transactions =
      await Transaction.find()
      .sort({ createdAt: -1 });

    res.json(transactions);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch transactions",

      error: error.message,

    });

  }

});

/* =========================
   SERVER START
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Backend running on port ${PORT}`
  );

});