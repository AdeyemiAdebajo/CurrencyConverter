import express from "express";
import bodyParser from "body-parser";
const app = express();

const port=3000;
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs")
});

app.post("/convert", (req, res) => {
    const frmcurrency = req.body["fromCurrency"];
    const tocurrency = req.body["toCurrency"];
    const amount = req.body["amount"];
    const exchangeRate = 1.2; 
    const convertedAmount = (req.body["amount"]* exchangeRate).toFixed(2);
    
    console.log(`From: ${frmcurrency}, To: ${tocurrency}, Amount: ${amount}`);
    res.render("index.ejs", {
        moneyConverted: convertedAmount,
        fromCurrency: frmcurrency,
        toCurrency: tocurrency,
        amount: amount,
        result: `Converted ${amount} ${frmcurrency} to ${tocurrency}`
    });
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})