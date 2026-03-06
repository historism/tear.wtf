const gist = "https://gist.githubusercontent.com/historism/652c187ca62b373e55effb5ca959b223/raw/status.json"

async function getMyStatus() {
  try {
    const response = await fetch(`${gist}?nocache=${new Date().getTime()}`);
    if(!response.ok) {
      throw new error("fetch failed");
    }
    const data = await response.json();
    document.getElementById('status-text').innerText = `${data.status}`;

  } catch (error) {
    document.getElementById('status-text').innerText = `No status yet i guess?`;
  }
}


getMyStatus();