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

var Friend = new Schema({
    idAmi1: Schema.ObjectId,
    idAmi2: Schema.ObjectId,
    accepted : {type: Boolean, default:false}
});

var User = new Schema({
    pseudo: {type: String, unique: true},
    description: String,
    email: String,
    pwd : String
});

var Destinataire = new Schema({
    idDestinataire : Schema.ObjectId,
    lu : Boolean
});

var Message = new Schema({
    type:  String,
    donnes: String,
    temps: Number,
    idEnvoyeur : Schema.ObjectId,
    destinataires : [Destinataire],
    dateEnvoi : Date
});

/*
var MySnapchatSchema = new Schema({
    utilisateurs : [Utilisateur],
    messages: [Message],
    amis : [Ami]
});
*/

//Models
var UserModel = mongoose.model('UtilisateurModel', User);
var MessageModel = mongoose.model('MessageModel', Message);
var FriendModel = mongoose.model('FriendModel', Friend);

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
app.post('/api/user/subscribe', function(req, res, next) {
    var hash = crypto.createHash('sha256')
    hash.update(req.body.pwd)
    req.body.pwd = hash.digest('hex')
    var newUser = new UserModel(req.body)
    newUser.save(function(e, results){
        if (e) {
            res.sendStatus(409)
            return next(e)
        }
        res.send(results)
    })
});

// Connection
app.post('/api/user/login', function(req, res, next) {
    var pseudo = req.body.pseudo;
    var password = req.body.password;
    console.log("pseudo = "+ pseudo +" , pass = "+ password)
    UserModel.findOne({'pseudo': pseudo}, function(e, result) {
        if (e) return next(e)
            if (!result) {
                res.sendStatus(401)
            }
            else {
                var hash = crypto.createHash('sha256')
                hash.update(password)
                password = hash.digest('hex')
                if (password == result.pwd) {

                    var token = jwt.encode({
                        iss: result._id
                    }, app.get('jwtTokenSecret'));

                    res.json({
                        token : token,
                        user: result
                    });
                }
                else {
                    console.log(e);
                    res.sendStatus(401)
                }
            }	    
        })
});

//Demande d'ami
app.post('/api/friend', function(req, res, next) {
    var senderId = authenticateSender(req.headers);
    if(!senderId) res.sendStatus(403);
    UserModel.findOne({'pseudo':req.body.pseudo}, function(e, result){ 
        if (e) return next(e);
        if (!result) {
            res.sendStatus(404)
        } else {
            var newFriend = new FriendModel({
                idAmi1 : senderId,
                idAmi2 : result._id
            });
            newFriend.save(function(e, results){
                if (e) return next(e);
                res.send(results);
            })

        }
    })
});

//Envoyer un message
app.post('/api/message', function(req, res, next) {
    var newMessage = new MessageModel(req.body);
    newMessage.save(function(e, results){
        if (e) return next(e);
        res.send(results);
    })
});


/*************************************************************/
/********************** UPDATE REQUESTS **********************/
/*************************************************************/

// TODO : Acceptation d'une demande d'amis
app.put('/api/request/:id', function(req, res, next) {
    // A coder : UPDATE Ami SET accepte = true WHERE _id = req.body.idToUpdate
    var reqId = req.params.id;
    console.log("Accept friend - ID line = "+req.params.id);
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    //If the user accepting the request is the one who received the request, Okay
    FriendModel.findById(reqId, function(e, result) {
        if (e) return next(e);
        if (!result) res.sendStatus(404);
        if (result.idAmi2.equals(id)) {
            result.accepted = true;
            result.save(function (err, req) {
                if (err) return next(err);
                res.sendStatus(200)
            })
        }
    })

});



/*************************************************************/
/********************** GET REQUESTS *************************/
/*************************************************************/

//Get UserInfo by Pseudo
app.get('/api/user/byPseudo/:pseudo', function(req, res, next) {
    console.log("Pseudo recherché : " + req.params.pseudo);
    UserModel.findOne({'pseudo':req.params.pseudo}, function(e, result){ 
        if (e) return next(e);
        res.send({'user':result})
    })
})

//Get UserInfo by ID
app.get('/api/user/byId/:id', function(req, res, next) {
    console.log("id = "+req.params.id);
    UserModel.findById(req.params.id, function(e, result){
        if (e) return next(e);
        res.send({'user':result})
    })
})

