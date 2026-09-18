import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { generateCountdownEmbed } from '../modules/countdown';

export const countdownCommand = {
    data: new SlashCommandBuilder()
        .setName('countdown')
        .setDescription('Megmutatja a közelgő World of Warcraft: Forever események visszaszámlálóját.'),
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = generateCountdownEmbed();
        await interaction.reply({ embeds: [embed] });
    },
};
