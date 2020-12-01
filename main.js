const Discord = require('discord.js');
const client = new Discord.Client();
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();
const experience = new Discord.Collection();
const level = new Discord.Collection();
const PREFIX = '.';
const welcome = require('./bot_welcome')
const counter = require('./bot_counter')



//-----------------------------------------------------------------------------------------------------------------------------------------------------
// THIS IS BLOCK OF CODE RETURNS THE VALUE OF THE REQUESTED BLOCK OF CODES BELOW
//-----------------------------------------------------------------------------------------------------------------------------------------------------



// THIS IS BLOCK OF CODE IS AUTO UPDATING YOUR BALANCE
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(currency, 'add', {
                /* eslint-disable-next-line func-name-matching */
                value: async function add(id, amount) {
                        const user = currency.get(id);
                        if (user) {
                                user.balance += Number(amount);
                                return user.save();
                        }
                        const newUser = await Users.create({ user_id: id, balance: amount });
                        currency.set(id, newUser);
                        return newUser;
                },
        });

// THIS IS BLOCK OF CODE RETURNS THE VALUE OF YOUR CURRENT BALANCE
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(currency, 'getBalance', {
                /* eslint-disable-next-line func-name-matching */
                value: function getBalance(id) {
                        const user = currency.get(id);
                        return user ? user.balance : 0;
                },
        });

// THIS IS BLOCK OF CODE IS AUTO UPDATING YOUR EXP
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(experience, 'add', {
                /* eslint-disable-next-line func-name-matching */
                value: async function add(id, amount) {
                        const user = experience.get(id);
                        if (user) {
                                user.exp += Number(amount);
                                return user.save();
                        }
                        const newUser = await Users.create({ user_id: id, exp: amount });
                        currency.set(id, newUser);
                        return newUser;
                },
        });

// THIS IS BLOCK OF CODE RETURNS THE VALUE OF YOUR CURRENT EXP
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(experience, 'getExp', {
                /* eslint-disable-next-line func-name-matching */
                value: function getExp(id) {
                        const user = experience.get(id);
                        return user ? user.exp : 0;
                },
        });

// THIS IS BLOCK OF CODE IS AUTO UPDATING YOUR LEVEL
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(level, 'add', {
                /* eslint-disable-next-line func-name-matching */
                value: async function add(id, amount) {
                        const user = level.get(id);
                        if (user) {
                                user.level += Number(amount);
                                return user.save();
                        }
                        const newUser = await Users.create({ user_id: id, level: amount });
                        level.set(id, newUser);
                        return newUser;
                },
        });

// THIS IS BLOCK OF CODE RETURNS THE VALUE OF YOUR CURRENT LEVEL
//-----------------------------------------------------------------------------------------------------------------------------------------------------
        Reflect.defineProperty(level, 'getLevel', {
                /* eslint-disable-next-line func-name-matching */
                value: function getLevel(id) {
                        const user = level.get(id);
                        return user ? user.level : 0;
                },
        });
//------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------
// THIS BLOCK OF CODE WILL APPEAR IN CMD IF THE CODE HAS BEEN SUCCESSFULLY BUILD
//------------------------------------------------------------------------------------------------------------------------------------------------------
client.once('ready',async () => {
        
        const storedBalances = await Users.findAll();
        storedBalances.forEach(b => currency.set(b.user_id, b));

        const storedExp = await Users.findAll();
        storedExp.forEach(b => experience.set(b.user_id, b));

        const storedLevel = await Users.findAll();
        storedExp.forEach(b => level.set(b.user_id, b));

    console.log(`Logged in as ${client.user.tag}!`);
        
    welcome(client)
    counter(client)
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'VS Code',
            type: 'PLAYING',
        }
    })
});
client.once('reconnecting', () => {
        console.log('Reconnecting!');
       });
client.once('disconnect', () => {
        console.log('Disconnect!');
       });
