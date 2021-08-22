const fartbutton = document.getElementById('fart')

fartbutton.addEventListener('click', () => {
    let audio = new Audio('Firework.ogg')
    audio.volume = 0.2

    audio.play()

    for (i=0; i<50; i++) {
        spawn(window.innerWidth/2, window.innerHeight/2, Math.random()*20-10, -(Math.random()*15+15))
    }
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

    window.requestAnimationFrame(update)
    // console.log(delta)
}

window.requestAnimationFrame(update)