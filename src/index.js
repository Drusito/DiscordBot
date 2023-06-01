require('dotenv').config();
require('colors');
console.log(process.env.BOT_TOKEN);
try{
  const Bot = require('./models/Client.js');
  console.log(Bot.klk());
}catch(e){
  console.log(e);
}
console.log('aa');