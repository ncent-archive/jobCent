const TelegramBot = require('node-telegram-bot-api');
const nCentSDK = require('ncent-sandbox-sdk');
const stellarSDK = require('stellar-sdk')
const utils = require('./db_utils');

sdk = new nCentSDK();
utils.set_up_users_table()
.then(result => {
  console.log('result', result)
})

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

//may want to store the private key locally in future use
const generate_key_pair = () => {
  return sdk.createWalletAddress()
}

const stamp_tokens = (user, numbers) => {
  utils.get_user(user)
  .then(result => {
    new Promise(function(resolve, reject) {
      sdk.stampToken(result.publickey, 'jeffjobCents' + Math.random().toString(), numbers[0], '2021', resolve, reject)
    })
    .then(result => console.log('result', result))
  })
  .catch(err => {
    console.log('err', err)
  })
}

const get_all_balances = (user, chatId) => {
  utils.get_user(user)
  .then(result => {
    new Promise(function(resolve, reject) {
      sdk.getAllBalances(result.publickey, resolve, reject)
    })
    .then((result) => {
      const balances = result.data
      balances.forEach(balance => {
        bot.sendMessage(chatId, 'You have ' + balance.balance + ' of ' + balance.uuid)
      })
    })
  })
  .catch((err) => { console.log('error', err) })
}

const send_to_user = (user, address_to_recieve, amount) => {
  key_pair = null
  utils.get_user(user)
  .then(result => {
    key_pair = stellarSDK.Keypair.fromSecret(result.privatekey)
    new Promise(function(resolve, reject) {
      sdk.getAllBalances(result.publickey, resolve, reject)
    })
    .then((result) => {
      const balances = result.data
      currency_id = balances[0].uuid
      new Promise(function(resolve, reject) {
        sdk.transferTokens(key_pair, address_to_recieve, currency_id, amount, resolve, reject)
      })
      .then(res => console.log('res', res))
      .catch(err => console.log('err', err))
    })
  })
  .catch((err) => { console.log('error', err) })
}

const sendInitialDialogue = (user, chatId) => {
  bot.sendMessage(chatId, `Hello and Welcome ` + user);
  bot.sendMessage(chatId, `- To create a new Wallet say 'new wallet'`);
  bot.sendMessage(chatId, `- To view token balances say 'view balances'`)
  bot.sendMessage(chatId, `- To add jobcent tokens to your account say 'Can I have x jobcents' where x is the number of tokens (REQUIRES ADDRESS BEING SET)`);
  bot.sendMessage(chatId, `- To transfer your jobcent tokens to another account say 'Transfer x jobcents to y' where x is the number of tokens and y is the address you want to send to(REQUIRES ADDRESS BEING SET)`);
}

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const txt = msg.text;
  const user = msg.from.username
  const is_ask = txt.toString().toLowerCase().includes('can i have')
  const includes_jobcent = txt.toString().toLowerCase().includes('jobcent')
  const wants_new_wallet = txt.toString().toLowerCase() === 'new wallet'
  const wants_to_view_balances = txt.toString().toLowerCase() === 'view balances'
  const should_transfer = txt.toString().toLowerCase().includes('transfer')

  const is_ask_of_payment = is_ask && includes_jobcent

  if (is_ask_of_payment) {
    const numbers = txt.match(/\d+/g).map(Number);
    bot.sendMessage(chatId, 'Sure, sending ' + numbers + ' jobcents')
    stamp_tokens(user, numbers)
  } else if (wants_new_wallet) {
    const wallet = generate_key_pair()
    bot.sendMessage(chatId, 'Sure, your new wallet address is ' + wallet.publicKey()  + ' make sure not to lose it :)')
    utils.insert_user(user, wallet.publicKey(), wallet.secret())
  } else if (wants_to_view_balances) {
    get_all_balances(user, chatId)
  } else if (should_transfer) {
    const amount_to_transfer = txt.match(/\d+/g).map(Number)[0];
    const start_of_public_key = txt.indexOf('G')
    const public_key = txt.slice(start_of_public_key)
    bot.sendMessage(chatId, 'Sure, just sent ' + amount_to_transfer + ' jobcents to ' + public_key)
    send_to_user(user, public_key, amount_to_transfer)
  } else {
    sendInitialDialogue(user, chatId)
  } 
}); 