var express = require("express");
var path = require("path");
var fs = require("fs");
var app = express();
const exphbs = require("express-handlebars");
const data = require("./dataset.json");



const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

// Configure handlebars
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        replaceZeroWithNA: function (value) {
            return value === 0 ? "N/A" : value;
        },
        eq: function (a, b) {
            return a === b;
        }
    }
}));

app.set('view engine', '.hbs');

app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/users', function (req, res) {
    res.send('respond with a resource');
});

app.get("/data", (req, res) => {
    res.render("data", { data: "JSON data is loaded and ready!" });
    // console.log(data);
});

app.get('/data/product/:index', (req, res) => {


    const productIndex = parseInt(req.params.index);

    const productsData = loadUser();

    if (productIndex >= 0 && productIndex < productsData.length) {

        const product = productsData[productIndex];

        res.json({ asin: product.asin });
    } else {

        res.status(404).json({ error: 'you entered wrong index' });
    }
});




app.get('/data/search/prdID/', (req, res) => {
    res.send(`
      <form method="POST" action="/data/search/prdID/">
        <label for="prdID">Enter Product ID:</label>
        <input type="text" id="prdID" name="prdID" required>
        <input type="submit" value="Search">
      </form>
    `);
});

app.post('/data/search/prdID/', express.urlencoded({ extended: true }), (req, res) => {
    const productId = req.body.prdID;
    const foundProduct = data.find(product => product.asin === productId);

    if (foundProduct) {
        console.log('Found product:', foundProduct);
        res.render("prdID", { product: foundProduct });
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

app.get('/data/search/prdName/', (req, res) => {
    res.send(`
      <form method="POST" action="/data/search/prdName/">
        <label for="prdName">Enter Product Name:</label>
        <input type="text" id="prdName" name="prdName" required>
        <input type="submit" value="Search">
      </form>
    `);
});
app.post('/data/search/prdName/', express.urlencoded({ extended: true }), (req, res) => {
    const productName = req.body.prdName.toLowerCase();

    const foundProducts = data.filter(product =>
        product.title.toLowerCase().includes(productName)
    );

    console.log('Found:', foundProducts);

    if (foundProducts.length > 0) {
        console.log('Found products:', foundProducts);
        res.render("prdName", { products: foundProducts }); // Pass foundProducts to the render function
    } else {
        res.status(404).json({ error: 'No products found' });
    }
});
// app.get("/allData", (req, res) => {
//     res.render("allData", { products: data }); // Change 'product' to 'products'
// });

app.get("/allData", (req, res) => {
    res.render("sample", { data }); // Assuming `data` is defined elsewhere
});

app.get('*', function (req, res) {
    res.render('error', { title: 'Error', message: 'Wrong Route' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
