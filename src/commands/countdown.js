"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countdownCommand = void 0;
const discord_js_1 = require("discord.js");
const countdown_1 = require("../modules/countdown");
exports.countdownCommand = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Megmutatja a közelgő WoW Classic+ események visszaszámlálóját.'),
    async execute(interaction) {
        const embed = (0, countdown_1.generateCountdownEmbed)();
        await interaction.reply({ embeds: [embed] });
    },
};
//# sourceMappingURL=countdown.js.map