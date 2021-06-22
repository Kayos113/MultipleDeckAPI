const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/DeckDB";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}); // Connect to Mongo Database

const deckSchema = {
  title: String,
  cards: Array,
  drawnCards: [Number]
};
const Deck = mongoose.model("Deck", deckSchema);

exports.Deck = Deck;
exports.deckSchema = deckSchema;
