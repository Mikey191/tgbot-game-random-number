# ТелеграммБот-Игра "Случайное число".

### Описание проекта:
1. Создание команд для телеграмм бота.
2. Отправка пользователю кнопок.
3. Обработка нажатий на созданные кнопки.
4. Взаимодействие телеграмм бота с базой данных postgres.
5. Деплой телеграмм бота на облачный сервер.
6. Подключение к серверу по SSH.
7. Запуск приложения в фоновом режиме.

## 1. Создание телеграм-бота в Телеграм.
1. Вбиваем в поиске в телеграм "botfather".
2. Нас интересует команда /newbot.
3. Вводим название бота. Оно может быть любым. Оно будет отображаться пользователям.
4. Вводим уникальный username по которому его можно будет найти в поиске. Название обязательно должно заканчиваться на Bot.
5. Нам приходит сообщение с информацией о созданном боте и с токеном для взаимодействия с ним.

## 2. Создание приложения на Node.js
1. Открываем папку.
2. Инициализируем приложение с помощью команды: npm init -y .
3. Создаем файл index.js .
4. Создаем переменную const token = "токен _бота".
5. Устанавливаем пакет для взаимодействия с телеграм: npm i node-telegram-bot-api
6. Устанавливаем пакет для автоматического обновления сервера без перезапуска: npm i nodemon
7. В файле index.js импортируем установленный пакет const TelegramApi = require('node-telegram-bot-api').
8. Создаем скрипты в файле package.json для запуска приложения:
    1. скрипт для режима разработки: "dev": "nodemon index.js"
    2. скрипт для продакшена: "start": "node index.js"
9. Создаем переменную bot = new TelegramApi(token, {polling:true})

## 3. Работа с ботом.
1. Создаем слушатель событий на обработку полученных сообщений. Как ивент указываем "message", и вторым аргументом callback. Пока выведем сообщение, которое попадает в callback:
```javascript
bot.on("message", msg => {
 console.log(msg)
})
```
2. Запускаем бота с помощью скрипта npm run dev.
3. Переходим в телеграм в нашего созданного бота(ссылка в сообщении от botfather).
4. Нажимаем на предлагаемую в телеграмме команду /start .
5. И в логах мы можем увидеть сообщение. Оно представляет из себя обычный объект у которого есть некоторые поля:
    - id сообщения
    - from от кого оно было отправлено
    - chat информация о самом чате
    - date дата отправки сообщения
    - text текст который был отправлен
```javascript
{
  message_id: 645,
  from: {
    id: 824624480,
    is_bot: false,
    first_name: 'whymiky',
    username: 'whymiky',
    language_code: 'ru'
  },
  chat: {
    id: 824624480,
    first_name: 'whymiky',
    username: 'whymiky',
    type: 'private'
  },
  date: 1717082884,
  text: 'hello Bot'
}
```

## 4. Работа с информацией из сообщения.
1. Вытаскиваем интересующие нас поля внутри bot.on:
     - text = msg.text;
     - chatId = msg.chat.id;
2. Все функции для работы с ботом являются асинхронными. Перед функцией добавляем async, перед методами добавляем await.
3. Отправка сообщений в ответ осуществляется с помощью bot.sendMessage() первым параметром передаем chatId, вторым параметром передаем сообщение.
```javascript
bot.on("message", async msg => {
 const text = msg.text;
 const chatId = msg.chat.id;
 bot.sendMessage(chatId, `Ты написал мне ${text}`)
})
```
4. Проверяем работоспособность в телеграм-боте.

## 5. sendMessage и sendSticker.
1. Реализуем ответ на команду старт:
```javascript
if(text === "/start"){
 await bot.sendMessage(chatId, "Добро пожаловать в телеграм бот")
}
```
2. Эта команда отправляется по дефолту в тот момент, когда пользователь нажал кнопку подключитсья.
3. Реализуем вторую команду info в которой мы будем выводить следующий текст:
```javascript
if(text === "/info"){
 await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
}
```
4. Добавление стикера при отправки сообщения. Его мы добавим для команды /start .
```javascript
if(text === "/start"){
 await bot.sendSticker(chatId, "ссылка_на_стикер");
 await bot.sendMessage(chatId, "Добро пожаловать в телеграм бот");
}
```
5. Проверяем работоспособность в телеграм-боте.
6. Таким же образом как стикер мы можем отправлять и картинки, и аудио и любой другой формат доступный в телеграм.


## 6. Команды бота для пользователя.
1. Для установления команд мы можем воспользоваться функцией bot.setMyCommands(), которая параметром принимает массив объектов:
```javascript
bot.setMyCommands([
 {command: "/start", description: "Начальное приветсвие"}, //ключ - comand значением этого ключа является команда /start и description описание этой команды
 {command: "/info", description: "Информация о пользователе"},
])
```
2. Теперь в боте появилась кнопка "/" нажимая на которую мы можем увидеть все команды.
3. Создадим функцию start и весь написанный код перенесем в нее.
4. Запустим эту функцию.
5. Далее заменим на return некоторые await, что бы команда после отработки завершалась.
6. И после условного оператора с помощью return возвращаем сообщение "Я тебя не понимаю". Таким образом мы обработаем сообщения от пользователей без команд.


