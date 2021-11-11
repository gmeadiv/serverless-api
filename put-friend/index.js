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
  let info = event.body;

  console.log(info["name"], '<-- info name')

  let updated = false;
  let friendToUpdate = null;
  let newData = null;

  try {
    data = await friendsTable.scan().exec();

    data.map(friend => {

      if (friend.id === id) {

        friendToUpdate = friend;

      }

    })

    if (friendToUpdate) {

      newData = await friendsTable.update(id, {
        
        name: info.name,
        role: info.role

      });

      updated = true;

    }

    status = 200;
  } catch (error) {
    console.log(error, '<-- error --<<');

    data = new Error(error);
    status = 400;
    updated = false;
  }

  if (updated === true) {

    const response = {
      statusCode: status,
      body: newData
    };

    return response;

  } else {

    const response = {
      statusCode: status,
      body: 'Failed to Update Friend'
    };

    return response;
  }
};
