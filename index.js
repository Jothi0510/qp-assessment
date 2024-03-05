var express = require('express');
var app = express();
var connection = require('./database.js').databaseConnection;

app.use(express.json())

//Admin Responsibilities
//List all the Groceries
app.get('/groceries', (req, res) => {
    let sql = 'SELECT * FROM grocery';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        //console.log(result);
        res.send(result);
    });
});

//Add new Groceries
app.post('/add', (req,res)=>{
    //console.log(req.body)
    req.body.forEach((r) => {
    let sql = 'INSERT INTO grocery(name,mfd,expiry_date,price,quantity) values("'+r.name+'","'+r.mfd+'","'+r.expiry_date+'","'+r.price+'","'+r.quantity+'")';
    connection.query(sql , (err,result) =>{
    let response = {
        "status" : "Grocery inserted successfully"
    }
        res.json(response)
    })
});
});

//Delete Grocery items
app.delete('/remove/:name',(req,res)=>{
    let sql = 'DELETE FROM grocery where name = "'+req.params.name+'"';
    connection.query(sql, (err,result)=>{
        let response = {
            "status" : req.params.name + " is deleted successfully"
        }
        res.json(response);
    })
});

//Update Grocery items
app.put('/update/:id',(req,res)=>{
    let sql = 'UPDATE grocery set name = "'+req.body.name+'" , price = "'+req.body.price+'" , quantity = "'+req.body.quantity+'" where id = "'+req.params.id+'"';
    connection.query(sql, (err,result)=>{
        let response = {
            "status" : "ID "+req.params.id+" is updated successfully"
        }
        res.json(response);
    })
});


//USER RESPONSIBILITIES --> VIEW GROCERY ITEMS
app.get('/grocerylist',(req,res)=>{
    let sql = "select name,quantity from grocery where quantity > 0";
    connection.query(sql,(err,result)=>{
        res.json(result);
    })
});

//USER RESPONSIBILITIES --> ORDER GROCERIES

app.post('/order',(req,res)=>{
    var o = req.body.order_id;
    req.body.order_items.forEach((r)=>{
        let sql = 'INSERT INTO user_grocery(order_id,name,quantity) values("'+o+'","'+r.name+'","'+r.quantity+'")';
        connection.query(sql,(err,result)=>{
            let sql0 = 'select quantity from grocery where name = "'+r.name+'"';
            connection.query(sql0,(err,result)=>{
                result.forEach((r1)=>{
                    let value = r1.quantity - r.quantity;
                let sql1 = 'UPDATE grocery set quantity = '+value+'  where name = "'+r.name+'"';
                connection.query(sql1,(err,result)=>{
                })
                })
            })  
        })
    })
    let resp = {
        "status": "Order placed successfully for Order# - " +o
    }
    res.json(resp)
    
})
app.listen(8080);