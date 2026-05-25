const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const stickySystem = require('./stickySystem');

function createSuggestionContainer() {
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

module.exports = (client) => {
    const handleSuggestionPanel = async (interaction) => {
        const container = createSuggestionContainer();
        await stickySystem.setStickyPanel(interaction.channel, container);
        return interaction.reply({ content: 'Sticky suggestion panel posted.', flags: 64 });
    };

    const handleSuggestionButton = async (interaction) => {
        const modal = new ModalBuilder().setCustomId('suggestion_modal').setTitle('Make a Suggestion');

        const suggestionInput = new TextInputBuilder()
            .setCustomId('suggestion_text')
            .setLabel('Your suggestion')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1000);

        modal.addComponents(new ActionRowBuilder().addComponents(suggestionInput));
        return interaction.showModal(modal);
    };

    const handleSuggestionSubmit = async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const suggestion = interaction.fields.getTextInputValue('suggestion_text');

        const timestamp = Math.floor(Date.now() / 1000);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${interaction.user.tag}**`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent('**New Suggestion**'))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${suggestion}`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`<t:${timestamp}:f>`));

        const sent = await interaction.channel.send({ components: [container], flags: 32768 });
        await sent.react('<:142557verified:1499282336846708848>').catch(() => {});
        await sent.react('<:9349_nope:1499282529838956544>').catch(() => {});

        await interaction.editReply({ content: '<:142557verified:1499282336846708848> Suggestion submitted.' });
        return;
    };

    module.exports.handleSuggestionPanel = handleSuggestionPanel;
    module.exports.handleSuggestionButton = handleSuggestionButton;
    module.exports.handleSuggestionSubmit = handleSuggestionSubmit;
};