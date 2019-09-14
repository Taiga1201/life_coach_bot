var CHANNEL_ACCESS_TOKEN = 'Jf9BYdoXJ2k1/zyhMxJDNzlG+YJNR/lVSvZQxq49JKvde22ghajV2MONuVM4/0ZkvnyHAbD59UZrI59xS7LdSDcGGv1nnfAY6pfVRZMFG9VMA1/pb46ELHNBRBshXndKH1gtREf7XtpVFDEglfGQBwdB04t89/1O/w1cDnyilFU=';
var USER_ID = "U5f2bfe398308421df61197e5df151b2c";

// 通知機能
function push_message() {
  var today = new Date();
  var toWeekday = toWD(today);
  var msgWeatherForecast = getTemperatureForecast();
  var weekDay = today.getDay();
  var day = today.getDate();
  var trash = getTrashDay(weekDay, day);
  var border = "\n---------------------------\n"
  var postData = {
    "to": USER_ID,
    "messages": [
      {　
        "type": "text",
        "text": "✨今日は" + Utilities.formatDate( today, 'Asia/Tokyo', 'M月d日') + toWeekday + 'だよ！️\n'
        + border + msgWeatherForecast[0] + border + msgWeatherForecast[1] + border + msgWeatherForecast[2] + border + msgWeatherForecast[3] + border + '🚮ゴミ収集日\n\n' + trash + border
      }]
    }
  
  var headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);  
}

// 傘を持って行った際に忘れないようメッセージ
function umbrella_forget(){
  var msgWeatherForecast = getTemperatureForecast();
  var postData = {
    "to": USER_ID,
    "messages": [
      {
        "type": "text",
        "text": msgWeatherForecast[4]
      }]
    } 
  
  var headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };
  
  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  
  var response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", options);  
}

// 天気予報の取得
function getTemperatureForecast() {
  const area = "東京地方"
  const area2 = "東部"
  var options = 
      {
        "contentType" : "text/xml;charset=utf-8",
        "method" : "get",
      };
  
  var options2 = 
      {
        "contentType" : "text/xml;charset=utf-8",
        "method" : "get",
      };
  var responce = UrlFetchApp.fetch("https://www.drk7.jp/weather/xml/13.xml", options);
  var responce2 = UrlFetchApp.fetch("https://www.drk7.jp/weather/xml/14.xml", options2);
  var xmlDoc = XmlService.parse(responce.getContentText());
  var xmlDoc2 = XmlService.parse(responce2.getContentText());
  var rootDoc = xmlDoc.getRootElement();
  var rootDoc2 = xmlDoc2.getRootElement();
  var region = parser.getElementById(rootDoc, area);
  var region2 = parser.getElementById(rootDoc2, area2);
  var weather = parser.getElementsByTagName(region, 'weather');
  var weather2 = parser.getElementsByTagName(region2, 'weather');
  var temperature = parser.getElementsByTagName(region, 'range');
  var temperature2 = parser.getElementsByTagName(region2, 'range');
  var rainyPercent = parser.getElementsByTagName(region, 'period');
  var rainyPercent2 = parser.getElementsByTagName(region2, 'period');
  var weatherInformation = parser.getElementsByTagName(region, 'weather_detail');
  var weatherInformation2 = parser.getElementsByTagName(region2, 'weather_detail');
  var weathermsg = "🌈天気情報\n\n" + "神奈川県" + area2 + "👇" + "\n" +  weatherInformation2[0].getValue() + "\n\n" + area + "👇" + "\n" + weatherInformation[0].getValue();
  var tempmsg = "🌡気温\n\n"  + "神奈川県" + area2 + "👉" + temperature2[0].getValue() + "℃/" + temperature2[1].getValue() + "℃" + "\n\n" + area + "👉" + temperature[0].getValue() + "℃/" + temperature[1].getValue() + "℃";
  var umbrellamsg = "☂️傘予想\n\n" + getUmbrellaNecessary(weatherInformation[0].getValue(), weather[0].getValue(),rainyPercent[1].getValue(),rainyPercent[2].getValue(),rainyPercent[3].getValue(),rainyPercent[4].getValue(),weatherInformation2[0].getValue(),weather2[0].getValue(),rainyPercent2[1].getValue(),rainyPercent2[2].getValue(),rainyPercent2[3].getValue(),rainyPercent2[4].getValue());
  var umbrellaForget = getUmbrellaDoNotForget(weatherInformation[0].getValue(), weather[0].getValue(),rainyPercent[1].getValue(),rainyPercent[2].getValue(),rainyPercent[3].getValue(),rainyPercent[4].getValue(),weatherInformation2[0].getValue(),weather2[0].getValue(),rainyPercent2[1].getValue(),rainyPercent2[2].getValue(),rainyPercent2[3].getValue(),rainyPercent2[4].getValue());
  var HangOutCan = "🌀外干し予想\n\n" + getHangOut(weatherInformation2[0].getValue(), weather2[0].getValue(), rainyPercent2[1].getValue(), rainyPercent2[2].getValue(), rainyPercent2[3].getValue(), rainyPercent2[4].getValue());
  var rainyTemperature = [weathermsg,tempmsg,umbrellamsg,HangOutCan,umbrellaForget,rainyPercent2[4]];
  return rainyTemperature
}

