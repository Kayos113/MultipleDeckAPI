const express = require("express");
const bodyParser = require("body-parser");
const controller = require('./controllers/deckController');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));


//----------------------- ROUTE TO ALL DECKS -----------------------------
app.route("/decks")
.get(controller.getDecks)
.post(controller.postDecks)
.delete(controller.deleteDecks);

//------------------- ROUTE TO A SPECIFIC DECK ----------------------------
app.route("/decks/:deckTitle")
.get(controller.getSingleDeck)
.post(controller.postCard)
.delete(controller.deleteCards);


//--------------- ROUTE TO A SPECIFIC CARD IN A SPECIFIC DECK -------------
app.route("/decks/:deckTitle/:cardTitle")
.get(controller.getCard)
.put(controller.putCard)
.patch(controller.patchCard)
.delete(controller.deleteCard);


//-----------------GET A RANDOM CARD FROM A SPECIFIC DECK------------------
app.route("/draw/:deckTitle")
.get(controller.drawCard)
.delete(controller.reshuffleDeck);

//------------------------------DEFAULT ROUTE------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname+"/README.md");
})

//-----------------------------SERVER SPIN UP------------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 7000;
}
app.listen(port, (err) => {
  if(!err) {
    console.log("DeckAPI spinning up on port: " + port);
  } else {
    console.log(err);
  }
});
