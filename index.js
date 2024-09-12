const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

// Middleware cors setup
app.use(cors())

// request.body undefined problem solution
app.use(express.json())

//console.log(process.env.DB_USER, process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bq3zt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Declare database
    const database = client.db("CRUDoperationProject");
    const userCollection = database.collection("Users");


    // CRUD - Read/ Get user by API hit
    app.get('/users', async (request, response) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray()
      response.send(users)
    })


    // CRUD - Create/ Post user operation
    app.post('/users', async (request, response) => {
      const frontendUser = request.body;
      const result = await userCollection.insertOne(frontendUser);
      response.send(result);
      console.log(result);
    })


    // CRUD - Delete/ Erase user operation
    app.delete('/users/:userID', async (request, response) => {
      const id = request.params.userID;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      response.send(result);
      console.log(result);
    })


    // CRUD - Update/ Get a single user operation
    app.get('/users/:id', async (request, response) => {
      const id = request.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      response.send(user)
      console.log(id);
    })


    // CRUD - Update by PUT method
    app.put('/users/:uiID', async (request, response) => {

      // what should we Update, we update the user id 
      const id = request.params.uiID;
      console.log(id);
      const filter = { _id: new ObjectId(id) };

      // whom should we Update, weupdate the user info
      const user = request.body;
      console.log(user);

      // Update by "PUT" and upsert
      const option = { upsert: true };
      const updateUser = {
        $set: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      }

      const result = await userCollection.updateOne(filter, updateUser, option);
      response.send(result);

    })


    console.log("Pinged your deployment. You are successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);

// Connecting to server 
app.get('/', (request, response) => {
  response.send(`It is connected to server via ${port}:Change with dotEnv`)
})


// Listening to port ("as a confirmation to connection")
app.listen(port, () => {
  console.log(`CRUD Server is Listening & Running on port ${port}`);
})