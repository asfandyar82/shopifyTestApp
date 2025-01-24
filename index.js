// Load environment variables from a .env file.
require('dotenv').config();
const express = require('express')
const app = express()
const axios = require('axios');
app.use(express.urlencoded({
  extended: true
}))
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
const Shopify = require('shopify-api-node');



app.get('/api/getproducts', async (req, res) => {
  try {
    const url = `https://${process.env.API_KEY}:${process.env.API_SECRET}@${process.env.SHOP_NAME}/admin/api/2025-01/products.json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch products from Shopify.' });
  }
});

app.get('/api/get-products-by-id', async (req, res) => {

  //  let search=req.query.title;

  //  console.log(search);
  let id = req.query.id; // Search query from the user

  if (!id) {
    return res.status(400).json({ error: "Id parameter is required" });
  }
  try {
    const url = `https://${process.env.API_KEY}:${process.env.API_SECRET}@${process.env.SHOP_NAME}//admin/api/2024-10/products/`+id+`.json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch products from Shopify.' });
  }
});


app.get('/', (req, res) => {
  res.status(200).send(`<form action="/api/search-filters" method="GET"> <label for="inputField">Enter Product Name:</label>
        <input type="text" id="title" name="title" required>
        <button type="submit">Submit</button>
    </form>`);
});

const SHOPIFY_GRAPHQL_ENDPOINT = `https://${process.env.SHOP_NAME}/admin/api/2025-01/graphql.json`;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Search and Discovery API - Example: Querying filters
app.get("/api/search-filters", async (req, res) => {
  try {
    const { title } = req.query;
    const query = `
        {
          products(first: 5, query: "${title}") {
            edges {
              node {
                id
                title
                 
              }
            }
          }
        }
        `;

    const response = await axios.post(
      SHOPIFY_GRAPHQL_ENDPOINT,
      { query },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.API_SECRET,
        },
      }
    );

    const products = response.data.data.products.edges.map(edge => ({
      id: edge.node.id.replaceAll("gid://shopify/Product/", ""),
      title: edge.node.title
    }));

    res.json({ products });
  } catch (error) {
    console.error("Error fetching filters:", error.response?.data || error.message);
    res.status(500).json({ error: "An error occurred while fetching filters" });
  }
});


app.listen(PORT, () => console.log('listing to port ' + PORT));





