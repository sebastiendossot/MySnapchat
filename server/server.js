// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    path = require('path'), //Utilities for dealing with file paths
    bodyParser  = require('body-parser'),
    mongoose = require('mongoose'), //MongoDB integration
    crypto = require('crypto'), //to hash passwords
    jwt = require('jwt-simple'); // Token authentication


//Create server
var app = express();

// Configure server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(application_root ,'../client/www')));
app.set('jwtTokenSecret', 'PEDSnapSECRE7');
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
var db = mongoose.connect('mongodb://localhost/snap');

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

var authenticateSender = function(headers) {
    var token = headers['x-session-token'];
    if(token) {
        try {
            //console.log("TOKEN = " + token)
            var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
            //console.log("ID is : "+JSON.stringify(decoded.iss))
            return decoded.iss;
        } catch (err) {
            return undefined;
        }
    } else {
        return undefined;
    }
}

/*************************************************************/
/********************** POST REQUESTS ************************/
/*************************************************************/

//Ajouter un utilisateur
app.post('/api/utilisateur', function(req, res, next) {
    var hash = crypto.createHash('sha256')
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
    var name = req.body.name;
    var password = req.body.password;
    console.log("name = "+ name +" , pass = "+ password)
    UtilisateurModel.findOne({'nom': name}, function(e, result) {
        if (e) return next(e)
            if (!result) 
                res.sendStatus(401)
            else {
                var hash = crypto.createHash('sha256')
                hash.update(password)
                password = hash.digest('hex')
                if (password == result.mdp) {

                    var token = jwt.encode({
                        iss: result._id
                    }, app.get('jwtTokenSecret'));

                    res.json({
                        token : token,
                        user: result
                    });
                }
                else
                  res.send(401)
          }	    
      })
})


/*************************************************************/
/********************** GET REQUESTS *************************/
/*************************************************************/

//getBy Pseudo
app.get('/api/utilisateur/:nom', function(req, res, next) {   
 UtilisateurModel.findOne({'nom':req.params.nom}, function(e, result){  
     console.log("Nom du recepteur 123456");
     if (e)      
       return next(e); 
     if (result)
	 console.log(result.nom)
   res.send(result)
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

// TODO : Suppression ou refus d'un amis
app.post('/api/deleteRequest', function(req, res, next) {
	// A coder : DELETE FROM Ami WHERE _id = req.body.idToDelete
	console.log("Delete friend - ID line = "+req.body.idToDelete);
});

// TODO : Acceptation d'une demande d'amis
app.post('/api/acceptRequest', function(req, res, next) {
	// A coder : UPDATE Ami SET accepte = true WHERE _id = req.body.idToUpdate
	console.log("Accept friend - ID line = "+req.body.idToUpdate);
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

//recupération de toutes les demandes d'ami reçues et non traitées par un utilisateur
app.get('/api/requests/:id', function(req, res, next) {
    authenticateSender(req.headers);
    console.log("id = "+req.params.id);
    AmiModel.find({idAmi2 : req.params.id, accepte : false }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

//recupération des amis
// (David) A CORRIGER : idAmi1 : req.params.id OU idAmi2 : req.params.id, sinon ça retournera pas tous les amis.
app.get('/api/friends/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    AmiModel.find({idAmi1 : req.params.id, accepte : true }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

//recupération des informations d'un utilisateur
app.get('/api/user/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    UtilisateurModel.findById(req.params.id, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

/*************************************************************/
/********************* DELETE REQUESTS ***********************/
/*************************************************************/


