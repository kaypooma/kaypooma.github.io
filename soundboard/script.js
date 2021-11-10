// const sounds = ['21', 'airhorn', 'amogus_scream', 'amogus', 'aou', 'bonk', 'bruh', 'crowd_laughing', 'deez_nuts', 'dialup', 'ding', 'dubstep', 'eas_one', 'eas_two', 'epic_fail', 'fl_studio_render', 'flight_cry', 'flight_scream', 'fnaf_ambience', 'fnaf_jumpscare', 'geometry_dash', 'glass', 'grandma', 'jack_black', 'mammot', 'mouse_click', 'no_i_not', 'oh_my_god', 'porch', 'ps2_startup', 'pussy', 'ragdoll_sounds', 'reverb_fart', 'role_reveal', 'samsung_notification', 'squeak', 'suspense_1', 'suspense_2', 'suspense_3', 'suspense_4', 'suspense_5', 'suspense_6', 'swoosh', 'vine_boom', 'wet_fart', 'what_da_dog_doin', 'whip', 'wii_freeze', 'windows_95', 'windows_xp', 'wrong', 'you_stupid'];
const sounds = [
    // speech
    'you_stupid', 'no_i_not', '21', 'amogus_scream', 'amogus', 'aou', 'boyfriend', 'bruh', 'deez_nuts', 'flight_cry', 'flight_scream', 'grandma', 'jack_black', 'mammot', 'oh_my_god', 'porch', 'pussy', 'scream2', 'what_da_dog_doin', 'whip',
    '----',
    // sound effects
    'airhorn', 'bfdi_cheering', 'bonk', 'boowomp', 'crowd_laughing', 'dialup', 'dubstep', 'eas_one', 'eas_two', 'epic_fail', 'fl_studio_render', 'fnaf_ambience', 'fnaf_jumpscare', 'geometry_dash', 'krabs', 'ps2_startup', 'ragdoll_sounds', 'role_reveal', 'samsung_notification', 'squeak', 'swoosh', 'vine_boom', 'wii_freeze', 'windows_95', 'windows_xp',
    '----',
    // fart
    'reverb_fart', 'wet_fart', 'short_fart', 
    '----',
    // ding buzzer
    'ding', 'wrong', 'mouse_click', 'glass', 
    '----',
    // suspense
    'suspense_1', 'suspense_2', 'suspense_3', 'suspense_4', 'suspense_5', 'suspense_6'
];
const audioContext = new window.AudioContext();

(() => {
    const $ = (s) => document.querySelector(s)
    const audioQueue = {}

    let volume = 0.5
    let speed = 1

    let reverse = false
    $('#reverse').addEventListener('click', () => {
        reverse = $('#reverse').checked
    })
    
    const parseName = (name) => name.replace(/\_/g, ' ')

    const playSound = (name) => {
        let tag = `${name}.${Date.now()}`

        const audio = new Audio()
        audio.src = `sounds/${name}.ogg`

        audio.volume = 0.2 * volume
        audio.playbackRate = speed
        audio.play()        

        audioQueue[tag] = audio
        audio.addEventListener('ended', () => { removeSound(tag) })
    }
    const playSoundReverse = (name) => {
        let tag = `${name}.${Date.now()}`

        fetch(`sounds/${name}.ogg`)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                let tag = `${name}.${Date.now()}`

                let reversedBuffer = audioBuffer
                
                Array.prototype.reverse.call( reversedBuffer.getChannelData(0) )
                Array.prototype.reverse.call( reversedBuffer.getChannelData(1) )        

                const soundSource = audioContext.createBufferSource()

                const gainNode = audioContext.createGain()
                gainNode.gain.value = 0.2 * volume
                gainNode.connect(audioContext.destination)

                soundSource.playbackRate.value = speed

                soundSource.buffer = reversedBuffer
                soundSource.connect(gainNode)

                soundSource.start()

                audioQueue[tag] = soundSource
                soundSource.addEventListener('ended', () => { removeSound(tag) })
            })
    }

    const removeSound = (tag) => {
        if (audioQueue[tag]) {
            if (Object.prototype.toString.call(audioQueue[tag]) === '[object HTMLAudioElement]') { // audio tag
                audioQueue[tag].pause()
                audioQueue[tag].remove()
            } else { // audio buffer
                audioQueue[tag].stop()
                audioQueue[tag].disconnect()
            }

            delete audioQueue[tag]
        }
    }
    const stopAllSound = () => {
        for (tag in audioQueue) {
            removeSound(tag)
        }
    }

    $('#stopall').addEventListener('click', () => { stopAllSound() })
    document.addEventListener('keydown', e => {
        if (e.key === 's') stopAllSound()
    })

    $('#random').addEventListener('click', () => {
        playSound( sounds[Math.floor(Math.random()*sounds.length)] )
    })

    const setVolume = (vol) => {
        volume = vol
        $('#volumelabel').innerHTML = `volume: ${vol}`
        
        for (tag in audioQueue) {
            audioQueue[tag].volume = 0.2*volume
        }
    }
    $('#volume').addEventListener('input', () => {
        setVolume( $('#volume').value/100 )
    })
    $('#volume').addEventListener('dblclick', e => {
        e.preventDefault()

        $('#volume').value = 50
        setVolume( 0.5 )
    })

    const setSpeed = (s) => {
        speed = s
        $('#speedlabel').innerHTML = `speed: ${s}`
        
        for (tag in audioQueue) {
            audioQueue[tag].playbackRate = s
        }
    }
    $('#speed').addEventListener('input', () => {
        setSpeed( $('#speed').value/100 )
    })
    $('#speed').addEventListener('dblclick', e => {
        e.preventDefault()
        
        $('#speed').value = 100
        setSpeed( 1 )
    })

    const addSeperator = () => {
        const hr = document.createElement('hr')
        $('main').appendChild(hr)
    }
    const addToSoundboard = (name) => {
        const btn = document.createElement('button')

        btn.id = name
        btn.innerHTML = parseName(name)

        btn.addEventListener('click', () => { 
            if (reverse) {
                playSoundReverse(name)
            } else {
                playSound(name) 
            }
        })

        $('main').appendChild(btn)
    }

    for (sound of sounds) {
        if (sound === '----') {
            addSeperator()
        } else {
            addToSoundboard(sound)            
        }
    }
})();