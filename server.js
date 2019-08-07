'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
    channelAccessToken: 'GbzUJ2bQNFTtnTgqXxzvxNlC2wzFFH3MEitEdZ80ZSKhNC7hzy3umCjho9K5uKJNZSi+7QTi5W0evcsijk8uCdHcThRgVVnlJmbczZxDMNj5qh5mCLcul6n2qcbrjvgrxPWe6leWwkNJyqhh1bgKvgdB04t89/1O/w1cDnyilFU=',
    channelSecret: '568c835b04f59052a2ce141a095a64a7'
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    // console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }


  let mes = ''
  if(event.message.text.match(/天気/)){
  if(event.message.text.match(/今日/)){
    mes = '「今日」の天気か！ちょっとまってね〜'; 
    if(event.source.groupId){
    getNodeVer(event.source.groupId,0); 
    }else if(event.source.roomId){
    getNodeVer(event.source.roomId,0); 
    }else if(event.source.userId){
    getNodeVer(event.source.userId,0); 
    }
  }else if(event.message.text.match(/明日/)){
    mes = '「明日」の天気か！ちょっとまってね〜'; 
    if(event.source.groupId){
    getNodeVer(event.source.groupId,1); 
    }else if(event.source.roomId){
    getNodeVer(event.source.roomId,1); 
    }else if(event.source.userId){
    getNodeVer(event.source.userId,1); 
    }
  }else if(event.message.text.match(/明後日/)){
      mes = '「明後日」の天気か！ちょっとまってね〜'; 
      if(event.source.groupId){
      getNodeVer(event.source.groupId,2); 
      }else if(event.source.roomId){
      getNodeVer(event.source.roomId,2); 
      }else if(event.source.userId){
      getNodeVer(event.source.userId,2); 
      }
    }else{
      if(event.source.groupId){
        getNodeVer(event.source.groupId,3); 
        }else if(event.source.roomId){
        getNodeVer(event.source.roomId,3); 
        }else if(event.source.userId){
        getNodeVer(event.source.userId,3); 
        }
    }
  }else{
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getNodeVer = async (Id,day) => {
    const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=015010');
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
