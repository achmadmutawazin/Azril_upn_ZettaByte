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

    <script>
      function purchaseBook(title, author, price, discountPercent, taxPercent) {
        const DISCOUNT_PERCENT = discountPercent;
        const TAX_PERCENT = taxPercent;
        const DISCOUNT_MULTIPLIER = (100 - DISCOUNT_PERCENT) / 100;
        const TAX_MULTIPLIER = (100 + TAX_PERCENT) / 100;
        const discountAmount = price * (DISCOUNT_PERCENT / 100);
        const priceAfterDiscount = price * DISCOUNT_MULTIPLIER;
        const taxAmount = priceAfterDiscount * (TAX_PERCENT / 100);
        const priceAfterTax = priceAfterDiscount * TAX_MULTIPLIER;

        const bookDetails = `Title: ${title}, Author: ${author}, Price: $${price.toFixed(2)}`;
        const discountText = `Discount Amount: $${discountAmount.toFixed(2)} (${DISCOUNT_PERCENT}% off)`;
        const priceAfterDiscountText = `Price After Discount: $${priceAfterDiscount.toFixed(2)}`;
        const taxText = `Tax Amount: $${taxAmount.toFixed(2)} (${TAX_PERCENT}% tax)`;
        const priceAfterTaxText = `Price After Tax: $${priceAfterTax.toFixed(2)}`;

        document.getElementById("bookDetails").textContent = bookDetails;
        document.getElementById("discountAmount").textContent = discountText;
        document.getElementById("priceAfterDiscount").textContent = priceAfterDiscountText;
        document.getElementById("taxAmount").textContent = taxText;
        document.getElementById("priceAfterTax").textContent = priceAfterTaxText;
      }

      purchaseBook("The Great Gatsby", "F. Scott Fitzgerald", 15.99, 20, 8.25);
    </script>
  </body>
</html>
