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
  let id = parseInt(event.pathParameters.id);

  let deleted = false;

  console.log(id, '<-- ID --<<');

  try {
    data = await friendsTable.scan().exec();

    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data.splice(i, 1)
        deleted = true;
      }
    }

    status = 200;
  } catch (error) {
    console.log(error, '<-- error --<<');

    data = new Error(error);
    status = 400;
  }

  const response = {
      statusCode: status,
      body: JSON.stringify(deleted)
  };

  return response;
};
