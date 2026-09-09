import dotenv from 'dotenv';
dotenv.config();

export const config = {
    discordToken: process.env.DISCORD_TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    newsChannelId: process.env.NEWS_CHANNEL_ID || '',
    countdownChannelId: process.env.COUNTDOWN_CHANNEL_ID || '',
    rssFeeds: [
        { name: 'Reddit r/classicwow (Camelot)', url: 'https://www.reddit.com/r/classicwow/search.rss?q=Camelot&restrict_sr=1&sort=new' },
    ],
    countdownEvents: [
        { 
            name: 'BlizzCon 2026', 
            date: new Date('2026-09-12T17:30:00Z'), 
            description: 'A hivatalos bejelentések és újdonságok bemutatása a BlizzCon-on.',
            url: 'https://blizzcon.com',
            image: 'https://blz-contentstack-images.akamaized.net/v3/assets/blt4230e1d1d56e7d5e/bltd5479e78a3cb6c18/6903bb6644af3e1081c75d7e/event_header.webp'
        }
    ]
};