//-------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------------------------------------------------
// THIS BLOCK OF CODE EARNS MONEY AND EXP BY CHATTING 
//------------------------------------------------------------------------------------------------------------------------------------------------------
client.on('message', async message => {
	if (message.author.bot) return;
        currency.add(message.author.id, +1);
        if (message.author.bot) return;
        experience.add(message.author.id, +1);

//-------------------------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------

	if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
        const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
        

        // -------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES GETS THE USERS BALANCE
        // -------------------------------------------------------------------------------------------------------------------
	if (command === 'balance') {
        
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(`${target.tag} has ${currency.getBalance(target.id,2)}💵`);
        // -------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES GETS THE USERS LEVEL AND EXPERIENCE
        // -------------------------------------------------------------------------------------------------------------------
        }else if (command === 'exp') {
        
                const target = message.mentions.users.first() || message.author;
                return message.channel.send(`${target.tag} is Level ${level.getLevel(target.id)} and has ${experience.getExp(target.id)} Experience Points!`);
        // -------------------------------------------------------------------------------------------------------------------
        //THIS BLOCK OF CODES CHECK THE USERS INVERTORY
        // -------------------------------------------------------------------------------------------------------------------        
	} else if (command === 'inventory') {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
        return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES TRANSFER COINS FROM ONE USER TO ANOTHER
        // --------------------------------------------------------------------------------------------------------------------
	} else if (command === 'transfer') {
        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = message.mentions.users.first();
                if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
                if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

                currency.add(message.author.id, -transferAmount);
                currency.add(transferTarget.id, transferAmount);

        return message.channel.send(`Successfully transferred ${transferAmount}💵 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💵`);
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES IS FOR ADMIN USE ONLY THAT GIVES COIN TO A CERTAIN USER
        // --------------------------------------------------------------------------------------------------------------------
	} else if (command === 'addgold') {
                if(message.member.roles.cache.has('781345194045210634')){
                        const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
                        const transferTarget = message.mentions.users.first();
                        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                        currency.add(transferTarget.id, transferAmount);
                        return message.channel.send(`${transferAmount}💵 Successfully added to ${transferTarget.tag}.`);
                }else{
                        return message.channel.send(`Sorry! You dont have a permission to access this command !`);
                }
                // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES IS FOR ADMIN USE ONLY THAT GIVES COIN TO A CERTAIN USER
        // --------------------------------------------------------------------------------------------------------------------
	} else if (command === 'addexp') {
                if(message.member.roles.cache.has('781345194045210634')){
                        const transferAmount = commandArgs.split(/ +/g).find(arg => !/<@!?\d+>/g.test(arg));
                        const transferTarget = message.mentions.users.first();
                        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
                        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);
                        experience.add(transferTarget.id, transferAmount);
                        return message.channel.send(`${transferAmount}exp Successfully added to ${transferTarget.tag}.`);
                }else{
                        return message.channel.send(`Sorry! You dont have a permission to access this command !`);
                }
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES LETS YOU BUY ITEMS FROM THE SHOP
        //---------------------------------------------------------------------------------------------------------------------
	} else if (command === 'buy') {
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: commandArgs } } });

        if (!item) return message.channel.send(`That item doesn't exist.`);

        if (item.cost > currency.getBalance(message.author.id)) {
	        return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
        }
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        currency.add(message.author.id, -item.cost);
        await user.addItem(item);

        message.channel.send(`You've bought: ${item.name}.`);
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES LETS YOU ACCESS THE SHOP
        // --------------------------------------------------------------------------------------------------------------------
	} else if (command === 'shop') {
        const items = await CurrencyShop.findAll();
        return message.channel.send(items.map(item => `${item.name}: ${item.cost}💵`).join('\n'), { code: true });
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES SHOW THE LEADERBOARD OF CURRENCY
        //---------------------------------------------------------------------------------------------------------------------
	} else if (command === 'cleaderboard') {
        
        return message.channel.send(
            currency.sort((a, b) => b.balance - a.balance)
                .filter(user => client.users.cache.has(user.user_id))
                .first(10)
                .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💵`)
                .join('\n'),
            { code: true }
        );
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES SHOW THE LEADERBOARD OF EXPERIENCE
        //---------------------------------------------------------------------------------------------------------------------
	} else if (command === 'eleaderboard') {
        
                return message.channel.send(
                    experience.sort((a, b) => b.exp - a.exp)
                        .filter(user => client.users.cache.has(user.user_id))
                        .first(10)
                        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.exp}`)
                        .join('\n'),
                    { code: true }
                ); 
        // --------------------------------------------------------------------------------------------------------------------
        // THIS BLOCK OF CODES SHOW THE LEADERBOARD OF LEVELS
        //---------------------------------------------------------------------------------------------------------------------
	} else if (command === 'lleaderboard') {
        
                return message.channel.send(
                    experience.sort((a, b) => b.level - a.level)
                        .filter(user => client.users.cache.has(user.user_id))
                        .first(10)
                        .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.level}`)
                        .join('\n'),
                    { code: true }
                );
        // --------------------------------------------------------------------------------------------------------------------
        // CONVERTS EXP TO LEVEL (GAINS ROLE AFTER HIT A CERTAIN LEVEL)
        //---------------------------------------------------------------------------------------------------------------------
	} else if (command === 'lvlup') {
                const user = await Users.findOne({ where: { user_id: message.author.id } }); 
                const role01 = message.guild.roles.cache.get('781359461708070954')
                const role02 = message.guild.roles.cache.get('781359459166715914')
                const role03 = message.guild.roles.cache.get('781359455857803294')
                const role04 = message.guild.roles.cache.get('781359453131636766')
                const role05 = message.guild.roles.cache.get('781359450069663786')
                const role06 = message.guild.roles.cache.get('781359447528046642')
                const role07 = message.guild.roles.cache.get('781362502918602752')
                const role08 = message.guild.roles.cache.get('781359444586922014')
                const role09 = message.guild.roles.cache.get('781359441504370698')
                const role10 = message.guild.roles.cache.get('781359437780746300')
                if (experience.getExp(message.author.id) >= 1000) {
                        if(level.getLevel(message.author.id) === 9){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.add(role01)
                                message.channel.send(`Congratulations on reaching level 10!`); 
                        }else if (level.getLevel(message.author.id) === 19){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role01)
                                await message.member.roles.add(role02)
                                message.channel.send(`Congratulations on reaching level 20!`);
                        }else if (level.getLevel(message.author.id) === 29){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role02)
                                await message.member.roles.add(role03)
                                message.channel.send(`Congratulations on reaching level 30!`);
                        }else if (level.getLevel(message.author.id) === 39){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role03)
                                await message.member.roles.add(role04)
                                message.channel.send(`Congratulations on reaching level 40!`);
                        }else if (level.getLevel(message.author.id) === 49){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role04)
                                await message.member.roles.add(role05)
                                message.channel.send(`Congratulations on reaching level 50!`);
                        }else if (level.getLevel(message.author.id) === 59){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role05)
                                await message.member.roles.add(role06)
                                message.channel.send(`Congratulations on reaching level 60!`);
                        }else if (level.getLevel(message.author.id) === 69){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role06)
                                await message.member.roles.add(role07)
                                message.channel.send(`Congratulations on reaching level 70!`);
                        }else if (level.getLevel(message.author.id) === 79){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role07)
                                await message.member.roles.add(role08)
                                message.channel.send(`Congratulations on reaching level 80!`);
                        }else if (level.getLevel(message.author.id) === 89){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role08)
                                await message.member.roles.add(role09)
                                message.channel.send(`Congratulations on reaching level 90!`);
                        }else if (level.getLevel(message.author.id) === 99){
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                await message.member.roles.remove(role09)
                                await message.member.roles.add(role10)
                                message.channel.send(`Congratulations on reaching level 100!`);
                        }else{
                                await experience.add(message.author.id, -1000);
                                await level.add(message.author.id, +1);
                                message.channel.send(`Congratulations on leveling up!`);       
                        }   
                }else{
                        return message.channel.send(`You currently have ${experience.getExp(message.author.id)}, but leveling up costs 1000exp!`);   
                }
                
        } 
        //-----------------------------------------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------------------------------------
});

client.login(process.env.TOKEN);

// THIS BOT IS CREATED BY GINO TORALBA EST (11/29/2020)
// THE BOT NAME IS AINCRAD (FROM SWORD ART ONLINE)
// I DO NOT OWN OR HAVE PERMISSION TO DISTRIBUTE ITS NAME
// I WILL MAKE IT PUBLIC IF I ALREADY HAVE THE PERFECT NAME FOR IT AND IT HAS THE 5 FUNCTIONS I WANT