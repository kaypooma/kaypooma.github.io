'use strict';

;(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    
    const Mouse = {x: 0, y: 0}
    document.addEventListener('mousemove', e => {
        Mouse.x = e.pageX
        Mouse.y = e.pageY

        let s = Math.sin(-Math.PI/2)
        let c = Math.cos(-Math.PI/2)

        Mouse.x -= canvas.width/2
        Mouse.y -= canvas.height/2

        let xnew = Mouse.x * c - Mouse.y * s
        let ynew = Mouse.x * s + Mouse.y * c

        Mouse.x = xnew + canvas.width/2
        Mouse.y = ynew + canvas.height/2
    })

    const update = () => {
        window.requestAnimationFrame(update)

        // -----------------------------------------

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        ctx.fillStyle = 'pink'
    
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(Math.PI/2)
        ctx.translate(-canvas.width/2, -canvas.height/2)
    
        ctx.font = '300 500px "Open Sans"'
    
        let head = ctx.measureText('o')
        head.height = Math.abs(head.actualBoundingBoxAscent) + Math.abs(head.actualBoundingBoxDescent)
        
        ctx.fillText('o', canvas.width/2 - head.width/2, canvas.height/2 + head.height/2)
    
        ctx.font = '120px "Open Sans"'
    
        let eye = ctx.measureText('o')
        eye.height = Math.abs(eye.actualBoundingBoxAscent) + Math.abs(eye.actualBoundingBoxDescent)
    
        ctx.fillText('o', canvas.width/2 - eye.width/2 - 52, canvas.height/2 + eye.height/2 + 45)
        ctx.fillText('o', canvas.width/2 - eye.width/2 - 52, canvas.height/2 + eye.height/2 - 41)
    
        ctx.font = '200px "Open Sans"'
    
        let pupil = ctx.measureText('.')
        pupil.height = Math.abs(pupil.actualBoundingBoxAscent) + Math.abs(pupil.actualBoundingBoxDescent)

        let lx = (canvas.height/2 + pupil.height/2 + 43 - 10)
        let rx = (canvas.height/2 + pupil.height/2 - 43 - 10)

        let py = (canvas.width/2 - pupil.width/2 - 52 + 20)

        let ladd = Math.atan2(Mouse.y - lx, Mouse.x - py)
        let radd = Math.atan2(Mouse.y - rx, Mouse.x - py)

        let ldist = Math.sqrt( (Mouse.y - lx)**2 + (Mouse.x - py)**2 )
        let rdist = Math.sqrt( (Mouse.y - rx)**2 + (Mouse.x - py)**2 )
    
        ctx.fillText('.', py-20 + Math.min(ldist, 10)*Math.cos(ladd), lx+10 + Math.min(ldist, 15)*Math.sin(ladd))
        ctx.fillText('.', py-20 + Math.min(rdist, 10)*Math.cos(radd), rx+10 + Math.min(rdist, 15)*Math.sin(radd))
    
        let mouth = ctx.measureText(')')
        mouth.height = Math.abs(mouth.actualBoundingBoxAscent) + Math.abs(mouth.actualBoundingBoxDescent)
    
        ctx.fillText(')', canvas.width/2 - mouth.width/2 + 55, canvas.height/2 + mouth.height/2 - 32)
    }

    window.requestAnimationFrame(update)
})()