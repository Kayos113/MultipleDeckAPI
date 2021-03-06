const model = require('../models/deckModel');
let Deck = model.Deck;


//Route "/decks"
exports.getDecks = function(req, res) { // Get all decks
  Deck.find({}, (err, foundDecks) => {
    if(!err) {
      res.send(foundDecks);
    } else {
      res.send(err);
    }
  });
}

exports.postDecks = function(req, res) { // Create a new deck
  const arr = [];
  console.log(req.body);
  const newDeck = new Deck ({
    title: req.body.deckTitle,
    cards: arr
  });
  newDeck.save((err) => {
    if(!err) {
      console.log("DECK CREATED");
      res.send("Deck created successfully");
    } else {
      console.log("DECK NOT CREATED");
      res.send(err);
    }
  });
}

exports.deleteDecks = function(req, res) { // Delete all decks
  Deck.deleteMany({}, (err) => {
    if(!err) {
      res.send('Successfully deleted all decks');
    } else {
      res.send(err);
    }
  })
}

//Route "/decks/:customDeckName"
exports.getSingleDeck = function(req, res, deckTitle) { // Get all cards from a specific deck
  Deck.find({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      res.send(foundDeck);
    } else {
      res.send(err);
    }
  });
}

exports.postCard = function(req, res, deckTitle) { // Create a new card in a specific deck
  const newCard = {cardTitle:req.body.cardTitle, cardContent:req.body.cardContent}
  Deck.updateOne( {title: deckTitle},
  {$push:{cards:newCard}},
  {new:true},
  (err, updatedDeck) => {
    if(!err) {
      res.send("Successfully added card");
    } else {
      res.send(err);
    }
  });
}

exports.deleteCards = function(req, res, deckTitle) { // Delete all cards in a specific deck
  Deck.updateOne({title:deckTitle},
    {cards:[]},
    {new:true},
    (err, foundDeck) => {
    if(!err) {
      res.send("Successfully deleted all cards from " + req.body.deckTitle);
    } else {
      res.send(err);
    }
  });
}

//Route "/decks/:customDeckName/:customCardName"
exports.getCard = function(req, res, deckTitle, cardTitle) { // Get a specific card from a specific deck
  Deck.findOne({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      let cardArr = foundDeck.cards;
      res.send(cardArr.find(card => card.cardTitle===cardTitle));
    } else {
      res.send(err);
    }
  })
}

exports.putCard = function(req, res, deckTitle, cardTitle) { // Updates a specific card in a specific deck WITH OVERWRITE
  const newTitle = req.body.cardTitle;
  const newContent = req.body.cardContent;
  Deck.findOne({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      const cardArr = foundDeck.cards;
      const cardtemp = cardArr.find(card => card.cardTitle===cardTitle);
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
          res.send("Successfully updated the card in " + deckTitle);
        } else {
          res.send(err2);
        }
      })
    } else {
      res.send(err);
    }
  })
}

exports.patchCard = function(req, res, deckTitle, cardTitle) { // Updates a specific card in a specific deck WITHOUT OVERWRITE
  let newTitle = req.body.cardTitle;
  let newContent = req.body.cardContent;
  Deck.findOne({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      const cardArr = foundDeck.cards;
      const cardtemp = cardArr.find(card => card.cardTitle===cardTitle);
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
          res.send("Successfully updated the card in " + deckTitle);
        } else {
          res.send(err2);
        }
      })
    } else {
      res.send(err);
    }
  })
}

exports.deleteCard = function(req, res, deckTitle, cardTitle) { // Delete a specific card in a specific deck
  Deck.findOne({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      let cardArr = foundDeck.cards;
      let indexOf = cardArr.find(card => card.cardTitle===cardTitle);
      cardArr = cardArr.splice(indexOf,1);
      Deck.updateOne({title:foundDeck.title},
      {cards: cardArr},
      {new: true},
      (err2, updatedDeck) => {
          if(!err2) {
            res.send("Successfully deleted card from " + deckTitle);
          } else {
            res.send(err2);
          }
      });
    } else {
      res.send(err);
    }
  });
}

//Route "/draw/:customDeckName"
exports.drawCard = (req, res, deckTitle) => {
  Deck.findOne({title:deckTitle}, (err, foundDeck) => {
    if(!err) {
      let deck = foundDeck.cards;
      let randIndex = Math.floor(Math.random()*deck.length);
      let drawnArr = foundDeck.drawnCards;
      if(drawnArr.length===deck.length)
      {
        res.send("All cards drawn. Reshuffle Deck.")
      } else {
        let count = 1;
        while(drawnArr.find(index => index===randIndex)!=undefined) {
          console.log("Re-rolling number, attempt #"+count+++":");
          randIndex = Math.floor(Math.random()*deck.length);
          console.log(randIndex);
        }
        drawnArr.push(randIndex);
        Deck.updateOne({title:foundDeck.title},
        {drawnCards: drawnArr},
        {new: true},
        (err2, updatedDeck) => {
            if(err2) {
              res.send(err2);
            }
        });
        res.send(deck[randIndex]);
      }
    } else {
      res.send(err);
    }
  });
}

exports.reshuffleDeck = (req, res, deckTitle) => {
  Deck.updateOne({title:deckTitle},
    {drawnCards: []},
    {new: true},
    (err, foundDeck) => {
    if(!err) {
      res.send("Deck reshuffled");
    } else {
      res.send(err);
    }
  })
}
