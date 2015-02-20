// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    path = require('path'), //Utilities for dealing with file paths
    bodyParser  = require('body-parser'),
    mongoose = require('mongoose'), //MongoDB integration
    crypto = require('crypto'); //to hash passwords


//Create server
var app = express();

// Configure server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client/www')));
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
    idAmi1: Schema.ObjectId,
    idAmi2: Schema.ObjectId,
    accepte : Boolean
});

var Utilisateur = new Schema({
    nom:  String,
    description: String,
    mail: String,
    mdp : String
});

var Destinataire = new Schema({
    idDestinataires : Schema.ObjectId,
    lu : Boolean
});

var Message = new Schema({
    type:  String,
    donnes: String,
    idEnvoyeur : Schema.ObjectId,
    destinataires : [Destinataire]
});

/*
var MySnapchatSchema = new Schema({
    utilisateurs : [Utilisateur],
    messages: [Message],
    amis : [Ami]
});
*/

//Models
var UtilisateurModel = mongoose.model('UtilisateurModel', Utilisateur);
var MessageModel = mongoose.model('MessageModel', Message);
var AmiModel = mongoose.model('AmiModel', Ami);

/*var MySnapchatModel = mongoose.model('MySnapchatModel', MySnapchatSchema);*/


//Get all recipes
app.get('/api/recipes', function (req, resp , next) {
    'use strict';
    RecipeModel.find(function (err, coll) {
        if (!err) {
            return resp.send(coll);
        } else {
            console.log(err);
            next(err);
		}
	});
});
 

// create the hash for inscription and connection 
var hash = crypto.createHash('sha256')


//Requetes POST

//Ajouter un utilisateur
app.post('/api/utilisateur', function(req, res, next) {
    hash.update(req.body.mdp)
    req.body.mdp = hash.digest('hex')
    var newUtilisateur = new UtilisateurModel(req.body);
    newUtilisateur.save(function(e, results){
        if (e) return next(e);
        res.send(results);
    })
});

// Connection
app.post('/api/connection/', function(req, res, next) {
    var name = req.body.nom
    var password = req.body.mdp
    console.log("name = "+ name +" , pass = "+ password)
    UtilisateurModel.findOne({'nom': name}, function(e, result) {
	if (e) return next(e)
	if (!result) 
	    res.send(null)
	else {
	    hash.update(password)
	    password = hash.digest('hex')
	    if (password == result.mdp)
		res.send(result)
	    else
		res.send(null)
	}	    
    })
})

//Envoyer un message
app.post('/api/message', function(req, res, next) {
    var newMessage = new MessageModel(req.body);
    newMessage.save(function(e, results){
        if (e) return next(e);
        res.send(results);
    })
});

//Demande d'ami
app.post('/api/ami', function(req, res, next) {
    var newAmi = new AmiModel(req.body);
    newAmi.save(function(e, results){
        if (e) return next(e);
        res.send(results);
    })
});

//GET

//get les messages qui nous sont addressés
app.get('/api/message/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    MessageModel.find({destinataire : req.params.id }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

//recupération de toutes les demandes d'ami concernant l'utilisateur
app.get('/api/ami/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    AmiModel.find({idAmi2 : req.params.id, accepte : false }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})



//recupération des amis
app.get('/api/ami/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    AmiModel.find({idAmi2 : req.params.id, accepte : true }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})


//recupération des informations d'un utilisateur
/*app.get('/api/utilisateur/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    UtilisateurModel.findById(req.params.id, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})*/
// a supprimer ?


