const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder
} = require('discord.js');

/**
 * Create donator tier embed with tier information
 * @param {object} donatorData - Donator tier data from config
 * @returns {EmbedBuilder}
 */
function createDonatorContainer(donatorData) {
    const tierDescriptions = Object.entries(donatorData)
        .map(([tier, info]) => `**${tier.toUpperCase()}**: ${info.description}`)
        .join('\n');

    const container = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('# <:VipersCommunity:1499286332046966824> Donator Tiers'))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(tierDescriptions))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('Support the server with a donation!'));

    return container;
}

/**
 * Create game dropdown for team finder
 * @returns {ActionRowBuilder}
 */
function createGameDropdown() {
    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('tf_game_select')
            .setPlaceholder('Select a game')
            .addOptions([
                { label: 'Valorant', value: 'tf_valorant', emoji: { id: '1507428533679689788' } },
                { label: 'MLBB', value: 'tf_mlbb', emoji: { id: '1507428533679689788' } },
                { label: 'Roblox', value: 'tf_roblox', emoji: { id: '1507428533679689788' } },
                { label: 'League of Legends', value: 'tf_lol', emoji: { id: '1507428533679689788' } },
                { label: 'Among Us', value: 'tf_amongus', emoji: { id: '1507428533679689788' } }
            ])
    );
}

/**
 * Create suggestion panel embed and buttons
 * @returns {object} { embed: EmbedBuilder, components: ActionRowBuilder[] }
 */
function createSuggestionPanelContainer() {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('# <:543581paperplane:1508110189163708426> Suggestion Box'))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('Click the button below to make a suggestion.'))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addActionRowComponents(new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('suggestion_make').setLabel('Make a Suggestion').setStyle(ButtonStyle.Primary)
        ));

    return container;
}

/**
 * Create team finder panel with media gallery and dropdown
 * @param {string} vipersEmoji - Viperix emoji string
 * @returns {ContainerBuilder[]}
 */
function createTeamFinderPanel(vipersEmoji) {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `# ${vipersEmoji} Viperix — Team Finder`
            )
        )
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`
## EARLY ACCESS (BETA)

This Team Finder is currently in beta.

More games will be added after testing phase.
Report bugs to staff.

This system is available when the bot is online.
            `)
        )
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setDivider(true)
                .setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `⚡ Select a game to find teammates!`
            )
        )
        .addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder()
                    .setURL("https://i.giphy.com/media/BE3Di0QCtDKEM2ScGU/giphy.gif")
            )
        )
        .addActionRowComponents(createGameDropdown());

    return [container];
}

module.exports = {
    createDonatorContainer,
    createGameDropdown,
    createSuggestionPanelContainer,
    createTeamFinderPanel
};