require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // ID server kamu

// ================= REGISTER SLASH COMMAND =================
const commands = [
    new SlashCommandBuilder()
        .setName('task')
        .setDescription('Menampilkan task sesuai role kamu')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('Slash command berhasil didaftarkan.');
    } catch (error) {
        console.error(error);
    }
})();

// === Event ketika bot siap ===

client.once('clientReady', () => {
    console.log(`Bot online sebagai ${client.user.tag}`);
});

// === Event ketika anggota baru bergabung ===

client.on('guildMemberAdd', async (member) => {

    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
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

// ================= TASK COMMAND =================
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'task') {

        const member = interaction.member;
        const roles = member.roles.cache.map(role => role.name);

        let embed;

        if (roles.includes('Programmer')) {
            embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('👨‍💻 Programmer Tasks')
                .setDescription(`
- Fix bug pada dashboard
- Integrasi API export
- Optimasi database
                `);
        }

        else if (roles.includes('UI/UX Design')) {
            embed = new EmbedBuilder()
                .setColor(0xFF69B4)
                .setTitle('🎨 UI/UX Design Tasks')
                .setDescription(`
- Redesign landing page
- Update design system
- Improve mobile responsiveness
                `);
        }

        else if (roles.includes('Administration')) {
            embed = new EmbedBuilder()
                .setColor(0x00FF99)
                .setTitle('🗂 Administration Tasks')
                .setDescription(`
- Update laporan mingguan
- Review dokumen export
- Follow up client email
                `);
        }

        else {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('⚠️ Tidak Ada Role')
                .setDescription('Kamu belum memiliki role yang sesuai.');
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(process.env.TOKEN);
