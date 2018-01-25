# Defined REST APIs:
* ### `/`
    * **GET**: show login methods (local or oauth)
    * POST:
    * PUT:
    * DELETE:

* ### `/login`
  * **GET**: show local login form
  * **POST**: take username and password from form and authenticate user
  * PUT:
  * DELETE:

* ### `/signup`
  * **GET**: show signup form
  * **POST**: take email username and password and registers user (authenticate it after mail convalidation)
  * PUT:
  * DELETE:

* ###  `/registration`
  * **GET**: confirm the registration and authenticate user
  * POST:
  * PUT:
  * DELETE:

* ### `/logout`
  * #### GET**:
  Avvia la procedura di disconnessione dell'account e reindirizza alla pagina home.

* ### `/google`
    * **GET**: show login with google credentials through oauth
    * POST:
    * PUT:
    * DELETE:

* ### `/auth`
 * **GET**: Callback called by Google Oauth once the user has logged on Google and need to be saved on redirected to profile page
 * POST:
 * PUT:
 * DELETE:
* ### `/profile`
  * **GET**: show user information
  * POST:
  * PUT:
  * DELETE:

* ###  `/edifici`
  * **GET**: show weather information about rome, available buildings and a websocket chat
  * POST:
  * PUT:
  * DELETE:

* ### `/edificio?edificio=X`
  * **GET**: show information about building X, a map with POI, bar and restaurants near by and indications
  * POST:   
  * PUT:
  * DELETE:

* ### `/aula?edificio=X&aula=Y`
  * **GET**: show information about classroom Y in the building X and enable amqp client to receive comments
  * POST:
  * PUT:
  * DELETE:

*  ### `/aula`
  * GET:
  * **POST**: use amqp to send comment to amqp client with routing key [building;classroom_number]
  * PUT:
  * DELETE:
