function focus(a) {
    const sections = document.getElementsByClassName('section')
    for (s of sections) {
        s.classList.remove('section_active')
    }

    document.getElementById(a).classList.add('section_active')
}

function focus_instant(a) {
    const sections = document.getElementsByClassName('section')
    for (s of sections) {
        s.classList.remove('section_active')
        s.classList.add('section_instant')
    }

    document.getElementById(a).classList.add('section_active')
}

let menuActive = false
window.addEventListener('load', (event) => {
    let focused = window.location.hash.substring(1) || 'main'

    focus_instant('s_' + focused)

    if (focused !== 'main') {
        document.getElementById('menu_button').classList.add('mb_active')
        document.getElementById('menu_divider').classList.add('md_active')
        document.getElementById('menu_bg_transition').classList.add('mbg_active')

        document.getElementById('favicon_tag').href = 'favicon_light.png'

        for (const m of menuItems) {
            m.classList.add('mi_active')
        }

        menuActive = true        
    }
})

const menuItems = document.getElementById('menu').children

// handle menu button
document.getElementById('menu_button').addEventListener('click', () => {
    if (menuActive) {
        document.getElementById('menu_button').classList.remove('mb_active')
        document.getElementById('menu_divider').classList.remove('md_active')
        document.getElementById('menu_bg_transition').classList.remove('mbg_active')

        document.getElementById('favicon_tag').href = 'favicon_dark.png'

        for (const m of menuItems) {
            m.classList.remove('mi_active')
        }

        menuActive = false
    } else {
        document.getElementById('menu_button').classList.add('mb_active')
        document.getElementById('menu_divider').classList.add('md_active')
        document.getElementById('menu_bg_transition').classList.add('mbg_active')

        document.getElementById('favicon_tag').href = 'favicon_light.png'

        for (const m of menuItems) {
            m.classList.add('mi_active')
        }

        menuActive = true
    }
})

// clicking list items shows section specified in data attribute
for (const m of menuItems) {
    m.addEventListener('click', () => {
        focus('s_' + m.dataset.section)
        window.history.replaceState(null, null, '#'+m.dataset.section);

        const sections = document.getElementsByClassName('section')
        for (s of sections) {
            s.classList.remove('section_instant')
        }
    })
}

// back button
const backButtons = document.getElementsByClassName('back_to_main')
for (const b of backButtons) {
    b.addEventListener('click', () => {
        focus('s_main')
        window.history.replaceState(null, null, '#main');

        const sections = document.getElementsByClassName('section')
        for (s of sections) {
            s.classList.remove('section_instant')
        }
    })
}

