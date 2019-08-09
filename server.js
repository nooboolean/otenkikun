'use strict';
// require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const jaconv = require('jaconv');
const fs = require('fs');
const moment = require('moment');
const PORT = process.env.PORT || 3000;
// 最初.envに避難させてたけど、nowでデプロイするときは.envは持ってかれないので、別の方法で設定しなきゃならないみたい
const config = {
    channelAccessToken: '8K2FWTbfGf/27YSyeBCbf46OGbX5pHG7jJC7MCd2qaGJH7FybaZb13P6BNZnOZJ8ZSi+7QTi5W0evcsijk8uCdHcThRgVVnlJmbczZxDMNgl2SmJLkwLQI6jaIrm6ugG4znPgJaOM2MlQa35ZzjwUQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '50cc5c01b7846f22cc01f22530911a34'
};
const app = express();
const client = new line.Client(config);
const const_file = require('./const');
const city_list = JSON.parse(fs.readFileSync('city.list.json', 'utf8'));
var reply_count = 0;

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  if (reply_count > 0){
    var text = jaconv.toHebon(event.message.text).toLowerCase();
    var city_name = text.charAt(0).toUpperCase() + text.slice(1);
    var city_id = getCityId(city_name);
    if(city_id === undefined) {
      if(event.source.groupId) replyMessage2(event.source.groupId, city_id);
      else if(event.source.roomId) replyMessage2(event.source.roomId, city_id);
      else if(event.source.userId) replyMessage2(event.source.userId, city_id);
    }else{
      if(event.source.groupId) getNodeVer(event.source.groupId, city_id);
      else if(event.source.roomId) getNodeVer(event.source.roomId, city_id);
      else if(event.source.userId) getNodeVer(event.source.userId, city_id);
    }
    reply_count--;
    return Promise.resolve(null);
  }else{
    if(event.message.text.match(/天気/)){
      reply_count++;
      if(event.source.groupId) replyMessage(event.source.groupId);
      else if(event.source.roomId) replyMessage(event.source.roomId);
      else if(event.source.userId) replyMessage(event.source.userId);
      return
    }else{
      // if (event.source.userId){
      //   client.pushMessage(event.source.userId, {
      //     type: 'text',
      //     text: 'いいから「天気」って言ってみろ',
      //   });
      // }else{
      //   return Promise.resolve(null);
      // }
      return Promise.resolve(null);
    }
  }

}

function replyMessage(id) {
  client.pushMessage(id, {
    type: 'text',
    text: 'どの場所の天気を知りたいんや？都市名を「ひらがな」で教えてくれ！\n例）ちとせ',
  });
}

function replyMessage2(id) {
  client.pushMessage(id, {
    type: 'text',
    text: 'ワイそんな都市名知らんわ〜',
  });
}

function getCityId(city_name) {
  var city_id
  city_list.forEach((city) => {
    if (city.name == city_name){
      city_id = city.id;
    }
  });
  return city_id
}

const getNodeVer = async (chat_id, city_id) => {
    const res = await axios.get(const_file.WEATHER_API+'id='+city_id+'&appid=de87f859e6c39dd89d76d4f8864a72a5');
    for (var i = 3; i <= 5; i++){
      var main = const_file.MAIN_WEATHER[res.data.list[i].weather[0].main];
      var description = const_file.DESCRIPTION[res.data.list[i].weather[0].id];
      var date_time = moment(res.data.list[i].dt_txt, "YYYY-MM-DD HH:mm:ss").format('YYYY年MM月DD日 HH:mm');
      await client.pushMessage(chat_id, {
        type: 'text',
        text: '日時：'+date_time+'\n天気：'+main+'\n詳細な天気：'+description,
      });
    }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

// axios.get(const_file.WEATHER_API+'id=2130452&appid=de87f859e6c39dd89d76d4f8864a72a5').then((res) => {
//   var a = moment(res.data.list[3].dt_txt, "YYYY-MM-DD HH:mm:ss");
//   console.log(a.format('YYYY年MM月DD日 HH:mm'));
// })