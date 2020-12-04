module.exports = client =>{
    
   
    const channelID1 = '782987136412418078'
    const channelID2 = '782991248251551764'
    const channelID3 = '782991287367630868'
    const channelID4 = '783003069859364894'
    const channelID5 = '784208247212343319'
    const channelID6 = '784208355870769172'
    const channelID7 = '784208464812441630'
    const ServerID = '781344722303189072'
    const updateMembers = guild =>{
        const channel1 = guild.channels.cache.get(channelID1)
        channel1.setName(`TOTAL : ${guild.memberCount}`)
        const channel2 = guild.channels.cache.get(channelID2)
        channel2.setName(`MEMBERS : ${guild.members.cache.filter(m =>!m.user.bot).size}`)
        const channel3 = guild.channels.cache.get(channelID3)
        channel3.setName(`ANDROID : ${guild.members.cache.filter(m =>m.user.bot).size}`)
        const channel4 = guild.channels.cache.get(channelID4)
        channel4.setName(`ONLINE : ${guild.members.cache.filter(m =>(m.presence.status === 'online' || m.presence.status === 'idle') || m.presence.status='dnd').size}`)
        const channel5 = guild.channels.cache.get(channelID5)
        channel5.setName(`OFFLINE : ${guild.members.cache.filter(m =>m.presence.status !== 'online' && m.presence.status !== 'idle' && m.presence.status !== 'dnd').size}`)
        const channel6 = guild.channels.cache.get(channelID6)
        channel6.setName(`IDLE : ${guild.members.cache.filter(m =>m.presence.status === 'idle').size}`)
        const channel7 = guild.channels.cache.get(channelID7)
        channel7.setName(`DND : ${guild.members.cache.filter(m =>m.presence.status === 'dnd').size}`)
    }
    client.on('guildMemberAdd', member => updateMembers(member.guild))
    client.on('guildMemberRemove', member => updateMembers(member.guild))
    const guild = client.guilds.cache.get(ServerID)
    
    updateMembers(guild)
}
