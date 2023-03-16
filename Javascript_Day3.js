<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Book Purchasing Function</title>
  </head>
  <body>
    <h1>Book Purchasing Function</h1>
    <p id="bookDetails"></p>
    <p id="discountAmount"></p>
    <p id="priceAfterDiscount"></p>
    <p id="taxAmount"></p>
    <p id="priceAfterTax"></p>
    <p id="stockText"></p>

    <script>
    function purchaseBook(title, author, price, discountPercent, taxPercent, stock, purchaseAmount, credit) {
  const DISCOUNT_PERCENT = discountPercent;
  const TAX_PERCENT = taxPercent;
  const DISCOUNT_MULTIPLIER = (100 - DISCOUNT_PERCENT) / 100;
  const TAX_MULTIPLIER = (100 + TAX_PERCENT) / 100;
  const discountAmount = price * (DISCOUNT_PERCENT / 100);
  const priceAfterDiscount = price * DISCOUNT_MULTIPLIER;
  const taxAmount = priceAfterDiscount * (TAX_PERCENT / 100);
  const priceAfterTax = priceAfterDiscount * TAX_MULTIPLIER;
  const termPrice = priceAfterTax / credit;

  if (stock < purchaseAmount) {
    document.getElementById("stockText").textContent = `Sorry, we only have ${stock} copies of ${title} in stock.`;
    return;
  }

  for (let i = 1; i <= purchaseAmount; i++) {
    stock--;
    if (stock < 0) {
      document.getElementById("stockText").textContent = `Sorry, we're out of stock for ${title}.`;
      break;
    }
  }

  const bookDetails = `Title: ${title}, Author: ${author}, Price: $${price.toFixed(2)}`;
  const discountText = `Discount Amount: $${discountAmount.toFixed(2)} (${DISCOUNT_PERCENT}% off)`;
  const priceAfterDiscountText = `Price After Discount: $${priceAfterDiscount.toFixed(2)}`;
  const taxText = `Tax Amount: $${taxAmount.toFixed(2)} (${TAX_PERCENT}% tax)`;
  const priceAfterTaxText = `Price After Tax: $${priceAfterTax.toFixed(2)}`;
  const termPriceText = `Price per Term (${credit} terms): $${termPrice.toFixed(2)}`;

  const stockText = stock >= purchaseAmount ? `There are ${stock} copies of ${title} left in stock.` : `Sorry, we're out of stock for ${title}.`;

  document.getElementById("bookDetails").textContent = bookDetails;
  document.getElementById("discountAmount").textContent = discountText;
  document.getElementById("priceAfterDiscount").textContent = priceAfterDiscountText;
  document.getElementById("taxAmount").textContent = taxText;
  document.getElementById("priceAfterTax").textContent = priceAfterTaxText;
  document.getElementById("termPrice").textContent = termPriceText;
  document.getElementById("stockText").textContent = stockText;
}

purchaseBook("The Great Gatsby", "F. Scott Fitzgerald", 15.99, 20, 8.25, 10, 5, 12);
    </script>
  </body>
</html>