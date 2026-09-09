import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import http from 'http';
import { config } from './config';
import { setupNewsWatcher } from './modules/newsWatcher';
import { setupCountdownJob } from './modules/countdown';
import { countdownCommand } from './commands/countdown';

// Render.com Web Service követelmény: figyelni kell egy HTTP porton, különben a deploy elbukik
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Bot is running!');
    res.end();
}).listen(port, () => {
    console.log(`Dummy HTTP server listening on port ${port} for Render health checks.`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(config.discordToken);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [countdownCommand.data.toJSON()] },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }

    // Start modules
    setupNewsWatcher(client);
    setupCountdownJob(client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === countdownCommand.data.name) {
        await countdownCommand.execute(interaction);
    }
});

client.login(config.discordToken);
