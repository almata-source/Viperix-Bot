const { Events, PermissionFlagsBits } = require('discord.js');
const { loadStickyMessages, saveStickyMessages } = require('../utils/fileManager');

let stickyMessages = {};
const stickyResetChannels = new Set();
const repositionLocks = new Set();
const restoreLocks = new Set();

function ignoreStickyReset(channelId) {
    stickyResetChannels.add(channelId);
    setTimeout(() => stickyResetChannels.delete(channelId), 2000);
}

function buildSendOptions(sticky) {
    const sendOptions = {};
    if (sticky.content) sendOptions.content = sticky.content;
    if (sticky.components) {
        sendOptions.components = sticky.components;
        sendOptions.flags = 32768;
    }
    return sendOptions;
}

async function repositionStickyMessage(channel) {
    const channelId = channel.id;
    if (repositionLocks.has(channelId)) return; // already repositioning
    repositionLocks.add(channelId);
    restoreLocks.add(channelId);
    try {
        const sticky = stickyMessages[channelId];
        if (!sticky) return;

        const existing = await channel.messages.fetch(sticky.messageId).catch(() => null);
        if (existing) {
            // mark channel to ignore the delete-triggered restore
            ignoreStickyReset(channelId);
            await existing.delete().catch(() => {});
        }

        const sent = await channel.send(buildSendOptions(sticky));
        stickyMessages[channelId] = { ...sticky, messageId: sent.id };
        saveStickyMessages(stickyMessages);
    } finally {
        repositionLocks.delete(channelId);
        restoreLocks.delete(channelId);
    }
}

module.exports = (client) => {
    stickyMessages = loadStickyMessages();

    // MessageDelete event - restore sticky messages
    client.on(Events.MessageDelete, async message => {
        if (!message.guild || stickyResetChannels.has(message.channelId)) return;

        const sticky = stickyMessages[message.channelId];
        if (!sticky || sticky.messageId !== message.id) return;

        const channel = message.channel;
        restoreLocks.add(message.channelId);
        const sent = await channel.send(buildSendOptions(sticky)).catch(() => null);
        restoreLocks.delete(message.channelId);
        if (!sent) return;

        stickyMessages[message.channelId] = { ...sticky, messageId: sent.id };
        saveStickyMessages(stickyMessages);
    });

    // MessageCreate event - reposition sticky messages
    client.on(Events.MessageCreate, async message => {
        // Allow bot messages to trigger repositioning so feature posts (e.g., IG posts)
        // will still cause the sticky to move. Keep guild check.
        if (!message.guild) return;
        if (restoreLocks.has(message.channelId)) return;

        const sticky = stickyMessages[message.channelId];
        if (!sticky) return;
        if (message.id === sticky.messageId) return;

        await repositionStickyMessage(message.channel);
    });

    // Sticky command handler
    const handleStickyCommand = async (interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: "<:9349_nope:1499282529838956544> Only administrators can manage sticky messages.",
                ephemeral: true
            });
        }

        const subcommand = interaction.options.getSubcommand();
        const channel = interaction.channel;

        if (subcommand === 'set') {
            const content = interaction.options.getString('content');
            const existing = stickyMessages[channel.id];

            if (existing?.messageId) {
                ignoreStickyReset(channel.id);
                await channel.messages.fetch(existing.messageId).then(msg => msg.delete()).catch(() => {});
            }

            const sent = await channel.send(content);
            if (interaction.guild.members.me.permissionsIn(channel).has(PermissionFlagsBits.PinMessages)) {
                await sent.pin().catch(() => {});
            }

            stickyMessages[channel.id] = {
                content,
                components: null,
                messageId: sent.id
            };
            saveStickyMessages(stickyMessages);

            return interaction.reply({ content: `<:142557verified:1499282336846708848> Sticky message set for ${channel}.`, ephemeral: true });
        }

        if (subcommand === 'remove') {
            const existing = stickyMessages[channel.id];
            if (!existing) {
                return interaction.reply({
                    content: "<:9349_nope:1499282529838956544> There is no sticky message set for this channel.",
                    ephemeral: true
                });
            }

            ignoreStickyReset(channel.id);
            await channel.messages.fetch(existing.messageId).then(msg => msg.delete()).catch(() => {});
            delete stickyMessages[channel.id];
            saveStickyMessages(stickyMessages);

            return interaction.reply({
                content: `<:142557verified:1499282336846708848> Sticky message removed for ${channel}.`,
                ephemeral: true
            });
        }

        if (subcommand === 'show') {
            const existing = stickyMessages[channel.id];
            if (!existing) {
                return interaction.reply({
                    content: "<:9349_nope:1499282529838956544> No sticky message set for this channel.",
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: `<:770443pin:1508113592673894551> Sticky message for ${channel}:\n${existing.content}`,
                ephemeral: true
            });
        }
    };

    async function setStickyPanel(channel, container) {
        const existing = stickyMessages[channel.id];
        if (existing?.messageId) {
            ignoreStickyReset(channel.id);
            await channel.messages.fetch(existing.messageId).then(msg => msg.delete()).catch(() => {});
        }

        const sendOptions = { components: [container], flags: 32768 };
        const sent = await channel.send(sendOptions);
        if (channel.guild.members.me.permissionsIn(channel).has(PermissionFlagsBits.PinMessages)) {
            await sent.pin().catch(() => {});
        }

        stickyMessages[channel.id] = {
            content: null,
            components: [container],
            messageId: sent.id
        };
        saveStickyMessages(stickyMessages);
        return sent;
    }

    module.exports.repositionStickyMessage = repositionStickyMessage;
    module.exports.ignoreStickyReset = ignoreStickyReset;
    module.exports.handleStickyCommand = handleStickyCommand;
    module.exports.setStickyPanel = setStickyPanel;
};
