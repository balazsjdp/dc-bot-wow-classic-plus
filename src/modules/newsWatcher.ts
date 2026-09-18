import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import cron from 'node-cron';
import Parser from 'rss-parser';
import { config } from '../config';
import { storage } from '../storage';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
    }
});

export const setupNewsWatcher = (client: Client) => {
    const checkNews = async () => {
        console.log('Running news watcher...');
        try {
            const channel = await client.channels.fetch(config.newsChannelId) as TextChannel;
            if (!channel) {
                console.error('News channel not found!');
                return;
            }

            for (const feedConfig of config.rssFeeds) {
                const feed = await parser.parseURL(feedConfig.url);
                // Megfordítjuk a listát, hogy a legrégebbi poszt menjen be először a Discordra,
                // így a legújabb lesz legalul (kronológiailag helyes sorrend)
                const itemsToProcess = [...feed.items].reverse();
                
                for (const item of itemsToProcess) {
                    const id = item.guid || item.link || item.title;
                    if (!id) continue;

                    const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
                    
                    // Szűrés: csak a tegnapi (vagy annál frissebb) posztokat engedjük át
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    yesterday.setHours(0, 0, 0, 0); // Tegnap éjfél

                    if (pubDate < yesterday) {
                        // Ha régebbi mint tegnap éjfél, megjelöljük olvasottként (hogy ne dolgozzuk fel újra) és átugorjuk
                        if (!storage.isNewsSeen(id)) {
                            storage.markNewsSeen(id, feedConfig.name);
                        }
                        continue;
                    }

                    if (!storage.isNewsSeen(id)) {
                        storage.markNewsSeen(id, feedConfig.name);

                        // Tisztítjuk a Wowhead "Continue reading »" sallangot a szöveg végéről
                        let cleanSnippet = item.contentSnippet || '';
                        const continueReadingIndex = cleanSnippet.indexOf('Continue reading');
                        if (continueReadingIndex !== -1) {
                            cleanSnippet = cleanSnippet.substring(0, continueReadingIndex).trim();
                        }

                        if (cleanSnippet.length > 500) {
                            cleanSnippet = cleanSnippet.substring(0, 500) + '...';
                        }
                        if (cleanSnippet === '') {
                            cleanSnippet = '*Csak média vagy rövid link. (Kattints a címre a megtekintéshez)*';
                        }

                        const embed = new EmbedBuilder()
                            .setTitle(item.title ? (item.title.length > 250 ? item.title.substring(0, 250) + '...' : item.title) : 'Új hír')
                            .setURL(item.link || null)
                            .setAuthor({
                                name: item.creator || item.author || 'Wowhead',
                                iconURL: 'https://wow.zamimg.com/images/logos/wh-logo.png'
                            })
                            .setDescription(cleanSnippet)
                            .setFooter({
                                text: `Forrás: ${feedConfig.name}`,
                                iconURL: 'https://assets.stickpng.com/images/5a576a4d1c992a034569ab75.png'
                            })
                            .setTimestamp(item.pubDate ? new Date(item.pubDate) : new Date())
                            .setColor('#D4AF37'); // Wowhead arany szín

                        await channel.send({ embeds: [embed] });
                    }
                }
            }
        } catch (error) {
            console.error('Error in news watcher:', error);
        }
    };

    // Futtatás indításkor azonnal
    checkNews();

    // Utána 15 percenként
    cron.schedule('*/15 * * * *', checkNews);
};
