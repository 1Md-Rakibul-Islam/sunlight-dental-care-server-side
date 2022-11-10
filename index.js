const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// require('crypto').randomBytes(64).toString('hex')

// middle qares
app.use(cors());
app.use(express.json())

//DB: SunlightDentalCareDB
// pass: AXFkQhj3JB3FaDry


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gksews0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const dentalServicesCollection = client.db('SunlightDentalCare').collection('services');

    const servicesReviewCollection = client.db('SunlightDentalCare').collection('review');

    try{

        // all services load api
        app.get('/topservice', async(req, res) => {
            const query = {};
            const cursor = dentalServicesCollection.find(query);
            const services = await cursor.limit(3).toArray()
            res.send(services);
        })

        //read data from database and send to client site
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = dentalServicesCollection.find(query);
            const services = await cursor.toArray()
            res.send(services);
        })

        //read data from client site and insert to database
        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = await dentalServicesCollection.insertOne(service);
            res.send(result);
        })

        // spicific id based service load api
        app.get('/services/:_id', async(req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id)};
            const service = await dentalServicesCollection.findOne(query);
            res.send(service);
        })

        //review data read from client site and insert to database
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            console.log(review)
            const result = await servicesReviewCollection.insertOne(review);
            res.send(result)
        })

        //review data read from database and send client side
        app.get('/reviews/:_id', async(req, res) => {
            const id = req.params._id;
            const query = {_id: ObjectId(id)};
            const review = await servicesReviewCollection.findOne(query);
            res.send(review);

        })

        //delete review
        app.delete('/reviews/:_id', async(req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id)};
            const result = await servicesReviewCollection.deleteOne(query);
            res.send(result)
        })

        app.patch('/reviews/:_id', async(req, res) => {
            const id = req.params._id;
            const about = req.body.about;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    about: about
                }
            }
            
            const result = await servicesReviewCollection.updateOne(query, updatedDoc);
            res.send(result)
        })


        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.service){
                query = {
                    service: req.query.service
                }
            }
            const cursor = servicesReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // user based review
        app.get('/reviews/user', async(req, res) => {
            let query = {};
            if(req.query.email) {
                query = {
                    email: req.query.email
                };
            }
            const cursor = servicesReviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

    }
    finally{

    }
}
run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('Sunlight Dental Care server is running')
})

app.listen(port, () => {
    console.log(`Sunlight Dental Care server running on ${port}`);
})