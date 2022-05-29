'use strict'

const theme = 'theme';
const dataTheme = 'data-theme';
const themeTab = '.theme-tab';
const switcherBtn = '.switcher-btn';
const dark = 'dark';
const light = 'light';
const open = 'open';
const active = 'active';
let favorited = false;

const modalOpen = '[data-open]';
const modalClose = '[data-close]';
const isVisible = 'is-visible';

const root = document.documentElement;

const albums = [];

// Theme

const toggleTheme = document.querySelector(themeTab);
const switcher = document.querySelectorAll(switcherBtn);
const currentTheme = localStorage.getItem(theme);
const favsButton = document.querySelector('#favs');
const card = document.querySelector('.card');

// Modal

const modal = document.querySelector('#favs-modal');
const favsList = document.querySelector('#favs-list');
const favsLink = document.querySelector('#favs');
const openModal = document.querySelectorAll(modalOpen);
const closeModal = document.querySelectorAll(modalClose);

const sortSelector = document.querySelector('#sort-selector');

const setActive = (elm, selector) => {
    if (document.querySelector(`${selector}.${active}`) !== null) {
        document.querySelector(`${selector}.${active}`).classList.remove(active);
    } elm.classList.add(active);
};

const setTheme = (val) => {
    if(val === dark) {
        root.setAttribute(dataTheme, dark);
        localStorage.setItem(theme, dark);
    } else {
        root.setAttribute(dataTheme, light);
        localStorage.setItem(theme, light);
    }
};

if (currentTheme) {
    root.setAttribute(dataTheme, currentTheme);
    switcher.forEach((btn) => {
        btn.classList.remove(active);
    });

    if (currentTheme === dark) {
        switcher[1].classList.add(active);
    } else {
        switcher[0].classList.add(active);
    }
}

toggleTheme.addEventListener('click', function() {
    const tab = this.parentElement.parentElement;
    if (!tab.className.includes(open)) {
        tab.classList.add(open);
    } else {
        tab.classList.remove(open);
    }
});

for (const elm of switcher) {
    elm.addEventListener('click', function() {
        const toggle = this.dataset.toggle;
        setActive(elm, switcherBtn);
        setTheme(toggle);
    })
}

favsButton.addEventListener('click', function (event) {
    console.log(event);
    console.log('the favs button has been pressed');
});

sortSelector.addEventListener('change', function (event) {
    albums.sort(function (album1, album2) {
        if (album1.release_date < album2.release_date) { // album1 come before album2
            return -1;
        }
        else if (album1.release_date > album2.release_date) {
            return 1;
        }
        else {
            return 0;
        }
    });

    if (sortSelector.value === 'newest-oldest') {
        albums.reverse();
    }

    render();
});

for (const elm of openModal) {
    elm.addEventListener('click', function() {
        const modalId = this.dataset.open;
        document.getElementById(modalId).classList.toggle(isVisible);
    })
}

for (const elm of closeModal) {
    elm.addEventListener('click', function() {
        modal.classList.remove(isVisible);
    })
}

function render() {
    console.log(albums);
    const cardList = document.querySelector(".card");
    const favsList = document.querySelector("#favs-list");

    while (cardList.firstChild) {
        cardList.removeChild(cardList.firstChild);
    }

    while (favsList.firstChild) {
        favsList.removeChild(favsList.firstChild);
    }
        
    for (let single of albums) {
        if (single.favorited) {
            const { album_type, name, release_date, images } = single
            
            const newListItem = document.createElement("li")
            newListItem.innerText = name;

            favsList.appendChild(newListItem);
        }
    }

    for (let single of albums) {
        const { album_type, name, release_date, images } = single
        
        const newListItem = document.createElement("li")
        const newListImg = document.createElement("img")
        const title = document.createElement("h3")
        
        title.innerText = `${name}`
        title.classList.add("song-title")
        
        // newListItem = <li></li>
        newListItem.appendChild(title)
        newListImg.src = `${images[1].url}`
        newListItem.appendChild(newListImg)
        
        // reformat release_date
        let date = release_date.split('-')
        let year = date[0]
        let month = date[1]
        let day = date[2]
        let newDate = `${month}/${day}/${year}`
        
        
        console.log(newDate)
        
        const divBottom = document.createElement("div");
        const divAlbumInfo = document.createElement("div");
        const divHeart = document.createElement("div");
        
        divBottom.appendChild(divAlbumInfo);
        divBottom.appendChild(divHeart);
        
        divAlbumInfo.setAttribute(`class`, `album-info`);
        divAlbumInfo.innerHTML = `${newDate}<br><br><strong>${album_type.toUpperCase()}</strong>`;
        
        divHeart.setAttribute(`class`, `heart`);
        divHeart.innerHTML = `<i class="fa-regular fa-heart"></i>`
        
        
        newListItem.addEventListener('click', function () {
            console.log(single);
            if (single.favorited === true) {
                single.favorited = false;
            } 
            else if ( single.favorited === false ) {
                single.favorited = true;
            }
            render();
        });
        
        switch (single.favorited) {
            case true:
                divHeart.innerHTML = `<i class="fas fa-solid fa-heart"></i>`
                break;
            case false:
                divHeart.innerHTML = `<i class="far fa-heart"></i>`
            default:
                break;
        }

        newListItem.appendChild(divBottom);
        
        const list = document.querySelector(".card")
        list.appendChild(newListItem)
        
        console.log(newListImg)
    }
}

const endpoint = 'https://v1.nocodeapi.com/jamesability/spotify/oEmloKmOocfOxIzP/artists?id=4AT7XlLBevgZIiKvZQ83ye&queryType=albums'

// This gets the data from the Spotify endpoint
const jamesPromise = fetch(endpoint)
jamesPromise
.then(res => { return res.json() })
    .then(data => {
        // for every single that we get from spotify,
        // define a favorited property on it. set it to false
        // at first.
        console.log(data)
        console.log(data.items)
        for (const single of data.items) {
            console.log(single)
            single.favorited = false;
                albums.push(single);
            }
            return 42;
        }
    )
    .then(resultOfLastPromise => { render() })
