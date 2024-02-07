const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// Mongo code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ae0fypv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const mangoCollection = client.db("MangoDB").collection("mangoes");

    app.post("/mangoes", async (req, res) => {
      const gotMangoesFromCLient = req.body;
      console.log(gotMangoesFromCLient);
      const result = await mangoCollection.insertOne(gotMangoesFromCLient);
      res.send(result);
    });

    app.get("/mangos", async (req, res) => {
      const cursor = mangoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/mangoes/:id", async (req, res) => {
      const deleteId = req.params.id;
      console.log("got id from client", deleteId);
      const query = { _id: new ObjectId(deleteId) };
      const result = await mangoCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment of Mango. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// Mongo code end

app.get("/", (req, res) => {
  res.send("Hello Mango!");
});

app.listen(port, () => {
  console.log(`CUD RUNNING PORT ON ${port}`);
});
