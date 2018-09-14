### ABOUT

>  node.js rest service that returns new words the user has learned.

### Updates 

> trying to make it Paas agnostic when talking to other services.

# Making it Go
### INSTALL

> npm install

### DEPENDENCIES

> You need to create a 'keys.json' file the following keys: 'mongo' for a MongoDB datastore.

### RUNNING LOCALLY

> npm start

### BUILDING THE DOCKER IMAGE

> docker build -t words_service .

### RUNNING IN DOCKER

> docker run -d -p 8080:9774 --name words_service