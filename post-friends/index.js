const dynamoose = require('dynamoose');


exports.handler = async (event) => {

  const jsonBody = JSON.parse(event.body);

  const friendSchema = new dynamoose.Schema({
    'id': Number,
    'name': String,
    'role': String
  });

  const friendsTable = dynamoose.model('friends', friendSchema)

  let data = null;
  let status = 500;

  try {

    let id = Math.floor(Math.random() * 100);

    let friend = new friendsTable({id, ...jsonBody})
    
    data = await friend.save();
    status = 200;

  } catch (error) {
    status = 400;
    data = new Error(error);
  }

  const response = {
      statusCode: status,
      body: JSON.stringify(data),
  };
  return response;
};
