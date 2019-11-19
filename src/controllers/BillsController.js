const axios = require("axios");

class BillsController {
  constructor() {
    this.key = process.env.ORGANIZZE_KEY;
    this.apiUrl = "https://api.organizze.com.br/rest/v2/";
    this.user = process.env.ORGANIZZE_USERMAIL;

    this.authorization = Buffer.from(`${this.user}:${this.key}`).toString(
      "base64"
    );

    this.axios = axios.create({
      baseURL: this.apiUrl,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Basic ${this.authorization}`,
        "User-Agent": `${process.env.ORGANIZZE_USERNAME} (${this.user})`,
        "Content-Type": "application/json",
        Accept: " */*"
      }
    });
  }

  /**
   * Busca todas as transações do mês atual
   * @return {Array} transações
   */
  async fetchTransactions(req, res) {
    const { data } = await this.axios.get("transactions");

    // TESTING
    const transactions = data.map(transaction =>
      this.handleTransaction(transaction)
    );
    // END TESTING

    res.status(200).json({
      success: true,
      message: "Transações encontradas",
      body: transactions
    });
  }

  handleTransaction(transaction) {
    const { amount_cents, paid, date } = transaction;

    const type = `${amount_cents}`.includes("-") ? "expense" : "income";

    // Converte o preço da trasação
    const priceString = `${amount_cents}`;
    const priceDecimal = priceString.substr(0, priceString.length - 2);
    const priceCents = priceString.substring(
      priceString.length - 2,
      priceString.length
    );
    const price = `${priceDecimal},${priceCents}`;

    // converte a data
    const dateObj = new Date(date);
    const weekday = {
      0: "Sunday",
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday"
    };

    const transactionFmt = {
      description: transaction.description,
      type: type,
      price: price,
      dayOfWeek: weekday[dateObj.getDay()],
      date: dateObj.getTime(),
      paid
    };
    return transactionFmt;
  }
}

module.exports = new BillsController();
