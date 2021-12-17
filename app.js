require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const controller = require('./controllers/deckController');
const connection = require('./conn/connection');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));


//----------------------- ROUTE TO ALL DECKS -----------------------------
app.route("/decks")
.get((req,res) => {controller.getDecks(req,res);})
.post((req,res) => {controller.postDecks(req,res);})
.delete((req,res) => {controller.deleteDecks(req,res);});

//------------------- ROUTE TO A SPECIFIC DECK ----------------------------
app.route("/decks/:deckTitle")
.get((req,res) => {controller.getSingleDeck(req,res, req.params.deckTitle);})
.post((req,res) => {controller.postCard(req,res, req.params.deckTitle);})
.delete((req,res) => {controller.deleteCards(req,res, req.params.deckTitle);});


//--------------- ROUTE TO A SPECIFIC CARD IN A SPECIFIC DECK -------------
app.route("/decks/:deckTitle/:cardTitle")
.get((req,res) => {controller.getCard(req,res,req.params.deckTitle,req.params.cardTitle);})
.put((req,res) => {controller.putCard(req,res,req.params.deckTitle,req.params.cardTitle);})
.patch((req,res) => {controller.patchCard(req,res,req.params.deckTitle,req.params.cardTitle);})
.delete((req,res) => {controller.deleteCard(req,res,req.params.deckTitle,req.params.cardTitle);});


//-----------------GET A RANDOM CARD FROM A SPECIFIC DECK------------------
app.route("/draw/:deckTitle")
.get((req,res) => {controller.drawCard(req,res, req.params.deckTitle);})
.delete((req,res) => {controller.reshuffleDeck(req,res, req.params.deckTitle);});

//------------------------------DEFAULT ROUTE------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname+"/README.md");
})

//-----------------------------SERVER SPIN UP------------------------------
let port = process.env.PORT;
let ip = connection.ip
if (port == null || port == "") {
  port = 7000;
}
app.listen(port, (err) => { //Currently quotaguardstatic is installed in this instance of node, but is not integrated to give this application a static ip for secure access to mongodb. Currently my work around it to give global access to my cluster.
  if(!err) {
    console.log("DeckAPI spinning up on port: " + port);
  } else {
    console.log(err);
  }
});
