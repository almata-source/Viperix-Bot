// no embeds used; use Components V2 containers across features
const { repositionStickyMessage } = require('../features/stickySystem');

module.exports = (client) => {
    // Import feature modules
    const commandAccessModule = require('../features/commandAccess');
    const stickySystem = require('../features/stickySystem');
    const donatorSystem = require('../features/donatorSystem');
    const teamFinder = require('../features/teamFinder');
    const suggestionSystem = require('../features/suggestionSystem');
    const instagram = require('../features/instagram');
    const selfRole = require('../features/selfRole');
    const voiceJoin = require('../features/voiceJoin');

    // Initialize command access
    commandAccessModule.initCommandAccess();

    // Initialize features (those that need client)
    stickySystem(client);
    donatorSystem(client);
    teamFinder(client);
    suggestionSystem(client);
    instagram(client);
    selfRole(client);
    voiceJoin(client);

    client.on('interactionCreate', async (interaction) => {
        try {
            // SLASH COMMANDS
            if (interaction.isChatInputCommand()) {
                const { commandName } = interaction;

                // Check command access
                if (!commandAccessModule.isCommandAllowed(commandName, interaction.member)) {
                    return interaction.reply({
                        content: "<:9349_nope:1499282529838956544> You don't have permission to use this command.",
                        ephemeral: true
                    });
                }

                // Route to handlers
                if (commandName === 'teamfinderpanel') {
                    await teamFinder.handleTeamFinderPanel(interaction);
                } else if (commandName === 'selfrolepanel') {
                    const category = interaction.options?.getString('category') || 'games';
                    await selfRole.handleSelfRolePanel(interaction, category);
                } else if (commandName === 'donatorsetup') {
                    await donatorSystem.handleDonatorSetup(interaction);
                } else if (commandName === 'suggestpanel') {
                    await suggestionSystem.handleSuggestionPanel(interaction);
                } else if (commandName === 'sticky') {
                    await stickySystem.handleStickyCommand(interaction);
                } else if (commandName === 'ig') {
                    await instagram.handleInstagramCommand(interaction);
                } else if (commandName === 'joinvoice') {
                    await voiceJoin.handleJoinVoice(interaction);
                }
            }

            // BUTTONS
            if (interaction.isButton()) {
                const { customId } = interaction;

                if (customId === 'update_donators') {
                    await donatorSystem.handleUpdateDonatorsModal(interaction);
                } else if (customId === 'suggestion_make') {
                    await suggestionSystem.handleSuggestionButton(interaction);
                } else if (customId.startsWith('dm_tf_user')) {
                    // customId format: dm_tf_user:<userId>
                    const parts = customId.split(':');
                    const targetId = parts[1];
                    if (targetId) {
                        const target = await interaction.client.users.fetch(targetId).catch(() => null);
                        if (target) {
                            await target.send({ content: `<:emojigg_dm:1507430442947838024> **${interaction.user.tag}** wants to message you regarding your Team Finder post.` }).catch(() => {});
                            return interaction.reply({ content: `<:emojigg_dm:1507430442947838024> Check your DMs — I sent a message to the host.`, flags: 64 });
                        }
                    }
                } else if (customId === 'close_tf_post') {
                    await interaction.message.delete();
                    return interaction.reply({
                        content: "<:142557verified:1499282336846708848> Team Finder post closed.",
                        ephemeral: true
                    });
                }
            }

            // SELECT MENUS
            if (interaction.isStringSelectMenu()) {
                const { customId } = interaction;

                if (customId === 'tf_game_select') {
                    await teamFinder.handleGameSelect(interaction);
                }
                if (customId.startsWith('sr_select:')) {
                    const parts = customId.split(':');
                    const category = parts[1];
                    await selfRole.handleSelect(interaction, category);
                }
            }

            // MODAL SUBMISSIONS
            if (interaction.isModalSubmit()) {
                const { customId } = interaction;

                if (customId === 'donator_modal') {
                    await donatorSystem.handleDonatorModalSubmit(interaction);
                } else if (customId === 'suggestion_modal') {
                    await suggestionSystem.handleSuggestionSubmit(interaction);

                }
            }

            // MESSAGES - Sticky reposition on new message
            if (interaction.isRepliable() === false && interaction.isMessageComponent() === false) {
                // Not an interaction we handle
                return;
            }

        } catch (error) {
            console.error('Interaction error:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '<:9349_nope:1499282529838956544> An error occurred while processing your request.',
                    ephemeral: true
                }).catch(() => {});
            }
        }
    });
};
