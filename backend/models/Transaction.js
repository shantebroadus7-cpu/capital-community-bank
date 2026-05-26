const mongoose = require("mongoose");

const TransactionSchema =
  new mongoose.Schema(

    {
      sender: String,
      recipient: String,
      bank: String,
      accountNumber: String,
      amount: Number,
      status: {
        type: String,
        default: "Completed",
      },
    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "Transaction",
    TransactionSchema
  );