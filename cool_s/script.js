'use strict';

(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const instructions = document.getElementById('instructions')

    const CoolS = {}
    CoolS.segments = []

    CoolS.color = '#000'
    CoolS.placeColor = '#aaa'
    
    CoolS.addPoint = (x, y) => {
        CoolS.segments.push( {x: x, y: y} )
    }

    const Mouse = {x: 0, y: 0}

    // -------------------------------------------------

    canvas.addEventListener('mousemove', e => {
        Mouse.x = e.pageX
        Mouse.y = e.pageY
    })

    canvas.addEventListener('mousedown', e => {
        if (e.button === 0)
            CoolS.addPoint(Mouse.x, Mouse.y)
    })
    canvas.addEventListener('mouseup', e => {
        if (e.button === 0)
            CoolS.addPoint(Mouse.x, Mouse.y)
    })

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'z') undo()
        if (e.key === 'Delete') clear()
    })

    // -------------------------------------------------

    const update = (timestamp) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        if (Mouse.y > window.innerHeight-20 && !instructions.classList.contains('hidden')) {
            instructions.classList.add('hidden')
        } else if (Mouse.y < window.innerHeight-20 && instructions.classList.contains('hidden')) {
            instructions.classList.remove('hidden')
        }

        draw()
    }

    const drawSegments = () => {
        ctx.strokeStyle = CoolS.color

        for (let i=0; i<CoolS.segments.length; i+=2) {
            // console.log(CoolS.segments[i], CoolS.segments[i+1] || 'none')
            ctx.beginPath()

            if (CoolS.segments[i+1]) {
                ctx.moveTo(CoolS.segments[i].x, CoolS.segments[i].y)    
                ctx.lineTo(CoolS.segments[i+1].x, CoolS.segments[i+1].y)            
            } else {
                ctx.arc(CoolS.segments[i].x, CoolS.segments[i].y, 3 , 0, 2 * Math.PI)
                
                ctx.strokeStyle = CoolS.placeColor
                ctx.setLineDash([4,2])

                ctx.moveTo(CoolS.segments[i].x, CoolS.segments[i].y)    
                ctx.lineTo(Mouse.x, Mouse.y)    
            }

            ctx.stroke()
        }

        ctx.strokeStyle = CoolS.color
        ctx.setLineDash([])
    }

    const drawCap = (seg1, seg2, offset) => {
        let top = {}

        top.x1 = seg1.x
        top.y1 = seg1.y
        top.x2 = seg2.x
        top.y2 = seg2.y

        top.midpoint = {}

        top.midpoint.x = (top.x1 + top.x2) / 2
        top.midpoint.y = (top.y1 + top.y2) / 2

        top.angle = Math.atan( (top.y2-top.y1) / (top.x2-top.x1) ) + Math.PI/2 + offset

        top.distance = Math.sqrt( (top.x2 - top.x1)**2 + (top.y2 - top.y1)**2 )

        ctx.beginPath()

        ctx.moveTo(top.x1, top.y1)
        ctx.lineTo(top.midpoint.x - top.distance/2*Math.cos(top.angle), top.midpoint.y - top.distance/2*Math.sin(top.angle))
        ctx.lineTo(top.x2, top.y2)

        ctx.stroke()
    }

    const orient = (p1, p2) => {
        return p2.x - p1.x > 0 ? 0 : Math.PI
    }

    const drawCaps = () => {
        if (CoolS.segments.length>0 && CoolS.segments.length%6 === 0) {            
            drawCap(CoolS.segments[0], CoolS.segments[4], orient(CoolS.segments[0], CoolS.segments[4]))
            drawCap(CoolS.segments[CoolS.segments.length-1], CoolS.segments[CoolS.segments.length-5], orient(CoolS.segments[CoolS.segments.length-1], CoolS.segments[CoolS.segments.length-5]))
        }
    }

    const connectSegments = () => {
        if (CoolS.segments.length>6 && CoolS.segments.length%6 === 0) {
            for (let i=0; i<CoolS.segments.length; i+=6) {
                if (CoolS.segments[i+6]) {
                    for (let add=0; add<3; add+=2) {
                        ctx.beginPath()
        
                        ctx.moveTo(CoolS.segments[i+1 + add].x, CoolS.segments[i+1 + add].y)
                        ctx.lineTo(CoolS.segments[i+8 + add].x, CoolS.segments[i+8 + add].y)
                        
                        ctx.moveTo(CoolS.segments[i+6 - add/2].x, CoolS.segments[i+6 - add/2].y)
                        ctx.lineTo((CoolS.segments[i+1 + add].x + CoolS.segments[i+8 + add].x) / 2, (CoolS.segments[i+1 + add].y + CoolS.segments[i+8 + add].y) / 2)
        
                        ctx.stroke()
                    }                    
                }
            }
        }
    }

    const undo = () => {
        if (CoolS.segments.length>0) CoolS.segments.splice(CoolS.segments.length-2, 2)
    }
    const clear = () => {
        CoolS.segments = []
    }

    const draw = () => {
        ctx.lineWidth = 2

        drawSegments()
        connectSegments()
        drawCaps()

        window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(update)
})();