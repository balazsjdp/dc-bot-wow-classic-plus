"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const newsWatcher_1 = require("./modules/newsWatcher");
const countdown_1 = require("./modules/countdown");
const countdown_2 = require("./commands/countdown");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
    ]
});
client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    // Register slash commands
    const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.config.discordToken);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.clientId), { body: [countdown_2.countdownCommand.data.toJSON()] });
        console.log('Successfully reloaded application (/) commands.');
    }
    catch (error) {
        console.error(error);
    }
    // Start modules
    (0, newsWatcher_1.setupNewsWatcher)(client);
    (0, countdown_1.setupCountdownJob)(client);
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    if (interaction.commandName === countdown_2.countdownCommand.data.name) {
        await countdown_2.countdownCommand.execute(interaction);
    }
});
client.login(config_1.config.discordToken);
//# sourceMappingURL=index.js.map