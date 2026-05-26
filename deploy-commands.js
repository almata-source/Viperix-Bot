const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
        .setName('donatorsetup')
        .setDescription('Setup Donator Panel'),
    
    new SlashCommandBuilder()
    .setName('suggestpanel')
    .setDescription('Send the suggestion panel'),

    new SlashCommandBuilder()
        .setName('teamfinderpanel')
        .setDescription('Setup Team Finder Panel'),

    new SlashCommandBuilder()
        .setName('joinvoice')
        .setDescription('Make the bot join your voice channel'),

    new SlashCommandBuilder()
        .setName('sticky')
        .setDescription('Manage a sticky message in this channel')
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('Set a sticky message for this channel')
                .addStringOption(option =>
                    option.setName('content')
                        .setDescription('The sticky message text')
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove the sticky message from this channel')
        )
        .addSubcommand(sub =>
            sub.setName('show')
                .setDescription('Show the current sticky message for this channel')
        ),

    new SlashCommandBuilder()
        .setName('setcommandaccess')
        .setDescription('Configure command access mode')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('The command to configure')
                .setRequired(true)
                .addChoices(
                    { name: 'donatorsetup', value: 'donatorsetup' },
                    { name: 'suggestpanel', value: 'suggestpanel' },
                    { name: 'teamfinderpanel', value: 'teamfinderpanel' },
                    { name: 'joinvoice', value: 'joinvoice' },
                    { name: 'ig', value: 'ig' },
                    { name: 'sticky', value: 'sticky' }
                )
        )
        .addStringOption(option =>
            option.setName('access')
                .setDescription('Set access mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Admin only', value: 'admin' },
                    { name: 'Open to everyone', value: 'everyone' }
                )
        )

    ,new SlashCommandBuilder()
        .setName('ig')
        .setDescription('Look up an Instagram account')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Instagram username (without @)')
                .setRequired(true)
        )
    ,new SlashCommandBuilder()
        .setName('selfrolepanel')
        .setDescription('Setup self-role panel for games')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Which self-role category to post')
                .setRequired(false)
                .addChoices({ name: 'Games', value: 'games' })
        )
    
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Commands registered (GUILD MODE)");
    } catch (err) {
        console.error(err);
    }
})();
