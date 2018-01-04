1) start CouchDB:
    DB stucture:
        - a database for all buildings
        - a database for each building with classrooms
          in each classroom we have information and comments

2) run nodejs:
    $ node classroom.js X N  {X = building name; N = number of the classroom we want access to}

Now you can access to classroom data:

->  Classroom info (number, seats ...)
    Use http method GET at the address ../classroomN

    ex. curl 127.0.0.1:3000/classroomN

->  Photo from flickr
    Use http method get at the address ../classroomN/photo

    ex. curl 127.0.0.1:3000/classroomN/photo

    tag is the keyword of photo research
    this procedure download photo from flickr in a folder called "photo"

->  Comments
    TODO
