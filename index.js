import express from "express";
import bodyParser from "body-parser";
import currencyCodes from "currency-codes";

const app = express();
let apikey = "f986bcf5750b8c55074bcfbb9a8ab3d9";

const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
const seen = new Set();
const codes = [];
const namesMap = {};

currencyCodes.data.forEach((c) => {
  if (!seen.has(c.code)) {
    seen.add(c.code);
    codes.push(c.code);
    namesMap[c.code] = c.currency;
  }
});

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    currencyCodes: codes,
    currencyNames: namesMap,
    moneyConverted: null,
    fromCurrency: null,
    toCurrency: null,
    amount: null,
    result: null,
  });
});

app.post("/convert", (req, res) => {
  const frmcurrency = req.body["fromCurrency"];
  const tocurrency = req.body["toCurrency"];
  const amount = parseFloat(req.body["amount"]);
  const exchangeRate = 1.2;
  const convertedAmount = (req.body["amount"] * exchangeRate).toFixed(2);

  console.log(`From: ${frmcurrency}, To: ${tocurrency}, Amount: ${amount}`);
  res.render("index.ejs", {
    currencyCodes: codes,
    currencyNames: namesMap,
    moneyConverted: convertedAmount,
    fromCurrency: frmcurrency,
    toCurrency: tocurrency,
    amount: amount,
    result: `Converted ${amount} ${frmcurrency} to ${tocurrency}`,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
