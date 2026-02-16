const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Menampilkan daftar command yang tersedia"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("📘 Nexvorta Bot Commands")
      .setDescription("Berikut adalah command yang tersedia:")
      .addFields(
        {
          name: "🗂 /task",
          value: "Menampilkan task sesuai role kamu",
          inline: false,
        },
        {
          name: "❓ /help",
          value: "Menampilkan daftar command",
          inline: false,
        },
      )
      .setFooter({ text: "Nexvorta Management System 🚀" })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
