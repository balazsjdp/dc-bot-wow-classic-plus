"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNewsWatcher = void 0;
const discord_js_1 = require("discord.js");
const node_cron_1 = __importDefault(require("node-cron"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const config_1 = require("../config");
const storage_1 = require("../storage");
const parser = new rss_parser_1.default();
const setupNewsWatcher = (client) => {
    // Run every 15 minutes
    node_cron_1.default.schedule('*/15 * * * *', async () => {
        console.log('Running news watcher...');
        try {
            const channel = await client.channels.fetch(config_1.config.newsChannelId);
            if (!channel) {
                console.error('News channel not found!');
                return;
            }
            for (const feedConfig of config_1.config.rssFeeds) {
                const feed = await parser.parseURL(feedConfig.url);
                for (const item of feed.items) {
                    const id = item.guid || item.link || item.title;
                    if (!id)
                        continue;
                    if (!storage_1.storage.isNewsSeen(id)) {
                        storage_1.storage.markNewsSeen(id, feedConfig.name);
                        const embed = new discord_js_1.EmbedBuilder()
                            .setTitle(item.title || 'Új hír')
                            .setURL(item.link || null)
                            .setDescription(item.contentSnippet ? item.contentSnippet.substring(0, 200) + '...' : 'Nincs tartalom')
                            .setFooter({ text: `Forrás: ${feedConfig.name}` })
                            .setTimestamp(item.pubDate ? new Date(item.pubDate) : new Date())
                            .setColor('#0099ff');
                        await channel.send({ embeds: [embed] });
                    }
                }
            }
        }
        catch (error) {
            console.error('Error in news watcher:', error);
        }
    });
};
exports.setupNewsWatcher = setupNewsWatcher;
//# sourceMappingURL=newsWatcher.js.map