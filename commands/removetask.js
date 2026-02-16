const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removetask")
    .setDescription("Menghapus task berdasarkan nomor")
    .addStringOption((option) =>
      option.setName("role").setDescription("Nama role").setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName("number").setDescription("Nomor task").setRequired(true),
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "Kamu tidak memiliki permission.",
        ephemeral: true,
      });
    }

    const role = interaction.options.getString("role");
    const number = interaction.options.getInteger("number");

    const path = require("path");
    const filePath = path.join(__dirname, "..", "data", "tasks.json");

    const tasksData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!tasksData[role]) {
      return interaction.reply({
        content: "Role tidak ditemukan.",
        ephemeral: true,
      });
    }

    if (!tasksData[role][number - 1]) {
      return interaction.reply({
        content: "Nomor task tidak valid.",
        ephemeral: true,
      });
    }

    tasksData[role].splice(number - 1, 1);

    fs.writeFileSync(filePath, JSON.stringify(tasksData, null, 2));

    await interaction.reply({
      content: `Task nomor ${number} berhasil dihapus.`,
      ephemeral: true,
    });
  },
};
