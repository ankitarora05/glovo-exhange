const express = require('express');
const bodyParser = require('body-parser');
const port = "2018";
const app = express();
const router = require('./routes/product.route');

//setup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//setup router
app.use("/products",router);
app.listen(port, function(){
    console.log("Server listening on port:" + port);
});