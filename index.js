const express =require ('express');
const cors =require ('cors');
// const jwt = require ('jwt');
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
        const itemCollection=client.db('Order').collection('AddItems')
// AUTH
// app.post('/getlogin', async(req,res)=>{
//     const user=req.body
//     const GetToken= jwt.sign(user,process.env.SCERCT_TOKEN,
//         {
//         expiresIn:'1d'
//     })
//     res.send(GetToken)
// })
        // Order API 
        app.get('/orderItems', async (req,res)=>{
            const email= req.query.email
            console.log(email)
            const query={email:email}
            const cursor= itemCollection.find(query)
            const orderItem= await cursor.toArray()
            console.log(orderItem)
            res.send(orderItem)
        })

        app.get('/item', async (req,res) => {
        const query={}
        const cursor= fruitCollection.find(query)
        const fruitItem= await cursor.toArray()
        res.send(fruitItem)
    
        })

        // Delete item API
        

        app.delete('/item/:id',async(req,res)=>{
            const id= req.params.id 
            const query={_id:ObjectId(id)}
            const deleteItem= await fruitCollection.deleteOne(query)
            res.send(deleteItem)
        })

        app.get('/item/:id', async(req,res)=>{
            const id= req.params.id
            const query={_id:ObjectId(id)}
            const fruitItem =await fruitCollection.findOne(query)
            res.send(fruitItem)

        })
        // POST
        app.post('/item ', async (req,res)=>{
            const newitem=req.body
            const itemresult= await fruitCollection.insertOne(newitem)
            console.log(itemresult)
            res.send(itemresult)
        })

        // order POST API
        app.post('/OrderItems',async (req,res)=>{
            const orderitem= req.body
            const orderresult= await itemCollection.insertOne(orderitem)
            res.send(orderresult)
        })

//update quantity API
        app.put("/updateitem/:id", async (req, res) => {
            const quantity = req.body;
            console.log(quantity);
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: quantity,
              };
              const result = await fruitCollection.updateOne(filter, updateDoc, options);
              res.status(200).send(result)
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