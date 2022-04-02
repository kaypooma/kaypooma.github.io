'use strict';

import * as fftlib from './fft.js';

(() => {
    const $ = (selector) => document.querySelector(selector)

    const audioContext = new window.AudioContext()
    let audioData = {}
    let animationFrame

    const canvas = $('#canvas')
    const ctx = canvas.getContext('2d')

    const fftcanvas = $('#fftcanvas')
    const ftx = fftcanvas.getContext('2d')

    const analyzer = audioContext.createAnalyser()

    analyzer.fftSize = 1024
    let analyzerBufferLength = analyzer.frequencyBinCount

    const handleFiles = (files) => {
        let audio

        for (let file of files) {
            if (file.type.indexOf('audio/') > -1) {
                audio = file
                break
            }
        }

        handleAudio(audio, analyzer.frequencyBinCount)
    }

    const handleAudio = (audio, bufferLength = analyzer.frequencyBinCount) => {
        audio.arrayBuffer()
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                let channelData = audioBuffer.getChannelData(0)
                let slices = []
                
                let index = 0
                while (index < channelData.length) {
                    let data = []
                    for (let i=index; i<index+bufferLength; i++) {
                        data.push(channelData[i] === undefined ? 0 : channelData[i])
                    }

                    slices.push( data )

                    index += bufferLength
                }
                
                updateData(slices, bufferLength, audioBuffer.sampleRate)
                $('#preview_audio').src = URL.createObjectURL(audio)
            })
    }

    // const test = (n) => {
    //     return Math.floor(Math.pow(n, 2) * 512)
    // }
    // for (let i=0; i<1; i+=1/16) console.log(test(i))

    const generateSpectrum = (slices, bins=16) => {
        // audioData.rawSpectrum = []
        // audioData.spectrum = []
        let slice = Float32Array.from(slices[64])

        console.log(slice)
        console.log( analyzer.getFloatTimeDomainData(slice) )

        // for (let slice=0; slice<slices.length; slice++) {
        //     let test = fftjs.fft(slices[slice])
            
        //     let frequencies = fftjs.util.fftFreq(test, audioData.sampleRate)
        //     let magnitudes = fftjs.util.fftMag(test)
        
        //     let both = frequencies.map(function (f, ix) {
        //         return {frequency: Math.floor(f), magnitude: magnitudes[ix]}
        //     })

        //     // if (slice==0) console.log(both)

        //     audioData.rawSpectrum[slice] = both

        //     let funny = []
        //     for (let i=0; i<1; i+=1/64) funny.push( Math.floor(Math.pow(i, 2) * 512) )
    
        //     audioData.spectrum[slice] = []
            
        //     for (let i=0; i<funny.length; i++) {
        //         let min = funny[i]
        //         let max = funny[i+1] || 512
    
        //         let average = []
    
        //         for (let r=min; r<max; r++) {
        //             average.push( audioData.rawSpectrum[slice][r].magnitude )
        //         }
     
        //         let magAverage = average.reduce((a, b) => a + b) / average.length

        //         audioData.spectrum[slice].push(magAverage)
        //     }
        // }
    }

    const updateData = (data, bufferLength, sampleRate) => {
        audioData.slices = data
        audioData.bufferLength = bufferLength
        audioData.sampleRate = sampleRate

        generateSpectrum(audioData.slices)

        // $('#preview_range').setAttribute('max', audioData.slices.length-1)
    }

    $('#upload').addEventListener('change', () => {
        handleFiles( $('#upload').files )
    })

    const previewAudio = $('#preview_audio')
    const updateCanvas = () => {
        let time = previewAudio.currentTime
        let position = Math.floor(time * audioData.sampleRate / audioData.bufferLength)

        drawWaveform(audioData.slices[position])
        // drawSpectrum(audioData.spectrum[position])

        if (!previewAudio.paused) window.requestAnimationFrame(updateCanvas)
    }

    previewAudio.addEventListener('play', () => {
        animationFrame = window.requestAnimationFrame(updateCanvas)
    })

    const drawWaveform = (slice) => {
        ctx.clearRect(0, 0, 400, 200)
        
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgb(0, 0, 0)'
        ctx.beginPath()

        for (let i=0; i<audioData.bufferLength; i++) {
            ctx[i==0 ? 'moveTo' : 'lineTo'](i/audioData.bufferLength * 400, 100 + slice[i]*100)
        }

        ctx.stroke()
    }

    const drawSpectrum = (slice) => {
        // let length = slice.length

        // ftx.clearRect(0, 0, 400, 200)
        
        // ftx.lineWidth = 2
        // ftx.fillStyle = 'rgb(0, 0, 0)'

        // // console.log(slice)

        // for (let i=0; i<length; i++) {
        //     ftx.fillRect(i/length * 400, 100, 5, slice[i]*5)
        // }

    }

    // $('#preview_range').addEventListener('input', () => {
    //     let position = $('#preview_range').value
    //     let currentSlice = audioData.slices[position]

    //     $('label[for="preview_range"]').innerText = `${position} / ${(position * audioData.bufferLength / audioData.sampleRate).toFixed(2)}s`

    //     // ------------------------------------------------------------

    //     drawWaveform(currentSlice)
    // })

    $('#buffer_length').addEventListener('input', () => {
        $('label[for="buffer_length"]').innerText = `fft size: ${$('#buffer_length').value}`
        analyzer.fftSize = parseInt( $('#buffer_length').value )
    })
    $('#generate').addEventListener('click', () => {
        handleFiles( $('#upload').files )
    })



})();