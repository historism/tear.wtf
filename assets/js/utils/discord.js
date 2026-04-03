let songLyrics = [];
let currentSong = "";

async function fetchSyncedLyrics(artist, track) {
    const container = document.getElementById("lyrics-container");

    try {
        const res = await fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`);

        if (res.status === 404) {
            container.classList.remove("visible");
            return;
        }

        const data = await res.json();

        if (data.syncedLyrics) {
            container.classList.remove("visible");

            setTimeout(() => {
                parseLRC(data.syncedLyrics);
                container.classList.add("visible");
            }, 200);
        } else {
            container.classList.remove("visible");
        }

    } catch (e) {
        console.error("Lyrics error:", e);
        container.classList.remove("visible");
    }
}

function parseLRC(lrc) {
    const lines = lrc.split('\n');
    songLyrics = lines.map(line => {
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const ms = (parseInt(match[1]) * 60 + parseFloat(match[2])) * 1000;
            return { time: ms, text: match[3].trim() };
        }
        return null;
    }).filter(l => l && l.text);

    const wrapper = document.getElementById("lyrics-wrapper");
    wrapper.innerHTML = songLyrics.map((l, i) => `<div class="lyric-line" id="line-${i}">${l.text}</div>`).join('');
}

async function getdata() {
    const result = await fetch("https://api.lanyard.rest/v1/users/430772757643395074");
    const { data } = await result.json();

    const discord = data.discord_user;
    const spotify = data.spotify;
    const activities = data.activities;


    if (!discord) {
        return;
    }

    if (!spotify) {
        const widget = document.getElementById("spotify-widget");
        if (widget) {
            widget.style.display = "none";
        }
    } else {
        const widget = document.getElementById("spotify-widget");
        if (widget) {
            widget.style.display = "flex";
        }
    }

    // Discord Data
    const d_name = discord?.username;
    const d_displayname = discord?.display_name;
    const d_status = discord?.discord_status;
    const clan = data.discord_user.primary_guild;

    document.getElementById("discord-avatar").src = `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png`;
    document.getElementById("discord-displayname").textContent = d_displayname || d_name;
    document.getElementById("discord-username").textContent = "@" + d_name;
    const clanElement = document.getElementById("discord-clan");

    if (clan && clan.tag) {
        clanElement.style.display = "flex";
        document.getElementById("clan-tag").textContent = clan.tag;

        if (clan.badge) {
            const badgeImg = document.getElementById("clan-badge");
            badgeImg.src = `https://cdn.discordapp.com/clan-badges/${clan.identity_guild_id}/${clan.badge}.png`;
            badgeImg.style.display = "block";
        } else {
            document.getElementById("clan-badge").style.display = "none";
        }
    } else {
        clanElement.style.display = "none";
    }

    //Discord activity Data
    const activity = activities.find(act => act.type == 0);
    if(activity) {
        document.getElementById("activity-name").textContent = activity.name;
        document.getElementById("activity-details").textContent = activity.details || "";
        document.getElementById("activity-state").textContent = activity.state || "";
        document.getElementById("activity-icon").src = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;;

        let activityInterval;
        const te = document.getElementById("activity-time");

        function update(){
            const now = Date.now();
            const elapsed = now - activity.timestamps.start;

            const totalsec = Math.floor(elapsed/1000);
            const totalmin = Math.floor(totalsec/60);
            const totalhours = Math.floor(totalmin/60);

            const displayMins = String(totalmin % 60).padStart(2, '0');
            const displaySecs = String(totalsec % 60).padStart(2, '0');

            if (totalhours > 0) {
                te.textContent = `${totalhours}:${displayMins}:${displaySecs}`;
            } else {
                te.textContent = `${displayMins}:${displaySecs}`;
            }
        }   

        update();
    } else {
        document.getElementById("discord-activity").style.display = "none"
    }


    // Spotify Data
    const s_album_art_url = spotify?.album_art_url;
    const s_artist = spotify?.artist;
    const s_song = spotify?.song;
    const t_start = spotify?.timestamps.start;
    const t_end = spotify?.timestamps.end;


    document.getElementById("song").textContent = s_song;
    document.getElementById("artist").textContent = s_artist;
    document.getElementById("albumArt").src = s_album_art_url;


    function formattime(ms) {
        if (isNaN(ms) || ms < 0) return "0:00";
        const totalsec = Math.floor(ms / 1000);
        const mins = Math.floor(totalsec / 60);
        const sec = totalsec % 60;

        return `${mins}:${sec.toString().padStart(2, '0')}`;
    }
    const now = Date.now();
    const currentms = now - t_start;
    const totalms = t_end - t_start;

    document.getElementById("current-time").textContent = formattime(currentms);
    document.getElementById("total-time").textContent = formattime(totalms);

    const progress = (currentms / totalms) * 100;
    document.getElementById("progress-bar").style.width = Math.min(Math.max(progress, 0), 100) + "%";

    if (s_song !== currentSong) {
        currentSong = s_song;
        console.log("New song detected, fetching lyrics...");
        fetchSyncedLyrics(s_artist, s_song);
    }

    const activeIndex = songLyrics.findLastIndex(l => l.time <= currentms);

    if (activeIndex !== -1) {
        const activeLine = document.getElementById(`line-${activeIndex}`);

        if (activeLine && !activeLine.classList.contains('active')) {
            document.querySelectorAll('.lyric-line').forEach(el => el.classList.remove('active'));
            activeLine.classList.add('active');

            const container = document.getElementById("lyrics-container");
            const wrapper = document.getElementById("lyrics-wrapper");

            const containerHeight = container.offsetHeight;
            const lineOffset = activeLine.offsetTop;
            const lineHeight = activeLine.offsetHeight;

            const finalOffset = -lineOffset + (containerHeight / 2) - (lineHeight / 2);

            wrapper.style.transform = `translateY(${finalOffset}px)`;
        }
    }
}

getdata();
setInterval(getdata, 1000);