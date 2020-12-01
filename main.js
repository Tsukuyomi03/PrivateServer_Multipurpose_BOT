const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '.';
const counter = require('./bot_counter')

client.once('ready',async () => {
        
    console.log(`Logged in as ${client.user.tag}!`);
        
    counter(client)
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'G COUNTER',
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
client.on('message', async message => {
        if (!message.content.startsWith(PREFIX)) return;
	const input = message.content.slice(PREFIX.length).trim();
	if (!input.length) return;
        const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

        if (command === 'setup') {
                const ServerID = ''
                if(ServerID === ''){
                        return message.channel.send(`PLEASE ENTER YOUR SERVER ID BY USING THE COMMAND SERVER`)
                }
        }else if (command === 'getid') {
                const ID = client.guilds.cache.get()
        }
        
});
const token = 'NzgyNTExMDc4NzU1NDAxNzI5.X8NQOw.iBaab2sDfDm02OuOVhgkRrrm3wY'
client.login(process.env.token)

// G-BOT IS 100% FREE
