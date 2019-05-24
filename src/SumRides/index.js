const AWS = require('aws-sdk');
const epsagon = require('epsagon');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  try {
    await Promise.all(
      event.Records
        .map(record => record.dynamodb.NewImage)
        .map(countRide)
    );
  } catch (e) {
    epsagon.setError(e);
  }

};

async function countRide(newImage) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: { Name: newImage.Unicorn["M"].Name["S"] },
    UpdateExpression: "ADD #counter :increment",
    ExpressionAttributeNames: { '#counter': 'RideCount' },
    ExpressionAttributeValues: { ':increment': 1 }
  };

  await ddb.update(params).promise();
}
