<!-- 
> This material was originally posted [here](http://www.quora.com/What-is-Amazons-approach-to-product-development-and-product-management). It is reproduced here for posterities sake.

There is an approach called "working backwards" that is widely used at Amazon. They work backwards from the customer, rather than starting with an idea for a product and trying to bolt customers onto it. While working backwards can be applied to any specific product decision, using this approach is especially important when developing new products or features.

For new initiatives a product manager typically starts by writing an internal press release announcing the finished product. The target audience for the press release is the new/updated product's customers, which can be retail customers or internal users of a tool or technology. Internal press releases are centered around the customer problem, how current solutions (internal or external) fail, and how the new product will blow away existing solutions.

If the benefits listed don't sound very interesting or exciting to customers, then perhaps they're not (and shouldn't be built). Instead, the product manager should keep iterating on the press release until they've come up with benefits that actually sound like benefits. Iterating on a press release is a lot less expensive than iterating on the product itself (and quicker!).

If the press release is more than a page and a half, it is probably too long. Keep it simple. 3-4 sentences for most paragraphs. Cut out the fat. Don't make it into a spec. You can accompany the press release with a FAQ that answers all of the other business or execution questions so the press release can stay focused on what the customer gets. My rule of thumb is that if the press release is hard to write, then the product is probably going to suck. Keep working at it until the outline for each paragraph flows. 

Oh, and I also like to write press-releases in what I call "Oprah-speak" for mainstream consumer products. Imagine you're sitting on Oprah's couch and have just explained the product to her, and then you listen as she explains it to her audience. That's "Oprah-speak", not "Geek-speak".

Once the project moves into development, the press release can be used as a touchstone; a guiding light. The product team can ask themselves, "Are we building what is in the press release?" If they find they're spending time building things that aren't in the press release (overbuilding), they need to ask themselves why. This keeps product development focused on achieving the customer benefits and not building extraneous stuff that takes longer to build, takes resources to maintain, and doesn't provide real customer benefit (at least not enough to warrant inclusion in the press release).
 -->
 
# PickUp! #

## Usage
To Use our app the User will need to first run npm install and bower install to get all of the dependencies.

A .env folder needs to be created in the root directory to hold all environmental variables. The environmental variables needed for this project are:
MONGO_URI=your mongo db 
PORT=the alternate port you want to use
GOOGLE_GEOCODE_API=google api key
TWILIO_NUM=twilio number
TWILIO_ACCOUNT_SID=twilio account number
TWILIO_SID=twilio sid number 
TWILIO_AUTH_TOKEN=twilio auth token
GOOGLE_MAPS_API=google maps api
GOOGLE_MAPS_JAVASCRIPT_API=google maps javascript api
WEATHER_ID=open weather map api key 

To run in development environment, first run your mongo db in a terminal then run grunt dev in another.

## Requirements
-MongoDB
-Express
-Mongoose
-Node
-Grunt

Steps
make the .env file with above reqs
npm i
npm i -g grunt
grunt prod


## Deployment 
This project was deployed using a Ubuntu MEAN 14.04 Digital Ocean droplet. To re-deploy you need to clone the repo into the ~/ directory of your Digital Ocean droplet. Cd into your cloned repo and add a .env file with your environmental variables. Make sure you perform 'npm install' and 'bower install --allow-root'. After that run grunt prod and you should be good to go!

## PickUp takes the setup out of pick-up games. ##

## Summary ##
Pickup organizes pick-up games automatically for you. You just tell us what you want to play and when and we'll set up a friendly game at a park near you.
Pick up pools players in your area who would like to play at a certain time and once enough people request a game, we'll send you text giving you the heads up.
Confirm you're still on to play and with enough confirmations come in from the others, it's Game On!


## Problem ##
  You love playing pick-up soccer, but you hate organzing games. All your friends have different schedules. You can never get enough people for a good game.

## Solution ##
  PickUp does all the organizing for you. People request to play a game at a certain time and pick pools all the people who want to play, say basketball at 3pm today. For a good game you'll need at least 6 players, three to a side. When the sixth person request a basketball game for 3pm, PickUp notifies all interested parties and ask them to confirm via text there willingness to play. The text responses go to PickUp and not each participant, so numbers are not shared. Once all the confirmations come in, PickUp sends another text informing participants of the exact location of the game. 

## Quote from You ##
  "PickUp is the the perfect integration between traditional neighborhood fun and social interaction." - Neal Taylor

## How to Get Started ##
PickUp is crazy easy to use:
1. Sign up with your phone number (so we can notify you when a game is about to begin).
2. Select a sport and a time and send in the pick-up game request
3. Go about your day and receive a text when there are enough requests in for the selected sport and time.
4. Confirm you're still down to play via text response
5. When enough other confirmations are in, you'll receive a final text with the exact location of the game.
6. Game Time! Have Fun!

## Customer Quote ##
  I love playing pick-up soccer, but I can never find enough other people to play. Now I just tell PickUp when I want play and now I can play whenever I want!!
  There always a good squad of players ready to go. No more 2-on-2.

## Closing and Call to Action ##
Ready to get your game on?! 
Download PickUp now!
