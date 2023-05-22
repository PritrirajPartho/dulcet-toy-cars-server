const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware is here........
app.use(cors())
app.use(express.json());
// -------------------------------------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltzoo6n.mongodb.net/?retryWrites=true&w=majority`;
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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollection = client.db('toysDB').collection('toy');

/*----------------------------------------------------------------- */
    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const query  = {_id: new ObjectId(id)}
      const result = await toysCollection.findOne(query);
      res.send(result);
     })
    
    app.get('/mytoys', async (req, res) => {
      let query = {};
      if (req.query?.email) {
          query = { email: req.query.email }
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/alltoys/:category', async (req, res) => {
      const toys = await toysCollection.find({category: req.params.category}).toArray();
      res.send(toys)
    })

    app.post('/toys', async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    });

    app.put('/toys/:id', async(req, res) => {
      const id = req.params.id;
      const filter  = {_id: new ObjectId(id)};
      const options = { upsert: true };
      // create a document that sets the plot of the movie
      const updateToy = req.body;
      const updateDoc = {
          $set: {
            name: updateToy.name,
            quantity: updateToy.quantity,
            price: updateToy.price,
            description: updateToy.description
          },
      };
      const result = await toysCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);


// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send('Assignment 11 is running ...........')
})

app.listen(port, () => {
  console.log(`Assignment node app listening on port ${port}`)
})