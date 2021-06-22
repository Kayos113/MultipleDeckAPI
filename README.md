
# Multiple Deck api

This api is built to be used with a game where you need multiple deck of unique and custom cards, and also need to be able to draw a random card from any of the decks.

This api uses a local mongoose database at the moment, running on port 27017, but can be customized to use your own remote mongoose database.

## RESTful routes:    
### "/decks"    
*GET*: retrieves the entire deck object, including _id and title.    
*POST*: creates a new deck. The deck title is set by the body passing a value for title through the request. (req.body.title)    
*DELETE*: clears out all deck objects. CANNOT BE UNDONE, YOU WILL LOSE ALL DECKS AND CARDS    

### "/decks/:customDeckName"    
*GET*: retrieves the array of card objects contained with the deck titled the custom deck name in the route    
*POST*: Adds a new card object to the custom deck that is called in the route request. Populates the card object with cardTitle and cardContent from the request body (req.body.cardTitle, req.body.cardContent)    
*DELETE*: Clears all of the cards from the custom deck specified in the route request. YOU WILL LOSE ALL CARDS IN THIS DECK, CANNOT BE UNDONE    

### "decks/:customDeckName/:customCardName"    
*GET*: retrieves the card that is specified in the route request, that is in the custom deck specified in the route request    
*PUT*: updates the entire reference of a specific card object in a specific deck. Will overwrite the title and content with values passed on through the request's body under the values of cardTitle and cardContent. Will even overwrite with blank/empty strings if no value is specified. (req.body.cardTitle, req.body.cardContent)    
*PATCH*: updates the entire reference of a card object. Will overwrite the title and content with values passed on through the request's body under the values of cardTitle and cardContent. Will not overwrite with blank/empty strings if no value is specified. (req.body.cardTitle, req.body.cardContent)    
*DELETE*: Will delete a specific card reference in a deck. **YOU WILL LOSE THIS CARD, CANNOT BE UNDONE*    

### "draw/:customDeckName"    
*GET*: retrieves a random card from the specified decks    

#TO BE IMPLEMENTED:    
### "draw/:customDeckName"    
*GET*: track the indexes drawn, to ensure that repeats are not drawn until the entire deck has been gone through.    
*DELETE*: reset the index tracks, essentially restarting your game, and shuffling all used cards back into the decks.    
