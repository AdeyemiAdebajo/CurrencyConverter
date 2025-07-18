import express from "express";
import bodyParser from "body-parser";
import currencyCodes from "currency-codes";
import request from "request";
import dotenv from "dotenv";

dotenv.config();


const app = express();
let  apikey = process.env.API_KEY; // Default API key if not set in .env


const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));     
const seen = new Set(); // To track unique currency codes
const codes = []; // Array to store unique currency codes
const namesMap = {}; // Object to map currency codes to names

currencyCodes.data.forEach((c) => {
  if (!seen.has(c.code)) {
    seen.add(c.code);
    codes.push(c.code);
    namesMap[c.code] = c.currency;
  }
});

app.get("/", async (req, res) => {
    // Render the index page with currency codes and names
  res.render("index.ejs", {
    currencyCodes: codes, // Pass the unique currency codes
    currencyNames: namesMap,
    moneyConverted: null,
    fromCurrency: null,
    toCurrency: null,
    amount: null,
    result: null,
  });
});

app.post("/convert", (req, res) => {
  let frmcurrency = req.body["fromCurrency"];
  let tocurrency = req.body["toCurrency"]; // Get the selected currencies from the form
  let amount = parseFloat(req.body["amount"]); // Convert amount to a number
  let appurl = "http://api.currencylayer.com/live?access_key=" + apikey;
  
      let convertedAmount = 0;
     
  request(appurl, function (err, response, body) {
    if (err) {
      console.log(err);
    } else {
      let converter = JSON.parse(body);
      let rateFrom = converter.quotes["USD" + frmcurrency]; // Get the exchange rate for the from currency
      let rateTo = converter.quotes["USD" + tocurrency]; // Get the exchange rate for the to currency

      if (frmcurrency === tocurrency) {
        convertedAmount = amount;
      } else if (frmcurrency === "USD") {
        convertedAmount = rateTo * amount;
      } else if (tocurrency === "USD") {
        convertedAmount = amount / rateFrom;
      } else {
        const usdAmount = amount / rateFrom ;
        convertedAmount = usdAmount * rateTo ;
      }
      console.log(`Converted ${amount} ${frmcurrency} to ${tocurrency} = ${convertedAmount}`);
    }
     

    res.render("index.ejs", {
      currencyCodes: codes,
      currencyNames: namesMap,
      moneyConverted: convertedAmount.toFixed(2),
      fromCurrency: frmcurrency,
      toCurrency: tocurrency,
      amount: amount,
    
    });
  });
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
