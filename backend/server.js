const mongoose = require("mongoose");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Transaction =
  require("./models/Transaction");

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database Connected"))
.catch((err) => console.log(err));

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234") {
    res.json({
      success: true,
      token: "bank-token-demo",
      username: "admin",
      balance: 24850.20,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});
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
        "Transfer saved successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Transfer failed",
    });

  }

});app.get("/api/transactions", async (req, res) => {

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
    });

  }

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});