const hero = document.querySelector(".hero");
const heroBox = document.querySelectorAll(".hero-box");
const heroImg = document.querySelectorAll("#hero-box-img");
const heroSlider = document.querySelector(".hero-slider");

window.onload = () => {
    setHeroBoxesAndButtons();
}

function setHeroBoxesAndButtons() {
    if (heroBox.length <= 0) {
        hero.style.backgroundImage = "url(/images/services.jpg)";
        return;
    }
    //Set index to hero boxes
    for (let i = 0; i < heroBox.length; i++) {
        heroBox[i].dataset.index = i;
    }
    //Creates the respective buttons for each hero box
    for (let i = 0; i < heroImg.length; i++) {
        if (i > 2) break;
        let source = heroImg[i].src;
        if (source) {
            let heroSlide = document.createElement("div");
            heroSlide.classList.add("hero-slide");
            let image = document.createElement("img");
            image.src = source;
            image.dataset.index = i;
            heroSlider.appendChild(heroSlide);
            heroSlide.appendChild(image);
        } else {
            hero.style.background = "url(/images/services.jpg) no-repeat";
            return;
        }
    }

    //Add event listeners to the buttons that switch between images
    let heroSliderImg = document.querySelectorAll(".hero-slider img")
    for (let i = 0; i < heroSliderImg.length; i++) {
        heroSliderImg[i].addEventListener("click", setActiveHero)
    }

    heroBox[0].classList.add("active")
    heroSliderImg[0].classList.add("active")
}

function setActiveHero(e) {
    let heroSliderImg = document.querySelectorAll(".hero-slider img")
    let imageIndex = e.target.dataset.index;
    let activeHero = document.querySelector(`.hero-box[data-index="${imageIndex}"]`)
    for (let i = 0; i < heroBox.length; i++) {
        if (i > 2) break;
        heroBox[i].classList.remove("active");
        heroSliderImg[i].classList.remove("active");
    }
    activeHero.classList.add("active")
    e.target.classList.add("active")
}

$('.owl-recommended').owlCarousel({
    loop:false,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:2,
        },
        1000:{
            items: 3,
        },
        1300:{
            items: 4,
        }
    }
})
$('.owl-short').owlCarousel({
    loop:false,
    margin:10,
    responsiveClass:true,
    responsive:{
        0:{
            items:2,
        },
        1000:{
            items: 3,
        },
        1300:{
            items: 4,
        }
    }
})