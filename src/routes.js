const express = require("express");
const routes = express.Router();

const BillsController = require("./controllers/BillsController")

routes.get("/transactions", (req, res) => {
    BillsController.fetchTransactions(req, res)
});

module.exports = routes;
