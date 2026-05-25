function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max)
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
function lerp(x, y, a) {
    return x * (1 - a) + y * a
}

const audioContext = new AudioContext()

let bounceElements

// preload
const preloadImagePaths = ['bg'] 
// const preloadImagePaths = ['bg', 'booboo', 'bububunny-bubu', 'bunny-bunny-eating', 'bunny-cute (1)', 'bunny-cute', 'bunny-sleepy (1)', 'bunny-sleepy', 'bunny-surprised', 'bunny', 'HATA_D-XYAA6TCb'] 
const images = preloadImagePaths.map(path => new Image())
images.forEach((img, i) => img.src = `${preloadImagePaths[i]}.gif`)

const preloadImagePromises = images.map(img => new Promise(res => img.onload = () => res([img.width, img.height])))

const preloadAudioPaths = ['air1', 'air2', 'air3', 'air4']
const preloadAudioPromises = []
const audioBuffers = []

preloadAudioPaths.forEach((path, i) => {
    preloadAudioPromises[i] = fetch(`${path}.ogg`)
        .then(resp => resp.arrayBuffer())
        .then(buf => audioContext.decodeAudioData(buf))
        .then(audioBuf => {
            audioBuffers[i] = audioBuf
            return Promise.resolve(path)
        })    
})

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight

window.onresize = function() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight
}

let oldTime = 0
let deltaTime = 0
let lastGoodDeltaTime = 0

let gravityAccel = 0.002
let dragValue = 0.0001
let energyLoss = 0.75

let mouse = {x: 0, y: 0}
let touch = {x: 0, y: 0}

let dragVelocity = {oldX: 0, oldY: 0, velX: 0, velY: 0}
let audioThreshold = 0.3

// rotation
let deviceRotation = 0
let screenOrientation = 0
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', e => {
        deviceRotation = e.alpha
    })
}
screen.orientation.addEventListener('change', e => {
    screenOrientation = e.target.angle
})
// acceleration
let deviceAcceleration = {x: 0, y: 0}
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', e => {

        if (screenOrientation===0) {
            deviceAcceleration.x = e.acceleration.x
            deviceAcceleration.y = e.acceleration.y
        } else if (screenOrientation===90) {
            deviceAcceleration.x = e.acceleration.y
            deviceAcceleration.y = e.acceleration.x
        } else if (screenOrientation===180) {
            deviceAcceleration.x = -e.acceleration.x
            deviceAcceleration.y = -e.acceleration.y            
        } else if (screenOrientation===270) {
            deviceAcceleration.x = -e.acceleration.y
            deviceAcceleration.y = -e.acceleration.x            
        }
    })
}
// document.getElementById('rot_test').addEventListener('input', e => {
//     deviceRotation = e.target.value * (Math.PI/180)
// })

function clack(vel, mass) {
    if (navigator.userActivation.hasBeenActive) {
        let volume = Math.abs(clamp(vel*0.5, 0, 1))
        let sizeInfluence = (3-mass) * 75
        let which = getRandomInt(0,4)

        const gain = audioContext.createGain()
        gain.gain.value = volume*0.75
        gain.connect(audioContext.destination)

        const source = audioContext.createBufferSource()
        source.buffer = audioBuffers[which]
        source.connect(gain)

        source.detune.value = sizeInfluence + getRandomInt(-100,100)

        source.start(0)
    }
}

function update(timestamp) {
    if (timestamp-oldTime < 1/30*1000) {
        deltaTime = timestamp-oldTime
        lastGoodDeltaTime = deltaTime
    } else {
        console.log('oops')
        deltaTime = lastGoodDeltaTime
    }

    oldTime = timestamp

    let rotationAmount = (deviceRotation - screenOrientation) * (Math.PI/180)

    // document.getElementById('arrow').style.transform = `rotateZ(${Math.PI*0.5 + rotationAmount}rad)`

    // accurate(?)
    let xGravityMult = -Math.sin(rotationAmount)
    let yGravityMult = Math.cos(rotationAmount)

    if (document.getElementById('rotation')) document.getElementById('rotation').innerHTML = `${deviceAcceleration.x}, ${deviceAcceleration.y}`

    for (let el of bounceElements) {
        if (el.dataset.updating === 'true') {
            let [x,y,width,height,velX,velY,mass,massInfluence] = [parseFloat(el.dataset.x), parseFloat(el.dataset.y), parseFloat(el.dataset.width), parseFloat(el.dataset.height), parseFloat(el.dataset.velX), parseFloat(el.dataset.velY), parseFloat(el.dataset.mass), parseFloat(el.dataset.massInfluence)]
            
            velX += gravityAccel*massInfluence*xGravityMult * deltaTime
            velX += deviceAcceleration.x*0.002 * deltaTime
            velX += (-dragValue * velX**2) * deltaTime

            velY += gravityAccel*massInfluence*yGravityMult * deltaTime
            velY += deviceAcceleration.y*0.002 * deltaTime
            velY += (-dragValue * velY**2) * deltaTime
            // velX += (-0.001 * velX) * deltaTime

            x += velX * deltaTime
            y += velY * deltaTime

            if (x <= 0) {
                if (velX>audioThreshold) {
                    clack(velX, mass)
                }

                x = 0
                velX = -velX * energyLoss
            }
            if (x >= windowWidth-width) {
                if (velX>audioThreshold) {
                    clack(velX, mass)
                }

                x = windowWidth-width
                velX = -velX * energyLoss
            }

            if (y <= 0) {
                if (velY>audioThreshold) {
                    clack(velY, mass)
                }

                y = 0
                velY = -velY * energyLoss
            }
            if (y >= windowHeight-height) {
                if (velY>audioThreshold) {
                    clack(velY, mass)
                }

                y = windowHeight-height
                velY = -velY * energyLoss
            }

            // update positions and stuff

            el.dataset.x = x
            el.dataset.y = y

            el.dataset.velX = velX
            el.dataset.velY = velY

            el.style.transform = `translate(${x}px, ${y}px)`
        } else {
            dragVelocity.velX = (dragVelocity.velX + (parseFloat(el.dataset.x) - dragVelocity.oldX)) / 2
            dragVelocity.velY = (dragVelocity.velY + (parseFloat(el.dataset.y) - dragVelocity.oldY)) / 2

            dragVelocity.oldX = parseFloat(el.dataset.x)
            dragVelocity.oldY = parseFloat(el.dataset.y)

            el.dataset.velX = dragVelocity.velX*0.1
            el.dataset.velY = dragVelocity.velY*0.1
        }
    }

    requestAnimationFrame(update)
}

