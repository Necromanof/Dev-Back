const { error } = require('console');
const express = require('express');
const { request } = require('http');
const { MongoClient } = require('mongodb'); // Base de données 'MongoDB'
const bodyParser = require('body-parser');

const uri = 'mongodb+srv://theokennedy1808:2y8hn4d2@cluster0.lb1nrp0.mongodb.net/?retryWrites=true&w=majority';

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.use((request, response, next) => {
    console.log(`Request Sending : ${request.method} ${request.url} ${JSON.stringify(request.body)}`);
    next();
});

const client = new MongoClient(uri); 
    client.connect(err => {
    if (err){
      console.log("Connection error at database !");  
    } else {
        console.log("Connection success !");
    }
});



app.post('/users', (request, response) => {
    const {nom, prenom} = request.body;

    if (!nom || !prenom){
        return response.status(400).json({erreur : "Missing properties, please send name and surname"});
    }

    const newUser = {nom, prenom};
    const collection = client.db("myDb").collection("users");

    try{
        const result = collection.insertOne(newUser);
        console.log("Succes User Add")
        response.status(201).json(newUser);
    }
    catch{
        console.error("Error User Add");
        response.status(500).send('Server Error');
    }
});




app.get('/users', (request, response) => {    
    const collection = client.db("myDb").collection("users");
    collection.find().toArray((err, users) => {
        if (err){
            console.error("User Search Error", err);
            response.status(500).send("Internal Server Error");
        } else {
            response.json(users);
        }
    });
});



app.listen(port, ()=> {
    console.log(`Server is running on port : ${port}`)
});