## 7. Добавление /game
1. Добавим еще одно условие с командой /game .
2. Игра будет заключаться в том, что бот будет загадывать число, а пользователь должен будет его отгадать.
3. Добавляем в условии сообщение "Сейчас я загадаю цифру от 0 до 9, отгадай ее".
4. Далее генерируем это рандомное число с помощью функции Math.random() * 10 .
5. Затем с помощью функции Math.floor это число округляем.
```javascript
if(text === "/game"){
 await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, отгадай ее");
 const randomNumber = Math.floor(Math.random() * 10);
}
```


## 8. Создание аналога базы данных.
1. Создаем глобально объект который как ключи будет содержать в себе id чата, а как значение, загаданное ботом число.
```javascript
const chats = {}
```
2. Добавляем в объект значение, и отправляем сообщение в котором просим пользователя отгадать число:
```javascript
if(text === "/game"){
 await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, отгадай ее");
 const randomNumber = Math.floor(Math.random() * 10);
 chats[chatId] = randomNumber
 return bot.sendMessage(chatId, "Отгадай число")
}
```
3. Добавляем команду в наш массив.
```javascript
bot.setMyCommands([
 {command: "/start", description: "Начальное приветсвие"}, //ключ - comand значением этого ключа является команда /start и description описание этой команды
 {command: "/info", description: "Информация о пользователе"},
 {command: "/game", description: "Игра угадай цифру"},
])
```


## 9. Работа с кнопками.
1. Функция sendMessage третьим параметром некий объект form. С помощью этого объекта можно вместе с сообщением отправлять еще и кнопки.
2. Создаем объект опций gameOptions. У него будет одно единственное поле reply_markup и это должна быть JSON строка.
3. Преобразовать объект в строку можно с помощью JSON.stringify.
4. У объекта который мы будем преобразовывать будет поле inline_keyboard. Это поле является массивом, который в себе содержит так же массивы. И массив в себе содержит объекты - это уже непосредственно объекты кнопок.
5. У кнопок должно быть поле text: "Текст кнопки" и поле callback_data: "wdwdwqdqw" - это какая то информация которая вернётся на сервер, когда пользователь нажмет кнопку.
```javascript
const gameOptions = {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: "Текст кнопки", callback_data: "sdcsacwcw"}]
  ]
 })
}
```
6. Передаем эти опции третьим параметром в функцию sendMessage в if /game.
```javascript
if(text === "/game"){
 await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, отгадай ее");
 const randomNumber = Math.floor(Math.random() * 10);
 chats[chatId] = randomNumber
 return bot.sendMessage(chatId, "Отгадай число", gameOptions)
}
```
7. Проверяем работоспособность в телеграм-боте.
8. Продублировав массивы в inline_keyboard этих кнопок у нас появиться столько же.



## 10. Слушатель кнопок.
1. Для каждой кнопки создадим уникальную callback_data
```javascript
const gameOptions = {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: "Текст кнопки", callback_data: "1"}]
   [{text: "Текст кнопки", callback_data: "2"}]
   [{text: "Текст кнопки", callback_data: "3"}]
   [{text: "Текст кнопки", callback_data: "4"}]
  ]
 })
}
```
2. Для прослушивания событий при нажатии кнопок будем использовать слушатель callback_query.
3. Внутри функции старт создаем еще один bot.on, но теперь первым аргументом будет "callback_query".
4. Вторым параметром прилетает callback с сообщением. И выведем это сообщение в логи.
```javascript
bot.on("callback_query", msg => {
 console.log(msg)
})
```
5. В логах у нас появляется объект со свойством data. В нем так же есть информация о самом сообщение кто его отправил в каком чате оно находится и с этим так же можно работать.
```javascript
{
  id: '3541735173846098879',
  from: {
    id: 824624480,
    is_bot: false,
    first_name: 'whymiky',
    username: 'whymiky',
    language_code: 'ru'
  },
  message: {
    message_id: 681,
    from: {
      id: 6510839183,
      is_bot: true,
      first_name: 'APL_football_news',
      username: 'apl_footballBot'
    },
    chat: {
      id: 824624480,
      first_name: 'whymiky',
      username: 'whymiky',
      type: 'private'
    },
    date: 1717084862,
    text: 'Отгадай число',
    reply_markup: { inline_keyboard: [Array] }
  },
  chat_instance: '8115981633004417574',
  data: 'qwqwqwqwqwqwqw'
}
```
6. Для удобаства вытащим необходимые нам поля. Это поля data и chatId.
7. Далее после того как пользователь нажал на кнопку отправим ему сообщение с информацией "Ты выбрал цифру ${data}".
```javascript
bot.on("callback_query", msg => {
 const data = msg.data;
 const chatId = msg.message.chat.id;
 bot.sendMessage(chatId, `ты выбрал цифру ${data}`)
})
```
8. Поправляем текст внутри кнопок.
```javascript
const gameOptions = {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: "1", callback_data: "1"}]
   [{text: "2", callback_data: "2"}]
   [{text: "3", callback_data: "3"}]
   [{text: "4", callback_data: "4"}]
  ]
 })
}
```
9. Проверяем работоспособность в телеграм-боте.


