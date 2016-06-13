var express = require('express');
// var csv = require('express-csv');
var json2csv = require('json2csv');
var fs = require('fs');
var Converter = require("csvtojson").Converter;
// var nodeExcel = require('excel-export');
// var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');

var Data = require('./models/data');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/create', function(req, res) {
    res.render('create', {
        title: 'Add New Users'
    });
});

// app.get('/dashboard', function(req, res) {
//     res.render('dashboard', {
//         title: 'Dashboard'
//     });
// });



app.post('/create', function(req, res) {
    var question = req.body.question;
    var answer = req.body.answer;
    var image = req.body.image;
    var option = req.body.option;
    var explanation = req.body.explanation;
    var date = new Date();

    var data = new Data();
    data.question = question;
    data.answer = answer;
    data.image = image;
    data.option = option;
    data.explanation = explanation;
    data.date = date;

    data.save(function(err, user) {

        if (err) {
            console.log(err);
            return res.status(500).send();
        } else {
            // res.json({user: user });
            // console.log('user saved' + user);
            res.send('user');
            return res.status(200).send();
        }

    });
});

app.get('/', function(req, res) {
    Data.find({}, function(err, users) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else {

             console.log(users);
            // Prepare an sorted array
            var sortedArray = [];
            users.forEach(function(item){
                if (item.option && item.option.trim().length){
                    var newGuy = {
                        "_id": item._id,
                        "explanation": item.explanation,
                        "image": item.image,
                        "answer": item.answer,
                        "question": item.question,
                        "__v": item.__v,
                        "date": item.date,
                        "options": item.option ? item.option.split('|') : ''
                    }
                    sortedArray.push(newGuy);   
                }
            })
            res.json({
                users: sortedArray
            });
            
            
        }
    }).sort({
        _id: -1
    });
});
var fields = ['question', 'answer', 'image', 'option', 'explanation', 'date'];
app.get('/export', function(res,req){        
    // res.sendfile('file imported');
    var sortedsArray = [];
    Data.find({}, function(err, data){  
        //console.log(data);
        sortedsArray = data
        console.log(sortedsArray);

        json2csv({
                data: sortedsArray,
                fields: fields
            }, function(err, csv) {
                if (err) console.log(err);
                fs.writeFile('file.csv', csv, function(err) {
                    if (err) throw err;
                    console.log('file saved');
                });
        });
    })
    


    
});

app.get('/import', function(res,req){
    var converter = new Converter({});
    converter.fromFile("./file.csv", function(err,items){
        if (err) console.log(err);
            //console.log(result);
            var numberOfSavedRecords = 0;
            var numberOfErrorRecords = 0;
            console.log(items.length);
            items.forEach(function(item){
                //console.log(item);
                var current = item;
                var data = new Data();
                data.question = current.question;
                data.answer = current.answer;
                data.image = current.image;
                data.option = current.option;
                data.explanation = current.explanation;
                // data.date_created = new Date(current.date_created);
                data.date = new Date();

                data.save(function(err, user) {
                    if (err) {
                        console.log(err);
                        numberOfErrorRecords++;
                    } else {
                        numberOfSavedRecords++;  
                    }
                });
            })
            console.log('Report: '+numberOfSavedRecords + 'records completed and ' + numberOfErrorRecords + ' records failed');
    })
    // console.log(sortedArray);
    
})
app.listen(3001, function() {
    console.log('listening on *:3001');
});
module.exports = app;
