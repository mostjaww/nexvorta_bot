const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("task")
    .setDescription("Menampilkan task sesuai role kamu"),

  async execute(interaction) {
    const tasksData = JSON.parse(fs.readFileSync("./data/tasks.json", "utf8"));

    const roles = interaction.member.roles.cache.map((role) => role.name);
    const foundRole = roles.find((role) => tasksData[role]);

    if (!foundRole) {
      return interaction.reply({
        content: "Kamu tidak memiliki role dengan task.",
        ephemeral: true,
      });
    }

    const tasks = tasksData[foundRole];

    if (tasks.length === 0) {
      return interaction.reply({
        content: "Belum ada task untuk role kamu.",
        ephemeral: true,
      });
    }

    const taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x00aeff)
      .setTitle(`📋 ${foundRole} Tasks`)
      .setDescription(taskList);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
