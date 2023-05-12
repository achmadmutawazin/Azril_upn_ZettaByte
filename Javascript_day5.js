const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

app.use(bodyParser.json());
app.use(basicAuth({
    users: { 'admin': 'password' } 
}));

// Function to calculate the term of credit asynchronously
async function calculateTermOfCredit(credit) {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const term = 12; 
      resolve(term);
    }, 2000); // Simulating asynchronous processing with a delay of 2 seconds
  });
}

app.post('/purchase', async (req, res) => {
    const { title, author, price, discountPercent, taxPercent, stock, purchaseAmount, credit, additionalPrice } = req.body;
    const DISCOUNT_PERCENT = discountPercent;
    const TAX_PERCENT = taxPercent;
    const DISCOUNT_MULTIPLIER = (100 - DISCOUNT_PERCENT) / 100;
    const TAX_MULTIPLIER = (100 + TAX_PERCENT) / 100;
    const discountAmount = price * (DISCOUNT_PERCENT / 100);
    const priceAfterDiscount = price * DISCOUNT_MULTIPLIER;
    const taxAmount = priceAfterDiscount * (TAX_PERCENT / 100);
    const priceAfterTax = priceAfterDiscount * TAX_MULTIPLIER;

    if (stock < purchaseAmount) {
        res.status(400).send(`Sorry, we only have ${stock} copies of ${title} in stock.`);
        return;
    }

    for (let i = 1; i <= purchaseAmount; i++) {
        stock--;
        if (stock < 0) {
            res.status(400).send(`Sorry, we're out of stock for ${title}.`);
            break;
        }
    }

    const term = await calculateTermOfCredit(credit); // Calculate the term of credit asynchronously
    const termPrice = (priceAfterTax + additionalPrice) / term; // Calculate the term price

    const bookDetails = `Title: ${title}, Author: ${author}, Price: $${price.toFixed(2)}`;
    const discountText = `Discount Amount: $${discountAmount.toFixed(2)} (${DISCOUNT_PERCENT}% off)`;
    const priceAfterDiscountText = `Price After Discount: $${priceAfterDiscount.toFixed(2)}`;
    const taxText = `Tax Amount: $${taxAmount.toFixed(2)} (${TAX_PERCENT}% tax)`;
    const priceAfterTaxText = `Price After Tax: $${priceAfterTax.toFixed(2)}`;
    const termPriceText = `Price per Term (${term} terms): $${termPrice.toFixed(2)}`;

    const stockText = stock >= purchaseAmount ? `There are ${stock} copies of ${title} left in stock.` : `Sorry, we're out of stock for ${title}.`;

    res.send({
        bookDetails,
        discountText,
        priceAfterDiscountText,
        taxText,
        priceAfterTaxText,
        termPriceText,
        stockText
    });
});

app.listen(port, () => {
    console.log(`Book purchasing function listening at http://localhost:${port}`);
});
