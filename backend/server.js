const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const { MongoMemoryServer } = require("mongodb-memory-server");

require("dotenv").config();

const Transaction =
  require("./models/Transaction");

let mongoServer;

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "*",
}));

app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

/* =========================
   DATABASE CONNECTION
========================= */

const connectDatabase = async () => {
  try {
    if (process.env.MONGO_URI.includes("localhost")) {
      // Use in-memory MongoDB for local development
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("MongoDB In-Memory Server Connected");
    } else {
      // Use cloud MongoDB for production
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connected Successfully");
    }
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
  }
};

connectDatabase();

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
        role: user.role,
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

      role: user.role,

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
   ADMIN ROUTES
========================= */

app.post("/api/admin/create-admin", async (req, res) => {
  try {
    const { username, password, secret } = req.body;

    if (secret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin creation secret",
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      username,
      password: hashedPassword,
      role: "admin",
      balance: 250000,
    });

    await adminUser.save();

    res.json({
      success: true,
      message: "Admin account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Admin creation failed",
    });
  }
});

app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("username balance role createdAt").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

app.get("/api/admin/overview", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    const users = await User.find().select("username balance role").sort({ createdAt: -1 }).limit(5);
    const transactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalUsers,
      totalTransactions,
      users,
      transactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin overview",
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

/* =========================
   ADMIN USER MANAGEMENT
========================= */

// Get single user by id
app.get("/api/admin/user/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username balance role createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

// Update user (balance, role)
app.put("/api/admin/user/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { balance, role } = req.body;

    const updates = {};
    if (typeof balance !== 'undefined') updates.balance = balance;
    if (typeof role === 'string') updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("username balance role createdAt");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
});

// Delete user
app.delete("/api/admin/user/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});