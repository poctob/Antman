const DynamoDBService = require('./dynamoDBService');

const dynamoDBService = new DynamoDBService();

module.exports = class ProjectManagementService {

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

}
