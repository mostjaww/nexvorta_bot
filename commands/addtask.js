const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addtask")
    .setDescription("Menambahkan task ke role tertentu")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Pilih role")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option.setName("task").setDescription("Isi task").setRequired(true),
    ),

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();

    const roles = interaction.guild.roles.cache
      .filter((role) => role.name !== "@everyone")
      .map((role) => role.name);

    const filtered = roles
      .filter((role) => role.toLowerCase().includes(focusedValue.toLowerCase()))
      .slice(0, 25); // max 25 pilihan

    await interaction.respond(
      filtered.map((role) => ({ name: role, value: role })),
    );
  },

  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "Kamu tidak memiliki permission.",
        ephemeral: true,
      });
    }

    const role = interaction.options.getString("role");
    const task = interaction.options.getString("task");

    const filePath = path.join(__dirname, "..", "data", "tasks.json");
    const tasksData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!tasksData[role]) {
      tasksData[role] = [];
    }

    tasksData[role].push(task);

    fs.writeFileSync(filePath, JSON.stringify(tasksData, null, 2));

    await interaction.reply({
      content: `Task berhasil ditambahkan ke ${role}.`,
      ephemeral: true,
    });
  },
};
