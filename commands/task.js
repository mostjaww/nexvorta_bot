const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('task')
        .setDescription('Menampilkan task sesuai role kamu'),

    async execute(interaction) {

        const roles = interaction.member.roles.cache.map(role => role.name);
        let embed;

        if (roles.includes('Programmer')) {
            embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('👨‍💻 Programmer Tasks')
                .setDescription(`
• Fix bug dashboard
• Integrasi API
• Optimasi database
                `);
        }

        else if (roles.includes('UI/UX Design')) {
            embed = new EmbedBuilder()
                .setColor(0xFF69B4)
                .setTitle('🎨 UI/UX Design Tasks')
                .setDescription(`
• Redesign landing page
• Update design system
• Improve mobile UI
                `);
        }

        else if (roles.includes('Administration')) {
            embed = new EmbedBuilder()
                .setColor(0x00FF99)
                .setTitle('🗂 Administration Tasks')
                .setDescription(`
• Update laporan
• Review dokumen
• Follow up client
                `);
        }

        else {
            embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('⚠️ Role Tidak Ditemukan')
                .setDescription('Silakan hubungi admin.');
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
