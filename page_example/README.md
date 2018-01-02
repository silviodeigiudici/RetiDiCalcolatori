1) start CouchDB using Docker:
        docker run -p 5984:5984 -d couchdb

    to manipulate our database use the address:
        /127.0.0.1:5894/_utils

    create database named "databaseaule" and a classroom with id "aula24" with random info to test program

2) start RabbitMQ server with docker:
    docker run -d --hostname my-rabbit --name X -p 5672:5672 -p 15672:15672 rabbitmq:3
    * X = random name

3) run nodejs:
    $ node classroom.js N  N = number of the classroom we want access to (ex. 24)

Now you can access to classroom data:

->  Classroom info (number, seats ...)
    Use http method GET at the address ../classroomN

    ex. curl 127.0.0.1:3000/classroomN

->  Photo from flickr
    Use http method post at the address ../classroomN/photo whit parametres tag=...

    ex. curl -X POST 127.0.0.1:3000/classroomN/photo -d 'tag="..."'

    tag is the keyword of photo research
    this procedure download photo from flickr in a folder called "photo"

->  Comments
    amqp queue are routing based, the key is N
    Send Message:
        Use http method post at the address ../classroomN/Comments whit parametres data=MESSAGE

        ex. curl -X POST 127.0.0.1:3000/classroomN/photo -d 'data="..."'

    Receive Message:
        Use http method GET at the address ../classroomN/comments

        ex. curl 127.0.0.1:3000/classroomN/comments
