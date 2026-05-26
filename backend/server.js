const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("./models/User");
const Transaction = require("./models/Transaction");

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

  console.log("MongoDB Connected Successfully");

})

.catch((error) => {

  console.log(
    "MongoDB Connection Error:",
    error
  );

});

/* =========================
   AUTH MIDDLEWARE
========================= */

const authenticateToken = (
  req,
  res,
  next
) => {

  const authHeader =
    req.headers["authorization"];

  const token =
    authHeader &&
    authHeader.split(" ")[1];

  if (!token) {

    return res.status(401).json({

      success: false,

      message: "Authentication required",

    });

  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, user) => {

      if (error) {

        return res.status(403).json({

          success: false,

          message: "Invalid token",

        });

      }

      req.user = user;

      next();

    }
  );

};

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

    const {
      username,
      password,
    } = req.body;

    // VALIDATION
    if (!username || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Username and password required",

      });

    }

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({
        username,
      });

    if (existingUser) {

      return res.status(400).json({

        success: false,

        message:
          "User already exists",

      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser =
      new User({

        username,

        password: hashedPassword,

        balance: 250000,

        role: "customer",

      });

    await newUser.save();

    res.status(201).json({

      success: true,

      message:
        "Account created successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Registration failed",

    });

  }

});

/* =========================
   LOGIN
========================= */

app.post("/api/login", async (req, res) => {

  try {

    const {
      username,
      password,
    } = req.body;

    // VALIDATION
    if (!username || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Username and password required",

      });

    }

    // FIND USER
    const user =
  await User.findOne({
    username,
  });

console.log(
  "LOGIN USER:",
  user
);

    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "User not found",

      });

    }

    // CHECK PASSWORD
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );
console.log(
  "PASSWORD MATCH:",
  validPassword
);
    if (!validPassword) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid password",

      });

    }

    // CREATE TOKEN
    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      }

    );

    // SUCCESS RESPONSE
    res.json({

      success: true,

      token,

      username: user.username,

      balance: user.balance,

      role: user.role,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Login failed",

    });

  }

});

/* =========================
   TRANSFER MONEY
========================= */

app.post(
  "/api/transfer",
  authenticateToken,
  async (req, res) => {

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

          status: "Completed",

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

        message:
          "Transfer failed",

      });

    }

  }
);

/* =========================
   GET TRANSACTIONS
========================= */

app.get(
  "/api/transactions",
  authenticateToken,
  async (req, res) => {

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

  }
);

/* =========================
   START SERVER
========================= */

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});