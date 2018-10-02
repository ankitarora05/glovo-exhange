const axios = require('axios');
const exchanges = ['BTX','BNB', 'BFX']
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRldkBnbG92b2FwcC5jb20iLCJpZCI6IjVhNTcyZGEyNTM4OWMzNzZiZWZlNjY1NCIsImlhdCI6MTUxNTY2MjgyMn0.a6homMOumqLBxwfX9nOwbBaxmSx-srkS8dISSPCPPYE"
exports.listAllProducts = function(req,res) {
    const promises = [];

    for(var i=0;i<exchanges.length;i++) {
        promises.push(fetchProdutsFromExchange(exchanges[i]));
    }

    axios.all(promises).then(axios.spread(function(res1, res2, res3){
        let unionExchange = findCommonProducts(res1.data, res2.data, res3.data);
        res.send(unionExchange);
    })).catch(function(err){
        res.status(500).send("Something went wrong!!");
    });

}

function findCommonProducts(arr1, arr2, arr3) {
    let arrays = []
    arrays.push(arr1, arr2, arr3);
    var currentValues = {};
    var commonValues = {};
    for (var i = arrays[0].length-1; i >=0; i--){//Iterating backwards for efficiency
        currentValues[arrays[0][i]["id"]] = 1; //Doesn't really matter what we set it to
    }
    for (var i = arrays.length-1; i>0; i--){
        var currentArray = arrays[i];
        for (var j = currentArray.length-1; j >=0; j--){
        if (currentArray[j]["id"] in currentValues){
            commonValues[currentArray[j]["id"]] = 1; //Once again, the `1` doesn't matter
        }
        }
        currentValues = commonValues;
        commonValues = {};
    }
    return Object.keys(currentValues).map(function(value){
        return value;
    });
}

function fetchProdutsFromExchange(exchange) {
    return axios.get(`https://api.moneeda.com/api/exchanges/${exchange}/products`,{ headers: {Authorization: 'Bearer ' + authToken}})
}

function fetchProductPrices(exchange, param) {
    return axios.get(`https://api.moneeda.com/api/exchanges/${exchange}/ticker?product=${param}`, { headers: {Authorization: 'Bearer ' + authToken}})
}
exports.productPrice = function(req,res) {
    const promises = [];
    console.log(req.params);
    for(var i=0;i<exchanges.length;i++) {
        promises.push(fetchProductPrices(exchanges[i], req.params.PRODUCTS));
    }
    axios.all(promises).then(axios.spread(function(res1, res2, res3){
        res1.data["exchange"] = 'BTX';
        res2.data["exchange"] = 'BNB';
        res3.data["exchange"] = 'BFX';
        let finalArray = [];
        finalArray.push(res1.data, res2.data, res3.data);
        res.send(JSON.stringify(finalArray));
    })).catch(function(err){
        res.status(500).send("Something went wrong!!");
    })
}