// dragging logic
let currentlyDraggingElement = null
let dragInitPositions = {startX: 0, startY: 0, elStartX: 0, elStartY: 0}

function startDragging(el, x, y) {
    currentlyDraggingElement = el

    currentlyDraggingElement.dataset.updating = 'false'

    dragInitPositions.startX = x
    dragInitPositions.startY = y

    dragInitPositions.elStartX = parseFloat(el.dataset.x)
    dragInitPositions.elStartY = parseFloat(el.dataset.y)

    dragVelocity.oldX = parseFloat(el.dataset.x)
    dragVelocity.oldY = parseFloat(el.dataset.y)
}
function updateDraggingElement(el, x, y) {
    let dest_x = dragInitPositions.elStartX + (x - dragInitPositions.startX)
    let dest_y = dragInitPositions.elStartY + (y - dragInitPositions.startY)

    currentlyDraggingElement.dataset.x = dest_x
    currentlyDraggingElement.dataset.y = dest_y

    currentlyDraggingElement.style.transform = `translate(${dest_x}px, ${dest_y}px)`
}
function releaseDraggingElement(el) {
    el.dataset.updating = 'true'
    currentlyDraggingElement = null
}

document.addEventListener('mousemove', e => {
    // deviceAcceleration.x = (e.clientX - mouse.x)/50
    // deviceAcceleration.y = (e.clientY - mouse.y)/50

    mouse.x = e.clientX
    mouse.y = e.clientY
    
    if (currentlyDraggingElement) {
        updateDraggingElement(currentlyDraggingElement, mouse.x, mouse.y)
    }
})
document.addEventListener('mouseup', e => {
    if (currentlyDraggingElement) { 
        releaseDraggingElement(currentlyDraggingElement)
    }
})

document.addEventListener('touchmove', e => {
    e.preventDefault()

    touch.x = e.targetTouches[0].clientX
    touch.y = e.targetTouches[0].clientY

    if (currentlyDraggingElement) {
        updateDraggingElement(currentlyDraggingElement, touch.x, touch.y)
    }
})
document.addEventListener('touchend', e => {
    e.preventDefault()
    if (currentlyDraggingElement) {
        releaseDraggingElement(currentlyDraggingElement)
    }
})

// init func
function init(n) {
    document.querySelector('main').innerHTML = ''
    for (let i=0; i<n; i++) {
        document.querySelector('main').appendChild(images[i%images.length].cloneNode())
    }

    bounceElements = document.querySelectorAll('main img')

    for (let el of bounceElements) {
        el.style.width = `${getRandomArbitrary(75,300)}px`
        // el.style.filter = `hue-rotate(${getRandomArbitrary(0,360)}deg)`

        let rect = el.getBoundingClientRect()

        el.dataset.x = getRandomArbitrary(0, windowWidth-rect.width)
        el.dataset.y = rect.y

        el.dataset.width = rect.width
        el.dataset.height = rect.height

        el.dataset.velX = 0
        el.dataset.velY = 0

        el.dataset.mass = rect.width*rect.height / 16000
        el.dataset.massInfluence = lerp(1, parseFloat(el.dataset.mass), 0.5)

        el.dataset.updating = 'true'

        el.setAttribute('draggable', 'false')

        el.addEventListener('mousedown', e => {
            startDragging(el, mouse.x, mouse.y)
        })
        el.addEventListener('touchstart', e => {
            e.preventDefault()
            startDragging(el, e.targetTouches[0].clientX, e.targetTouches[0].clientY)
        })
    }

    requestAnimationFrame(update)
}
// explode
document.addEventListener('contextmenu', e => {
    e.preventDefault()
    for (let el of bounceElements) {
        el.dataset.velX = parseFloat(el.dataset.velX) + getRandomArbitrary(-3, 3)
        el.dataset.velY = parseFloat(el.dataset.velY) + getRandomArbitrary(-3, 3)
    }
})

Promise.all([...preloadImagePromises, ...preloadAudioPromises]).then(d => {
    init(32)
})