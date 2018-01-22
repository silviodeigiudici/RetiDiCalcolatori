# Views
This folder contains the pages to be renderized by ejs and to be given to the user along with the eventually needed support files.

* ##### _index.ejs_
Contains links to initiate the signup and login methods.

* ##### _login.ejs_
Contains the form used by the login method.

* ##### _signup.ejs_
Contains the form used by the signup method.

* ##### _profile.ejs_
Contains the info of the user and the link to the homepage.

* ##### _registered.ejs_
This is the page where the user lands after verifying the email while waiting to be redirected on the login page.

* ##### _home.ejs_
This page conatins the the global chat and the list of Buildings from which the user can view classrooms.

* ##### _building.ejs_
Contains info about the building chosen by the user with a maps displaying the nearest points of interest.

* ##### _classroom.ejs_
Contains info and comments about the classroom chosen by the user.

# Support
In this folder there are two subfolders used to store the files needed by the homepage and the building page.

* ### building
 #### _maps.js_
 Script used to access Google Maps API and fill the map in the building page.

* ### home
#### _style.css_
File used to define the layout of the chat in the home page.
#### _chat_
Script used to connect to the chatroom.   
