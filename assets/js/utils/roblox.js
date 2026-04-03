async function fetchRoblox(userId) {
    const proxy = "https://corsproxy.io/?"; 
    
    try {
        const userRes = await fetch(`${proxy}https://users.roblox.com/v1/users/${userId}`);
        const userData = await userRes.json();
        const countRes = await fetch(`${proxy}https://friends.roblox.com/v1/users/${userId}/friends/count`);
        const followersRes = await fetch(`${proxy}https://friends.roblox.com/v1/users/${userId}/followers/count`);
        const followingRes = await fetch(`${proxy}https://friends.roblox.com/v1/users/${userId}/followings/count`);
        
        const friendsCount = await countRes.json();
        const followersCount = await followersRes.json();
        const followingCount = await followingRes.json();

        const thumbRes = await fetch(`${proxy}https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`);
        const thumbData = await thumbRes.json();

        document.getElementById("rbx-displayname").textContent = userData.displayName;
        document.getElementById("rbx-username").textContent = `@${userData.name}`;
        if (!userData.description || userData.description.length === 0) {
            document.getElementById("rbx-about").style.display = "none";
        } else {
            document.getElementById("rbx-about").textContent = userData.description;
            document.getElementById("rbx-about").style.display = "block";
        }
        if (thumbData && thumbData.data && thumbData.data.length > 0) {
            document.getElementById("rbx-avatar").src = thumbData.data[0].imageUrl;
        } else {
            console.warn("Avatar data not found in response:", thumbData);
        }        
        document.getElementById("rbx-friends").textContent = friendsCount.count;
        document.getElementById("rbx-followers").textContent = followersCount.count;
        document.getElementById("rbx-following").textContent = followingCount.count;

    } catch (error) {
        console.error("Roblox Fetch Error:", error);
    }
}

fetchRoblox("350167333");