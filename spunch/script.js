// image drop
const dropzone = document.getElementById('dropzone')
let currentImage = new Image()
currentImage.src = 'test.png'

dropzone.addEventListener('dragover', e => {
    e.preventDefault()

    dropzone.style.backgroundColor = 'rgba(0,0,0,0.1)'
})
dropzone.addEventListener('dragleave', e => {
    e.preventDefault()

    dropzone.style.backgroundColor = 'rgba(0,0,0,0)'
})

dropzone.addEventListener('drop', e => {
    e.preventDefault()
    dropzone.style.backgroundColor = 'rgba(0,0,0,0)'

    let item

    if (e.dataTransfer.items) {
        item = e.dataTransfer.items[0].getAsFile()
    } else {
        item = e.dataTransfer.files[0]
    }

    if (item.type.indexOf('image') !== -1) {        
        let reader
        let image = new Image()
        reader = new FileReader()

        reader.onload = function(e) {
            image.src = e.target.result

            image.onload = function() {
                handleImage(image)
            }
        }

        reader.readAsDataURL(item)
    } else {
        alert('unsupported format')
    }
})
document.onpaste = function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // might give you mime types
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            let image = new Image()
            reader.onload = function (e) {
                // console.log(event.target.result); // data url!image.src = e.target.result
                image.src = e.target.result

                image.onload = function() {
                    handleImage(image)
                }
            }; 
            reader.readAsDataURL(blob);
        }
    }
}

function handleImage(image) {
    currentImage = image
    document.getElementById('imagedisplay').src = image.src
}

// ----------- make the funny gif
// [x, y, w?, h?]
const mode = {
    arc: { width: 57, height: 35, 
        data: [
            [1, 12],
            [0, 12],
            [2, 8],
            [5, 4],
            [13, 1],
            [22, 0],
            [28, 2],
            [35, 8],
            [40, 12],
            [41, 12],
            [35, 8],
            [28, 2],
            [22, 0],
            [13, 1],
            [5, 4],
            [2, 8],
        ] 
    },

    bounce: { width: 27, height: 25, 
        data: [
            [7, 2, 16, 23],
            [6, 1, 16, 24],
            [6, 0, 16, 25],
            [6, 2, 16, 23],
            [4, 9, 20, 16],
            [1, 11, 24, 14],
            [0, 11, 26, 14],
            [6, 6, 18, 19]
        ]
    },

    // circle: { width: 16, height: 16, data: function(f) { 
    //     return [ Math.cos( f*Math.PI*2 )*4, Math.sin( f*Math.PI*2 )*4, 16, 16 ]
    // }, frames: 12 },
}
// populate dropdown
for (m in mode) {
    const op = document.createElement('option')
    op.value = m
    op.innerHTML = m

    document.getElementById('modeselect').appendChild(op)
}

document.getElementById('make').addEventListener('click', function() { 
    makeGif( mode[ document.getElementById('modeselect').value ], document.getElementById('hires').checked ? 4 : 1 ) 
})

// make the funny gif function
const pre = document.createElement('canvas')
const ptx = pre.getContext('2d')

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

function makeGif(mode, sizemult = 1) {
    sizemult = Math.min(sizemult, 4)

    document.getElementById('loading').style.display = 'block'
    render.style.display = 'none'

    canvas.width = mode.width * sizemult
    canvas.height = mode.height * sizemult

    const gif = new GIF({
        workers: 4,
        quality: 1,
        workerScript: 'gif.worker.js',
        width: mode.width * sizemult,
        height: mode.height * sizemult,    
        transparent: '0x00ff00'  
    })

    gif.on('finished', b => {
        const render = document.getElementById('render')
        render.src = URL.createObjectURL(b)

        document.getElementById('loading').style.display = 'none'
        render.style.display = 'block'
    })

    let posdata = []

    if (typeof mode.data === 'object') {
        posdata = mode.data
    } else {
        const fnum = mode.frames || 12
        for (i=0; i<fnum; i++) {
            let calc = mode.data( i / fnum )
            posdata.push( calc )

            console.log(calc)
        }
    }

    for (i=0; i<posdata.length; i++) {
        ptx.clearRect(0, 0, mode.width * sizemult, mode.height * sizemult)

        ptx.drawImage(currentImage, posdata[i][0] * sizemult, posdata[i][1] * sizemult, (posdata[i][2] || 16) * sizemult, (posdata[i][3] || 23) * sizemult)
        
        // took this idea from petpet (https://benisland.neocities.org/petpet/)
        const imgdata = ptx.getImageData(0, 0, mode.width * sizemult, mode.height * sizemult)
        for (c = 0; c < imgdata.data.length; c+=4) {
            imgdata.data[c + 1] = Math.min(imgdata.data[c + 1], 250)

            if (imgdata.data[c + 3] < 120) {
                imgdata.data[c] = 0
                imgdata.data[c+1] = 255
                imgdata.data[c+2] = 0
            }

            imgdata.data[c + 3] = 255
        }
        
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(0, 0, mode.width * sizemult, mode.height * sizemult)
        ctx.putImageData(imgdata, 0, 0)

        gif.addFrame( ctx, {copy: true, delay: 20} )
    }

    gif.render()
}