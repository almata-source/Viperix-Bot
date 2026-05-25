const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = (client) => {
    const handleJoinVoice = async (interaction) => {
        const vc = interaction.member.voice.channel;
        if (!vc) {
            return interaction.reply({
                content: "<:9349_nope:1499282529838956544> You need to be in a voice channel first.",
                ephemeral: true
            });
        }

        joinVoiceChannel({
            channelId: vc.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });

        return interaction.reply({
            content: `<:142557verified:1499282336846708848> Joined **${vc.name}**.`,
            ephemeral: true
        });
    };

    module.exports.handleJoinVoice = handleJoinVoice;
};