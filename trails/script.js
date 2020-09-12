var canvas = document.getElementById('c'),
    ctx = canvas.getContext('2d')

var sw = canvas.width,
    sh = canvas.height

var mx = -200,
    my = -200

var flash = 0
var fCur = ['white.png', 'black.png']

var s = 0

ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

window.addEventListener('mousemove', function(e) {
    mx = e.clientX
    my = e.clientY

    flash++

    s = Math.sin(flash/20)
})

function init() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    window.requestAnimationFrame(draw)
}

function draw() {
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    // ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    var cur = new Image()
    cur.src = fCur[flash%2]

    ctx.drawImage(cur, mx, my)
    
    window.requestAnimationFrame(draw)
}

init()