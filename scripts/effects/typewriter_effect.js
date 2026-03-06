const speed = 375; // MS
const pauseDuration = 1000; // MS

const prefix = "@";
const domain = "tear";
const tld = ".wtf";

let deleting = false;
let index = 0;

const text = domain + tld;
const textLength = text.length;

function typewriter() {
  if (!deleting && index < textLength) {
    document.title = prefix + text.slice(0, index + 1);
    index++;
    setTimeout(typewriter, speed);

  } else if (!deleting && index === textLength) {
    deleting = true;
    setTimeout(typewriter, pauseDuration); 

  } else if (deleting && index > 0) {
    index--;
    document.title = prefix + text.slice(0, index);
    setTimeout(typewriter, speed);

  } else {
    deleting = false;
    index = 0;
    setTimeout(typewriter, speed); 
  }
}

typewriter();