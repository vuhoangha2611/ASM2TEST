var express = require('express')
var hbs = require('hbs')

var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'hbs')


var url = 'mongodb+srv://vuhoangha:1234@cluster0.edbka.mongodb.net/test';
var MongoClient = require('mongodb').MongoClient;

app.post('/update', async (req, res) => {
    let id = req.body.txtId;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues = { $set: { name: nameInput, price: priceInput } };
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    await dbo.collection("product").updateOne(condition, newValues);
    res.redirect('/');

})

app.get('/edit', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let productToEdit = await dbo.collection("product").findOne(condition);
    res.render('edit', { product: productToEdit })

})

app.get('/delete', async (req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };

    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");

    await dbo.collection("product").deleteOne(condition);
    res.redirect('/')
})

app.post('/search', async (req, res) => { 
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let nameInput = req.body.txtName;
    let searchCondition = new RegExp(nameInput, 'i')
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray(); 
    res.render('index', { model: results })
})

app.get('/', async (req, res) => { 
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('index', { model: results })
})

//taoj file insert
app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.post('/doInsert', async (req, res) => { 
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = { name: nameInput, price: priceInput };

    let client = await MongoClient.connect(url); 
    let dbo = client.db("Test123"); 
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/')
})
const PORT = process.env.PORT||3000 
app.listen(PORT); 
console.log('server is running at 3000')




