function discordbutton(target) {
    const handles = {
        "tear": { id: "tear-discord", text: "8ho", displaytext:"@8ho (copied)"},
    };

    const data = handles[target];
    if (!data) return;

    const button = document.getElementById(data.id);
    const originalText = "Discord"; 

    navigator.clipboard.writeText(data.text).then(() => {
        button.innerText = data.displaytext;
        button.classList.add("copied"); 

        setTimeout(() => {
            button.innerText = originalText;
            button.classList.remove("copied");
        }, 1500);

    }).catch(err => {

    });
}