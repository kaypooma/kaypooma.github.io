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
}
// populate dropdown
for (m in mode) {
    const op = document.createElement('option')
    op.value = m
    op.innerHTML = m

    document.getElementById('modeselect').appendChild(op)
}

document.getElementById('make').addEventListener('click', function() { 
    makeGif( mode[ document.getElementById('modeselect').value ] ) 
})

// make the funny gif function
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

function makeGif(mode) {
    canvas.width = mode.width
    canvas.height = mode.height

    const gif = new GIF({
        workers: 4,
        workerScript: 'gif.worker.js',
        width: mode.width,
        height: mode.height,        
    })

    gif.on('finished', b => {
        const render = document.getElementById('render')
        render.src = URL.createObjectURL(b)
    })

    for (i=0; i<mode.data.length; i++) {
        // ctx.clearRect(0, 0, mode.width, mode.height)
        ctx.fillStyle = document.getElementById('bg').value
        ctx.fillRect(0, 0, mode.width, mode.height)
        ctx.drawImage(currentImage, mode.data[i][0], mode.data[i][1], mode.data[i][2] || 16, mode.data[i][3] || 23)

        gif.addFrame( ctx, {copy: true, delay: 20} )
    }

    gif.render()
}
