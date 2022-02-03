'use strict';

(() => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const instructions = document.getElementById('instructions')

    const CoolS = {}
    CoolS.segments = []

    CoolS.color = '#000'
    CoolS.placeColor = '#aaa'

    CoolS.preTranslateX = 0
    CoolS.preTranslateY = 0

    CoolS.translateX = 0
    CoolS.translateY = 0

    CoolS.scale = 1
    
    CoolS.addPoint = (x, y) => {
        CoolS.segments.push( {x: x, y: y} )
    }

    const Mouse = {x: 0, y: 0, dragging: false}
    Mouse.drag = {}

    Mouse.drag.startX = 0
    Mouse.drag.startY = 0

    Mouse.drag.distX = 0
    Mouse.drag.distY = 0

    // -------------------------------------------------

    const startDrag = () => {
        Mouse.dragging = true

        Mouse.drag.startX = Mouse.x
        Mouse.drag.startY = Mouse.y

        CoolS.preTranslateX = CoolS.translateX
        CoolS.preTranslateY = CoolS.translateY

        canvas.style.cursor = 'grabbing'
    }
    const stopDrag = () => {
        Mouse.dragging = false

        CoolS.translateX = CoolS.preTranslateX + Mouse.drag.distX
        CoolS.translateY = CoolS.preTranslateY + Mouse.drag.distY

        canvas.style.cursor = 'auto'
    }

    canvas.addEventListener('mousemove', e => {
        Mouse.x = e.pageX
        Mouse.y = e.pageY

        Mouse.canvasX = (Mouse.x - CoolS.translateX) / CoolS.scale
        Mouse.canvasY = (Mouse.y - CoolS.translateY) / CoolS.scale
    })

    canvas.addEventListener('mousedown', e => {
        switch (e.button) {
            case 0:
                CoolS.addPoint(Mouse.canvasX, Mouse.canvasY)
                break
            case 2:
                startDrag()
                break
        }
    })
    canvas.addEventListener('mouseup', e => {
        switch (e.button) {
            case 0:
                CoolS.addPoint(Mouse.canvasX, Mouse.canvasY)
                break
            case 2:
                stopDrag()
                break
        }
    })

    canvas.addEventListener('contextmenu', e => {
        e.preventDefault()
    })

    canvas.addEventListener('wheel', e => {
        CoolS.scale += e.deltaY*-0.0005

        CoolS.scale = Math.max(0.1, CoolS.scale)

        Mouse.canvasX = (Mouse.x - CoolS.translateX) / CoolS.scale
        Mouse.canvasY = (Mouse.y - CoolS.translateY) / CoolS.scale
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

        if (Mouse.dragging) {
            Mouse.drag.distX = Mouse.x - Mouse.drag.startX
            Mouse.drag.distY = Mouse.y - Mouse.drag.startY

            CoolS.translateX = CoolS.preTranslateX + Mouse.drag.distX
            CoolS.translateY = CoolS.preTranslateY + Mouse.drag.distY
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
                ctx.lineTo(Mouse.canvasX, Mouse.canvasY)    
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
        ctx.translate(CoolS.translateX, CoolS.translateY)
        ctx.scale(CoolS.scale, CoolS.scale)

        ctx.beginPath()        
        ctx.arc(Mouse.canvasX, Mouse.canvasY, 3, 0, 2 * Math.PI)
        ctx.stroke()

        drawSegments()
        connectSegments()
        drawCaps()

        window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(update)
})();