const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Menampilkan task sesuai role kamu"),

  async execute(interaction) {

    const tasksData = JSON.parse(
      fs.readFileSync("./data/tasks.json", "utf8")
    );

    const roles = interaction.member.roles.cache.map(role => role.name);

    let foundRole = roles.find(role => tasksData[role]);

    if (!foundRole) {
      return interaction.reply({
        content: "Role tidak ditemukan.",
        ephemeral: true
      });
    }

    const tasks = tasksData[foundRole]
      .map(task => `• ${task}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x00AEFF)
      .setTitle(`📋 ${foundRole} Tasks`)
      .setDescription(tasks);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
