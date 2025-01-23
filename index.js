// Load environment variables from a .env file.
require('dotenv').config();
const app = require('express')();
const axios = require('axios');
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

 

app.get('/', (req, res) => {
    res.status(200).send('test home link ');
});


app.listen(PORT,()=>console.log('listing to port '+ PORT));

 



