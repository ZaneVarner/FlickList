const Express = require("express");
// const fs = require("fs");
// const https = require("https");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const PORT = 8080;

const CONNECTION_URL = "mongodb+srv://zanevarner:test1234@cluster0-xblnp.mongodb.net/test?retryWrites=true&w=majority";
const DATABASE_NAME = "movies1";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

var database, movie_collection, review_collection;

// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert'),
//   requestCert: false,
//   rejectUnauthorized: false
// }, app).listen(PORT, function () {
app.listen(PORT, function () {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, function (error, client) {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        movie_collection = database.collection("movies3");
        review_collection = database.collection("reviews");
        rating_collection = database.collection("ratings");
        list_collection = database.collection("lists");
        console.log("Connected to " + DATABASE_NAME + "!");
    });
});


/*
MOVIE SEARCHING METHODS
*/

// Get a movie by IMDb ID
app.get("/movies/imdbID/:imdbID", function (request, response) {
  var query = { 'imdbID': request.params.imdbID };
  movie_collection.findOne(query, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Get all movies in a given year
app.get("/movies/popular/:year", function (request, response) {
  var query = { "Year": parseInt(request.params.year) };
  var mysort = { "imdbVotes": -1 };
  movie_collection.find(query).sort(mysort).limit(40).toArray(function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Get a movie by keyword, sort by text score
app.get("/movies/keyword/title/:keyword", function (request, response) {
    console.log('Searched this keyword: ' + request.params.keyword);
    movie_collection.createIndex({
      Title: "text"
      // Genre: "text",
      // Cast: "text"
    });
    movie_collection.find(
      { $text: { $search: request.params.keyword } },
      { projection: { score: { $meta: 'textScore' } } })
    .sort( { score: { $meta: "textScore" } } ).limit(100)
    .toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Get recommended movies that match a string of keywords
app.get("/movies/keyword/string/:keyword", function (request, response) {
    movie_collection.createIndex({
      Genre: "text",
      Cast: "text",
      Directors: "text"
    });
    movie_collection.find(
      { $text: { $search: request.params.keyword } },
      { projection: { score: { $meta: 'textScore' } } })
    .sort( { score: { $meta: "textScore" } } ).limit(16)
    .toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Get a movie by title, sorting order
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
    movie_collection.find(query).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        if (result.length == 0){ //no results found
          result.push(movie_collection.find( { $text: { $search: input } } ));
        }
        if (result.length == 0){ //no results found
          var titleArray = movie_collection.distinct(title); //save all titles to an array
          var levDistArray = titleArray; //copy title array to store distance values
          for (i=0; i<titleArray.length; i++){ //loop iterating through all titles
            levDistArray[i] = levDist(input,titleArray[i]); //store dist value in array
            if (i>0){
              var j = i;
              while (levDistArray[j]<levDistArray[j-1]){ //while the lev value is less than the value before it
                var levHolder = levDistArray[j-1]; //sort the array
                levDistArray[j-1] = levDistArray[j];
                levDistArray[j] = levHolder;
                var titleHolder = titleArray[j-1];
                titleArray[j-1] = titleArray[j];
                levDistArray[j] = titleHolder;
                j--;
              }
            }
          }
          for (i=0; i<titleArray.length; i++){ //add movie with matching title to result
            result.push(movie_collection.find({title: titleArray[i] }));
          }
        }
        response.send(result);
    });
});

// Get a movie by cast member, sorting order
app.get("/movies/cast/:cast/:sort/:order", function (request, response) {
    console.log(request.params.cast);
    var query = { 'Cast': new RegExp(request.params.cast, 'i') };
    mysort = {};
    mysort[request.params.sort] = parseInt(request.params.order);
    movie_collection.find(query).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Get a movie by genre, sorting order
app.get("/movies/genre/:genre/:sort/:order", function (request, response) {
    console.log(request.params.genre);
    var query = { 'Genre': new RegExp(request.params.genre, 'i') };
    mysort = {};
    mysort[request.params.sort] = parseInt(request.params.order);
    movie_collection.find(query).limit(100).sort(mysort).toArray(function (error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


/*
REVIEW AND RATING METHODS
*/

// Gets the set of all reviews for a movie
app.get("/reviews/:imdbID", function (request, response) {
  console.log("getting reviews");
  review_collection.find({ 'imdbID': request.params.imdbID }).limit(50).toArray(function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Gets the rating for a particular movie made by a particular user
app.get("/reviews/:imdbID/:user", function (request, response) {
    var query = { 'imdbID': request.params.imdbID, 'user': request.params.user }
    review_collection.findOne(query, function (error, result) {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Posts a document to the reviews collection
app.post("/reviews/post", function (request, response) {
    console.log(request.body);
    review_collection.insertOne(request.body, function (error, result) {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Deletes a document by id
// Document corresponds to 1 review by 1 user on 1 movie
app.delete("/reviews/delete/:id", function (request, response) {
    console.log("About to delete...");
    var query = { "_id": new ObjectId(request.params.id) };
    console.log(query);
    review_collection.deleteOne(query, function (error, result) {
        if (error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

// Get the ratings score for a movie
app.get("/ratings/:imdbID", function (request, response) {
  var query = { 'imdbID': request.params.imdbID };
  rating_collection.findOne(query, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Deletes a rating document by id
app.delete("/ratings/delete/:id", function (request, response) {
  var query = { "_id": new ObjectId(request.params.id) };
  rating_collection.deleteOne(query, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Posts a document to the ratings collection
app.post("/ratings/post", function (request, response) {
  rating_collection.insertOne(request.body, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  })
});


/*
LIST METHODS
*/

// Gets all lists of a particular user
app.get("/lists/:user", function (request, response) {
  var query = { 'user': request.params.user };
  list_collection.find(query).toArray(function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Gets a specified list of a specified user
app.get("/lists/:user/:listName", function (request, response) {
  var query = { 'user': request.params.user, 'listName': request.params.listName };
  list_collection.findOne(query, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Deletes a list document by id
app.delete("/lists/delete/:id", function (request, response) {
  var query = { "_id": new ObjectId(request.params.id) };
  list_collection.deleteOne(query, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

// Posts a document to the list collection
app.post("/lists/post", function (request, response) {
  list_collection.insertOne(request.body, function (error, result) {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(result);
  });
});

function levDist(a, b){
  if(a.length == 0) return b.length;
    if(b.length == 0) return a.length;
      var matrix = [];
        // increment along the first column of each row
        var i;
        for(i = 0; i <= b.length; i++){
          matrix[i] = [i];
        }
        // increment each column in the first row
        var j;
        for(j = 0; j <= a.length; j++){
          matrix[0][j] = j;
        }
        // Fill in the rest of the matrix
        for(i = 1; i <= b.length; i++){
          for(j = 1; j <= a.length; j++){
            if(b.charAt(i-1) == a.charAt(j-1)){
              matrix[i][j] = matrix[i-1][j-1];
            } else {
              matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                            Math.min(matrix[i][j-1] + 1, // insertion
                                                    matrix[i-1][j] + 1)); // deletion
            }
          }
        }
        return matrix[b.length][a.length];
      };
