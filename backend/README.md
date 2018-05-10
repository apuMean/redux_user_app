# TestApp 
Builds using  Express + knex + Bookself + sqlite3 using ES6 syntax. 

1. How do I get set up and running? 

Step 1: 
npm install knex -g   (not required if already globally present)
npm install babel-cli -g

Step 2: 
npm install  (On root directory of folder to install third party dependency)

Step 3: 
npm run migrate   (Setup database with model defined to change anythings create another migration file with change and run the following command )

Step 4: 
npm start  (Start the application)

*****Application can be access on the following Url:   http://localhost/serverIp:3000 


HERE IS THE API LIST AND ITS URL: 
(A)Owner
    1. PUT /addOwner
        http://localhost:3000/owner/addOwner

    2. DELETE /delOwner
        http://localhost:3000/owner/delOwner/:id

    3. GET /getOwner
        http://localhost:3000/owner/getOwner

(B)User
    1. PUT /addUserhtml
        http://localhost:3000/users/addUser 

    2. DELETE /delUser
        http://localhost:3000/users/delUser/:id 
    
    3. GET /getUser
        http://localhost:3000/users/getUser

<!-- **Considering Docker already install on local machine -->

<!-- docker-compose build
docker-compose up -->

## To run the apllication in background

<!-- docker-compose up -d (after closing of terminal also application run cont. ) -->

##Database

dev.sqlite3
