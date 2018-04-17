//Require the express module
//Require checks if the module exists in the library, if it does, it includes the module in the project
var express = require('express');
//create an express app
var app = express();

app.use('/static', express.static(__dirname + '/static'));

//These next 2 lines allow us to retrieve submitted data
//Checks if the module is in the library and if so, includes the module in the project
var bodyParser = require('body-parser');
//Loads the middlewar function, body-parser
app.use(bodyParser.urlencoded({extended: true}));

//Checks if 'path' is in the module library, if it is, it includes the 'path' module
var path = require('path');
//... now we can utilize the 'path' module ...

app.use(express.static(path.join(__dirname, './static')));

//Sets the views location path to the 'views' folder
app.set('views', path.join(__dirname, './views'));
//Sets the view engine to EJS
app.set('view engine', 'ejs');


//Require mongoose checks to see if the 'mongoose' module is in the module library
//If it is, it includes the 'mongoose' module in the project
var mongoose = require('mongoose');
//Connect to our MongoDB. If it doesn't already exist, Mongoose creates the specified DB
mongoose.connect('mongodb://localhost/dashDB');


//Use native promises - still not super sure on this one..
mongoose.Promise = global.Promise;

//Creating a new Schema...
var MuppetSchema = new mongoose.Schema({
    name: String,
    favorite_hobby: String,
}, {timestamps: true});

//Setting this schema in our Models as 'Muppet'
mongoose.model('Muppet', MuppetSchema);
//Retrieving this Schema from our Models named 'Muppet'

//Assigning the variable Muppet to the model named Muppet
var Muppet = mongoose.model('Muppet');


//If the root route is requested, then the 'index' view file is rendered
app.get('/', function(req, res){
    Muppet.find({}, function(err, results){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
    //the index view file is where we will display all of the Muppets
    res.render('index', {muppets: results});
    })
})


app.post('/', function(req, res){
    Muppet.find({}, function(err, results){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
    //the index view file is where we will display all of the Muppets
    res.render('index', {muppets: results});
    })
})


app.get('/muppets/new', function(req, res){
    res.render('new');
})

//With this POST request...
app.post('/muppets', function(req, res){
    console.log("Adding a Muppet..");
    //... a new muppet will be created
    Muppet.create(req.body, function(err){
        //if there are any error messages ...
        if(err){
            //... they will be logged to the console
            console.log(err);
        }
        //Otherwise, it will redirect the client to the root route
        res.redirect('/');
    });
});

app.get('/muppets/destroy/:id', function(req, res){
    Muppet.remove({ _id: req.params.id }, function(err, results){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
    //the index view file is where we will display all of the Muppets
    res.redirect('/');
    })
})

app.get('/muppets/edit/:id', function(req, res){
    Muppet.find({ _id: req.params.id }, function(err, results){
        res.render('edit', {muppets: results});
    })
})

app.get('/muppets/:id', function(req, res){
    Muppet.find({ _id: req.params.id }, function(err, results){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
    //the index view file is where we will display all of the Muppets
    res.render('info', {muppets: results});
    })
})


//With this POST request...
app.post('/muppets/:id', function(req, res){
    console.log("Editing a Muppet..");
    //... a  muppet will be edited
    Muppet.update({ _id: req.params.id }, req.body, function(err, result){
        if(err){
            //If there are any error msgs, they will be logged to the console
            console.log(err);
        }
    //the index view file is where we will display all of the Muppets
    res.redirect('/');
    });
});


//tells the app to listen on the port specified, this must be at the end of the file
app.listen(8000, function(){
    //logs the msg to the console to confirm that it is in fact working
    console.log("Listening on port 8000");
})