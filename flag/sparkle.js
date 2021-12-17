'use strict';

const Sparkle = {}

Sparkle.canvas = document.createElement('canvas')
Sparkle.ctx = Sparkle.canvas.getContext('2d')

Sparkle.canvas.style.width = '100vw'
Sparkle.canvas.style.height = '100vh'

Sparkle.canvas.style.position = 'fixed'
Sparkle.canvas.style.top = '0'
Sparkle.canvas.style.left = '0'

Sparkle.canvas.style.pointerEvents = 'none'

Sparkle.Mouse = {
    curX: 0, curY: 0,
    oldX: 0, oldY: 0,

    moving: false
}
Sparkle.Particles = []


Sparkle.oldTimestamp = undefined
Sparkle.delta = 0
Sparkle.timeBuildup = 0
Sparkle.particleTimer = 0

Sparkle.sparkleColor = 'purple'
Sparkle.canDrawSparkles = true

Sparkle.addElementExclusion = function(...elems) {
    for (let el of elems) {
        el.addEventListener('mouseover', () => Sparkle.canDrawSparkles = false)
        el.addEventListener('mouseout', () => Sparkle.canDrawSparkles = true)
    }
}

document.addEventListener('mousemove', e => {
    Sparkle.Mouse.curX = e.clientX
    Sparkle.Mouse.curY = e.clientY
})

Sparkle.updateMouse = function() {
    let speedX = Math.abs(Sparkle.Mouse.curX - Sparkle.Mouse.oldX)
    let speedY = Math.abs(Sparkle.Mouse.curY - Sparkle.Mouse.oldY)

    if (speedX > 0 || speedY > 0) {
        Sparkle.Mouse.moving = true
    } else {
        Sparkle.Mouse.moving = false
    }

    Sparkle.Mouse.oldX = Sparkle.Mouse.curX
    Sparkle.Mouse.oldY = Sparkle.Mouse.curY
}

Sparkle.spawnParticle = function(spawnX, spawnY, spawnVelocity, spawnColor) {
    let particle = { x: spawnX, y: spawnY, velocity: spawnVelocity, color: spawnColor, lifespan: 24 }

    Sparkle.Particles.push(particle)
}
Sparkle.updateParticles = function() {
    for (let i=0; i<Sparkle.Particles.length; i++) {
        let particle = Sparkle.Particles[i]

        particle.lifespan--

        particle.x += particle.velocity
        particle.y += 2 + particle.velocity

        if (particle.lifespan <= 0) Sparkle.Particles.splice(i, 1)
    }
}
Sparkle.drawParticles = function(ctx) {
    for (let particle of Sparkle.Particles) {
        ctx.fillStyle = particle.color

        let size = Math.ceil(particle.lifespan / 6)*1.25
        ctx.fillRect( particle.x - 0.5, particle.y - size/2, 1, size )
        ctx.fillRect( particle.x - size/2, particle.y - 0.5, size, 1 )
    }
}

Sparkle.update = function(timestamp) {
    Sparkle.canvas.width = window.innerWidth
    Sparkle.canvas.height = window.innerHeight

    if (Sparkle.oldTimestamp === undefined) Sparkle.oldTimestamp = timestamp
    Sparkle.delta = timestamp - Sparkle.oldTimestamp
    Sparkle.oldTimestamp = timestamp

    Sparkle.timeBuildup += Sparkle.delta
    if (Sparkle.timeBuildup >= 1/30 * 1000) {
        Sparkle.updateMouse()

        if (Sparkle.Mouse.moving && Sparkle.canDrawSparkles) Sparkle.spawnParticle(Sparkle.Mouse.curX, Sparkle.Mouse.curY, Math.random()*2-1, Sparkle.sparkleColor)

        Sparkle.particleTimer += 1
        // if (particleTimer >= 1) { spawnParticle(Mouse.curX, Mouse.curY, Math.random()*2-1) ; particleNum++ ; particleTimer = 0 }
        if (Sparkle.particleTimer >= 2) { Sparkle.updateParticles() ; Sparkle.particleTimer = 0 }

        Sparkle.timeBuildup = 0
    }
    
    Sparkle.drawParticles(Sparkle.ctx)

    window.requestAnimationFrame(Sparkle.update)
}

document.body.appendChild(Sparkle.canvas)
window.requestAnimationFrame(Sparkle.update)