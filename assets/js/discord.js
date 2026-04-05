class Lanyard {
  constructor(userId, options = {}) {
    this.userId = userId;
    this.baseUrl = "https://api.lanyard.rest/v1/users/";
    this.cache = null;
    this.pollInterval = options.pollInterval || null;
    this._intervalId = null;
    this._listeners = {};
  }

  async fetch() {
    const res = await fetch(this.baseUrl + this.userId);
    const json = await res.json();

    if (!json.success) {
      throw new Error("Failed to fetch Lanyard data");
    }

    this.cache = json.data;
    this._emit("update", this.cache);

    return this.cache;
  }

  startPolling() {
    if (!this.pollInterval) {
      throw new Error("pollInterval not set in constructor");
    }

    this.stopPolling();
    this._intervalId = setInterval(() => this.fetch(), this.pollInterval);
  }

  stopPolling() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  on(event, callback) {
    (this._listeners[event] ||= []).push(callback);
  }

  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
  }

  get status() {
    return this.cache?.discord_status ?? null;
  }

  get spotify() {
    return this.cache?.spotify ?? null;
  }

  isListening() {
    return this.cache?.listening_to_spotify === true;
  }
}


// ---------------------------------------------------------------------------------------------------

const lanyard = new Lanyard("430772757643395074", {
  pollInterval: 1000
});

const progressbar = document.getElementById("progress-bar");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const songCover = document.getElementById("song-cover");

let currentStart = null;
let currentEnd = null;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const songTime = document.getElementById("song-time");

function updateProgressAndTime() {
  if (currentStart && currentEnd) {
    const now = Date.now();
    const elapsed = now - currentStart;
    const duration = currentEnd - currentStart;
    const progress = Math.min(Math.max(elapsed / duration, 0), 1) * 100;

    progressbar.style.width = progress + "%";
    songTime.textContent = `${formatTime(elapsed)} | ${formatTime(duration)}`;

  }

  else {
    songTime.textContent = "0:00 | 0:00";
    progressbar.style.width = "0%";
  }

  requestAnimationFrame(updateProgressAndTime);
}


lanyard.on("update", data => {
  if (lanyard.isListening()) {
    const spotify = lanyard.spotify;

    currentStart = spotify.timestamps.start;
    currentEnd = spotify.timestamps.end;

    songName.textContent = spotify.song;
    songArtist.textContent = spotify.artist;
    songCover.src = spotify.album_art_url;

    document.getElementById("spotify-section").classList.add("visible");

  } else {
    currentStart = null;
    currentEnd = null;
    progressbar.style.width = "0%";

    document.getElementById("spotify-section").classList.remove("visible");
  }
});


// Start everything
lanyard.fetch();
lanyard.startPolling();
updateProgressAndTime();