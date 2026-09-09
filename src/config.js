"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    discordToken: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    newsChannelId: process.env.NEWS_CHANNEL_ID || '',
    countdownChannelId: process.env.COUNTDOWN_CHANNEL_ID || '',
    rssFeeds: [
        { name: 'Wowhead Classic', url: 'https://www.wowhead.com/classic/news/rss/all' },
        // Add more feeds here
    ],
    countdownEvents: [
        { name: 'BlizzCon 2026', date: new Date('2026-09-12T00:00:00Z'), description: 'BlizzCon 2026 event' }
    ]
};
//# sourceMappingURL=config.js.map