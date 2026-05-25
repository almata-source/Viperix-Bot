const fs = require('fs');
const path = require('path');

const COMMAND_ACCESS_FILE = path.join(__dirname, '..', 'commandAccess.json');
const STICKY_FILE = path.join(__dirname, '..', 'stickyMessages.json');

function loadFile(filePath, defaultValue = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultValue;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Failed to load ${filePath}:`, err);
        return defaultValue;
    }
}

function saveFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Failed to save ${filePath}:`, err);
    }
}

function loadCommandAccess(defaultAccess) {
    const loaded = loadFile(COMMAND_ACCESS_FILE, {});
    return { ...defaultAccess, ...loaded };
}

function saveCommandAccess(data) {
    saveFile(COMMAND_ACCESS_FILE, data);
}

function loadStickyMessages() {
    return loadFile(STICKY_FILE, {});
}

function saveStickyMessages(data) {
    saveFile(STICKY_FILE, data);
}

module.exports = {
    loadCommandAccess,
    saveCommandAccess,
    loadStickyMessages,
    saveStickyMessages,
    COMMAND_ACCESS_FILE,
    STICKY_FILE
};
