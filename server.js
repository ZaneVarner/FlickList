const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "movies1";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var database, collection;

app.listen(8080, function () {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (error, client) {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

// app.get("/movies/title/:title", function (request, response) {
//     console.log(request.params.title);
//     collection.createIndex({
//       Title: "text",
//       Genre: "text",
//       Cast: "text"
//     });
//     collection.find(
//    { $text: { $search: request.params.title } },
//    { projection: { score: { $meta: 'textScore' } } }
// ).sort( { score: { $meta: "textScore" } } )
//                     .limit( 50 ).toArray(function (error, result) {
//         if(error) {
//             return response.status(500).send(error);
//         }
//         response.send(result);
//     });
// });

// app.get("/movies/all_titles/:title", function (request, response) {
//     console.log(request.params.title);
//     collection.createIndex({ Title: "text" });
//     collection.find(
//       { $text: { $search: request.params.title } },
//       { projection: { score: { $meta: 'textScore' } } })
//       // .sort( { score: { $meta: "textScore" } } )
//       .sort( { imdbVotes: -1 } )
//       .toArray(function (error, result) {
//         if(error) {
//             return response.status(500).send(error);
//         }
//         response.send(result);
//     });
// });

app.get("/movies/title/:title/:sort/:order", function (request, response) {
    console.log(request.params.title);
    var input = request.params.title.replace(/[^A-Za-z0-9]/g, ' ').replace(/\s+/g,',').trim();
    var tokens = input.split(',');
    var garbageStrings = ['of', 'the', 'in', 'on', 'at', 'to', 'a', 'an', 'is'];
    var filteredTokens = tokens.filter(function (token) {
      return !garbageStrings.includes(token);
    });

    var queryExpressions = [];
    filteredTokens.forEach(function (token) {
      queryExpressions.push({ 'Title' : new RegExp(token, 'i') })
    })
    console.log(tokens);
    console.log(filteredTokens);
    console.log(queryExpressions);
    // var query = { 'Title': new RegExp(request.params.title, 'i') };
    var query = { $and: queryExpressions };
    var mysort = {};
    mysort[request.params.sort] = parseInt(request.params.order);
    // var mysort = { imdbVotes: -1 };
    collection.find(query).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies/cast/:cast/:sort/:order", function (request, response) {
    console.log(request.params.cast);
    var query = { 'Cast': new RegExp(request.params.cast, 'i') };
    mysort = {};
    mysort[request.params.sort] = parseInt(request.params.order);
    collection.find(query).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies/genre/:genre/:sort/:order", function (request, response) {
    console.log(request.params.genre);
    var query = { 'Genre': new RegExp(request.params.genre, 'i') };
    mysort = {};
    mysort[request.params.sort] = parseInt(request.params.order);
    collection.find(query).limit(100).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
