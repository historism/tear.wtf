function toggleDropdown() {
    const menu = document.getElementById('dropdownMenu');
    const arrow = document.getElementById('arrow');
    menu.classList.toggle('show');
    arrow.style.transform = menu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
}




function selectTab(name) {
    document.getElementById('tabname').innerText = name;
    toggleDropdown();

    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const target = document.getElementById('content-' + name.toLowerCase());
    if (target) {
        target.classList.add('active');
    }
}
window.onclick = function(event) {
    if (!event.target.closest('.dropdown-container')) {
        document.getElementById('dropdownMenu').classList.remove('show');
    }
}