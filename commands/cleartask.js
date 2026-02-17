const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cleartask")
    .setDescription("Menghapus semua task pada role tertentu")
    .addStringOption(option =>
      option.setName("role")
        .setDescription("Pilih role")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {

    const focusedValue = interaction.options.getFocused();

    const roles = interaction.guild.roles.cache
      .filter(role => role.name !== "@everyone")
      .map(role => role.name);

    const filtered = roles.filter(role =>
      role.toLowerCase().includes(focusedValue.toLowerCase())
    ).slice(0, 25);

    await interaction.respond(
      filtered.map(role => ({ name: role, value: role }))
    );
  },

  async execute(interaction) {

    // Hanya admin
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({
        content: "Kamu tidak memiliki permission.",
        ephemeral: true
      });
    }

    const role = interaction.options.getString("role");

    const filePath = path.join(__dirname, "..", "data", "tasks.json");
    const tasksData = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (!tasksData[role] || tasksData[role].length === 0) {
      return interaction.reply({
        content: `Tidak ada task untuk role ${role}.`,
        ephemeral: true
      });
    }

    const totalDeleted = tasksData[role].length;

    tasksData[role] = [];

    fs.writeFileSync(filePath, JSON.stringify(tasksData, null, 2));

    await interaction.reply({
      content: `✅ Berhasil menghapus ${totalDeleted} task dari role ${role}.`,
      ephemeral: true
    });
  }
};
