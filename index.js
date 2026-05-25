require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize interaction handler (this sets up all features and routes interactions)
require('./handlers/interactionHandler')(client);

// Handle message creation for sticky message repositioning
const { repositionStickyMessage } = require('./features/stickySystem');
const { ignoreStickyReset } = require('./features/stickySystem');

client.on(Events.MessageCreate, async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Reposition sticky messages when a new message is posted
    await repositionStickyMessage(message.channel);
});

client.on(Events.MessageDelete, async (message) => {
    // Handle sticky message deletion if needed
    if (message.channel) {
        await repositionStickyMessage(message.channel);
    }
});

client.once(Events.ClientReady, () => {
    console.log(`✅ ${client.user.tag} is online`);
});

client.on('error', (error) => {
    console.error('Client error:', error);
});

client.on('warn', (warning) => {
    console.warn('Client warning:', warning);
});

client.login(process.env.TOKEN);