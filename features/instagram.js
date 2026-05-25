const { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize, SectionBuilder, ThumbnailBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (client) => {
    const handleInstagramCommand = async (interaction) => {
        if (!interaction.isChatInputCommand() || interaction.commandName !== 'ig') return;

        const username = interaction.options.getString('username')?.replace(/^@/, '') || '';
        const igUrl = `https://instagram.com/${username}`;

        const avatarURL = interaction.user.displayAvatarURL({ size: 256, extension: 'png', dynamic: true });

        const container = new ContainerBuilder()
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# 📸 Instagram: @${username}\nOpen the Instagram profile for @${username}`))
                    .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatarURL))
            )
            .addActionRowComponents(new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel('Open Instagram').setStyle(ButtonStyle.Link).setURL(igUrl)
            ));

        await interaction.channel.send({ components: [container], flags: 32768 });
        return interaction.reply({ content: `Posted Instagram profile for @${username}`, flags: 64 });
    };

    module.exports.handleInstagramCommand = handleInstagramCommand;
};