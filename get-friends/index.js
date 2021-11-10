const dynamoose = require('dynamoose');


exports.handler = async (event) => {

  const friendSchema = new dynamoose.Schema({
    'id': Number,
    'name': String,
    'role': String
  });

  const friendsTable = dynamoose.model('friends', friendSchema)

  let data = null;
  let status = 500;

  try {
    data = await friendsTable.scan().exec();
    status = 200;
  } catch (error) {
    console.log(error, '<-- error --<<');

    data = new Error(error);
    status = 400;
  }

  const response = {
      statusCode: status,
      body: JSON.stringify(data),
  };
  return response;
};
