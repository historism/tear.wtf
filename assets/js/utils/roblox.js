async function fetchRoblox(userId) {
    try {
        const userRes = await fetch(`https://users.roproxy.com/v1/users/${userId}`);
        const userData = await userRes.json();
        
        const countRes = await fetch(`https://friends.roproxy.com/v1/users/${userId}/friends/count`);
        const followersRes = await fetch(`https://friends.roproxy.com/v1/users/${userId}/followers/count`);
        const followingRes = await fetch(`https://friends.roproxy.com/v1/users/${userId}/followings/count`);
        
        const friendsCount = await countRes.json();
        const followersCount = await followersRes.json();
        const followingCount = await followingRes.json();

        const thumbRes = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`);
        const thumbData = await thumbRes.json();

        document.getElementById("rbx-displayname").textContent = userData.displayName;
        document.getElementById("rbx-username").textContent = `@${userData.name}`;
        
        if (thumbData?.data?.[0]?.imageUrl) {
            document.getElementById("rbx-avatar").src = thumbData.data[0].imageUrl;
        }

        document.getElementById("rbx-friends").textContent = friendsCount.count || 0;
        document.getElementById("rbx-followers").textContent = followersCount.count || 0;
        document.getElementById("rbx-following").textContent = followingCount.count || 0;

        document.getElementById("rbx-about").textContent = userData.description || "No bio found";

    } catch (error) {
        console.error("Roblox Fetch Error:", error);
    }
}

fetchRoblox("350167333")