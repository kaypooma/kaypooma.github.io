const fartbutton = document.getElementById('fart')

EasingFunctions = {
    // no easing, no acceleration
    linear: t => t,
    // accelerating from zero velocity
    easeInQuad: t => t*t,
    // decelerating to zero velocity
    easeOutQuad: t => t*(2-t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    // accelerating from zero velocity 
    easeInCubic: t => t*t*t,
    // decelerating to zero velocity 
    easeOutCubic: t => (--t)*t*t+1,
    // acceleration until halfway, then deceleration 
    easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    // accelerating from zero velocity 
    easeInQuart: t => t*t*t*t,
    // decelerating to zero velocity 
    easeOutQuart: t => 1-(--t)*t*t*t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    // accelerating from zero velocity
    easeInQuint: t => t*t*t*t*t,
    // decelerating to zero velocity
    easeOutQuint: t => 1+(--t)*t*t*t*t,
    // acceleration until halfway, then deceleration 
    easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
  }

fartbutton.addEventListener('mousedown', e => {

    // switch (e.buttons) {
    //     case 1:
    //         for (i=0; i<50; i++) {
    //             spawn(window.innerWidth/2, window.innerHeight/2, Math.random()*20-10, -(Math.random()*15+15))
    //         }
    //         break
    //     case 2:
    //         for (i=0; i<50; i++) {
    //             spawnreverse(Math.random()*window.innerWidth, window.innerHeight)
    //         }
    //         break
    // }
    if (e.buttons === 1) {
        let audio = new Audio('Firework.ogg')
        audio.volume = 0.2
    
        audio.play()

        for (i=0; i<100; i++) {
            spawn(window.innerWidth/2, window.innerHeight/2, Math.random()*20-10, -(Math.random()*15+15))
        }
    } else {
        let audio = new Audio('reverse.wav')
        audio.volume = 0.5

        audio.play()

        for (i=0; i<100; i++) {
            spawnreverse(Math.random()*window.innerWidth*3 - window.innerWidth, Math.random()*window.innerHeight)
        }
    }
    console.log(e.buttons)
})
fartbutton.addEventListener('contextmenu', e => {
    e.preventDefault();
})

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const size = 640
const confettiSize = 10

canvas.width = window.innerWidth
canvas.height = window.innerHeight
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

let delta = 0
let oldtime = 0
let newtime = 0

let confetti = []
let confetti_rev = []

function spawn(x, y, velx, vely) {
    let c = {}

    c.x = x
    c.y = y

    c.velx = velx
    c.vely = vely

    c.rot = 0

    c.color = `hsl(${Math.random()*360}, 100%, 50%)`

    confetti.push(c)
}
function spawnreverse(x, y) {
    let c = {}

    c.initx = x
    c.inity = y
    c.x = x
    c.y = y
    
    c.speedmult = 1

    c.rot = 0
    c.time = 0

    c.rand = Math.random()

    c.color = `hsl(${Math.random()*360}, 100%, 50%)`

    confetti_rev.push(c)
}

function updateConfetti(dt) {  
    for (i=0; i<confetti.length; i++) {
        let con = confetti[i]

        con.y += 10+con.vely * dt
        con.x += con.velx * dt

        con.rot += con.velx*2 * dt

        if (con.vely > 0)
            con.vely -= 0.2*dt
        if (con.vely < 0)
            con.vely += 0.2*dt

        if (con.velx > 0)
            con.velx -= 0.05*dt
        if (con.velx < 0)
            con.velx += 0.05*dt

        if (con.y > window.innerHeight+confettiSize/2)
            confetti.splice(i, 1)
    }
    for (i=0; i<confetti_rev.length; i++) {
        let con = confetti_rev[i]

        // while (con.y > window.innerHeight/2) {
        // }
        // while (con.y > 0) {
        // con.y -= 1 * dt;
        // }
        // confetti_rev.splice(i, 1)
        // con.y -= 1 * con.speedmult * dt
        // con.speedmult += 0.03 * dt


        // if (con.y <= window.innerHeight/2)
        //     confetti_rev.splice(i, 1)


        // if (con.x > window.innerWidth/2+200)
        //     con.x -= 1 * con.speedmult*dt
        // if (con.x < window.innerWidth/2-200)
        //     con.x += 0.5 * con.speedmult*dt

        con.time += 0.12*dt / 17
        // if (i===1)
        //     console.log(con.time)

        if (con.time > 1)
            confetti_rev.splice(i, 1)

        con.rot = EasingFunctions.easeInCubic(con.time) * con.rand*360

        con.y = con.inity - (con.inity - window.innerHeight/2) * EasingFunctions.easeInCubic(con.time)
        con.x = con.initx - (con.initx - window.innerWidth/2) * EasingFunctions.easeInCubic(con.time) + Math.sin(con.time * 16 + con.rand*25)*100*EasingFunctions.easeInCubic(con.time) * con.rand
    }
}

function update() {
    newtime = Date.now()
    delta = newtime-oldtime
    oldtime = newtime

    delta /= 10

    updateConfetti(delta)

    ctx.clearRect(0,0,window.innerWidth, window.innerHeight)

    for (i=0; i<confetti.length; i++) {
        let con = confetti[i]

        ctx.save()

        ctx.translate(con.x + confettiSize/2, con.y + confettiSize/2)
        ctx.rotate( (Math.PI/180) * con.rot )
        ctx.translate(-(con.x + confettiSize/2), -(con.y + confettiSize/2))

        ctx.fillStyle = con.color
        ctx.fillRect( con.x - confettiSize/2, con.y - confettiSize/2, confettiSize, confettiSize )

        ctx.restore()
    }
    for (i=0; i<confetti_rev.length; i++) {
        let con = confetti_rev[i]

        ctx.save()

        ctx.translate(con.x + confettiSize/2, con.y + confettiSize/2)
        ctx.rotate( (Math.PI/180) * con.rot )
        ctx.translate(-(con.x + confettiSize/2), -(con.y + confettiSize/2))

        ctx.fillStyle = con.color
        ctx.fillRect( con.x - confettiSize/2, con.y - confettiSize/2, confettiSize, confettiSize )

        ctx.restore()
    }


    window.requestAnimationFrame(update)
    // console.log(delta)
}

window.requestAnimationFrame(update)