// simf ile
const fileData = {
    ecran: {
        title: 'Écran le Blanc',
        artist: 'Miho Tsujibayashi',
        difficulty: '<span class="normal">9</span> / <span class="slumpage">13</span>',
        description: 'first file with a difficulty under 10',

        date: '2020-08-24',

        youtube: 'https://www.youtube.com/watch?v=hostdOlQtl4',
        download: 'https://drive.google.com/file/d/1jCnyNt8Fk2-0azOT6RcBBzU97WbcC4YB/view'
    },
    hanavision: {
        title: 'Hanavision',
        artist: 't+pazolite',
        difficulty: '<span class="normal">16</span>',
        description: 'collab with sorae for mod rush couples',

        date: '2020-08-17',

        youtube: 'https://www.youtube.com/watch?v=TPIeurHyEHM',
        download: 'https://drive.google.com/file/d/1vaaIg2kJo9vKuZ5Jbxmp1i7tGUXDOwqY/view'
    },
    finorza: {
        title: 'Finorza',
        artist: 'Camellia ft. Nanahira',
        difficulty: '<span class="normal">17</span> / <span class="slumpage">20</span>',
        description: 'Finorza Ball ft. Frames Per Second',

        date: '2020-07-12',

        youtube: 'https://www.youtube.com/watch?v=AvjBVpYoAqA',
        download: 'https://drive.google.com/file/d/1uu5DZHYKxb8Yn-EWSFYQ8fDRmMpePelO/view?usp=sharing'
    },
    clear: {
        title: 'let me be clear',
        artist: '???',
        difficulty: '<span class="normal">1</span>',
        description: 'what',

        date: '2020-06-21',

        youtube: 'none',
        download: 'https://cdn.discordapp.com/attachments/395978682935803905/729344449259372594/let_me_be_clear.zip'
    },
    setmefree: {
        title: 'Set Me Free',
        artist: 'BilliumMoto',
        difficulty: '<span class="normal">10</span>',
        description: 'made in 48 hours for mod rush 2<br><br>most of those 48 hours was spent creating bitmaptext actors',

        date: '2020-06-02',

        youtube: 'https://www.youtube.com/watch?v=AYAJU_o201E',
        download: 'https://drive.google.com/file/d/1I42fILoAvtdEmG68m4q3xSNwxTqFpppH/view?usp=sharing'
    },
    frobenioid: {
        title: 'Abyss of Frobenioid',
        artist: 'Camellia',
        difficulty: '<span class="normal">15</span>',
        description: 'abyss of i never spell this title correctly first try',

        date: '2020-04-30',

        youtube: 'https://www.youtube.com/watch?v=f-4FMhZQzaU',
        download: 'https://drive.google.com/file/d/1EUY_tVM9KkGZu5lFh4W6yfbhCXU2tTss/view?usp=sharing'
    },
    primitive: {
        title: 'Primitive Vibes',
        artist: 'lapix',
        difficulty: '<span class="normal">13</span>',
        description: 'collab with NotITGfan61',

        date: '2020-04-15',

        youtube: 'https://www.youtube.com/watch?v=QrmaIBGS1aI',
        download: 'https://drive.google.com/file/d/1_cljzI-jGaGAmUfu2UGUP7TVxY3Km47J/view?usp=sharing'
    },
    sss: {
        title: '666',
        artist: 'RoughSketch',
        difficulty: '<span class="normal">14</span> / <span class="slumpage">17</span>',
        description: 'originally hidden in an april fools file with a puzzle that i spent at least 10 minutes on',

        date: '2020-04-11',

        youtube: 'https://www.youtube.com/watch?v=S-WDrvmfvg4',
        download: 'https://drive.google.com/file/d/14tlGp5mxQHjLOyUJtl8Fh4Rffp5Ulj_n/view?usp=sharing'
    },
    flamingo: {
        title: 'Flamingo',
        artist: 'Kero Kero Bonito',
        difficulty: '<span class="normal">12</span>',
        description: 'a normal file to a normal kero kero bonito song',

        date: '2020-04-01',

        youtube: 'none',
        download: 'https://cdn.discordapp.com/attachments/395978682935803905/729351726829666354/flamingo.zip'
    },
    senpai: {
        title: 'Ultimate Senpai',
        artist: 'PinocchioP',
        difficulty: '<span class="normal">13</span>',
        description: 'made in 48 hours for week two of mod rush<br>do you like quads',

        date: '2020-03-24',

        youtube: 'https://www.youtube.com/watch?v=FjYTSikEA38',
        download: 'https://drive.google.com/file/d/1tNVXFGDZ6_wKP6s6rq3VrH_TkLvNs6kn/view?usp=sharing'
    },
    reend: {
        title: 'Re:End of a Dream',
        artist: 'uma vs. モリモリあつし',
        difficulty: '<span class="normal">15</span>',
        description: 'made in 48 hours for week one of mod rush<br>do you like kaypooma files',

        date: '2020-03-24',

        youtube: 'https://www.youtube.com/watch?v=1FbQKNSX-R4',
        download: 'https://drive.google.com/file/d/1IHCfxPL0PboqBhj7WAHp4BpOwi1FHmi2/view?usp=sharing'
    },
    haunted: {
        title: 'Haunted Dance',
        artist: 'Mr. Asyu',
        difficulty: '<span class="normal">14</span> / <span class="slumpage">18</span>',
        description: '<img src="img/2.gif" style="width: 50px;">',

        date: '2020-01-12',

        youtube: 'https://www.youtube.com/watch?v=RADKgfC8HWM',
        download: 'https://drive.google.com/file/d/1VBA2Ns2uB4eVfGLLAHGxB6Lx07IUOKkt/view?usp=sharing'
    },
    adularia: {
        title: 'Adularia',
        artist: 'DJ TOTTO',
        difficulty: '<span class="normal">16</span> / <span class="slumpage">19</span>',
        description: 'stage 6 for Misfits in the Prairie, a sightreading tournament held at RIP 11.5<br><br>also first appearance of auburn',

        date: '2020-01-11',

        youtube: 'https://www.youtube.com/watch?v=Nhho9Epu6aQ',
        download: 'https://www.dropbox.com/s/w0zdsf0tvhczyvv/Misfits.zip'
    },
    oshama: {
        title: 'Oshama Scramble!',
        artist: 't+pazolite',
        difficulty: '<span class="normal">13</span> <span class="old">(old 7)</span>',
        description: 'file that i didn\'t work on for 7 months and then finished in 3 hours',

        date: '2019-11-30',

        youtube: 'https://www.youtube.com/watch?v=unRRGoZvVjQ',
        download: 'https://drive.google.com/file/d/1e4oM_qCq1rDcIgx_to_Ra_9ySumJdCAY/view?usp=sharing'
    },
    orville: {
        title: 'orville2',
        artist: '! ! Today at 6 47 PM',
        difficulty: '<span class="normal">17</span>',
        description: '(loud)',

        date: '2019-11-25',

        youtube: 'none',
        download: 'https://cdn.discordapp.com/attachments/395978682935803905/729346947164536932/orville2.zip'
    },
    veiled: {
        title: 'four veiled stars',
        artist: 'BilliumMoto',
        difficulty: '<span class="normal">12</span> <span class="old">(old 6)</span> / <span class="slumpage">15</span> <span class="old">(old 8)</span>',
        description: 'advanced grass physics',

        date: '2019-09-03',

        youtube: 'https://www.youtube.com/watch?v=Gapyu1-X2MA',
        download: 'https://drive.google.com/file/d/1DHVVevoOczjjHCFTna3rnfPqn5UtkLLg/view'
    },
    meu: {
        title: 'me & u',
        artist: 'succducc',
        difficulty: '<span class="normal">12</span> <span class="old">(old 5)</span> / <span class="slumpage">14</span> <span class="old">(old 7)</span>',
        description: 'remake of my first file',

        date: '2019-04-27',

        youtube: 'https://www.youtube.com/watch?v=LBEy9xV4ncE',
        download: 'https://drive.google.com/file/d/1AAn3fTd5SnyQLRwsHhlZR5PSmUGSnCSE/view'
    },
    viscracked: {
        title: 'VIS::CRACKED',
        artist: 'Frums',
        difficulty: '<span class="normal">15</span> <span class="old">(old 7)</span> / <span class="slumpage">16</span> <span class="old">(old 8)</span>',
        description: 'tried to create a hard file and probably forgot to make it fair',

        date: '2019-03-29',

        youtube: 'https://www.youtube.com/watch?v=2TzMQHp_duc',
        download: 'https://drive.google.com/file/d/1i1_7t1qYX5rmh78BaCNx7vFVn-Q6ZwNc/view'
    },
    nulctrl: {
        title: 'NULCTRL',
        artist: 'Silentroom',
        difficulty: '<span class="normal">11</span> <span class="old">(old 5)</span>',
        description: 'battle against the power of broken monitors against a virtual tv that may or may not be infected',

        date: '2019-02-07',

        youtube: 'https://www.youtube.com/watch?v=m2jBfzbkWzg',
        download: 'https://drive.google.com/file/d/1S9fnfgVnXgGYq6vjoutag56y8UyUvLpO/view'
    },
    furry: {
        title: 'Heartbreak Furry Fandom',
        artist: 'yuuyu_ssry',
        difficulty: '<span class="normal">11</span> <span class="old">(old 5)</span>',
        description: 'collab with XeroOl<br><br>heartbreak funnyism.com random',

        date: '2019-01-22',

        youtube: 'https://www.youtube.com/watch?v=Yk96YGOrYes',
        download: 'https://drive.google.com/file/d/1i6VkIcnRG7zKQwl7v19jjAXnQcRrJhRl/view'
    },
    universe: {
        title: 'Daiuchuu Stage',
        artist: 'Chroma',
        difficulty: '<span class="normal">12</span> <span class="old">(old 6)</span>',
        description: 'windows xp simulator featuring weird flickers',

        date: '2019-01-09',

        youtube: 'https://www.youtube.com/watch?v=ztYFlDVZr6I',
        download: 'https://drive.google.com/file/d/15dTLSB4db4DyorjRe7aC1z5JUOYJdpzi/view'
    },
    perfect: {
        title: 'Pictured as Perfect',
        artist: 'Frums',
        difficulty: '<span class="normal">14</span> <span class="old">(old 6)</span> / <span class="slumpage">19</span> <span class="old">(old 9)</span>',
        description: 'pictured as potato<br><br>chart rhythms are slightly incorrect near the end',

        date: '2018-12-05',

        youtube: 'https://www.youtube.com/watch?v=_GcjKYXGZhk',
        download: 'https://drive.google.com/file/d/1jT4nTyjL47myr8-6pbBpD1s2YyZT90RH/view'
    },
    wonderland: {
        title: 'Wonderland',
        artist: 'Caravan Palace',
        difficulty: '<span class="normal">12</span> <span class="old">(old 5)</span>',
        description: 'the ending is the easiest part of this file',

        date: '2018-11-18',

        youtube: 'https://www.youtube.com/watch?v=cmP2HbsqCvM',
        download: 'https://drive.google.com/file/d/1epRaOjVO_GGZsUu2r_QWcz6XfYwkTsim/view'
    },
    nhelv: {
        title: 'Nhelv',
        artist: 'Silentroom',
        difficulty: '<span class="normal">13</span> <span class="old">(old 6)</span> / <span class="slumpage">14</span> <span class="old">(old 7)</span>',
        description: 'this is a file',

        date: '2018-10-13',

        youtube: 'https://www.youtube.com/watch?v=Dxb8J0bkP3M',
        download: 'https://drive.google.com/file/d/1BqItMJ_NL5IvOVXMLx93Nb7PSdQ5mgNK/view'
    },
    backburn: {
        title: 'Do Back Burn',
        artist: 'PRASTIK DANCEFLOOR',
        difficulty: '<span class="normal">11</span> <span class="old">(old 6)</span> / <span class="slumpage">13</span> <span class="old">(old 7)</span>',
        description: 'hopefully the random mods at the end are readable when you play it',

        date: '2018-09-14',

        youtube: 'https://www.youtube.com/watch?v=12OCXXvSknM',
        download: 'https://drive.google.com/file/d/1CX7TtxijlvurWmVXD8wGhJHdRLiPn2HH/view'
    },
    aleph: {
        title: 'Aleph-0',
        artist: 'LeaF',
        difficulty: '<span class="normal">13</span> <span class="old">(old 6)</span>',
        description: 'the screen is too small i can\'t see the notes<br><br>also apparently the video is missing some mods that the file has so download the file to see the True Experience',

        date: '2018-07-16',

        youtube: 'https://www.youtube.com/watch?v=rnmIHSkdAp8',
        download: 'https://drive.google.com/file/d/1PbT_MixsGRccsajkfxSuetmmyJGMnDkP/view'
    },
    graduating: {
        title: 'GRADUATING FROM SPEEDCORE UNIVERSITY AT 240BPM',
        artist: 'Kero Kero Bonito / McMaNGOS',
        difficulty: '<span class="normal">14</span> <span class="old">(old 7)</span>',
        description: 'wow shaders',

        date: '2018-06-30',

        youtube: 'https://www.youtube.com/watch?v=Yh0_LN7ed00',
        download: 'https://drive.google.com/file/d/1niNU5d1V9VxH719ICeKCamb1zaR2sB1s/view'
    },
    asgore: {
        title: 'ASGORE (Puru Remix)',
        artist: 'Toby Fox',
        difficulty: '<span class="normal">12</span> <span class="old">(old 5)</span>',
        description: 'graphic design is my passion',

        date: '2018-05-18',

        youtube: 'https://www.youtube.com/watch?v=D5jv9BhjXPM',
        download: 'https://drive.google.com/file/d/1ykzub5khB9qlxpsAPNhner5c4OL8B8Wk/view'
    },
    umbrelloid: {
        title: 'umbrelloid 42',
        artist: 'dynastic',
        difficulty: '<span class="normal">11</span> <span class="old">(old 4)</span> / <span class="slumpage">12</span> <span class="old">(old 6)</span>',
        description: 'first released file with some weird charting choices and some weird modding choices',

        date: '2018-05-14',

        youtube: 'https://www.youtube.com/watch?v=qU4Z0swXbUQ',
        download: 'https://drive.google.com/file/d/1UJveMw-IsEhTpy0zpP_6PihvU5P2ts9O/view'
    },
}

