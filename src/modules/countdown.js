"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCountdownJob = exports.generateCountdownEmbed = void 0;
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("../config");
const storage_1 = require("../storage");
const generateCountdownEmbed = () => {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('Esemény Visszaszámláló')
        .setColor('#ff9900');
    const now = new Date();
    let description = '';
    for (const event of config_1.config.countdownEvents) {
        const diff = event.date.getTime() - now.getTime();
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            description += `**${event.name}**\n${days} nap, ${hours} óra van hátra.\n_${event.description}_\n\n`;
        }
        else {
            description += `**${event.name}**\nAz esemény már elkezdődött vagy véget ért!\n\n`;
        }
    }
    if (!description) {
        description = 'Jelenleg nincsenek közelgő események.';
    }
    embed.setDescription(description);
    return embed;
};
exports.generateCountdownEmbed = generateCountdownEmbed;
const setupCountdownJob = (client) => {
    // Run every hour
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log('Running countdown job...');
        try {
            const channel = await client.channels.fetch(config_1.config.countdownChannelId);
            if (!channel) {
                console.error('Countdown channel not found!');
                return;
            }
            const embed = (0, exports.generateCountdownEmbed)();
            const messageId = storage_1.storage.getCountdownMessageId();
            if (messageId) {
                try {
                    const message = await channel.messages.fetch(messageId);
                    await message.edit({ embeds: [embed] });
                    return;
                }
                catch (e) {
                    console.log('Pinned countdown message not found, creating new one...');
                }
            }
            const newMessage = await channel.send({ embeds: [embed] });
            // Pin the new message
            await newMessage.pin();
            storage_1.storage.setCountdownMessageId(newMessage.id);
        }
        catch (error) {
            console.error('Error in countdown job:', error);
        }
    });
};
exports.setupCountdownJob = setupCountdownJob;
//# sourceMappingURL=countdown.js.map