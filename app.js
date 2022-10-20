require("dotenv").config();

const express = require('express')
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const { ObjectId } = require('mongodb')
const PORT = (process.env.PORT || 3000);
//const herokuVar = process.env.HEROKU_NAME || "kingram"
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(bodyParser.json());
//app.use(express.static('public'))


let someVar = "";

async function cxnDB(){
  try{
    client.connect;
    const collection = client.db("kingramquebec").collection("quotes");
    const result = await collection.find().toArray();

    console.log("cxnDB result:", result);
    return result;

  }
  catch(e){
    console.log(e)
  }
  finally{
    client.close;
  }
}

 app.get('/', async (req, res) => {
  
  let quoteData = await cxnDB().catch(console.error);

  console.log("get/:", quoteData);

  res.render('index.ejs', {
     someVar: "Today young Padawan we will be training w/ a full data stack.",
     herokuVar: process.env.HEROKU_NAME,   
     quoteData: quoteData
     })
})

app.post('/addQuote', async (req, res) => {

  try {
 // console.log("req.body: ", req.body)
 // .then(result => {
  client.connect;
  const collection = client.db("kingramquebec").collection("quotes");
  await collection.insertOne(req.body)
  res.redirect('/');
  }
  catch(e){
    console.log(error)
  }
  finally{
   // client.close()
  }

})

app.post('/deleteQuote/:id', async (req, res) => {

  try {
    console.log('req.params.id: ', req.params.id)

    client.connect;
    const collection = client.db("kingramquebec").collection("quotes");
    let quoteData = await collection.findOneAndDelete( 
      {
      "_id": ObjectId(req.params.id)
      }
    )

    .then(quoteData => {
    console.log(quoteData);
    res.redirect('/');
  })
    .catch(error => console.error(error))
  }
    finally{
    // client.close()
  }
  
})

app.post('/updateQuote/:id', async (req, res) => {

  try {
    console.log('req.params.id: ', req.params.id)

    client.connect;
    const collection = client.db("kingramquebec").collection("quotes");
    let quoteData = await collection.findOneAndUpdate( 
      {
      "_id": ObjectId(req.params.id)
      },
      {
      $set: {
        speaker: '- Darth Barry',
        quote_name: 'The Dark Side will prevail!',
      },
    
    }
  
    )

    .then(quoteData => {
    console.log(quoteData);
    res.redirect('/');
  })
    .catch(error => console.error(error))
  }
    finally{
    // client.close()
  }
  
})
   
app.listen(PORT, () => {
  console.log(`Server is running & listening on port ${PORT}`); 

});