for (const fl in fileData) {
    let flap = document.createElement('li')
    flap.dataset.file = fl

    document.getElementById('files_list').appendChild(flap)
}


let textTimeout
let removeTimeout

const files = document.getElementById('files_list').children

for (const f of files) {
    f.innerHTML = fileData[f.dataset.file].title

    f.addEventListener('click', () => {
        const name = f.dataset.file
        const song = fileData[name]

        document.getElementById('files_data').classList.remove('f_switch')
        void document.getElementById('files_data').offsetWidth 
        document.getElementById('files_data').classList.add('f_switch')

        clearInterval(textTimeout)
        clearInterval(removeTimeout)

        for (const _ of document.getElementsByClassName('files_active')) {
            _.classList.remove('files_active')
        }
        f.classList.add('files_active')

        textTimeout = setTimeout(function() {
            for (const d in song) {
                if (d === 'youtube' || d === 'download') {
                    document.getElementById('file_' + d).href = song[d]
                } else {
                    document.getElementById('file_' + d).innerHTML = song[d]
                }
            }
    
            document.getElementById('file_bg').style.backgroundImage = 'url("img/file_img/' + name + '.png")'
    
            const cSize = 18*song.title.length
            if (cSize >= 380) {
                document.getElementById('file_title').style.transform = 'scaleX(' + 380/cSize + ')'
            } else {
                document.getElementById('file_title').style.transform = 'scaleX(1)'
            }
    
            if (song.youtube === 'none') {
                document.getElementById('file_youtube').style.display = 'none'
            } else {
                document.getElementById('file_youtube').style.display = 'inline'
            }        
        }, 150)

        removeTimeout = setTimeout(function() {
            document.getElementById('files_data').classList.remove('f_switch')            
        }, 300)
    })
}

