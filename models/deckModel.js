require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/DeckDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(connect => console.log("Connected to mongodb.."))
.catch(err => console.log("Could not connect to mongodb\n",err)); // Connect to Mongo Database

const deckSchema = {
  title: String,
  cards: Array,
  drawnCards: [Number]
};
const Deck = mongoose.model("Deck", deckSchema);

exports.Deck = Deck;
exports.deckSchema = deckSchema;
