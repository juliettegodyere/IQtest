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
var fields = ['questions', 'answers', 'explanation', 'option', 'date'];

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
                var newGuy = {
                    "_id": item._id,
                    "explanation": item.explanation,
                    "image": item.image,
                    "answer": item.answer,
                    "question": item.question,
                    "__v": item.__v,
                    "date": item.date,
                    "options": item.option ? item.option.split(',') : ''
                }
                sortedArray.push(newGuy);
            })
            json2csv({
                    users: sortedArray,
                    fields: fields
                }, function(err, csv) {
                    if (err) console.log(err);
                    fs.writeFile('file.csv', csv, function(err) {
                        if (err) throw err;
                        console.log('file saved');
                    });
                });


            // res.json({
            //     users: sortedArray
            // });
        }
    }).sort({
        _id: 1
    });
});


app.listen(1337, function() {
    console.log('listening on *:1337');
});
module.exports = app;
