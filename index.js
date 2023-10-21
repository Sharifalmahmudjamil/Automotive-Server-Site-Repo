const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cp7ahlj.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const carCollection=client.db('carDB').collection('car')
    const addToCartCollection=client.db('carDB').collection('cart');

    app.get('/cars',async(req,res)=>{
        const cursor = carCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    })

    app.get('/cars/:id',async(req,res)=>{
      const id= req.params.id;
      const  query = {_id: new ObjectId(id)}
      console.log(query);
      const result= await carCollection.findOne(query);
      res.send(result);
    });

    app.post('/cars',async(req,res)=>{
        const newCar=req.body;
        console.log(newCar);
        const result= await carCollection.insertOne(newCar);
        res.send(result);
    })

    app.put('/cars/:id',async(req,res)=>{
      const id= req.params.id;
      const filter={_id: new ObjectId(id)}
      const options={upsert:true}
      const updateCar=req.body;
      const car={
        $set:{
          name:updateCar.name,
          rating:updateCar.rating,
          brandName:updateCar.brandName,
          TypesOfProduct:updateCar.TypesOfProduct,
          price:updateCar.price,
          description:updateCar.description,
          photo:updateCar.photo
          
        }
      }
      const result = await carCollection.updateOne(filter,car,options);
      res.send(result);
    })


   

    app.get('/cart',async(req,res)=>{
      const cursor=addToCartCollection.find();
      const cart=await cursor.toArray();
      res.send(cart);
    })

 

    app.post('/cart',async(req,res)=>{
      const cart =req.body;
      console.log(cart);
      const result= await addToCartCollection.insertOne(cart);
      res.send(result);
    })

    app.delete('/cart/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query= { _id: id}
      const result= await addToCartCollection.deleteOne(query);
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
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('automotive server is running')
})

app.listen(port,()=>{
    console.log(`automotive server is running on port: ${port}`);
})