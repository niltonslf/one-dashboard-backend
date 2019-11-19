const axios = require("axios");

class TransactionController {
  constructor() {
    this.apiUrl = "https://api.organizze.com.br/rest/v2/";
    this.key = process.env.ORGANIZZE_KEY;
    this.user = process.env.ORGANIZZE_USERMAIL;
    this.username = process.env.ORGANIZZE_USERNAME;

    this.authorization = Buffer.from(`${this.user}:${this.key}`).toString(
      "base64"
    );

    this.axios = axios.create({
      baseURL: this.apiUrl,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Basic ${this.authorization}`,
        "User-Agent": `${this.username} (${this.user})`,
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

    // Parsea a resposta da api
    const transactions = data.map(transaction =>
      this._handleTransaction(transaction)
    );

    res.status(200).json({
      success: true,
      message: "Transações encontradas",
      body: transactions
    });
  }

  /**
   * Atualiza o status de uma transação para pago
   * @param {*} req
   * @param {*} res
   */
  async payTransaction(req, res) {
    const { id } = req.params;
    const { data } = await this.axios.put(`transactions/${id}`, {
      paid: true
    });

    return res.status(200).json({
      success: true,
      body: data
    });
  }

  /**
   * Extrai as principais informações da transação
   * @param {Object} transaction
   */
  _handleTransaction(transaction) {
    const { id, amount_cents, paid, date } = transaction;

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
      id,
      description: transaction.description,
      type: type,
      price: price,
      weekday: weekday[dateObj.getDay()],
      date: dateObj.getTime(),
      paid
    };
    return transactionFmt;
  }
}

module.exports = new TransactionController();
