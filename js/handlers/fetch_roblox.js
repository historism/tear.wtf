
async function fetchRoblox(userId) {
    try {
        const userReq = await fetch(`https://users.roproxy.com/v1/users/${userId}`);
        const userData = await userReq.json();

        const followerReq = await fetch(`https://friends.roproxy.com/v1/users/${userId}/followers/count`);
        const followerData = await followerReq.json();

        const followingReq = await fetch(`https://friends.roproxy.com/v1/users/${userId}/followings/count`);
        const followingData = await followingReq.json();

        const friendsReq = await fetch(`https://friends.roproxy.com/v1/users/${userId}/friends/count`);
        const friendsData = await friendsReq.json();

        const thumbReq = await fetch(`https://thumbnails.roproxy.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
        const thumbData = await thumbReq.json();

        if (userData.name) {
            document.querySelector('.display-name').innerText = `@${userData.displayName}`;
            document.querySelector('.username').innerText = userData.name;
            
            const statBoxes = document.querySelectorAll('.stat-box h5');
            
            statBoxes[0].innerText = `Friends: ${friendsData.count.toLocaleString()}`;
            statBoxes[1].innerText = `Followers: ${followerData.count.toLocaleString()}`;
            statBoxes[2].innerText = `Following: ${followingData.count.toLocaleString()}`;
            
            document.querySelector('.content-inner-roblox img').src = thumbData.data[0].imageUrl;
        }
    } catch (error) {
        console.error("Roblox Fetch Error:", error);
    }
}

fetchRoblox(350167333);