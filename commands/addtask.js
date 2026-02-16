const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtask")
    .setDescription("Menambahkan task ke role tertentu")
    .addStringOption(option =>
      option.setName("role")
        .setDescription("Nama role")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("task")
        .setDescription("Isi task")
        .setRequired(true)),

  async execute(interaction) {

    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "Kamu tidak memiliki permission.",
        ephemeral: true
      });
    }

    const role = interaction.options.getString("role");
    const task = interaction.options.getString("task");

    const tasksData = JSON.parse(
      fs.readFileSync("./data/tasks.json", "utf8")
    );

    if (!tasksData[role]) {
      return interaction.reply({
        content: "Role tidak ditemukan di sistem.",
        ephemeral: true
      });
    }

    tasksData[role].push(task);

    fs.writeFileSync("./data/tasks.json", JSON.stringify(tasksData, null, 2));

    await interaction.reply({
      content: `Task berhasil ditambahkan ke ${role}.`,
      ephemeral: true
    });
  }
};
