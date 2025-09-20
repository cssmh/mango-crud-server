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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const mangoCollection = client.db("MangoDB").collection("mangoes");

    // create new
    app.post("/mangoes", async (req, res) => {
      const gotMangoesFromCLient = req.body;
      console.log(gotMangoesFromCLient);
      const result = await mangoCollection.insertOne(gotMangoesFromCLient);
      res.send(result);
    });
    // create new end

    // get and show all
    app.get("/mangos", async (req, res) => {
      const cursor = mangoCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get and show all end

    // update part here
    // first get that id to send to update
    app.get("/update/:id", async (req, res) => {
      const gotParamsId = req.params.id;
      const query = { _id: new ObjectId(gotParamsId) };
      const result = await mangoCollection.findOne(query);
      res.send(result);
    });
    // first get that id to send to update end
    // set that id, time to update to database
    app.put("/update/:id", async (req, res) => {
      const paramsId = req.params.id;
      const updatedInfoFromClient = req.body;
      const filter = { _id: new ObjectId(paramsId) };
      const options = { upsert: true };
      const finalUpdateMangoes = {
        $set: {
          name: updatedInfoFromClient.name,
          photo: updatedInfoFromClient.photo,
        },
      };
      const result = await mangoCollection.updateOne(
        filter,
        finalUpdateMangoes,
        options
      );
      res.send(result);
    });
    // update part here end

    // delete a single one
    app.delete("/mangoes/:id", async (req, res) => {
      const deleteId = req.params.id;
      console.log("got id from client", deleteId);
      const query = { _id: new ObjectId(deleteId) };
      const result = await mangoCollection.deleteOne(query);
      res.send(result);
    });
    // delete a single one end

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
