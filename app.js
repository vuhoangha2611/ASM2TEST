
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
    let colorInput = req.body.txtColor;
    let newValues = { $set: { name: nameInput, price: priceInput, color: colorInput } };
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
    let searchCondition;
    let results;
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    if (nameInput) {
        searchCondition = new RegExp(nameInput, 'i')
        results = await dbo.collection("product").find({ name: searchCondition }).toArray();
    }
    if (priceInput) {
        searchCondition = new RegExp(priceInput, 'i')
        results = await dbo.collection("product").find({ price: searchCondition }).toArray();
    }
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

// app.post('/doInsert', async (req, res) => {
//     const validRegEx = /^[^\\\/&]*$/
//     var nameInput = req.body.txtName;
//     if (nameInput.length < 6 || nameInput.match(validRegEx)) {
//         return res.status(500).send({ message: "ban nhap loi" })
//         // res.render('newProduct', {
//         //     alert: "ban nhap loi"
//         // })
//         // return;
//     }
//     var priceInput = req.body.txtPrice;
//     var newProduct = { name: nameInput, price: priceInput };

//     let client = await MongoClient.connect(url);
//     let dbo = client.db("Test123");
//     await dbo.collection("product").insertOne(newProduct);
//     res.redirect('/')
// })

app.post('/doInsert', async (req, res) => {
    var nameInput = req.body.txtName;
    // if (nameInput.length < 6||!nameInput.includes('*')) {  // nếu có dấu "!" thì sẽ trong includes sẽ trả về true, nếu bỏ "!" sẽ trả về fail
    //     return res.status(500).send({ message: "ban nhap loi" })
    // }
    if(nameInput.length < 5){
        res.render('newProduct',{error: 'Name must be more than 5 character and no number'})
    } 

    var priceInput = req.body.txtPrice;
    var colorInput = req.body.txtColor;
    var newProduct = { name: nameInput, price: priceInput, color: colorInput };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Test123");
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/')
})

const PORT = process.env.PORT || 3000
app.listen(PORT);
console.log('server is running at 3000')
