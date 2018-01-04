# Applicazione
In questa cartella è contenuto il codice del modulo di autenticazione, formato dai seguenti sottomoduli:

* ##### _base.js_

  Modulo che effettua il bootstrap dell'applicazione, inizializzando la sessione e avvidno il server.

* ##### _OAuth-Secret.js_

  Questo modulo contiene le credenziali dell'applicazione necessarie all'autorizzazione della stessa per il protocollo OAuth2.

* ##### _passport.js_

  Questo modulo definisce le strategie di autenticazione locale e tramite Google dell'utente per il modulo passport, che gestisce le procedure relative all'autenticazione.

* ###### _routes.js_

  Questo modulo definisce le api REST esposte dall'applicazione.

* ###### _user.js_
  Questo modulo si occupa della gestione dell'account, interagendo con il database per creare, o ricercare un utente.
