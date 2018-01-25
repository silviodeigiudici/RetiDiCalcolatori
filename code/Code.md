# Modules
This folder contains all the modules used by the application:

* ##### _sever.js_

  This module sets up the application and is located in the root folder.

* ##### _Secrets.js_

  This moudle in't in the repo and contains all the required credentials to use the extran services such as Oauth or Flickr.

* ##### _passport.js_

  This module defines the strategies used by passportjs to signup and login a user

* ###### _routes.js_

  This module contains the defined REST APIs and specifies what the app must do for each one.

* ###### _user.js_

  This module is an interface between CouchDB and our application, is used to create and get the users

* ##### _websocket.js_

  This module sets up the webosocket used by the hat on the home page, on which every client connects.

* ##### _websocket functions.js_

  This modules contains the functions to specify what happens on the websocket.
  For example when a message is received, how the websocket is opened and how a message can be routed to other clients.

* ##### _weather.js_

  This module loads the home page, Rome's weather data and the global chat.

* ##### _classroom.js_
  This module loads the classroom page display the information, pictures and comments about the chosen classroom.

* ##### _buildings.js_
  This module load the building page, displays the general building informations.
  There is also a map of the nearest POIs which lets you calculate direction from a given address.

* ##### *amqp\_client.js*
  This is the module which loads an AMPQ client powered by RabbitMQ to save the comments on CouchDB, sorted by the building and the classroom they refer to.
