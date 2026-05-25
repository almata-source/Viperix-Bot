const axios = require('axios');

async function fetchInstagramData(username) {
    try {
        const response = await axios.get(
            `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            }
        );
        const user = response.data.data.user;
        return {
            followers: user.edge_followed_by?.count || 0,
            following: user.edge_follow?.count || 0,
            posts: user.edge_owner_to_timeline_media?.count || 0,
            bio: user.biography || '',
            verified: user.is_verified || false
        };
    } catch (err) {
        return null;
    }
}

module.exports = { fetchInstagramData };
