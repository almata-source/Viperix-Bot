const {
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder
} = require('discord.js');
const { selfRoleCategories } = require('../config');

function createSelectForCategory(category, selectedRoleIds = [], customId) {
    const map = category.map || {};
    const roleMap = category.roleMap || {};
    const options = Object.keys(map).map(key => {
        const label = map[key];
        const roleId = roleMap[key];
        return { label, value: roleId, default: selectedRoleIds.includes(roleId) };
    });

    return new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(customId)
            .setPlaceholder(`Select ${category.title}`)
            .setMinValues(0)
            .setMaxValues(options.length)
            .addOptions(options)
    );
}

function createPanelForCategory(category, selectedRoleIds = [], customId) {
    const emojiPrefix = category.emoji ? `${category.emoji} ` : '';
    const container = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# ${emojiPrefix}Self Roles — ${category.title}`));

    if (category.bannerUrl) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder().addItems(
                new MediaGalleryItemBuilder().setURL(category.bannerUrl)
            )
        ).addSeparatorComponents(
            new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
        );
    }

    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`\nSelect roles in **${category.title}** to add them to your profile. To remove a role, select it again.`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addActionRowComponents(createSelectForCategory(category, selectedRoleIds, customId));

    return container;
}

module.exports = (client) => {
    const handleSelfRolePanel = async (interaction, categoryKey = 'games') => {
        const category = selfRoleCategories[categoryKey];
        if (!category) return interaction.reply({ content: 'Unknown category.', flags: 64 });

        const panelChannel = interaction.guild.channels.cache.get(category.panelChannel);
        if (!panelChannel) return interaction.reply({ content: 'Panel channel not found.', flags: 64 });

        const panel = createPanelForCategory(category, [], `sr_select:${categoryKey}`);
        await panelChannel.send({ components: [panel], flags: 32768 });
        return interaction.reply({ content: `Self-role panel for ${category.title} posted.`, flags: 64 });
    };

    const handleSelect = async (interaction, categoryKey = 'games') => {
        // Defer immediately to ensure interaction is always replied to
        await interaction.deferUpdate().catch(() => {});

        const category = selfRoleCategories[categoryKey];
        if (!category) return interaction.followUp({ content: 'Unknown category.' });

        const member = interaction.member;
        const selectedRoleIds = interaction.values || [];
        const allRoleIds = Object.values(category.roleMap || {});

        const added = [];
        const removed = [];
        const failed = [];

        for (const roleId of allRoleIds) {
            const hasRole = member.roles.cache.has(roleId);
            const shouldHaveRole = selectedRoleIds.includes(roleId);
            try {
                if (shouldHaveRole && !hasRole) {
                    await member.roles.add(roleId);
                    added.push(`<@&${roleId}>`);
                } else if (!shouldHaveRole && hasRole) {
                    await member.roles.remove(roleId);
                    removed.push(`<@&${roleId}>`);
                }
            } catch (e) {
                failed.push(`<@&${roleId}>`);
            }
        }

        // reset dropdown selections on shared panel
        const panel = createPanelForCategory(category, [], `sr_select:${categoryKey}`);
        await interaction.editReply({ components: [panel] }).catch(() => {});

        let message = '';
        if (added.length) message += `Added roles: ${added.join(', ')}\n`;
        if (removed.length) message += `Removed roles: ${removed.join(', ')}`;
        if (!message) message = 'No changes made.';
        if (failed.length) message += `\nFailed to update: ${failed.join(', ')}`;

        return interaction.followUp({ content: message, flags: 64 });
    };

    module.exports.handleSelfRolePanel = handleSelfRolePanel;
    module.exports.handleSelect = handleSelect;
};
