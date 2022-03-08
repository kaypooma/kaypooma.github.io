'use strict';

const upload = document.getElementById('audioupload')
const audioContext = new window.AudioContext()

document.getElementById('generate').addEventListener('click', () => {
    handleFiles( upload.files )
})

const settings = { samplesPerCharacter: 44100 }
settings.updateTiming = (inValue, inSeconds) => {
    let value = inSeconds ? Math.round(inValue*44100) : inValue
    settings.samplesPerCharacter = value

    document.getElementById('samplesPerCharacter').value = settings.samplesPerCharacter
    document.getElementById('secondsPerCharacter').value = settings.samplesPerCharacter / 44100
}

settings.updateTiming(3675, false)

const handleFiles = (files) => {
    let audio

    for (let file of files) {
        if (file.type.indexOf('audio/') > -1) {
            audio = file
            break
        }
    }

    handleAudio(audio)
}

const handleAudio = (audio) => {
    let reader = new FileReader()
    reader.onload = generateSound

    reader.readAsDataURL(audio)
}

const generateSound = e => {
    let sound = {}

    sound.original = new wavefile.WaveFile()
    sound.processed = new wavefile.WaveFile()

    // store original audio in sound.original
    sound.original.fromDataURI(e.target.result)

    sound.original.toSampleRate(44100)
    sound.original.toBitDepth('8')

    // store buffer
    let originalBuffer = Array.from(sound.original.data.samples)
    let slice = originalBuffer.slice(0, settings.samplesPerCharacter*2 > originalBuffer.length ? originalBuffer.length-1 : settings.samplesPerCharacter*2-1)

    let processedBuffer = []
    let text = document.getElementById('text').value.slice('')
    for (let i=0; i<text.length; i++) {
        if (text[i] !== ' ') {
            processedBuffer.push(...slice)
        } else {
            let empty = []

            empty.length = settings.samplesPerCharacter*2
            empty.fill(128)

            processedBuffer.push( ...empty )
        }
    }

    sound.processed.fromScratch(2, 44100, '8', processedBuffer)

    document.getElementById('output').src = sound.processed.toDataURI()
}

document.getElementById('samplesPerCharacter').addEventListener('change', () =>
    settings.updateTiming(parseFloat(document.getElementById('samplesPerCharacter').value), false)
)
document.getElementById('secondsPerCharacter').addEventListener('change', () =>
    settings.updateTiming(parseFloat(document.getElementById('secondsPerCharacter').value), true)
)