const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle,
    ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize
} = require('discord.js');
const { DONATOR_CHANNEL_ID, PANEL_CHANNEL_ID, donatorData } = require('../config');

let donators = { ...donatorData };

function createDonatorPanelContainer(includeButton = true) {
    const title = '<:Snake:1499284347465891912> Vipers Community Donators';
    const body = `\nTier 1: ${donators.tier1 || 'None'}\nTier 2: ${donators.tier2 || 'None'}\nTier 3: ${donators.tier3 || 'None'}\nTier 4: ${donators.tier4 || 'None'}`;

    const container = new ContainerBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# ${title}`)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(body)
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );

    if (includeButton) {
        container.addActionRowComponents(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('update_donators')
                    .setLabel('Update Donators')
                    .setStyle(ButtonStyle.Danger)
            )
        );

        // small footer section to match panel style only when button is present
        container.addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        ).addTextDisplayComponents(
            new TextDisplayBuilder().setContent('_Use the Update Donators button to modify tiers._')
        );
    }

    return container;
}

module.exports = (client) => {
    const handleDonatorSetup = async (interaction) => {
        const panelChannel = interaction.guild.channels.cache.get(PANEL_CHANNEL_ID);
        const publicChannel = interaction.guild.channels.cache.get(DONATOR_CHANNEL_ID);

        // Send Components V2 panel to panelChannel (no embeds in the same message)
        const panelContainer = createDonatorPanelContainer(true);
        await panelChannel.send({ components: [panelContainer], flags: 32768 });

        // Send a read-only Components V2 container to the public channel as well
        const publicContainer = createDonatorPanelContainer(false);
        await publicChannel.send({ components: [publicContainer], flags: 32768 });

        return interaction.reply({ content: "<:142557verified:1499282336846708848> Done", flags: 64 });
    };

    const handleUpdateDonatorsModal = async (interaction) => {
        const modal = new ModalBuilder()
            .setCustomId('donator_modal')
            .setTitle('Update Donators');

        const t1 = new TextInputBuilder()
            .setCustomId('tier1')
            .setLabel('Tier 1')
            .setStyle(TextInputStyle.Paragraph);

        const t2 = new TextInputBuilder()
            .setCustomId('tier2')
            .setLabel('Tier 2')
            .setStyle(TextInputStyle.Paragraph);

        const t3 = new TextInputBuilder()
            .setCustomId('tier3')
            .setLabel('Tier 3')
            .setStyle(TextInputStyle.Paragraph);

        const t4 = new TextInputBuilder()
            .setCustomId('tier4')
            .setLabel('Tier 4')
            .setStyle(TextInputStyle.Paragraph);

        modal.addComponents(
            new ActionRowBuilder().addComponents(t1),
            new ActionRowBuilder().addComponents(t2),
            new ActionRowBuilder().addComponents(t3),
            new ActionRowBuilder().addComponents(t4)
        );

        return interaction.showModal(modal);
    };

    const handleDonatorModalSubmit = async (interaction) => {
        donators.tier1 = interaction.fields.getTextInputValue('tier1');
        donators.tier2 = interaction.fields.getTextInputValue('tier2');
        donators.tier3 = interaction.fields.getTextInputValue('tier3');
        donators.tier4 = interaction.fields.getTextInputValue('tier4');

        const channel = interaction.guild.channels.cache.get(DONATOR_CHANNEL_ID);

        // send updated public container (read-only)
        const publicContainer = createDonatorPanelContainer(false);
        await channel.send({ components: [publicContainer], flags: 32768 });

        return interaction.reply({ content: "<:142557verified:1499282336846708848> Updated", flags: 64 });
    };

    module.exports.handleDonatorSetup = handleDonatorSetup;
    module.exports.handleUpdateDonatorsModal = handleUpdateDonatorsModal;
    module.exports.handleDonatorModalSubmit = handleDonatorModalSubmit;
};