//get les messages qui nous sont addressés
app.get('/api/message/', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    MessageModel.find({destinataire : id }, function(e, result){
        if (e) return next(e);
        res.send(result)
    })
})

//recupération de toutes les demandes d'ami reçues et non traitées par un utilisateur
app.get('/api/receivedRequests', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    //Let's find all the pending requests sent to the user
    FriendModel.find({idAmi2 : id, accepted : false }, function(e, result){
        if (e) return next(e);
        if(result.length === 0) return res.send({list:[]});
        var requesters = []
        //For each requester, we get its pseudo and store it in a list we'll send
        var asyncLoop = function(i, callback) {
            if( i < result.length ) {
                var requestSenderId = result[i].idAmi1;
                var reqId = result[i]._id;
                UserModel.findById(requestSenderId, 'pseudo', function(e, user){
                    if (e) return next(e);
                    requesters.push({user:user, reqId:reqId});
                    asyncLoop( i+1, callback );
                })
            } else {
                callback();
            }
        }
        asyncLoop( 0, function() {
            res.send({list:requesters})
        });
    })
})

//recupération de toutes les demandes d'ami envoyées et non encore acceptées
app.get('/api/sentRequests', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    FriendModel.find({idAmi1 : id, accepted : false }, function(e, result){
        if (e) return next(e);
        if(result.length === 0) return res.send({list:[]});
        var requests = []
        //For each requester, we get its pseudo and store it in a list we'll send
        var asyncLoop = function(i, callback) {
            if( i < result.length ) {
                var requestSenderId = result[i].idAmi2;
                var reqId = result[i]._id;
                UserModel.findById(requestSenderId, 'pseudo', function(e, user){
                    if (e) return next(e);
                    requests.push({user:user, reqId:reqId});
                    asyncLoop( i+1, callback );
                })
            } else {
                callback();
            }
        }
        asyncLoop( 0, function() {
            res.send({list:requests})
        });
    })
})

//recupération des amis
// A CORRIGER : idAmi1 : req.params.id OU idAmi2 : req.params.id, sinon ça retournera pas tous les amis. Normalement fait par Nicolas !
app.get('/api/friends', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    var tmpFriends = [];
    FriendModel.find(function(e, res) {
        console.log(res);
        console.log(id)
    })
    FriendModel.find({idAmi1 : id, accepted : true }, function(e, result){
        if (e) return next(e);
        if (result) tmpFriends = result;

        FriendModel.find({idAmi2 : id, accepted : true }, function(e, result){
            if (e) return next(e);
            if (result) tmpFriends = tmpFriends.concat(result);
            if (tmpFriends.length === 0) {
                return res.send({list:[]})
            } else {
                var friends = []
                //For each requester, we get its pseudo and store it in a list we'll send
                var asyncLoop = function(i, callback) {
                    if( i < result.length ) {
                        var friendshipId = tmpFriends[i]._id
                        var requestSenderId = tmpFriends[i].idAmi1;
                        if(requestSenderId.equals(id)) requestSenderId = tmpFriends[i].idAmi2;

                        UserModel.findById(requestSenderId, 'pseudo', function(e, user){
                            if (e) return next(e);
                            friends.push({user: user, friendshipId: friendshipId});
                            asyncLoop( i+1, callback );
                        })
                    } else {
                        callback();
                    }
                }
                asyncLoop( 0, function() {
                    res.send({list:friends})
                });
            }
        });
})
})

/*************************************************************/
/********************* DELETE REQUESTS ***********************/
/*************************************************************/


app.delete('/api/user/unsubscribe', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    UserModel.findByIdAndRemove(id,  function(e, result){
        if (e) return res.sendStatus(404);
        if(result) {
            console.log("Account "+result.pseudo+" removed")
        }
        res.sendStatus(200)
    })
})

// TODO : Suppression ou refus d'un ami
app.delete('/api/friend/:id', function(req, res, next) {
    // A coder : DELETE FROM Ami WHERE _id = req.body.idToDelete
    var reqId = req.params.id;
    console.log("Delete friend - ID line = "+req.params.id);
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    //If the user asking to delete is the one who received the request, Okay
    FriendModel.findById(reqId, function(e, result) {
        if (e) return next(e);
        if (!result) res.sendStatus(404);
        if (result.idAmi2.equals(id)) {
            result.remove(function (err, req) {
                if (err) return next(err);
                res.sendStatus(200)
            })
        }
    })


});
