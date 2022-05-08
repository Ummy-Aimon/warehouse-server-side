const express =require ('express');
const cors =require ('cors');
require('dotenv').config()
const port= process.env.PORT || 5000
const app= express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.Fruits_User}:${process.env.Fruits_pass}@cluster0.0ergu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const fruitCollection= client.db('FoodFruits').collection('Items')
        
        app.get('/item', async (req,res) => {
        const query={}
        const cursor= fruitCollection.find(query)
        const fruitItem= await cursor.toArray()
        res.send(fruitItem)
    
        })
        app.get('/item/:id', async(req,res)=>{
            const id= req.params.id
            const query={_id:ObjectId(id)}
            const fruitItem =await fruitCollection.findOne(query)
            res.send(fruitItem)

        })
    }
    finally{

    }
}
run().catch(console.dir)
  console.log('db connected')
  // perform actions on the collection object
//   client.close();
// });


app.get('/',(req,res)=>{
    res.send('Running fruits warehouse')
})


app.listen(port,()=>{
    console.log('Listening on port',port)
})