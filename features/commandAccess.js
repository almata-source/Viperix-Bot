const { PermissionFlagsBits } = require('discord.js');
const { loadCommandAccess, saveCommandAccess } = require('../utils/fileManager');
const { defaultCommandAccess } = require('../config');

let commandAccess = {};

function initCommandAccess() {
    commandAccess = loadCommandAccess(defaultCommandAccess);
}

function isCommandAllowed(commandName, member) {
    const mode = commandAccess[commandName] || 'everyone';
    if (mode === 'admin') {
        return member?.permissions?.has(PermissionFlagsBits.Administrator);
    }
    return true;
}

function updateCommandAccess(commandName, access) {
    if (!defaultCommandAccess[commandName]) {
        return false;
    }
    commandAccess[commandName] = access;
    saveCommandAccess(commandAccess);
    return true;
}

module.exports = {
    initCommandAccess,
    isCommandAllowed,
    updateCommandAccess,
    getCommandAccess: () => commandAccess
};
