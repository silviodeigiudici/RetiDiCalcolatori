# Piccola Documentazione:
  Ho usato il codice di mattia per verificare il funzionamento. I seguenti sono i files scritti da me:
* ##### _websocket.js_

  E' il modulo che fa partire il server web socket e gestisce i client che si connettono a lui verificando che sono autenticati.

* ##### _websocket functions.js_

  In questo modulo sono presenti le funzioni usate dal modulo web socket. In particolare open_server_socket apre il server
  e indica come controllare gli eventi dai client (quando riceve un messaggio, ecc) oltre a verificare sempre l'autenticazione,
  e get_info crea un messaggio in cui sono incapsulati il messaggio, nome del mittente e orario.

* ##### _edifici.js_

  Questo modulo invia la pagina edifici quando richiesta chiamando la funzione send_page che ottiene le informazioni del meteo e l'elenco degli edifici
  passandoli a ejs.

* ##### _index.ejs_

  E' la pagina con la chat e i link verso le pagine di marco e nunzio.

* ##### _jscode.js_

  Qui è presente il codice javascript per connettersi al server socket della chat.

* ###### _stile.css_

  Contiene delle indicazioni sulla disposizioni degli elementi sulla pagina index.ejs.

* File Modificati:

  Ho modificato il file routes.js e base.js per verificare il funzionamento della chat

