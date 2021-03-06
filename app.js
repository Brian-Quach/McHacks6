const express = require('express');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
var path = require('path');

app.use(express.static('static'));

app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
    next();
});

var admin = require("firebase-admin");

var serviceAccount = {
    "type": "service_account",
    "project_id": "mchacks6-4f2f0",
    "private_key_id": "83e5acaeed921e451f997eea8b7cfbf50b097d7d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCPw/vIwNwN/9G4\nU8ptjOLB2b75pIa/6c5Ky5pc9BizgqjqFGZuuN7PbWzQ/TZqnRMT+iSyTY/HUs7b\nWMBCCNUDglOQXMcmqb1DzCRTvPR5gcHIUzZEZYhuOuwJTxlFHGEt3HK4NwawuVfo\nhPjtOpcsxuxoH0GCrxVT1MPy8tBazPOug2U4hz50kUXXcpKKjPz7TJ1kI3w5tyFd\nMknhlxEJAQROpMXfZz8acj8IYN4U50ayo23ApviIi02lyAMVYgfQ/K6oGfqoe33K\naXRsPqQBHfC56TFPMO1T6Nllac6mpG1pM7+0zGceou5qr/fOkoienXTlrvFuCBpB\nITnXyg2TAgMBAAECggEAPyPU/ittuhxDkFAElK6OnJK0ZFHU+I6IEqNvLSnre1OE\nOiIxhqlc+f7WDsdW0eYgjeKLoV+dKO5+eSl2bsoQO9VOPBXzRVDBFfifb8OKH59U\na1XYfJuXGsp4BfKeZ5L6PzkVjUBliNIuAKn95bqY0IqhI22uyOV6WXIViSsJRQcb\n7vv83pyC1I1iYXBUuZTAj5sqkK30yJpKSTIKB/vln7DVd6EhjtkY+tir3gRzbEfb\n8wlWKRor7uhWI4uL76gdd7ROBYnwAvHQreTC55I3eN93rcWLwhCwvHOmxW4x/1if\n+9ZoWKMlfOhT0mZwnC7jQ9+gjoCZpTyDHA7j++nG4QKBgQDA1hJx2bcCGarnaeoE\njfDq0SGdpSkIyPoEkGmFh5YPgu7lC2qiyWM7ECa6rxQZtdp2rIXYmFVHYzgc+w67\ndktN1MiVFAwL5z8lG+3CDIyZwXkfmly52cFUYm2LeT+8gu+VDq1JS/qw4fUd0gmB\nz3oJl57IpTw+ZV0TAnKzrdPkkQKBgQC+2y5qN6h1Df2HoIj0ExAn7zPGp+lDanxI\nu4/zAEoVbG8OOejcWeGLK1uL+U++IUcaTL3KgCnfYr7YJ0n5Z5Iz5hOxLindPkny\n6tyQi+OthsMLDHNznGyBCNodKgO05bxE0EMq+A4OtyckZjfYLF8O7X8MClyEHB4/\nsN1cOIzR4wKBgGSOfTnPXUaEGgHo0jajyfC5M31gheBl5TKCF/SgupjGH0tjQ601\ntUA0cO3CpImvsgdWeclzzmyWiclbBditnCEvB5XtyUZfxSbVxIr/PkZjhIT9WsMz\nkUQuu48SoDDuWn7xE134d/bLLaXqRDjj93CPFybsO1kSRJHIIgYebDNxAoGBALY/\nbCoHbfgg3OlHFaAkF/haRVG8g1VZ+MYnPMUpkJS2j7HBAKhxt5sCUw/tiQUgl9n4\nT/9vtQxYKa8UjWH4Ubb3S/SUBWv8D/dD6EyrGEVaeyMwx4otY7svrb/Nn+58tfPr\n/0enyRyqLllmtorZjAggJ4Ji3odUplnhVO+8HFRLAoGBAKnPkbGBj5DeGAIxNek9\nET/rlCrhTttqVdhCgxdEms5+yBMBGmdZ9xVuBvOzh4rw323OoF/39i7OXPIwNwdE\nyUPfaalEdLnOrucRPvfOrVtgnAYf9OTdX/aDZEJLbKsy8knfGn8DNqCKJtA6suhU\ngsM/C1ECfOh444wWG/Y41y8D\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qem81@mchacks6-4f2f0.iam.gserviceaccount.com",
    "client_id": "102576507375136224757",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qem81%40mchacks6-4f2f0.iam.gserviceaccount.com"
};


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mchacks6-4f2f0.firebaseio.com"
});

