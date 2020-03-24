const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    const uri =
        // "mongodb+srv://ali:rGOlk9S3XMzD064q@clusters-24qbf.gcp.mongodb.net/test?retryWrites=true&w=majority";
        MongoClient.connect("mongodb://localhost:27017/shop", {
            useUnifiedTopology: true
        })
            .then(client => {
                console.log("CONNECTED!!");
                _db = client.db();
                callback();
            })
            .catch(err => {
                console.log("CONNECTION INTERRUPTED");
                console.log("----------------------");
                console.log(err);
            });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "DATABASE NOT FOUND!!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
