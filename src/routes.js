const express = require("express");
const routes = express.Router();

const TransactionController = require("./controllers/TransactionController");

routes.get("/transactions", (req, res) =>
  TransactionController.fetchTransactions(req, res)
);

routes.put("/transactions/:id/pay", (req, res) =>
  TransactionController.togglePaymentStatus(req, res)
);

module.exports = routes;
