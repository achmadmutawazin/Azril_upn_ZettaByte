const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

app.use(bodyParser.json());
app.use(basicAuth({
    users: { 'admin': 'password' } 
}));

const bookSet = new Set();
const bookMap = new Map();

// Endpoint 1: Read and display the content of a text file using promise with await
app.get('/read-file-await', async (req, res) => {
    try {
      const fileContent = await fs.promises.readFile('path/to/file.txt', 'utf-8');
      console.log(fileContent);
      res.send('File content displayed on console.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error occurred while reading the file.');
    }
  });
  
  // Endpoint 2: Read and display the content of a text file using promise without await
  app.get('/read-file-promise', (req, res) => {
    fs.promises
      .readFile('path/to/file.txt', 'utf-8')
      .then((fileContent) => {
        console.log(fileContent);
        res.send('File content displayed on console.');
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error occurred while reading the file.');
      });
  });

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

    // Add the book to the Set
    bookSet.add(title);

    // Add the book details to the Map
    bookMap.set(title, {
        author,
        price,
        discountPercent,
        taxPercent,
        stock
    });

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

// Function to calculate the term of credit
function calculateTermOfCredit(credit) {
    return new Promise((resolve, reject) => {
      // Perform the necessary calculations to determine the term of credit
      // For demonstration purposes, let's assume a simple calculation based on the credit value
      const term = credit * 2;
  
      // Simulate some asynchronous delay
      setTimeout(() => {
        if (term) {
          resolve(term);
        } else {
          reject(new Error('Failed to calculate the term of credit.'));
        }
      }, 2000);
    });
  }
  
  // Endpoint to display the books in the Set and Map
  app.get('/books', (req, res) => {
    const bookSetArray = Array.from(bookSet); // Convert the Set to an Array
    const bookMapArray = Array.from(bookMap); // Convert the Map to an Array
  
    res.send({
      booksInSet: bookSetArray,
      booksInMap: bookMapArray,
    });
  });
  
  app.listen(port, () => {
    console.log(`Book purchasing function listening at http://localhost:${port}`);
  });
  