let db = admin.firestore()


let user = null;

app.put('/homeGames', function(req, res) {
	const username = req.body.username;
	console.log("receiving")

	gs = []

	var gamesRef = db.collection('games');
	var query = gamesRef.where('user1', '==', username).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	    	// can create this user
	      console.log('No matching documents.');
	    } else {
	    	// this used has games
			snapshot.forEach(doc => {
				gs.push(doc.data())
		        console.log(doc.id, '=>', doc.data());
		    });
	    }
	  }).then(function() {
	  	var query2 = gamesRef.where('user2', '==', username).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	    	// can create this user
	      console.log('No matching documents.');
	    } else {
	    	// this used has games
			snapshot.forEach(doc => {
				gs.push(doc.data())
		        console.log(doc.id, '=>', doc.data());
		    });

		    res.status(200).send({"result": true, "games": gs})
	    }
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });
	  console.log(gs)
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });

	  
	
})


app.put('/create', function(req, res) {
	console.log("creating")
	const username = req.body.username;
	const password = req.body.password;

	console.log("creating");
	balances[username] = 0;

	var usersRef = db.collection('users');
	var query = usersRef.where('username', '==', username).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	    	// can create this user
	      console.log('No matching documents.');
	      	db.collection("users").add({
			    "username": username,
			    "password": password,
				"balance": 0
			})
			.then(function(docRef) {
				//user = username
			    console.log("Document written with ID: ", docRef.id);
			    res.status(200).send({"result": true})
			})
			.catch(function(error) {
			    console.error("Error adding document: ", error);
			});
	      return;
	    } else {
	    	// cannot create this user
	    	console.log("this user already exists")
	    	res.status(200).send({"result": false})
	    }
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });
})

app.put('/challenge', function(req, res) {
	const me = req.body.me
	const them = req.body.them

	var gamesRef = db.collection('games');

	var addDoc = db.collection('games').add({
	  user1: me,
	  user2: them,
	  turn: 0,
	  user1score: 0,
	  user2score: 0
	}).then(ref => {
	  console.log('Added document with ID: ', ref.id);
	});
});

app.put('/login', function(req, res) {
	console.log("app logging in")

	const username = req.body.username;
	const password = req.body.password;

	var usersRef = db.collection('users');
	var query = usersRef.where('username', '==', username).where('password', '==', password).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	    	// user does not exist
	      res.status(200).send({"result": false})
	    } else {
	    	// found user
	    	//user = username
	    	res.status(200).send({"result": true})
	    }
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });
})

app.put('/newscore', function(req, res) {
    const username = req.body.username;
    const newScore = req.body.score;

    console.log(newScore);

    if(balances[username] != null){
        balances[username] += newScore;
    } else {
        balances[username] = newScore;
    }

    recentScores[username] = newScore;

    console.log(username + " got " + newScore + " points");

    var usersRef = db.collection('users');
	var query = usersRef.where('username', '==', username).get()
	  .then(snapshot => {
	    if (snapshot.empty) {
	    	// user does not exist
	      res.status(200).send({"result": false})
	    } else {
	    	snapshot.forEach(doc => {
	    		console.log(doc.data())

	    		userRef.doc(doc.id).update({score: score+newScore})

		        console.log(doc.id, '=>', doc.data());
		    });

	    	// found user
	    	//user = username
	    	res.status(200).send({"result": true})
	    }
	  })
	  .catch(err => {
	    console.log('Error getting documents', err);
	  });


});

let balances = {};
let recentScores = {};

app.get('/user/:username', function(req, res){

	const username = req.params.username;
	return res.json({username: username, balance: balances[username], recentScore: recentScores[username]});


});






app.get('/home', function(req, res){
    res.sendFile(path.join(__dirname + '/home.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log("Started server on port", PORT);
});
/*
var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 1337;

var server = http.createServer(function(request, response) {
	fs.readFile('static/index.html', function (err, data){
		if (err) {
			console.log("ERROR")
			console.log(err)
		} else {
			response.writeHead(200, {'Content-Type': 'text/html'});
        	response.write(data);
        	response.end();
		}
    });


    response.writeHead(200, {"Content-Type": "text/html"});
    response.end("<p>Hello World!</p><p>hiiiii</p>");

}).listen(port);


console.log("Server running at http://localhost:%d", port);*/
