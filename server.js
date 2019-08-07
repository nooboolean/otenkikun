'use strict';
require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;
const config = {
    channelAccessToken: process.env.CHANNELACCESSTOKEN,
    channelSecret: process.env.CHANNELSECRET
};
const app = express();
const client = new line.Client(config);
const const_file = require('./const');

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let mes = ''

  if(event.message.text.match(/天気/)){
  return reply('天気を知りたい場所を教えて！')
  // if(event.message.text.match(/今日/)){
  //   mes = '「今日」の天気か！ちょっとまってね〜'; 
  //   if(event.source.groupId){
  //   getNodeVer(event.source.groupId,0); 
  //   }else if(event.source.roomId){
  //   getNodeVer(event.source.roomId,0); 
  //   }else if(event.source.userId){
  //   getNodeVer(event.source.userId,0); 
  //   }
  // }else if(event.message.text.match(/明日/)){
  //   mes = '「明日」の天気か！ちょっとまってね〜'; 
  //   if(event.source.groupId){
  //   getNodeVer(event.source.groupId,1); 
  //   }else if(event.source.roomId){
  //   getNodeVer(event.source.roomId,1); 
  //   }else if(event.source.userId){
  //   getNodeVer(event.source.userId,1); 
  //   }
  // }else if(event.message.text.match(/明後日/)){
  //     mes = '「明後日」の天気か！ちょっとまってね〜'; 
  //     if(event.source.groupId){
  //     getNodeVer(event.source.groupId,2); 
  //     }else if(event.source.roomId){
  //     getNodeVer(event.source.roomId,2); 
  //     }else if(event.source.userId){
  //     getNodeVer(event.source.userId,2); 
  //     }
  //   }else{
  //     if(event.source.groupId){
  //       getNodeVer(event.source.groupId,3); 
  //       }else if(event.source.roomId){
  //       getNodeVer(event.source.roomId,3); 
  //       }else if(event.source.userId){
  //       getNodeVer(event.source.userId,3); 
  //       }
  //   }
  // }else{
  //   return Promise.resolve(null);
  }

  return reply(mes)
}

function reply(message){
  client.replyMessage(event.replyToken, {
    type: 'text',
    text: message
  });
};

const getNodeVer = async (Id,day) => {
    const res = await axios.get(const_file.WEATHER_API+'id=2130452&appid='+process.env.WEATHER_API_KEY);
    const item = res.data;
    console.log(item);
    if(day==3){
      await client.pushMessage(Id, {
        type: 'text',
        text: item.pinpointLocations[6].name+'の天気のURL貼るね\n'+item.pinpointLocations[6].link,
    　　});
    for(var i=0;i<day;i++){
      await client.pushMessage(Id, {
        type: 'text',
        text: item.forecasts[i].dateLabel+'('+item.forecasts[i].date+')の洞爺湖の天気は\n「'+item.forecasts[i].telop+'」',
    });
    }
  }
    await client.pushMessage(Id, {
        type: 'text',
        text: item.forecasts[day].dateLabel+'('+item.forecasts[day].date+')の洞爺湖の天気は\n「'+item.forecasts[day].telop+'」',
    });
    await client.pushMessage(Id, {
      type: 'text',
      text: item.pinpointLocations[6].name+'の天気のURL貼るね\n'+item.pinpointLocations[6].link,
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
console.log(const_file.DESCRIPTION[800]);
axios.get(const_file.WEATHER_API+'id=2130452&appid='+process.env.WEATHER_API_KEY).then((res) => {
  console.log(res.data.list[3]);
})
