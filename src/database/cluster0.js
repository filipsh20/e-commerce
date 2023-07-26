const mongodb = require('mongodb');

const cluster0 = async (dbName, collName) => {
    try {
        const client = await mongodb.MongoClient.connect(process.env.CLUSTER_0)
        const collection = client.db(dbName).collection(collName);
        return collection
    }catch(error){
        console.log('Error connecting to cluster 0', error)
    }
}

module.exports = cluster0;