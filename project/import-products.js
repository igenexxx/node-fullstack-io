const db = require('./db');
const Products = require('./models/products');

const products = require('./products_1.json');

(async function() {
  for (let product of products) {
    console.log(await Products.create(product));
  }

  db.disconnect();
})()
