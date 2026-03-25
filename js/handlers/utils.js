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


function discordbutton(target) {
    const handles = {
        "tear": { 
            id: "tear-discord", 
            text: "8ho", 
            displaytext: "✓ Copied" 
        },
    };

    const data = handles[target];
    if (!data) return;

    const button = document.getElementById(data.id);
    
    if (button.classList.contains("copied")) return;
    const originalText = button.innerText; 
    navigator.clipboard.writeText(data.text).then(() => {
        button.innerText = data.displaytext;
        button.classList.add("copied"); 

        setTimeout(() => {
            button.classList.remove("copied");
            button.style.opacity = 0; 
            
            setTimeout(() => {
                button.innerText = originalText;
                button.style.opacity = 1;
            }, 150);
            
        }, 1500);

    }).catch(err => {
        console.error("Copy failed", err);
    });
}

getMyStatus();

window.addEventListener('load', function() {
    const loader = document.getElementById('loading-screen');
    loader.classList.add('fade-out');
    
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500); 
});