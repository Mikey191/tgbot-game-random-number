const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require("./options")
const token = "6510839183:AAGStOVZPZLvT9Vzlb4zdxL2G-VnuyJfmVc";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, отгадай ее");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадай число", gameOptions);
};

function start() {
  //установка команд отдельно
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветсвие" },
    { command: "/info", description: "Информация о пользователе" },
    { command: "/game", description: "Игра" },
  ]);

  //слушатель событий
  bot.on("message", async (msg) => {
    text = msg.text;
    chatId = msg.chat.id;
    console.log(msg);
    // start command
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "CAACAgIAAxkBAAICi2ZYnfBKGUBB6rRs9eJ4_ZdCeU6PAAIdDwACYSlAS72q__scGOuQNQQ"
      );
      return bot.sendMessage(chatId, `Welcome home, brrrr`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю");
  });

  bot.on("callback_query", (msg) => {
    data = msg.data;
    chatId = msg.message.chat.id;
    if (data == "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `ты отгадал цифру ${data}`, againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `ты не отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
}

start();