//傘予想
function getUmbrellaNecessary(information,weather,mor,eve,nig,mid,information2,weather2,mor2,eve2,nig2,mid2){
  var msg = ""
  if (information.indexOf('雨') !== -1 || weather.indexOf('雨') !== -1 || mor > 30 || eve > 30 || nig > 30 || mid > 30 || information2.indexOf('雨') !== -1 || weather2.indexOf('雨') !== -1 || mor2 > 30 || eve2 > 30 || nig2 > 30 || mid2 > 30 ) {
    msg = "傘を持って行ったほうがいいね！";
  } else {
    msg = "傘は持たなくてもいいね！";
  }
  return msg
}
   
// 傘忘れ防止
function getUmbrellaDoNotForget(information,weather,mor,eve,nig,mid,information2,weather2,mor2,eve2,nig2,mid2){
  var msg = ""
  if (information.indexOf('雨') !== -1 || weather.indexOf('雨') !== -1 || mor > 30 || eve > 30 || nig > 30 || mid > 30 || information2.indexOf('雨') !== -1 || weather2.indexOf('雨') !== -1 || mor2 > 30 || eve2 > 30 || nig2 > 30 || mid2 > 30 ) {
    msg = "気をつけて帰ってね！👍傘を持って帰ってね！🌂";
  } else {
    msg = "気をつけて帰ってね！👍";
  } 
  return msg
}
    
// ゴミの日の取得
function getTrashDay(weekDay, day) {
  var TrashDay = ""

  if (weekDay == 1 || weekDay == 4){
    TrashDay = "今日は燃えるゴミの日だよ！";
  } else if (weekDay == 5) {
    TrashDay = "今日は資源ゴミの日だよ！";
  } else if (weekDay == 3 && day == 1 || day == 2 || day == 3 || day == 4 || day == 5 || day == 6 || day == 7 || day == 15 || day == 16 || day == 17 || day == 18 || day == 19 || day == 20 || day == 21 ) {
    TrashDay = "今日は陶器・ガラス・金属ゴミの日だよ！";
  } else {
    TrashDay = "今日はゴミ収集日じゃないよ！";
  }
  return TrashDay
}

// 外干し予想
function getHangOut(information,weather, mor, eve, nig, mid) {
  var hangOut = ""
  
  if (information.indexOf('晴') !== -1 && information.indexOf('雨') === -1 && weather.indexOf('晴') !== -1 && weather.indexOf('雨') === -1 && mor < 30 && eve < 30 && nig < 30 && mid < 30) {
    hangOut = "今日は外干し日和だよ！";
  } else {
    hangOut = "今日は部屋干ししよう！";
  }
  return hangOut
}

// 曜日の日本語変換
function toWD(date){
  var dayOfWeek = date.getDay();
  var dayOfWeekStr = ["日","月","火","水","木","金","土"][dayOfWeek];
  return "(" + dayOfWeekStr + ")";
}