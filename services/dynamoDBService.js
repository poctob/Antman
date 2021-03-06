const AWS = require('aws-sdk');

AWS.config.update({ region: "us-east-1" });
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = class DynamoDBService {

    constructor() {

    }

    async readTableData(tableName, key) {

        let params = {
            TableName: tableName,
            Key: key
        };

        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            }
        });
    }

    async writeTableData(tableName, data) {

        let params = {
            TableName: tableName,
            Item: data
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            }
            else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    }

    async getAll(tableName) {
        let params = {
            TableName: tableName
        };
        
        let data = null;
        
        try {
            data = await docClient.scan(params).promise();
            
            while (typeof data.LastEvaluatedKey != "undefined") {
                console.log("Scanning for more...");
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                let nextData = await docClient.scan(params).promise();
                
                data.Items.concat(nextData.Items);
                data.Count = nextData.Count;
                data.ScannedCount = nextData.ScannedCount;
                
            }
            return data;
            
        } catch (err) {
            console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        }
    }
}
