# ClassRoomAdvisor
Progetto di Reti di Calcolatori, è un applicazione web che fornisce informazioni sulle aule nei vari edifici dell'Università La Sapienza di Roma, insieme ad informazioni utili sui sevizi nei dintorni, meteo e indicazioni stradali

## Istruzioni per la configurazione
l'applicazione richiede i seguenti servizi:
* couchdb 2 all'indirizzo localhost:5984
* rabbitmq all'indirizzo localhost:5672
* un browser che supporta l'utilizzo di websocket
* nodejs per eseguire l'applicazione

In particolare in couchdb devono essere presenti i seguenti database:
* users, per memorizzare gli utenti
* buildingsdb, per memorizzare le informazioni sugli edifici
* un database per ogni edificio, identificato dal nome dell'edificio

##### TODO
1. [x] Definire struttura database e insieme dei dati di interesse (TUTTI)
2. [x] Login usando Google SignIn e in locale (MATTIA) (registrazione via mail) (MARCO)
3. [x] Elenco degli edifici, chat globale e info sul meteo a roma (SILVIO)
4. [x] Informazioni sull' edificio scelto, luoghi nei dintorni, indicazioni per raggiungerlo e aule disponibili (MARCO)
5. [x] Informazioni sull' aula, galleria fotografica presa da flickr e sezioni commenti (NUNZIATO)
6. [x] Documentazione REST (TUTTI)

###### Scritto da:
* Silvio Dei Giudici
* Nunziato Crisafulli
* Marco Morella
* Mattia Nicolella
