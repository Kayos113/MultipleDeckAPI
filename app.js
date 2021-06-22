const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));

const mongoURI = "mongodb://localhost:27017/DeckDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}); // Connect to Mongo Database

const deckSchema = {
  title: String,
  cards: Array
};
const Deck = mongoose.model("Deck", deckSchema);

//----------------------- ROUTE TO ALL DECKS -----------------------------
app.route("/decks")
.get( (req,res) => { // Get all decks
  Deck.find({}, (err, foundDecks) => {
    if(!err) {
      res.send(foundDecks);
    } else {
      res.send(err);
    }
  });
})
.post( (req,res) => { // Create a new deck
  const deckTitle = req.body.title;
  const arr = [];
  const newDeck = new Deck ({
    title: deckTitle,
    cards: arr
  });
  newDeck.save((err) => {
    if(!err) {
      res.send("Deck created successfully");
    } else {
      res.send(err);
    }
  });
})
.delete( (req,res) => { // Delete all decks
  Deck.deleteMany({}, (err) => {
      if(!err) {
        res.send('Successfully deleted all decks');
      } else {
        res.send(err);
      }
    })
  });

//------------------- ROUTE TO A SPECIFIC DECK ----------------------------
app.route("/decks/:deckTitle")
.get( (req,res) => { // Get all cards from a specific deck
  Deck.find({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      res.send(foundDeck);
    } else {
      res.send(err);
    }
  });
})
.post( (req,res) => { // Create a new card in a specific deck
  const newCard = {cardTitle:req.body.cardTitle, cardContent:req.body.cardContent}
  Deck.updateOne( {title: req.params.deckTitle},
  {$push:{cards:newCard}},
  {new:true},
  (err, updatedDeck) => {
    if(!err) {
      res.send("Successfully added card");
    } else {
      res.send(err);
    }
  });
})
.delete( (req,res) => { // Delete all cards in a specific deck
  Deck.updateOne({title:req.params.deckTitle},
    {cards:[]},
    {new:true},
    (err, foundDeck) => {
    if(!err) {
      res.send("Successfully deleted all cards from " + req.params.deckTitle);
    } else {
      res.send(err);
    }
  });
});


//--------------- ROUTE TO A SPECIFIC CARD IN A SPECIFIC DECK -------------
app.route("/decks/:deckTitle/:cardTitle")
.get( (req,res) => { // Get a specific card from a specific deck
  Deck.findOne({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      let cardArr = foundDeck.cards;
      res.send(cardArr.find(card => card.cardTitle===req.params.cardTitle));
    } else {
      res.send(err);
    }
  })
})
.put( (req,res) => { // Updates a specific card in a specific deck WITH OVERWRITE
  const newTitle = req.body.cardTitle;
  const newContent = req.body.cardContent;
  Deck.findOne({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      const cardArr = foundDeck.cards;
      const cardtemp = cardArr.find(card => card.cardTitle===req.params.cardTitle);
      const index = cardArr.indexOf(cardtemp);
      cardArr[index] = {
        cardTitle: newTitle,
        cardContent: newContent
      };
      Deck.updateOne( {title:foundDeck.title},
      {cards: cardArr},
      {new: true},
      (err2, updatedDeck) => {
        if(!err2) {
          res.send("Successfully updated the card in " + req.params.deckTitle);
        } else {
          res.send(err2);
        }
      })
    } else {
      res.send(err);
    }
  })
})
.patch( (req,res) => { // Updates a specific card in a specific deck WITHOUT OVERWRITE
  let newTitle = req.body.cardTitle;
  let newContent = req.body.cardContent;
  Deck.findOne({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      const cardArr = foundDeck.cards;
      const cardtemp = cardArr.find(card => card.cardTitle===req.params.cardTitle);
      const index = cardArr.indexOf(cardtemp);
      if(newTitle==="") {
        newTitle = cardtemp.cardTitle;
      }
      if(newContent==="") {
        newContent = cardtemp.cardContent;
      }
      cardArr[index] = {
        cardTitle: newTitle,
        cardContent: newContent
      };
      Deck.updateOne( {title:foundDeck.title},
      {cards: cardArr},
      {new: true},
      (err2, updatedDeck) => {
        if(!err2) {
          res.send("Successfully updated the card in " + req.params.deckTitle);
        } else {
          res.send(err2);
        }
      })
    } else {
      res.send(err);
    }
  })
})
.delete( (req,res) => { // Delete a specific card in a specific deck
  Deck.findOne({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      let cardArr = foundDeck.cards;
      let indexOf = cardArr.find(card => card.cardTitle===req.params.cardTitle);
      cardArr = cardArr.splice(indexOf,1);
      Deck.updateOne({title:foundDeck.title},
      {cards: cardArr},
      {new: true},
      (err2, updatedDeck) => {
          if(!err2) {
            res.send("Successfully deleted card from " + req.params.deckTitle);
          } else {
            res.send(err2);
          }
      });
    } else {
      res.send(err);
    }
  });
});


//-----------------GET A RANDOM CARD FROM A SPECIFIC DECK------------------
app.get("/draw/:deckTitle", (req, res) => {
  Deck.findOne({title:req.params.deckTitle}, (err, foundDeck) => {
    if(!err) {
      let deck = foundDeck.cards;
      let randIndex = Math.floor(Math.random()*deck.length);
      res.send(deck[randIndex].cardTitle+"\n"+deck[randIndex].cardContent);
    } else {
      res.send(err);
    }
  });
});


//-----------------------------SERVER SPIN UP------------------------------
app.listen(7000, (err) => {
  if(!err) {
    console.log("DeckAPI spinning up on port 7000");
  } else {
    console.log(err);
  }
});
