const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const Web3 = require("web3");

const app = express();
const port = 3000;

const {getIndexPage} = require('./routes/index');
const {getItemPage, 
       getAddItemPage, 
       getAddItem, 
       getModifyItemPage, 
       getModifyItem,
       getDeleteItem} = require('./routes/item');
const {getRentPage,
       getRent,
       getRentCategoryPage,
       getDeleteRent} = require('./routes/rent');
const {getContactPage} = require('./routes/contact');
const {getAboutPage} = require('./routes/about');
const {getAccountPage, 
       getLoginPage, 
       getLogin, 
       getLogout, 
       getSubscribePage, 
       getSubscribe, 
       getModifyAccountPage, 
       getModifyAccount} = require('./routes/user');
const {getAdminIndexPage, 
       getAdminUsersPage, 
       getAdminRentsPage, 
       getAdminItemsPage,
       getAdminAddCategoryPage,
       getAdminModifyCategoryPage, 
       getAdminAddCategory,
       getAdminModifyCategory, 
       getAdminDeleteCategory,
       getAdminDeleteItem,
       getAdminDeleteUser,
       getAdminDeleteRent} = require('./routes/admin');

// WEB3 interface
const abi = require("./assets/js/contractABI");
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8575"));
let urentalContract = new web3.eth.Contract(abi.abi, '0x00838625d3BAf935a4ac15c7a945b14B3472059C');
let ownerAccountAddress = '0xce0e26825f065147e1e02a9cc8dc8b2d95491697';
let buyerAddress = "0x206e9d4314ea576f1a735b72e101ce8f82b0d222";
let sellerAddress = "0x3d3f5996466965a2efe35b84e9efce909d5c3294";

app.route('/pay').post(function(req, res){
    urentalContract.methods.deposit().send({ from: ownerAccountAddress, gasPrice: web3.utils.toHex(20000000000), gasLimit: web3.utils.toHex(4700000), value: web3.utils.toHex(100) })
        .on('error', function(error){ console.log(error)})
        .on('transactionHash', function(transactionHash){})
        .on('receipt', function(receipt){console.log(receipt)})
        .on('confirmation', function(confirmationNumber, receipt){
            console.log(receipt);
            res.send({return : "ok"});
        });
});


// DATABASE
const db = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'urental'
});

db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// VARIABLE SESSION
app.use(session({
  secret: 'urental',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// CONFIG
app.set('port', port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, '/'))); // configure express to use public folder

// GET
app.get('/', getIndexPage);
app.get('/about', getAboutPage);
app.get('/rent', getRentPage);
app.get('/rent/category/:id', getRentCategoryPage);
app.get('/delete-rent/:id', getDeleteRent);
app.get('/item/:id', getItemPage);
app.get('/add-item', getAddItemPage);
app.get('/modify-item/:id', getModifyItemPage);
app.get('/delete-item/:id', getDeleteItem);
app.get('/contact', getContactPage);
app.get('/account', getAccountPage);
app.get('/modify-account', getModifyAccountPage);
app.get('/subscribe', getSubscribePage);
app.get('/login', getLoginPage);
app.get('/logout', getLogout);

// GET ADMIN
app.get('/admin/', getAdminIndexPage);
app.get('/admin/users', getAdminUsersPage);
app.get('/admin/rents', getAdminRentsPage);
app.get('/admin/items', getAdminItemsPage);
app.get('/admin/add-category', getAdminAddCategoryPage);
app.get('/admin/modify-category/:id', getAdminModifyCategoryPage);
app.get('/admin/delete-category/:id', getAdminDeleteCategory);
app.get('/admin/delete-item/:id', getAdminDeleteItem);
app.get('/admin/delete-user/:id', getAdminDeleteUser);
app.get('/admin/delete-rent/:id', getAdminDeleteRent);

// POST
app.post('/subscribe', getSubscribe);
app.post('/login', getLogin);
app.post('/item/:id', getRent);
app.post('/add-item', getAddItem);
app.post('/modify-item/:id', getModifyItem);
app.post('/modify-account', getModifyAccount);

// POST ADMIN
app.post('/admin/add-category', getAdminAddCategory);
app.post('/admin/modify-category/:id', getAdminModifyCategory);

app.route('/launchRent').post(function(req,res){
    urentalContract.methods.launchRent( web3.utils.toHex(req.body.rentHash) ).send({
        from: req.session.addressEthereum,
        gasPrice: web3.utils.toHex(20000000000),
        gasLimit: web3.utils.toHex(4700000) })
        .on('error', function(error){
            console.log( "error : ");
            console.log( error )
        })
        .on('transactionHash', function(transactionHash){})
        .on('receipt', function(receipt){
            console.log("receipt : ");
            console.log(receipt)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmation");
            console.log(receipt);
            console.log(confirmationNumber);
            res.redirect('/account');
        });
});

app.route('/releaseRent').post(function(req,res){
    urentalContract.methods.releaseRent( web3.utils.toHex(req.body.rentHash) ).send({
        from: req.session.addressEthereum,
        gasPrice: web3.utils.toHex(20000000000),
        gasLimit: web3.utils.toHex(4700000) })
        .on('error', function(error){
            console.log( "error : ");
            console.log( error )
        })
        .on('transactionHash', function(transactionHash){})
        .on('receipt', function(receipt){
            console.log("receipt : ");
            console.log(receipt)
        })
        .on('confirmation', function(confirmationNumber, receipt){
            console.log("confirmation");
            console.log(receipt);
            console.log(confirmationNumber);
            res.redirect('/account');
        });
});

app.route('/getSellerState').post(function (req, res) {
    urentalContract.methods.getSellerState( web3.utils.toHex(req.body.rentHash) ).call({ from : req.session.addressEthereum }).then(  function(sellerState) {
        console.log(sellerState);
        res.send({"sellerState": sellerState})
    })
});

app.route('/getBuyerState').post(function (req, res) {
    urentalContract.methods.getBuyerState( web3.utils.toHex(req.body.rentHash) ).call({ from : req.session.addressEthereum }).then(  function(buyerState) {
        console.log(buyerState);
        res.send({"sellerState": buyerState})
    })
});



app.route('/getRent').post(function(req,res) {
    urentalContract.methods.getRent( web3.utils.toHex(req.body.rentHash) ).call({from: req.session.addressEthereum }).then( function(rent) {
        console.log("rrr");
        res.send({"rent": rent})
    }).catch( function (error) {
        console.log(error);
        res.send({"error": error})
    });
});

// LISTEN
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});