## 11. Кастомная клавиатура.
1. Каждый вложенный массив - это отдельная строка. Сколько в эту строку мы кнопок засунем, столько кнопок и будет отображаться в телеграм.
2. Сделаем клавиатуру как на калькуляторе. По три цифры в ряд и внизу будет 0.
```javascript
const gameOptions = {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: "1", callback_data: "1"}, {text: "2", callback_data: "2"}, {text: "3", callback_data: "3"}],
   [{text: "4", callback_data: "4"}, {text: "5", callback_data: "5"}, {text: "6", callback_data: "6"}],
   [{text: "7", callback_data: "7"}, {text: "8", callback_data: "8"}, {text: "9", callback_data: "9"}],
   [{text: "0", callback_data: "0"}],
  ]
 })
}
```
3. Теперь нам нужно проверять угадал ли пользователь цифру. В дате нам возвращается цифра от пользователя. Ее нам необходимо сравнить с цифрой которая лежит в объекте по ключу chatId.
4. Если они равны будем отправлять пользователю сообщение что он угадал.
5. Обратным условием будет неотгаданная цифра.
```javascript
bot.on("callback_query", async msg => {
 const data = msg.data;
 const chatId = msg.message.chat.id;
 if(data === chats[chatId]){
  return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`)
 }else{
  return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`)
 }
})
```


## 12. Финальная часть логики игры. 
1. Загадывание кнопки при каждом новом нажатии.
2. Для реализации этого создадим новую клавиатуру againOptions.
3. В нем будет массив с одной единственной кнопкой "Играть еще раз".
```javascript
const againOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: "играть еще раз", callback_data: "/again"}]
    ]
  })
}
```
4. Как callback_data укажем команду "/again".
5. Далее отправляем эту клавиатуру в двух сообщениях.
```javascript
bot.on("callback_query", async msg => {
 const data = msg.data;
 const chatId = msg.message.chat.id;
 if(data == chats[chatId]){
  return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
 }else{
  return bot.sendMessage(chatId, `К сожалению ты не отгадал, бот загадал цифру ${chats[chatId]}`, againOptions)
 }
})
```
6. Обработаем команду /again внутри callback_query.
7. Создаем условие if(data === "/again") в котором нам будет необходимо заново генерировать число.
8. Вынесем логику генерации числа в отдельную функцию. Функцию назовем startGame. Это будет стрелочная асинхронная функция.
9. Параметром она будет принимать id чата.
10. Поместим в функцию логику из if(data === "/game").
11. Поменяем return на await.
```javascript
const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, отгадай ее");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай число", gameOptions);
}
```
12. Вызываем функцию в нужных местах.
```javascript
if(text === "/game"){
 return startGame(chatId);
}
```
```javascript
if(data === "/again"){
 return startGame(chatId);
}
```
13. Проверяем работоспособность в телеграм-боте.



## 13. Выносим опции для кнопок в отдельный файл.
1. Создаем файл options.js 
2. Внутри файла options делаем экспорты.
3. Из index вырезаем все опции.
4. Меняем константы на поля объекта, который будем экспортировать.
```javascript
module.exports = {
gameOptions: {
 reply_markup: JSON.stringify({
  inline_keyboard: [
   [{text: "1", callback_data: "1"}, {text: "2", callback_data: "2"}, {text: "3", callback_data: "3"}],
   [{text: "4", callback_data: "4"}, {text: "5", callback_data: "5"}, {text: "6", callback_data: "6"}],
   [{text: "7", callback_data: "7"}, {text: "8", callback_data: "8"}, {text: "9", callback_data: "9"}],
   [{text: "0", callback_data: "0"}],
  ]
 })
},
againOptions: {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{text: "играть еще раз", callback_data: "/again"}]
    ]
  })
}
}
```
5. Импортируем опции в файл index. В импорте делаем деструктуризацию и достаем необходимые поля.
```javascript
const {gameOptions, againOptions} = require("./options");
```


## 14. Заливаем проект на Github.
1. Создаем в проекте файл gitignore перед заливкой проекта на Git.
2. Туда помещаем: /node_modules и папку .idea
3. Создаем новый репозиторий на Github
4. Инициализируем проект: git init
5. Проиндексируем проект: git add .
6. Делаем первый коммит: git commit -m "init"
7. Добавляем ссылку на удаленный репозиторий: git remote add origin https://github.com/"ваш проект"
8. Заливаем проект: git push origin master


## 15. Деплоим бота на selectel.