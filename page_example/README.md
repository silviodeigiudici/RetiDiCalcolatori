1) start CouchDB and RabbitMQ broker:
    DB stucture:
        - a database for all buildings called "buildings"
        - a database for each building with classrooms
        and classroom comments (ex "spv/cr24", "spv/cr24comments" or "diag/crB2" ...)


2) run nodejs:
    $ node classroom.js X N  {X = building name; N = number of the classroom we want access to}
    $ node amqp_client.js

Now you can access to classroom data:

->  Classroom info (number, seats ...) & photo form flickr
    Use http method GET at the address ../classroomN

    ex. curl 127.0.0.1:3000/X/classroomN

->  Comments
    Use http method post at the address ../classroomN/

    ex. curl 127.0.0.1:3000/classroomN/

Try this app on the browser -> 127.0.0.1:3000/X/classroomN
