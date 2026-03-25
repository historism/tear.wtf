const LASTFM_USER = 'fortniteguy43';
const LASTFM_KEY  = 'a6a8bfa4a5a0f0bd1e13bc7aabe39f11';

let currentTrackId = ""; 


async function getLastListened() {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&limit=1&format=json`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        const track = data.recenttracks.track[0];

        const isNowPlaying = track?.['@attr']?.nowplaying === 'true';
        const card = document.querySelector('.spotify-card');
        const trackId = track ? track.name + track.artist['#text'] : "";

        if (!isNowPlaying) {
            card.classList.add('hidden');
            currentTrackId = ""; 
            return;
        } else {
            card.classList.remove('hidden');
        }

        if (trackId !== currentTrackId) {
            const nameEl = document.getElementById('track-name');
            const artistEl = document.getElementById('track-artist');
            const artEl = document.getElementById('track-art');

            nameEl.classList.add('text-faded');
            artistEl.classList.add('text-faded');

            setTimeout(() => {
                nameEl.textContent = track.name;
                artistEl.textContent = '@' + track.artist['#text'];
                
                const art = track.image?.[2]?.['#text'];
                if (art) artEl.src = art;

                nameEl.classList.remove('text-faded');
                artistEl.classList.remove('text-faded');
            }, 300); 

            currentTrackId = trackId;
        }

    } catch (err) {
        document.querySelector('.spotify-card').classList.add('hidden');
    }
}

setInterval(getLastListened, 5000);
getLastListened();