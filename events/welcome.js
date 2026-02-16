const { EmbedBuilder } = require('discord.js');

module.exports = (client) => {

    client.on('guildMemberAdd', async (member) => {

        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle("🎉 Welcome to Nexvorta Apps!")
            .setDescription(`Halo ${member} 👋\n\nSelamat datang di server Nexvorta Apps! 🚀`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `Member ke-${member.guild.memberCount}` })
            .setTimestamp();

        channel.send({ embeds: [embed] });
    });

};
