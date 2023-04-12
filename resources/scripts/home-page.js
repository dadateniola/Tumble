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


//Set genre positions
let genre = document.querySelectorAll(".genre");
let genreSpace = 0;
for (let i = 0; i < genre.length; i++) {
    genre[i].style.left = `${genreSpace}px`;
    genreSpace += (genre[i].clientWidth + 20);
}

//Select necessary elements
let genreBox = document.querySelector(".genre-box")
let genreNext = document.querySelector(".genre-next")
let genreBack = document.querySelector(".genre-back")
let genreActive = 0;
let genreDistance = 0;
let genreDisabled = false;

//Click event to move the slideshos by active elements width
genreNext.addEventListener("click", () => {
    if (genreDisabled != true) {
        genrePositioning((genreActive + 1))
        let active = genre[genreActive].clientWidth + 17;
        genreDistance += active;
        genreBox.style.transform = `translateX(-${genreDistance}px)`;
        genreActive++;
    } else {
        return;
    }
})

//Click event to move the slideshows back by active elements width
genreBack.addEventListener("click", () => {
    if (genreActive != 0) {
        let active = genre[genreActive - 1].clientWidth + 17;
        genreDistance -= active;
        genreBox.style.transform = `translateX(-${genreDistance}px)`;
        genreActive--;
        genreDisabled = false;
    } else {
        return;
    }
})

function genrePositioning(start) {
    let genreCont = document.querySelector(".genre-cont");
    let genreContWidth = genreCont.clientWidth;
    let genreWidth = 0;
    let lastGenre = 0;
    for (let i = start; i < genre.length; i++) {
        genreWidth += genre[i].clientWidth + 17;
        if (genreWidth >= genreContWidth) {
            if (i == 0) {
                lastGenre = 0;
                break;
            } else {
                lastGenre = i - 1;
                break;
            }
        } else if (genreWidth < genreContWidth && i == genre.length - 1) {
            lastGenre = genre.length - 1;
            genreDisabled = true;
        }
    }
}

window.onresize = () => {
    genreActive = 0;
    genreDistance = 0;
    genreDisabled = false;
    genreBox.style.transform= "translateX(0px)"
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