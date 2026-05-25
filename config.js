// Channel IDs
const DONATOR_CHANNEL_ID = "1506368122943180900";
const PANEL_CHANNEL_ID = "1506724001765134416";
const TEAM_PANEL_CHANNEL_ID = "1507435227969097738";
const TEAM_FINDER_CHANNEL_ID = "1499036081654468780";

// Cooldown Settings
const TF_COOLDOWN_TIME = 2 * 60 * 1000; // 2 minutes

// Game Configuration
const gameMap = {
    tf_valorant: "Valorant",
    tf_mlbb: "MLBB",
    tf_roblox: "Roblox",
    tf_lol: "League of Legends",
    tf_amongus: "Among Us"
};

const gameRoleMap = {
    tf_valorant: "1499364850244124812",
    tf_mlbb: "1499363658604613792",
    tf_roblox: "1499370835587104928",
    tf_lol: "1499373667379974294",
    tf_amongus: "1499363783980613834"
};

const gameImage = {
    tf_valorant: "https://i.pinimg.com/1200x/39/dc/66/39dc66a4fbaa85dcd12a49f216b60ead.jpg",
    tf_mlbb: "https://static.wikia.nocookie.net/mobile-legends/images/f/fb/MLBB_icon.png/revision/latest?cb=20241013132437",
    tf_roblox: "https://i.pinimg.com/736x/eb/20/30/eb203036af2bf931259d9c2ae254b2cd.jpg",
    tf_lol: "https://i.pinimg.com/1200x/8e/6a/a1/8e6aa11427127853cb8b96000b39ac59.jpg",
    tf_amongus: "https://i.pinimg.com/736x/ba/1c/79/ba1c796fc180a9a2ea9a3105530f35ee.jpg"
};

// Donator Data
const donatorData = {
    tier1: 'None',
    tier2: 'None',
    tier3: 'None',
    tier4: 'None'
};

// Command Access Defaults
const defaultCommandAccess = {
    donatorsetup: 'everyone',
    suggestpanel: 'admin',
    teamfinderpanel: 'admin',
    joinvoice: 'everyone',
    ig: 'everyone',
    sticky: 'admin'
};

module.exports = {
    DONATOR_CHANNEL_ID,
    PANEL_CHANNEL_ID,
    TEAM_PANEL_CHANNEL_ID,
    TEAM_FINDER_CHANNEL_ID,
    TF_COOLDOWN_TIME,
    gameMap,
    gameRoleMap,
    gameImage,
    donatorData,
    defaultCommandAccess
};
