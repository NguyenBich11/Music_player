const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const audio = $('#audio');
const progress = $('#progress');
const btnNext = $('.btn-next');
const btnPrev = $('.btn-prev');
const btnRandom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Ai cho tôi lương thiện',
            singer: 'Trang Pháp, Thu Phương, Lan Ngọc',
            path: 'asset/music/aichotoiluongthien.mp3',
            img: 'asset/img/ai-cho-toi-luong-thien.jpg'
        }, 
        {
            name: 'At the top',
            singer: 'Trang Pháp',
            path: 'asset/music/atthetop.mp3',
            img: 'asset/img/trang-phap.jpg'
        }, 
        {
            name: 'Chỉ là',
            singer: 'Trang Pháp',
            path: 'asset/music/chila.mp3',
            img: 'asset/img/chi-la.jpg'
        }, 
        {
            name: 'Chocolate',
            singer: 'Trang Pháp',
            path: 'asset/music/chocolate.mp3',
            img: 'asset/img/chocolate.jpg'
        }, 
        {
            name: 'Dân chơi sao phải khóc',
            singer: 'Andree Right Hand, Rhyder, WOKEUP',
            path: 'asset/music/DanChoiSaoPhaiKhoc.mp3',
            img: 'asset/img/dan-choi-sao-phai-khoc.jpg'
        }, 
        {
            name: 'Hoa dưới mặt trời',
            singer: 'Chi Pu',
            path: 'asset/music/HoaDuoiMatTroi.mp3',
            img: 'asset/img/hoa-duoi-mat-troi.jpg'
        }, 
        {
            name: 'Là anh',
            singer: 'Trang Pháp',
            path: 'asset/music/Laanh.mp3',
            img: 'asset/img/trang-phap.jpg'
        }, 
        {
            name: 'MASHUP MÁI ĐÌNH LÀNG BIỂN & LÝ KÉO CHÀI',
            singer: 'TRANG PHÁP, MỸ LINH, UYÊN LINH, LYNK LEE, NGUYÊN HÀ',
            path: 'asset/music/MashupLyKeoChai.mp3',
            img: 'asset/img/mai-dinh-ly-keo-chai.jpg'
        }, 
        {
            name: 'Mặt trời của em',
            singer: 'Phương Ly',
            path: 'asset/music/MatTroiCuaEmDaeronMix.mp3',
            img: 'asset/img/mat-troi-cua-em.jpg'
        }, 
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                    <div class="thumb" 
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Xử lý CD quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function() {
           const scollTop = window.scrollY || document.documentElement.scrollTop;
           const newCdWidth = cdWidth - scollTop;
           
           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
           cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click Play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();

            }else {
                if(audio.src !== '') {
                    audio.play();
                }
            }
        }

        // Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bài hát bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song
        btnNext.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        }

        // Khi prev song
        btnPrev.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong();
            }else  {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }

        // Xử lý khi bật/ tắt random song
        btnRandom.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        }
        
        // Xử lý lặp lại 1 bài hát
        btnRepeat.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat); 
        }

        // Xử lý audio ended
        audio.onended = function(e) {
            if(_this.isRepeat) {
                audio.play();
            }else {
                btnNext.click();
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    loadCurentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurentSong();
    },
    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex);
        
        this.currentIndex = newIndex;
        this.loadCurentSong();
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        //Địn nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện(DOM events)
        this.handleEvent();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng 
        this.loadCurentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat); 
    }
}

app.start();