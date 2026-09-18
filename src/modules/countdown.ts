import { Client, EmbedBuilder, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { config } from '../config';
import { storage } from '../storage';

export const generateCountdownEmbed = () => {
    const embed = new EmbedBuilder()
        .setTitle('⏳ Közelgő Események')
        .setColor('#FFA500')
        .setThumbnail('https://assets.stickpng.com/images/5a576a4d1c992a034569ab75.png')
        .setFooter({ text: 'World of Warcraft: Forever Visszaszámláló', iconURL: 'https://assets.stickpng.com/images/5a576a4d1c992a034569ab75.png' })
        .setTimestamp();

    const now = new Date();
    let hasEvents = false;

    // TypeScript típus kiegészítés a config miatt
    const events = config.countdownEvents as Array<{name: string, date: Date, description: string, url?: string, image?: string}>;

    for (const event of events) {
        const diff = event.date.getTime() - now.getTime();
        
        hasEvents = true;

        const formattedDate = new Intl.DateTimeFormat('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(event.date);

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            let remaining = '';
            if (days > 0) remaining += `${days} nap `;
            if (hours > 0 || days > 0) remaining += `${hours} óra `;
            remaining += `${minutes} perc`;

            embed.addFields({
                name: `📌 ${event.name}`,
                value: `**Időpont:** ${formattedDate}\n**Hátralévő idő:** ${remaining}\n_${event.description}_`,
                inline: false
            });
        } else {
            embed.addFields({
                name: `✅ ${event.name}`,
                value: `Az esemény már elkezdődött vagy véget ért!\n_${event.description}_`,
                inline: false
            });
        }

        if (event.image) {
            embed.setImage(event.image); // Ha több esemény van, csak az utolsó képét tartja meg, ami egy eseménynél pont jó
        }
    }

    if (!hasEvents) {
        embed.setDescription('Jelenleg nincsenek közelgő események.');
    }

    return embed;
};

export const setupCountdownJob = (client: Client) => {
    const updateCountdown = async () => {
        console.log('Running countdown job...');
        try {
            const channel = await client.channels.fetch(config.countdownChannelId) as TextChannel;
            if (!channel) {
                console.error('Countdown channel not found!');
                return;
            }

            const embed = generateCountdownEmbed();
            const messageId = storage.getCountdownMessageId();

            if (messageId) {
                try {
                    const message = await channel.messages.fetch(messageId);
                    await message.edit({ embeds: [embed] });
                    return;
                } catch (e) {
                    console.log('Pinned countdown message not found, creating new one...');
                }
            }

            const newMessage = await channel.send({ embeds: [embed] });
            // Pin the new message
            await newMessage.pin();
            storage.setCountdownMessageId(newMessage.id);

        } catch (error) {
            console.error('Error in countdown job:', error);
        }
    };

    // Futtatás indításkor azonnal
    updateCountdown();

    // Utána percenként frissít, hogy a HH:MM formátum pontos legyen
    cron.schedule('* * * * *', updateCountdown);
};
