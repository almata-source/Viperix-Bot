/**
 * Manages cooldowns for commands or features
 */

const cooldowns = new Map();

/**
 * Check if a user is on cooldown
 * @param {string} userId - Discord user ID
 * @param {string} feature - Feature name (e.g., 'teamFinder')
 * @returns {object} { isOnCooldown: boolean, remainingTime: number }
 */
function checkCooldown(userId, feature) {
    const key = `${userId}-${feature}`;
    const now = Date.now();

    if (cooldowns.has(key)) {
        const expirationTime = cooldowns.get(key);
        if (now < expirationTime) {
            return {
                isOnCooldown: true,
                remainingTime: Math.ceil((expirationTime - now) / 1000)
            };
        } else {
            cooldowns.delete(key);
        }
    }

    return {
        isOnCooldown: false,
        remainingTime: 0
    };
}

/**
 * Set a cooldown for a user on a feature
 * @param {string} userId - Discord user ID
 * @param {string} feature - Feature name
 * @param {number} cooldownMs - Cooldown duration in milliseconds
 */
function setCooldown(userId, feature, cooldownMs) {
    const key = `${userId}-${feature}`;
    cooldowns.set(key, Date.now() + cooldownMs);
}

/**
 * Clear cooldown for a user on a feature
 * @param {string} userId - Discord user ID
 * @param {string} feature - Feature name
 */
function clearCooldown(userId, feature) {
    const key = `${userId}-${feature}`;
    cooldowns.delete(key);
}

/**
 * Clear all cooldowns for a user
 * @param {string} userId - Discord user ID
 */
function clearAllUserCooldowns(userId) {
    for (const [key] of cooldowns) {
        if (key.startsWith(userId)) {
            cooldowns.delete(key);
        }
    }
}

module.exports = {
    checkCooldown,
    setCooldown,
    clearCooldown,
    clearAllUserCooldowns
};