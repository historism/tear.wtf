const LASTFM_USER = 'fortniteguy43';
const LASTFM_KEY  = 'a6a8bfa4a5a0f0bd1e13bc7aabe39f11';

async function getLastListened() {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&limit=2&format=json`;
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        const tracks = data.recenttracks.track;

        const isNowPlaying = tracks[0]['@attr']?.nowplaying === 'true';
        const track = isNowPlaying ? tracks[0] : tracks[0];

        document.getElementById('track-name').textContent = (isNowPlaying ? '' : '') + track.name;
        document.getElementById('track-artist').textContent = track.artist['#text'];

        const art = track.image?.[2]?.['#text'];
        if (art) document.getElementById('track-art').src = art;

    } catch (err) {
        document.getElementById('track-name').textContent = 'could not load :(';
        document.getElementById('track-artist').textContent = '';
    }
}

getLastListened();
setInterval(getLastListened, 30000);