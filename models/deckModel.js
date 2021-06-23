const mongoose = require('mongoose');
const password = "SaturvinNatilly";
const db = "DeckDB";
const mongoURI = "mongodb+srv://Will:"+password+"@deckcluster.bcf3e.mongodb.net/"+db+"?retryWrites=true&w=majority";
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
