module.exports = (client) => {
    const welcomeID = '781358715550695476' //Welcome ID
    const goodbyeID = '781358752225689610' //Goodbye ID
    const targetChannel1 = '781345073459363860' //Rules and Regulation
    const targetChannel2 = '781346025859842058' // Verification 
    client.on('guildMemberAdd', (member) => {
        console.log(member)
        const message = `Welcome to my Server <@${member.id}>. Please read the ${member.guild.channels.cache
            .get(targetChannel1)
            .toString()} and verify at ${member.guild.channels.cache
            .get(targetChannel2)
            .toString()} !`
        const channel = member.guild.channels.cache.get(welcomeID)
        channel.send(message)
    })
    client.on('guildMemberRemove', (member) => {
        console.log(member)
        const message = `<@${member.id}> has fallen and will never be revived again !`
        const channel = member.guild.channels.cache.get(goodbyeID)
        channel.send(message)
    })
}
