'use strict';

(() => {
    const $ = (selector) => document.querySelector(selector)

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

    let frequencyData = []
    let weightedFrequencyData = []
    const analyze = (step = 1/30, audioBuffer, offlineContext, analyzer, nextTime, source) => {        
        offlineContext.suspend(nextTime).then(() => {
            let test = new Uint8Array(analyzer.frequencyBinCount)

            analyzer.getByteFrequencyData(test)
            frequencyData.push( [offlineContext.currentTime, test] )

            nextTime += step

            offlineContext.resume()
            
            if (nextTime < audioBuffer.duration) return analyze(step, audioBuffer, offlineContext, analyzer, nextTime, source)
        }).catch((error) => {
            nextTime = offlineContext.currentTime + step*2
            return analyze(step, audioBuffer, offlineContext, analyzer, nextTime, source)
        })
    }

    const handleAudio = (audio) => {
        let audioContext = new AudioContext()
        audio.arrayBuffer()
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                console.log(audioBuffer)

                let offlineContext = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate)

                let analyzer = offlineContext.createAnalyser()
                analyzer.fftSize = 256
                analyzer.smoothingTimeConstant = 0.7
                analyzer.connect(offlineContext.destination)

                let source = offlineContext.createBufferSource()
                source.buffer = audioBuffer
                source.connect(analyzer)

                source.start()  
                offlineContext.startRendering().then(() => {
                    frequencyData.sampleRate = audioBuffer.sampleRate
                    applyAWeightingToFrequencyData(frequencyData, audio)
                })

                let nextTime = 0
                frequencyData = []
                analyze(1/24, audioBuffer, offlineContext, analyzer, nextTime, source)
            })
    }

    let aWeightFrequency = [
        10, 12.5, 16, 20, 
        25, 31.5, 40, 50, 
        63, 80, 100, 125, 
        160, 200, 250, 315, 
        400, 500, 630, 800, 
        1000, 1250, 1600, 2000, 
        2500, 3150, 4000, 5000,
        6300, 8000, 10000, 12500, 
        16000, 20000 
    ]        
    let aWeightDecibels = [
        -70.4, -63.4, -56.7, -50.5, 
        -44.7, -39.4, -34.6, -30.2, 
        -26.2, -22.5, -19.1, -16.1, 
        -13.4, -10.9, -8.6, -6.6, 
        -4.8, -3.2, -1.9, -0.8, 
        0.0, 0.6, 1.0, 1.2, 
        1.3, 1.2, 1.0, 0.5, 
        -0.1, -1.1, -2.5, -4.3, 
        -6.6, -9.3 
    ]
    const linterp = (x, y, xx) => {      
        let result = 0.0
        let found = false

        if (x[0] > xx) {
            result = y[0]
            found = true
        }

        if (!found) {
            for (let i = 1; i < x.length; i++) {
                if (x[i] > xx) {
                    result = y[i-1] + ((xx - x[i-1]) / (x[i] - x[i-1])) * (y[i] - y[i-1]);
                    found = true
                    break
                }
            }
        }

        if (!found) {
            result = y[y.length-1]
        }

        return result
    }
    const calculateAWeightingDBAtFrequency = (frequency) => {
        return 50**(linterp(aWeightFrequency, aWeightDecibels, frequency)/50)
    }

    const applyAWeightingToFrequencyData = (frequencyData, audio) => {
        weightedFrequencyData = []
        for (let i=0; i<frequencyData.length; i++) {
            let data = frequencyData[i]
            let ff = [ data[0], [] ]
            for (let f=0; f<data[1].length; f++) {
                let frequency = (f+1)/data[1].length * frequencyData.sampleRate/2
                let weighted = data[1][f]
                // if (i===0) {
                //     console.log(weighted, data[1][f])
                //     console.log(frequency)
                // }

                if (frequency<=20000) ff[1].push( weighted )
            }
            weightedFrequencyData.push( ff )
        }
        console.log(weightedFrequencyData, frequencyData)
        handleVisualizer(audio)
    }

    const handleVisualizer = (audio) => {
        $('#preview_audio').src = URL.createObjectURL(audio)
    }

    const ctx = $('#visualizer').getContext('2d')

    let canvasAnimationFrame
    let drawFrame = null
    const updateCanvas = () => {
        let time = $('#preview_audio').currentTime
        // let frame = frequencyData[Math.floor(time*30)]
        // let frame = null
        // let framei = 0
        // while (time < frequencyData[framei][0]) {
        //     console.log(frequencyData[framei][0], time)

        //     drawFrame = frequencyData[framei]
        //     framei++
        // }
        for (let i=0; i<weightedFrequencyData.length; i++) {
            if (time < weightedFrequencyData[i][0]) break
            drawFrame = weightedFrequencyData[i]
        }

        ctx.clearRect(0,0,800,200)
        for (let i=0; i<drawFrame[1].length; i++) {
            let height = drawFrame[1][i] / 256 * 200
            let x = Math.pow(i/drawFrame[1].length,1/2)*(800)
            ctx.fillRect(x, 200-height, 1, height)


        }

        if (!$('#preview_audio').paused) window.requestAnimationFrame(updateCanvas)
    }
    $('#preview_audio').addEventListener('play', () => {
        canvasAnimationFrame = window.requestAnimationFrame(updateCanvas)
    })

    $('#audio_upload').addEventListener('change', e => {
        handleFiles( $('#audio_upload').files )
    })
})();