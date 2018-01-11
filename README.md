1) start CouchDB and RabbitMQ broker:
    DB stucture:
        - a database for all buildings called "buildings"
        - a database for each building with classrooms
        and classroom comments (ex "spv/cr24", "spv/cr24comments" or "diag/crB2" ...)

2) run nodejs:
    $ node buildings.js to start the server. Open http://localhost:8080/edificio

To change building:
-open with an editor testing.js and change the variable building,for now only spv and diG are recognized.

