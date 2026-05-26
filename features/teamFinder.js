const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ThumbnailBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder
} = require('discord.js');
const { TEAM_PANEL_CHANNEL_ID, TEAM_FINDER_CHANNEL_ID, TF_COOLDOWN_TIME, gameMap, gameRoleMap, gameImage } = require('../config');

const tfCooldown = new Map();

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
                { label: 'Among Us', value: 'tf_amongus', emoji: { id: '1507428533679689788' } },
                { label: 'CODM', value: 'tf_codm', emoji: { id: '1507428533679689788' } },
                { label: 'Minecraft', value: 'tf_minecraft', emoji: { id: '1507428533679689788' } },
                { label: 'Bloodstrike', value: 'tf_bloodstrike', emoji: { id: '1507428533679689788' } }
            ])
    );
}

function createTeamFinderPanel(vipersEmoji) {
    const container = new ContainerBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${vipersEmoji} VIPERS COMMUNITY • Team Finder ##`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent('\n• __The Team Finder feature helps you easily discover and connect with players \nwho are looking for teammates. It allows you to join active teams or recruit \nmembers based on your preferred game, role, and playstyle. With this system, \nyou can quickly build a squad, find reliable teammates,vand improve your overall \ngaming experience.__'))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL('https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b20zcGZjeGtuaHBlazlkeGtkZTI1OTg2cHM0Nmdsa3Z0a2FjeXpxZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/yOyfe6juEC3LuDswr0/giphy.gif')))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
        .addActionRowComponents(createGameDropdown());

    return container;
}

module.exports = (client) => {
    const handleTeamFinderPanel = async (interaction) => {
        const vipersEmoji = interaction.guild.emojis.cache.get('1508114250185314395')?.toString() || '';
        const channel = interaction.guild.channels.cache.get(TEAM_PANEL_CHANNEL_ID);

        const panel = createTeamFinderPanel(vipersEmoji);
        await channel.send({ components: [panel], flags: 32768 });

        return interaction.reply({ content: '<:142557verified:1499282336846708848> Team Finder Panel sent', flags: 64 });
    };

    const handleGameSelect = async (interaction) => {
        const userId = interaction.user.id;
        const now = Date.now();

        if (tfCooldown.has(userId)) {
            const expirationTime = tfCooldown.get(userId);
            if (now < expirationTime) {
                const remaining = Math.ceil((expirationTime - now) / 1000);
                const vipersEmoji = interaction.guild.emojis.cache.get('1499286332046966824')?.toString() || '';
                await interaction.update({ components: [createTeamFinderPanel(vipersEmoji)] }).catch(() => {});
                return interaction.followUp({
                    content: `⏳ You are on cooldown. Please wait **${remaining} seconds**.`,
                    flags: 64
                });
            }
        }

        tfCooldown.set(userId, now + TF_COOLDOWN_TIME);

        const key = interaction.values[0];
        const game = gameMap[key];
        const vc = interaction.member.voice.channel;

        if (!vc) {
            const vipersEmoji = interaction.guild.emojis.cache.get('1499286332046966824')?.toString() || '';
            await interaction.update({ components: [createTeamFinderPanel(vipersEmoji)] }).catch(() => {});
            return interaction.followUp({
                content: "<:9349_nope:1499282529838956544> You must be in a voice channel first.",
                flags: 64
            });
        }

        const roleId = gameRoleMap[key];
        const roleMention = roleId ? `<@&${roleId}>` : "";
        const gameImageUrl = gameImage[key] || 'https://via.placeholder.com/640x360.png?text=Team+Finder';

        const container = new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`# <:VipersCommunity:1499286332046966824> ${game} Team Finder`))
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addSectionComponents(
                new SectionBuilder()
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**${interaction.user.username} is looking for teammates!**\n\n${roleMention}\n\nVoice Channel: ${vc}`))
                    .setThumbnailAccessory(new ThumbnailBuilder().setURL(gameImageUrl))
            )
            .addActionRowComponents(new ActionRowBuilder().addComponents(
                new ButtonBuilder().setLabel('Join VC').setStyle(ButtonStyle.Link).setURL(`https://discord.com/channels/${interaction.guild.id}/${vc.id}`),
                new ButtonBuilder().setCustomId(`dm_tf_user:${interaction.user.id}`).setLabel('Message').setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('close_tf_post').setLabel('Close').setStyle(ButtonStyle.Danger)
            ));

        const channel = interaction.guild.channels.cache.get(TEAM_FINDER_CHANNEL_ID);
        await channel.send({ components: [container], flags: 32768 });

        const vipersEmoji = interaction.guild.emojis.cache.get('1499286332046966824')?.toString() || '';
        await interaction.update({ components: [createTeamFinderPanel(vipersEmoji)] });
        return interaction.followUp({ content: '<:142557verified:1499282336846708848> Team Finder posted successfully.', flags: 64 });
    };

    module.exports.handleTeamFinderPanel = handleTeamFinderPanel;
    module.exports.handleGameSelect = handleGameSelect;
};
