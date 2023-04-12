var navBar = document.querySelector(".navbar");
var links = document.querySelectorAll(".links a");
var menuLinks = document.querySelectorAll(".menu-links a");

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", () => {
        let name = links[i].innerHTML.toLowerCase().split(" ");
        let page = document.getElementById(`${name[0]}`);
        if (page) page.scrollIntoView();
        else return;

    })
    menuLinks[i].addEventListener("click", () => {
        let name = menuLinks[i].innerHTML.toLowerCase().split(" ");
        let page = document.getElementById(`${name[0]}`);
        if (page) page.scrollIntoView();
        else return;

    })
}

let space = 10

window.onload =  servicesBoxSpacing(space);

window.addEventListener("resize", () => {
    servicesBoxSpacing(space)
})

window.onscroll = () => {
    if (window.scrollY > 100) {
        if(navBar.classList.contains("active")) return;
        navBar.classList.add("active")
    } else {
        navBar.classList.remove("active")
    }
}

function servicesBoxSpacing(margin = 0) {
    var servicesBox = document.querySelectorAll(".services-box");
    let width = servicesBox[0].clientWidth;
    let spacing = 0;
    for(let i = 0; i < servicesBox.length; i++) {
        servicesBox[i].style.left = `${spacing}px`;
        spacing += (width + margin);
    }
}

let menuBtn = document.getElementById("menu-btn");
let menuBox = document.querySelector(".menu-box");
let closeBtn = document.querySelector(".close-menu")

closeBtn.addEventListener("click", () => {
    menuBox.classList.remove("active")
    document.body.classList.remove("stop")
    setTimeout(() => {
        menuBox.style.zIndex = -1;
    }, 500)
})

menuBox.addEventListener("click", (e) => {
    let val = e.target.classList;
    if(!Object.values(val).includes("menu-box")) return;
    menuBox.classList.remove("active")
    document.body.classList.remove("stop")
    setTimeout(() => {
        menuBox.style.zIndex = -1;
    }, 500)
})

menuBtn.addEventListener("click", () => {
    menuBox.style.zIndex = 20;
    menuBox.classList.add("active")
    document.body.classList.add("stop")
})