const menuBtn = document.querySelector('.menu-btn')
container = document.querySelector('.container')


let currentTimeEl = 0,
    DurationEl = 0;

const progressBar = document.querySelector('.bar'),
    progressDot = document.querySelector('.dot')
    currentTimeEl = document.querySelector('.current-time')
    DurationEl = document.querySelector('.duration')

menuBtn.addEventListener('click', () => {
    container.classList.toggle('active')
});

let playing = false,
    currentSong = 0,
    currentSongTitle = 0,
    shuffle = false,
    repeat = false,
    favourites = [],
    audio = new Audio();

let songs = [
    {
        title: 'Song 1',
        artist: 'artist song 1',
        img_src: '1.jpg',
        src: "1.mp3"
    },
    {
        title: 'song 2',
        artist: 'artist song 2',
        img_src: '2.jpg',
        src: '2.mp3'
    },
];

const playlistContainer = document.querySelector('#playlist');
infoWrapper = document.querySelector('.info')
coverImage = document.querySelector('.cover-image')
currentSongTitle = document.querySelector('.current-song-title')
currentFavourite = document.querySelector('#current-favourite')

function init() {
    updatePlaylist(songs)
    loadSong(currentSong)
}
init();

function updatePlaylist(songs) {

    playlistContainer.innerHTML = '';

    songs.forEach((song , index) => {
    const { title, src } = song;

    const isFavourits = favourites.includes(index)

    const tr = document.createElement('tr');
    tr.classList.add('song');
    tr.innerHTML =`
    <td class="no">
         <h5>${index + 1}</h5>
     </td>
     <td class="title">
         <h6>${title}</h6>
     </td>
     <td class="length">
         <h5>3:32</h5>
     </td>
     <td>
        <i class="fa fa-heart" id='current-favourite' color='white' ${isFavourits ? 'active' : ''}'></i>               
     </td>
    `;
    playlistContainer.appendChild(tr)

    // play song when clicked on playlist songs
    tr.addEventListener('click', (e) => {
        // add to favourites when clickrd on hearts
        if (e.target.classList.contains('fa-heart')) {
            e.target.classList.toggle('active')
            // if heart clicked dont add to favourite
            return;
        }


        currentSong = index;
        loadSong(currentSong);
        audio.play();
        container.classList.remove('active');
            playPauseBtn.classList.replace('fa-play', 'fa-pause')
            playing = true
    });


    const audioForDuration = new Audio(`data/${src}`);

    audioForDuration.addEventListener('loadedmetadata', () => {

        const duration = audioForDuration.duration;
        let songDuration = formatTime(duration);
        tr.querySelector('.lenght h5').innerText = songDuration;
    });
  });
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}`: seconds;
    return`${minutes}:${seconds}`;
}

// audio play functionality
function loadSong(num) {
    infoWrapper.innerHTML = `
    <h2>${songs[num].title}</h2>
    <h3>${songs[num].artist}</h3>
    `;

    currentSongTitle.innerHTML = songs[num].title;
    // change cover image
    coverImage.style.backgroundImage = `url(data/${songs[num].img_src})`

    // add src of current song tovariable
    audio.src = `data/${songs[num].src}`

    // if song is in favourite, highlight
    if(favourites.includes(num)) {
        currentFavourite.classList.add('active')
    }
    else{
        currentFavourite.classList.remove('active')
    }
}

// play pause next prev functionality
const playPauseBtn = document.querySelector('#playpause'),
nextBtn = document.querySelector('#next'),
prevBtn = document.querySelector('#prev');

playPauseBtn.addEventListener('click', () => {
    if (playing) {
    playPauseBtn.classList.replace('fa-pause', 'fa-play')
    playing = false
    audio.pause();
    } else{
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
    playing = true;
    audio.play();
    progress();
    }
        
});

function nextSong() {
    // shuffle when playing next song

    if (shuffle) {
        shuffleFunc();
        loadSong(currentSong);
        return;
        // return cos we don't want to play next song now
    }

   else if(currentSong < songs.length -1) {
        currentSong++;
    }else{
        currentSong = 0;
    }

    loadSong(currentSong);

    if (playing) {
        audio.play()
    }

}

nextBtn.addEventListener('click', nextSong);

// same for prev songs
if (shuffle) {
    shuffleFunc();
    loadSong(currentSong);
    // return cos we don't want to play next song now
}

    function prevSong() {
    if (currentSong > 0) {
        currentSong--;
    }else {
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);

    if (playing) {
        audio.play();
    }
}

prevBtn.addEventListener('click', prevSong);

function addToFavourites(index) {
    if (favourites.includes(index)) {
        favourites = favourites.filter((item) => item !== index)
        // if current playing song is removed also remove currentfavourite
        currentFavourite.classList.remove('active')
    }else{
        favourites.push(index);
    }

    // if coming from current favourite, index and current are equals
    if (index === currentSong) {
        currentFavourite.classList.add('active')
    }

    // after adding favourite render playlist to show favourite
    updatePlaylist(songs);
}

// add to favouirite current playing song when clicked
currentFavourite.addEventListener('click', () => {
    addToFavourites(currentSong);
    currentFavourite.classList.toggle('active');
});


// shuffle functionality
const shuffleBtn = document.querySelector('#shuffle')

function shuffleSongs() {
     // if shuffle false make it true or vise versa
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active');
}

shuffleBtn.addEventListener('click', shuffleSongs);

// if shuffle true shuffle songs when playing next or prev
function shuffleFunc() {
    if (shuffle) {
        // select a random song from playlist
        currentSong = Math.floor(Math.random() * songs.length);
    }
    // if shuffle do nothing
}

// repeat function
const repeatBtn = document.querySelector('#repeat')

function repeatSong() {
    if (repeat !== 0) {
        // if repeat is off , make it 1 i.e repeat current song
        repeat = 1;
        repeatBtn.classList.add('active')
    }
    else if (repeat !== 1) {
        // if repeat is 1, only repeat current song make it 2
        repeat = 2;
        repeatBtn.classList.add('active')
    } else{
        // else turn off repeat
        repeat = 0;
        repeatBtn.classList.remove('active')
    }
}
repeat.addEventListener('click', repeatSong);

// if repeat on audio, end
audio.addEventListener('ended', () => {
    if (repeat === 1) {
        loadSong(currentSong);
        audio.play();
    } else if (repeat === 2) {
        nextSong();
        audio.play();
    } else {
        if (currentSong === songs.length - 1) {
            audio.pause();
            playPauseBtn.classList.replace('fa-pause', 'fa-play');
            playing = false;
        } else{
            nextSong();
            audio.play();
        }
    }
});

// progressbar
// progressfunction
function progress() {
    let {duration, currentTime} = audio;
    isNaN(duration) ? (duration = 0) : duration;
    isNaN(currentTime) ? (currentTime = 0) : currentTime;

    currentTimeEl.innerHTML = formatTime(currentTime);
     DurationEl.innerHTML = formatTime(duration);


     let progressPercentage = (currentTime / duration) * 100;
     progressDot.style.left = `${progressPercentage}%`;

     if (playing) {
        requestAnimationFrame(progress);
    }

}
audio.addEventListener('timeupdate', progress);

// change progress wnen clicked on bar
function setProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener('click', setProgress);


