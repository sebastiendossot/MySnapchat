// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    path = require('path'), //Utilities for dealing with file paths
    bodyParser  = require('body-parser'),
    mongoose = require('mongoose'), //MongoDB integration
    crypto = require('crypto'), //to hash passwords
    jwt = require('jwt-simple'), // Token authentication
    multiparty = require('connect-multiparty'),
    multipartMiddleware = multiparty()
    fs = require('fs'),
    uploadDir = "./media";


//Create server
var app = express();
var isLocal = process.env.PORT === undefined
console.log(isLocal ? "LOCAL LAUNCH" : "MODULUS LAUNCH")

// Configure server
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
if(isLocal) {
    app.use(express.static(path.join(application_root ,'../client/www')));
    app.use(express.static(path.join(application_root ,'media')));
}
app.set('jwtTokenSecret', 'PEDSnapSECRE7');
//Show all errors in development
//app.use(errorHandler({ dumpExceptions: true, showStack: true }));


//Start server
var port = isLocal ? 4711 : (process.env.PORT || 9999);
app.listen(port, function () {
    'use strict';
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
    console.log('application_root is %s',path.join(application_root ,'../client'));
});


//Connect to database
var db = mongoose.connect(isLocal ? 'mongodb://localhost/snap' : 'mongodb://nv:nv@ds033897.mongolab.com:33897/snap');

//Schemas
var Schema = mongoose.Schema;

var Friend = new Schema({
    idAmi1: Schema.ObjectId,
    idAmi2: Schema.ObjectId,
    accepted : {type: Boolean, default:false}
});

var User = new Schema({
    pseudo: {type: String, unique: true},
    description: {type: String, default:""},
    image : {type: String, default:"pictures/default.png"},
    email: String,
    pwd: String,
    temps: {
        texte: {type: Number, default:10},
        image: {type: Number, default:10},
        video: {type: Number, default:10}
    },
    imgUrl: String
});

var Destinataire = new Schema({
    idDestinataire : Schema.ObjectId,
    lu : {type: Boolean, default:false}
});

