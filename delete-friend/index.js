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

  let friendToDelete = null;

  try {
    data = await friendsTable.scan().exec();

    data.map(friend => {

      if (friend.id === id) {

        friendToDelete = friend;

      }

    })

    if (friendToDelete) {

      await friendsTable.delete(id);

      deleted = true;

    }

    status = 200;
  } catch (error) {
    console.log(error, '<-- error --<<');

    data = new Error(error);
    status = 400;
    deleted = false;
  }

  if (deleted === true) {

    const response = {
      statusCode: status,
      body: 'Friend Succesfully Deleted'
    };

    return response;

  } else {

    const response = {
      statusCode: status,
      body: 'Failed to Delete Friend'
    };

    return response;
  }
};
