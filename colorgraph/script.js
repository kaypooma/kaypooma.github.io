function lerp(v0, v1, t) {
    return v0*(1-t)+v1*t
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sw = 1067
const sh = 700
const scx = sw/2
const scy = sh/2

// mouse handler
const Mouse = { x: 0, y: 0, click: false }
document.addEventListener('mousemove', e => {
    Mouse.x = e.pageX-6
    Mouse.y = e.pageY-6

    if (Mouse.x < 0) Mouse.x = 0
    if (Mouse.x > sw) Mouse.x = sw
    if (Mouse.y < 0) Mouse.y = 0
    if (Mouse.y > sh) Mouse.y = sh
})
document.addEventListener('mousedown', e => {
    Mouse.click = true
})
document.addEventListener('mouseup', e => {
    Mouse.click = false

    Line.dragging.start = false
    Line.dragging.end = false
    Line.dragging.all = false

    Drag.set = false

    drawgraph()
})

// line
const linecanvas = document.getElementById('line')
const ltx = linecanvas.getContext('2d')

const Line = { start: {x: 30, y: 30}, end: {x: 400, y: 400}, dragging: {start: false, end: false, all: false} }
const Drag = { initX: 0, initY: 0, set: false,
    line: { start: {initX: 0, initY: 0}, end: {initX: 0, initY: 0} }
}

function updateline() {
    if (!Line.dragging.all) {
        if (!Line.dragging.end) {
            if (Mouse.x >= Line.start.x-10 && Mouse.x <= Line.start.x+10 && Mouse.y >= Line.start.y-10 && Mouse.y <= Line.start.y+10 && Mouse.click || Line.dragging.start) {
                Line.start.x = Mouse.x
                Line.start.y = Mouse.y

                Line.dragging.start = true
            }
        }

        if (!Line.dragging.start) {
            if (Mouse.x >= Line.end.x-15 && Mouse.x <= Line.end.x+15 && Mouse.y >= Line.end.y-15 && Mouse.y <= Line.end.y+15 && Mouse.click || Line.dragging.end) {
                Line.end.x = Mouse.x
                Line.end.y = Mouse.y

                Line.dragging.end = true
            }
        }
    }

    if (!Line.dragging.start && !Line.dragging.end && Mouse.click) {
        if (Drag.set) {
            let diffX = Mouse.x - Drag.initX
            let diffY = Mouse.y - Drag.initY

            Line.start.x = Drag.line.start.initX + diffX
            Line.start.y = Drag.line.start.initY + diffY

            Line.end.x = Drag.line.end.initX + diffX
            Line.end.y = Drag.line.end.initY + diffY
        } else {
            Drag.initX = Mouse.x
            Drag.initY = Mouse.y

            Drag.line.start.initX = Line.start.x
            Drag.line.start.initY = Line.start.y
            Drag.line.end.initX = Line.end.x
            Drag.line.end.initY = Line.end.y

            Drag.set = true
        }

        Line.dragging.all = true
    }
}
function drawline() {
    ltx.clearRect(0, 0, sw, sh)

    // draw line
    ltx.lineWidth = 3
    ltx.strokeStyle = '#fff'

    ltx.beginPath()

    ltx.moveTo( Line.start.x, Line.start.y )
    ltx.lineTo( Line.end.x, Line.end.y )

    ltx.stroke()

    ltx.lineWidth = 1
    ltx.strokeStyle = '#111'

    ltx.beginPath()

    ltx.moveTo( Line.start.x, Line.start.y )
    ltx.lineTo( Line.end.x, Line.end.y )

    ltx.stroke()

    // draw start handle
    ltx.lineWidth = 3
    ltx.strokeStyle = '#fff'

    ltx.beginPath()

    ltx.rect( Line.start.x - 10, Line.start.y - 10, 20, 20 )

    ltx.stroke()

    ltx.lineWidth = 1
    ltx.strokeStyle = '#111'

    ltx.beginPath()

    ltx.rect( Line.start.x - 10, Line.start.y - 10, 20, 20 )

    ltx.stroke()

    // draw end handle
    ltx.save()

    ltx.lineWidth = 3
    ltx.strokeStyle = '#fff'

    ltx.translate(Line.end.x, Line.end.y)
    ltx.rotate( Math.atan2( Line.end.y - Line.start.y, Line.end.x - Line.start.x ) )
    ltx.translate(-Line.end.x, -Line.end.y)

    ltx.beginPath()
    ltx.moveTo( Line.end.x, Line.end.y )
    ltx.lineTo( Line.end.x-10, Line.end.y-10 )
    ltx.moveTo( Line.end.x, Line.end.y )
    ltx.lineTo( Line.end.x-10, Line.end.y+10 )
    ltx.stroke()

    ltx.restore()

    ltx.save()

    ltx.lineWidth = 1
    ltx.strokeStyle = '#111'

    ltx.translate(Line.end.x, Line.end.y)
    ltx.rotate( Math.atan2( Line.end.y - Line.start.y, Line.end.x - Line.start.x ) )
    ltx.translate(-Line.end.x, -Line.end.y)

    ltx.beginPath()
    ltx.moveTo( Line.end.x, Line.end.y )
    ltx.lineTo( Line.end.x-10, Line.end.y-10 )
    ltx.moveTo( Line.end.x, Line.end.y )
    ltx.lineTo( Line.end.x-10, Line.end.y+10 )
    ltx.stroke()

    ltx.restore()
}

console.log( Math.atan2( Line.end.y - Line.start.y, Line.end.x - Line.start.x ) * 180 / Math.PI )

// graph logic
const graph = document.getElementById('graph')
const gtx = graph.getContext('2d')

const gh = 100

Line.positionAt = function(p) {
    return { x: lerp(Line.start.x, Line.end.x, p), y: lerp(Line.start.y, Line.end.y, p) }
}

gtx.globalCompositeOperation = 'lighter'
function drawgraph() {
    gtx.clearRect(0,0,sw,sh)

    // number of samples along line
    const grain = 256
    const data = { r: [], g: [], b: [] }

    for (i=0; i<grain; i++) {
        let position = Line.positionAt(1/(grain-1) * i)
        let color = ctx.getImageData(position.x, position.y, 1, 1).data

        // r
        data.r[i] = color[0]/256
        // g
        data.g[i] = color[1]/256
        // b
        data.b[i] = color[2]/256
    }

    // bg
    gtx.fillStyle = '#000'
    gtx.fillRect( 0, 0, sw, gh )

    // red
    gtx.strokeStyle = '#f00'
    gtx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    gtx.beginPath()

    gtx.moveTo( 0, (1-data.r[0]) * gh )
    for (i=1; i<data.r.length-1; i++) {
        gtx.lineTo( sw/grain * i, (1-data.r[i]) * gh )
    }
    gtx.stroke()

    gtx.beginPath()

    gtx.moveTo( 0, gh )
    for (i=0; i<data.r.length; i++) {
        gtx.lineTo( sw/grain * i, (1-data.r[i]) * gh )
    }
    gtx.lineTo( sw, gh )

    gtx.fill()

    // green
    gtx.strokeStyle = '#0f0'
    gtx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    gtx.beginPath()

    gtx.moveTo( 0, (1-data.g[0]) * gh )
    for (i=1; i<data.r.length-1; i++) {
        gtx.lineTo( sw/grain * i, (1-data.g[i]) * gh )
    }
    gtx.stroke()

    gtx.beginPath()

    gtx.moveTo( 0, gh )
    for (i=0; i<data.g.length; i++) {
        gtx.lineTo( sw/grain * i, (1-data.g[i]) * gh )
    }
    gtx.lineTo( sw, gh )

    gtx.fill()

    // blue
    gtx.strokeStyle = '#00f'
    gtx.fillStyle = 'rgba(0, 0, 255, 0.5)'
    gtx.beginPath()

    gtx.moveTo( 0, (1-data.b[0]) * gh )
    for (i=1; i<data.r.length-1; i++) {
        gtx.lineTo( sw/grain * i, (1-data.b[i]) * gh )
    }
    gtx.stroke()

    gtx.beginPath()

    gtx.moveTo( 0, gh )
    for (i=0; i<data.b.length; i++) {
        gtx.lineTo( sw/grain * i, (1-data.b[i]) * gh )
    }
    gtx.lineTo( sw, gh )

    gtx.fill()

}

// load example image
let image1 = new Image()
image1.src = 'img/1.png'

image1.onload = function() {
    imageready()
}

function imageready() {
    ctx.drawImage(image1, 20, 20, 300, 300)
}

function update() {
    ctx.clearRect(0, 0, sw, sh)

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, sw, sh)

    // draw example image
    imageready()
    // ctx.fillStyle = 'red'
    // ctx.fillRect(20, 20, 100, 100)
    // ctx.fillStyle = 'blue'
    // ctx.fillRect(40, 20, 200, 100)
    // ctx.fillStyle = 'green'
    // ctx.fillRect(20, 70, 67, 100)
    // ctx.fillStyle = 'yellow'
    // ctx.fillRect(90, 70, 200, 100)

    // line
    updateline()
    drawline()

    // graph
    // drawgraph()

    // -----------------------------------

    window.requestAnimationFrame(update)
}
window.requestAnimationFrame(update)