// just to focus the first file automatically
files[0].click()

// music stuff
const greek = 'αβγδεζηθικλμνξοπρςτυφχψω'.split('')
const ztochei = {
    dualtone: {
        date: '2016-08-23',
        color: 'f44236',
    },
    succession: {
        date: '2016-08-23',
        color: 'ea1e63',
    },
    sequence: {
        date: '2016-08-24',
        color: '9c28b1',
    },
    decimal: {
        date: '2016-08-24',
        color: '2196f3',
    },
    mean: {
        date: '2016-08-25',
        color: '00bcd5',
    },
    times: {
        date: '2016-08-25',
        color: '009688',
    },
    lift: {
        date: '2017-01-07',
        color: '4cb050',
    },
    theta: {
        date: '2017-01-23',
        color: 'ccbd30',
    },
    remember: {
        date: '2017-04-27',
        color: 'fe9700',
    },
    today: {
        date: '2018-03-02',
        color: '92b7bf',
    },
    dim: {
        date: '2018-06-25',
        color: '44cf6c',
    },
    reminisce: {
        date: '2018-08-08',
        color: '918c6e',
    },
    return: {
        date: '2018-08-08',
        color: '01394a',
    },
    nightshade: {
        date: '2018-09-06',
        color: '592941',
    },
    fade: {
        date: '2018-09-28',
        color: '388597',
    },
    abnormality: {
        date: '2018-10-19',
        color: 'ff4747',
    },
    sanity: {
        date: '2018-10-22',
        color: '8b4512',
    },
    abstract: {
        date: '2018-11-26',
        color: 'fe7e50',
    },
    augmenting: {
        date: '2019-01-14',
        color: '870080',
    },
    fidelity: {
        date: '2019-05-09',
        color: '651806',
    },
    outsider: {
        date: '2020-04-07',
        color: 'f1f1f1',
    },
}

const zlist = document.getElementById('ztochei_list')
let curz = 0
for (const z in ztochei) {
    const song = ztochei[z]

    // why is javascript
    const litag = document.createElement('li')

    const zctag = document.createElement('div')
    zctag.setAttribute('class', 'ztochei_cover')
    zctag.setAttribute('style', z === 'outsider' ? `background: #${song.color}; color: rgba(0,0,0,0.75)` : `background: #${song.color}`)
    zctag.innerHTML = greek[curz]
    litag.appendChild(zctag)

    const ptag = document.createElement('p')
    ptag.innerHTML = z.charAt(0).toUpperCase() + z.slice(1)
    litag.appendChild(ptag)

    const dtag = document.createElement('span')
    dtag.innerHTML = song.date
    litag.appendChild(dtag)

    const atag = document.createElement('a')
    atag.setAttribute('href', `https://soundcloud.com/kaypooma/${z}`)
    atag.setAttribute('target', '_blank')
    atag.setAttribute('rel', 'noopener noreferrer')

    atag.appendChild(litag)

    zlist.appendChild(atag)
    
    curz+=1
}