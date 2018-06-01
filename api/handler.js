'use strict';

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = {

  getOneItem: (event, context, callback) => {

    console.log('TEST')

    console.log(event);

    const params = {
      TableName: process.env.EXAMPLE_TABLE,
      IndexName: 'phoneNumber-practiceName-index',
      KeyConditionExpression: 'phoneNumber = :phoneNumber',
      ExpressionAttributeValues: {
        ":phoneNumber": event.pathParameters.phoneNumber
      }
    };

    dynamoDb.query(params).promise()
      .then(result => {
        console.log(result);
        console.log(result.Items[0]);
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Items[0]),
        };
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        const response = {
          statusCode: 404,
          body: 'Error: ' + error,
        };
        callback(null, response);
        return;
      });
  },

  postOneItem: (event, context, callback) => {

    const item = JSON.parse(event.body);
    console.log(item.phoneNumber);

    console.log(item);

    let params = {
      TableName: process.env.EXAMPLE_TABLE,
      Item: item
    }

    dynamoDb.put(params).promise()
      .then(result => {
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t add office item'));
        return;
      });
  },

  getAllItems: (event, context, callback) => {

    const params = {
      TableName: process.env.EXAMPLE_TABLE
    };

    dynamoDb.scan(params).promise()
      .then(result => {
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify(result.Items),
        };
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t fetch all offices'));
        return;
      });
  }
}
