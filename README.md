# star-wars-game-show-castings

## Introduction

* Suppose we’re working along with George Lucas’ team to select who will take part in each of the shows of a new TV show called “Star Wars Game Show”.
The team needs an app that allows casting managers to register prospective contestants including their first name, last name, date of birth, mobile phone, country of residence, email and the Star Wars character they will portray in the show. Managers should also be able to list all the contestants
created, modify the contestants information and delete any of the contestants items as they please.
* Bear in mind that all the contestants should be at least 18 years old and reside in Spain.
* The Star Wars characters to be assigned to the contestants upon creation can be loaded using SWAPI (The Star Wars API - https://swapi.co). Only the character name is required for this particular assignment.
* What they need is either a cross-platform mobile app (initially for iOS) or a website that they can use as a tool to manage all the prospective contestants.

## Basic features implemented

* Casting Managers can register prospective contestants.
* First name, last name, date of birth, mobile phone, country of residence and the Star Wars character are included.
* Casting Managers can modify contestants information.
* Casting Managers can delete contestants information.
* Contestants should be at least 18 years old.
* Contestants should reside in Spain.
* The Star Wars characters can be loaded from SWAPI (Star Wars API).

## Bonus features implemented

* Website deployed in Google Firebase (not in Heroku).
* Responsive design - Usable on mobile phone explorers (Safari, Chrome).
* Sort contestants alphabetically by their last name.
* Upload a photo as a part of the contestant creation.
* Sign up/sign in process for casting managers.

## Extra features implemented

* Cache in LocalStorage for the characters taken from SWAPI.
* Casting managers can modify their profile.
* Animation of the imperial soldier helmet instead of classical spinner.
* Google Captchas to improve security in forms.
* Contestants phone field is fully functional in mobile phones.
* Contestants email field is fully functional.

## Reading and Caching SWAPI (Star Wars API)
```
characters:[],

_LoadCharacters(page){
  var that = this;
  Ember.$.getJSON(page).then((data) => {
          data.results.forEach( c => {
            that.get('characters').push(c.name);
          })
          if (data.next){
              that._LoadCharacters(data.next);
          }
          else{
            window.localStorage.setItem('characters',that.get('characters'));
          }
      });
},

LoadCharacters(){
   var c = window.localStorage.getItem('characters');
   if (!c){
       this.set('characters',[]); 
       this._LoadCharacters("https://swapi.co/api/people"); 
   }
},

getCharacters(){
   var c = window.localStorage.getItem('characters');
   return c.split(',');
},
```

## Technology used

* Ember CLI 3.12.0
* Node 10.8.0
* Ubuntu Linux 18.04.02 64 bits
* SweetAlert.JS library
* Material Design for Bootstrap 4.5.3
* Firebase 7.3.2

## Limitations

* Website was not deployed in Heroku due to Google Firebase selection as a database and web hosting.
* You cannot add a photo at the same time you are adding a contestant.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)
* [Google Firebase](https://firebase.google.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd star-wars-game-show-castings`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running / Production

* Visit your app at [https://star-wars-game-show-castings.web.app](https://star-wars-game-show-castings.web.app).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

* `firebase deploy --project star-wars-game-show-castings` (production)

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