var Message = new Schema({
    type:  String,
    donnes: String,
    temps: Number,
    idEnvoyeur : Schema.ObjectId,
    destinataires : [Destinataire],
    dateEnvoi : { type: Date, default: Date.now }
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

var deleteIfVideo = function(message) {
    if(message.type=="video") {
        var filename = message._id+"."+message.donnes;
        fs.exists(uploadDir+"/"+filename, function(exists) {
            if (exists) {
                console.log(uploadDir+"/"+filename+" exists !")
                fs.unlink(uploadDir+"/"+filename, function (err) {
                    if (err) throw err;
                });
            }
        });
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
app.post('/api/message', multipartMiddleware, function(req, res, next) {
    if(req.body) {
        //var match = /data:([^;]+);base64,(.*)/.exec(req.body.donnes);
        if(req.body.type == 'image') {

            base64Data = req.body.donnes.replace(/^data:image\/png;base64,/,"");
            binaryData = new Buffer(base64Data, 'base64').toString('base64');
            //console.log("binaryData")
            //res.setHeader('Content-Type', 'image/png');
            //res.setHeader('Content-Length', binaryData.length);
            req.body.donnes = binaryData;

        }

        if(req.body.type == 'video') {
            //Cause of ng-file-upload
            req.body.destinataires = JSON.parse(req.body.destinataires)
        }
        var newMessage = new MessageModel(req.body);
        newMessage.save(function(e, results){
            if (e) return next(e);
            if(req.body.type == 'video') {
                var writeStream = fs.createWriteStream(uploadDir+"/"+results._id+"."+req.files.file.type.split("/")[1])
                writeStream.once('open', function(fd) {
                    fs.createReadStream(req.files.file.path).pipe(writeStream);
                })
            }
            res.sendStatus(200);
        })
    }
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

app.put('/api/user/times', function(req, res, next) {
    var id = authenticateSender(req.headers)
    if(!id)
        res.sendStatus(403)
    UserModel.findById(id, function(e, result) {
        if (e) 
            return next(e)
        if (!result)
            res.sendStatus(404)
        result.temps = req.body.times
        result.save(function (err, req) {
            if (err) 
                return next(err)
            res.sendStatus(200)
        })
    })
})

app.put('/api/user/description', function(req,res, next) {
    var id = authenticateSender(req.headers)
    if(!id)
        res.sendStatus(403)
    UserModel.findById(id, function(e, result) {
        if (e)
            return next(e)
        if (!result)
            res.sendStatus(404)

        result.description = req.body.description
        result.save(function (err, req) {
            if (err) 
                return next(err)
            res.sendStatus(200)
        })
    })
})

app.put('/api/user/password',  function(req, res, next) {
    var id = authenticateSender(req.headers)
    if(!id)
        res.sendStatus(403)
    UserModel.findById(id, function(e, result) {
        if (e)
            return next(e)
        if (!result)
            res.sendStatus(404)
        var hash = crypto.createHash('sha256')
        hash.update(req.body.oldPassword)
        var oldPassword = hash.digest('hex')
        if (oldPassword == result.pwd) {
            hash = crypto.createHash('sha256')
            hash.update(req.body.newPassword)
            var newPassword = hash.digest('hex')
            result.pwd = newPassword
            result.save(function (err, req) {
                if (err) 
                    return next(err)
                res.sendStatus(200)
            })
        }
        else {
            res.sendStatus(401)
        }
    })
})

app.put('/api/user/picture', function(req,res, next) {
    var id = authenticateSender(req.headers)
    if(!id) {
        res.sendStatus(403)
    }
    UserModel.findById(id, function(e, result) {
        if (e)
            return next(e)
        if (!result)
            res.sendStatus(404)

        result.imgUrl = req.body.imgUrl
        result.save(function (err, req) {
            if (err) 
                return next(err)
            res.sendStatus(200)
        })
    })
})

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

//get des messages qui nous sont addressés
app.get('/api/message/:idFriend', function(req, res, next) {
	
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);

    MessageModel.find({ $or: [{idEnvoyeur : id},{idEnvoyeur : req.params.idFriend}]}, function(e, result){
        if (e) return next(e);

        var privateMessages = [];

        result.forEach(function(entry) {
            if(entry.destinataires[0].idDestinataire == id || entry.destinataires[0].idDestinataire == req.params.idFriend) {
                privateMessages.push(entry)
            }
        });

        res.send({list:privateMessages})
    })
})

//get des messages non lus
app.get('/api/unreadMessages', function(req, res, next) {
	
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);

    MessageModel.find(function(e, result){
        if (e) return next(e);

        var unreadMessages = [];
        result.forEach(function(entry) {
            if(entry.destinataires[0].idDestinataire == id && entry.destinataires[0].lu == false) {
                unreadMessages.push(entry)
            }
        });

        res.send({list:unreadMessages})
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
app.get('/api/friends', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    var tmpFriends = [];
    FriendModel.find(function(e, res) {
        console.log(res);
        console.log(id)
    })

    FriendModel.find({ $or: [ {idAmi1 : id, accepted : true }, {idAmi2 : id, accepted : true } ] }, function(e, result){
        if (e) return next(e);
        if (result) tmpFriends = tmpFriends.concat(result);
        if (tmpFriends.length === 0) {
            return res.send({list:[]})
        } else {
            var friends = []
            //For each requester, we get the wanted fields and store it in a list we'll send
            var asyncLoop = function(i, callback) {
                if( i < result.length ) {
                    var friendshipId = tmpFriends[i]._id
                    var requestSenderId = tmpFriends[i].idAmi1;
                    if(requestSenderId.equals(id)) requestSenderId = tmpFriends[i].idAmi2;

                    UserModel.findById(requestSenderId, 'pseudo description imgUrl', function(e, user){
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

// Demande existante
app.get('/api/alreadyInserted/:idami', function(req, res, next) {
	console.log("alreadyinserted = "+req.params.idami)
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    var tmpFriends = [];
    FriendModel.find(function(e, res) {
        console.log(res);
        console.log(id)
    })

    FriendModel.find({ $or: [ {idAmi1 : id, idAmi2 : req.params.idami }, {idAmi1 : req.params.idami, idAmi2 : id } ] }, function(e, result){
        if (e) return next(e);
        if (result) tmpFriends = tmpFriends.concat(result);
        if (tmpFriends.length === 0) {
            return res.send({exist:false})
        } else {
            return res.send({exist:true})
        }
    });
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
    })
    FriendModel.find({$or: [{idAmi1 : id}, {idAmi2 : id}]}, function(e, result) {
        if (e) return res.sendStatus(404);
        if(result) {
            result.forEach(function(friend) {
                friend.remove()
            })
            console.log("friendlist removed")
        }
    })
    // should work for destinataires
    MessageModel.find({$or: [ {idEnvoyeur : id}, {'destinataires.idDestinaire' : id} ]}, function(e, result) {
        if (e) return res.sendStatus(404);
        if(result) {
            result.forEach(function(message) {
                message.remove()
            })
            console.log("messages removed")
        }
    })
    res.sendStatus(200)
})

// TODO : Suppression ou refus d'un ami
app.delete('/api/friend/:id', function(req, res, next) {
    var reqId = req.params.id;
    console.log("Delete friend - ID line = "+req.params.id);
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    //If the user asking to delete is the one who received the request, Okay
    FriendModel.findById(reqId, function(e, result) {
        if (e) return next(e);
        if (!result) res.sendStatus(404);
        result.remove(function (err, req) {
            if (err) return next(err);
            res.sendStatus(200)
        })
    })
});


//suppression du message
app.delete('/api/message/:id', function(req, res, next) {
    var id = authenticateSender(req.headers);
    if (!id) return res.sendStatus(403);
    var reqId = req.params.id;
    //Find the message to know how much it'll last
    MessageModel.findById(reqId, function(e, result) {
        if (e) return res.sendStatus(404);
        if (!result) {
            res.sendStatus(404);
        }else{
            //wait and then remove the message
            setTimeout(function(){
                MessageModel.findById(reqId, function(e, result) {
                    if (e) return next(e);
                    if (!result) {
                    //console.log("Message déjà supprimé")
                }else{
                    result.remove(function (err, req) {
                        if (err) return next(err);
                        deleteIfVideo(result)
                        res.sendStatus(200)
                    })
                }
            })
            }, result.temps*1000);
        }
    })
    //console.log("Delete message - ID line = "+req.params.id);

});
