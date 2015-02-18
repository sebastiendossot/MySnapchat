// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    path = require('path'), //Utilities for dealing with file paths
    bodyParser  = require('body-parser'),
    mongoose = require('mongoose'); //MongoDB integration


//Create server
var app = express();

// Configure server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client')));
//Show all errors in development
//app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


//Start server
var port = 4711;
app.listen(port, function () {
    'use strict';
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
    console.log('application_root is %s',path.join(application_root ,'../client'));
});



//Connect to database
var db = mongoose.connect('mongodb://localhost/bbq');

//Schemas
var Schema = mongoose.Schema;

var Ami = new Schema({
    idAmi1: Number,
    idAmi2: Number
    pute
});

var Utilisateur = new Schema({
    nom:  String,
    description: String,
    mail: String,
    mdp : String
});

var Destinataire = new Schema({
    idDestinataires : Number,
    lu : Boolean
});

var Message = new Schema({
    type:  String,
    donnes: String,
    idEnvoyeur : Number,
    destinataires : [Destinataire]
});

var MySnapchatSchema = new Schema({
    utilisateurs : [Utilisateur],
    messages: [Message],
    amis : [Ami]
});


//Models
var MySnapchatModel = mongoose.model('MySnapchatModel', MySnapchatSchema);



//Get all recipes
app.get('/api/recipes', function (req, resp , next) {
    'use strict';
    MySnapchatModel.find(function (err, coll) {
        if (!err) {
            return resp.send(coll);
        } else {
            console.log(err);
            next(err);
		}
	});
});
    
//add a new element in the collection
app.post('/api/recipes', function(req, res, next) {
    var newSnap = new MySnapchatModel(req.body);
    newSnap.save(function(e, results){
        if (e) return next(e);
        res.send(results);
    })
});

//get a single element
app.get('/api/recipes/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    MySnapchatModel.findById(req.params.id, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

