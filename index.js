import express from "express";
import bodyParser from "body-parser";
import currencyCodes from "currency-codes";
import request from "request";

// const request= request();
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
  let frmcurrency = req.body["fromCurrency"];
  let tocurrency = req.body["toCurrency"];
  let amount = parseFloat(req.body["amount"]);
  let appurl = "http://api.currencylayer.com/live?access_key=" + apikey;
  
      let convertedAmount = 0;
     
  request(appurl, function (err, response, body) {
    if (err) {
      console.log(err);
    } else {
      let converter = JSON.parse(body);
      let rateFrom = converter.quotes["USD" + frmcurrency];
      let rateTo = converter.quotes["USD" + tocurrency];

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
    //   result: `Converted ${amount} ${frmcurrency} to ${frmcurrency}`,
    });
  });
  
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
