function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max)
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const window_width = window.innerWidth
const window_height = window.innerHeight

const bounce_elements = document.querySelectorAll('main img')

let old_time = 0
let delta_time = 0
let last_good_delta_time = 0

let g_accel = 0.002
let p_drag = 0.0001
let loss_f = 0.2

let mouse = {x: 0, y: 0, velX: 0, velY: 0}

let drag_vel = {oldX: 0, oldY: 0, velX: 0, velY: 0}

function update(timestamp) {
    if (timestamp-old_time < 1/30*1000) {
        delta_time = timestamp-old_time
        last_good_delta_time = delta_time
    } else {
        console.log('oops')
        delta_time = last_good_delta_time
    }

    // delta_time = 2

    old_time = timestamp

    for (let el of bounce_elements) {
        if (el.dataset.updating === 'true') {
            let [x,y,width,height,velX,velY,mass] = [parseFloat(el.dataset.x), parseFloat(el.dataset.y), parseFloat(el.dataset.width), parseFloat(el.dataset.height), parseFloat(el.dataset.velX), parseFloat(el.dataset.velY), parseFloat(el.dataset.mass)]

            velY += g_accel*mass * delta_time
            velY += (-p_drag * velY**2) * delta_time

            velX += (-0.001 * velX) * delta_time

            x += velX * delta_time
            y += velY * delta_time

            if (x <= 0) {
                x = 0
                velX = -velX * 0.75
            }
            if (x >= window_width-width) {
                x = window_width-width
                velX = -velX * 0.75
            }

            if (y <= 0) {
                y = 0
                velY = -velY * 0.75
            }
            if (y >= window_height-height) {
                y = window_height-height
                velY = -velY * 0.75
            }

            // update positions and stuff

            el.dataset.x = x
            el.dataset.y = y

            el.dataset.velX = velX
            el.dataset.velY = velY

            el.style.transform = `translate(${x}px, ${y}px)`
        } else {
            drag_vel.velX = parseFloat(el.dataset.x) - drag_vel.oldX
            drag_vel.velY = parseFloat(el.dataset.y) - drag_vel.oldY

            drag_vel.oldX = parseFloat(el.dataset.x)
            drag_vel.oldY = parseFloat(el.dataset.y)

            el.dataset.velX = drag_vel.velX*0.1
            el.dataset.velY = drag_vel.velY*0.1
        }
    }

    requestAnimationFrame(update)
}

let dragging_element = null
let drag_pos = {startX: 0, startY: 0, elStartX: 0, elStartY: 0}

function start_dragging(el) {
    dragging_element = el

    dragging_element.dataset.updating = 'false'

    drag_pos.startX = mouse.x
    drag_pos.startY = mouse.y

    drag_pos.elStartX = parseFloat(el.dataset.x)
    drag_pos.elStartY = parseFloat(el.dataset.y)

    drag_vel.oldX = parseFloat(el.dataset.x)
    drag_vel.oldY = parseFloat(el.dataset.y)
}

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
    
    if (dragging_element) {
        let dest_x = drag_pos.elStartX + (mouse.x - drag_pos.startX)
        let dest_y = drag_pos.elStartY + (mouse.y - drag_pos.startY)

        dragging_element.dataset.x = dest_x
        dragging_element.dataset.y = dest_y

        dragging_element.style.transform = `translate(${dest_x}px, ${dest_y}px)`
    }
})
document.addEventListener('mouseup', e => {
    dragging_element.dataset.updating = 'true'

    dragging_element = null
})

for (let el of bounce_elements) {
    el.style.width = `${getRandomArbitrary(150,300)}px`

    let rect = el.getBoundingClientRect()

    el.dataset.x = getRandomArbitrary(0, window_width-rect.width)
    el.dataset.y = rect.y

    el.dataset.width = rect.width
    el.dataset.height = rect.height

    el.dataset.velX = 0
    el.dataset.velY = 0

    el.dataset.mass = rect.width*rect.height / 16000

    el.dataset.updating = 'true'

    el.setAttribute('draggable', 'false')

    el.addEventListener('mousedown', e => {
        start_dragging(el)
    })
}

requestAnimationFrame(update)