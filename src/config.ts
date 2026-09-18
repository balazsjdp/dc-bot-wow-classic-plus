import dotenv from 'dotenv';
dotenv.config();

export const config = {
    discordToken: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    newsChannelId: process.env.NEWS_CHANNEL_ID || '',
    countdownChannelId: process.env.COUNTDOWN_CHANNEL_ID || '',
    rssFeeds: [
        { name: 'Wowhead (WoW: Forever)', url: 'https://www.wowhead.com/forever/news/rss/all' },
    ],
    countdownEvents: [
        {
            name: 'World of Warcraft: Forever',
            date: new Date('2026-11-04T23:00:00Z'),
            description: 'A World of Warcraft: Forever hivatalos megjelenése.',
            url: 'https://worldofwarcraft.blizzard.com/en-us/forever',
            image: 'https://imguscdn.gamespress.com/cdn/files/BlizzardLive/2026/09/121553-8b567c06/WoW_Forever_Logo.png?w=276&mode=max&otf=y&quality=90&format=png&bgcolor=transparent&sky=aee8c234b2dab8ebd6fe975d749744a8cdd5ab7b70c93cdabf754222ce7d555d'
        }
    ]
};
