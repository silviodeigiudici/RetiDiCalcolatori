# Autenticazione
Il seguente modulo gestisce l'autenticazione degli utenti tramite due procedure, il login locale e il login tramite credenziali Google, sfruttando il protocollo OAuth2. Le dipendenze del modulo sono elencate nel file  __package.json__.
Il modulo espone la porta 3000 e si connette a CouchDB al seguente access point: `localhost:5984`.

#### Componenti:
* Pagine da visualizzare contenute in _views/_
* Codice del modulo contenuto in _code_

## API REST Definite:
* ### `/`
  * #### GET
  Richiede la pagina home.

* ### `/login`
  * #### GET
  Richiede la pagina di login tramite account locale.
  * #### POST
  Avvia il processo di autenticazione usando i dati inseriti nella pagina.

* ### `/signup`
  * #### GET
  Richiede la pagina di registrazione di un nuovo account locale.
  * #### POST
  Avvia la procedura di registrazione e login dell'account con i dati inseriti nella pagina.

* ### `/logout`
  * #### GET
  Avvia la procedura di disconnessione dell'account e reindirizza alla pagina home.

* ### `/google`
  * #### GET
  Avvia la procedura di autenticazione con credenziali Google tramite OAuth2.

* ### `/auth`
 * #### GET
 Completa la procedura di autenticazione con credenziali Google salvando l'utente se necessario e reindirizzando sulla pagina del profilo se questa avuto successo, altrimenti rendirizza alla pagina home.

* ### `/profile`
 * #### GET
 Richieda la pagina del profilo utente se autentcati, altrimenti reindirizza alla pagina home.
