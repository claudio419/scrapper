const {MongoClient, ServerApiVersion} = require("mongodb");
require('dotenv-defaults/config');
const uri = process.env.MONGO_DB_URL;
module.exports = {
    async saveData(data) {
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        try {
            await  client.connect();
            const db = client.db("WebScrapper");
            const collection = db.collection("soccerStats");

            const result = await collection.insertMany(data);
            console.log(result.insertedIds);
        } catch (e) {

            console.log('db Error!!!');
            console.log(e);

        } finally {
            await client.close();
        }
    },

    async getAllLeagues() {
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        try {
            await  client.connect();
            const db = client.db("WebScrapper");
            const coll = db.collection("soccerStats");

            const result = await coll.find().toArray();
            console.log('result:', result);
            return result;

        } catch (e) {

            console.log('db Error!!!');
            console.log(e);

        } finally {
            await client.close();
        }
    },
}
