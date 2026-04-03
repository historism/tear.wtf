async function updatestatus() {
    const gistURL = "https://gist.githubusercontent.com/historism/652c187ca62b373e55effb5ca959b223/raw/status.json";
    try {
        const res = await fetch(gistURL);
        const data = await res.json(); 
        const status = data.status;

        document.getElementById("status-text").textContent = status || ""
    } catch (error) {
        document.getElementById("status-text").textContent = ""
    }
}

updatestatus();