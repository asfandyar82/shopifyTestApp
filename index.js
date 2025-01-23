// Load environment variables from a .env file.
require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT || 3000;
const Shopify = require('shopify-api-node');
const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,  
    apiKey: process.env.API_KEY,  
    password: process.env.API_SECRET  
});

async function getAllProducts(){
    try {
        const products = await shopify.product.list(); 
        return products; 
    } catch(error) {
        console.error(error); 
    }
}
let myproducts;

(async () => {
    // Get all products.
    const products = await getAllProducts();
     
    myproducts=products;
})()

app.get('/api/getproducts', (req, res) => {
     
    res.status(200).send(myproducts);
});

app.get('/', (req, res) => {
    res.status(200).send('test home link ');
});


app.listen(PORT,()=>console.log('listing to port '+ PORT));

 



