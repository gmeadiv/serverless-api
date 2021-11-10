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

  console.log(id, '<-- ID --<<');

  let foundFriend = null;

  try {
    data = await friendsTable.scan().exec();

    data.map(friend => {

      
      if (friend.id === id) {

        foundFriend = friend;

      }

    })

    status = 200;
  } catch (error) {
    console.log(error, '<-- error --<<');

    data = new Error(error);
    status = 400;
  }

  const response = {
      statusCode: status,
      body: JSON.stringify(foundFriend),
  };

  return response;
};
