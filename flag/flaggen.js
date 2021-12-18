'use strict';

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}

const Flag = class Flag {
    #updateWH() {
        this.width = this.params.size
        this.height = this.params.size*(this.params.aspect.h/this.params.aspect.w)
    }

    constructor(pa) {
        // default
        this.params = {
            color: 'red',
    
            size: 400,
            aspect: { w: 4, h: 3 },

            transform: [1,0,0,1,0,0],
    
            designs: [],
        }

        this.#updateWH()

        if (pa) {
            for (let p in pa) {
                this.params[p] = pa[p]
            }
        }
    }

    setSize(size) {
        this.params.size = size
        
        this.#updateWH()
    }
    setAspectRatio(w, h) {
        this.params.aspect.w = w
        this.params.aspect.h = h
        
        this.#updateWH()
    }
    setColor(color) {
        this.params.color = color
    }
    setTransform(t1,t2,t3,t4,t5,t6) {
        this.params.transform = [t1,t2,t3,t4,t5,t6]
    }

    addDesign(design) {
        design.Flag = this
        this.params.designs.push( design )
    }
    removeDesign(design) {        
        let index = this.params.designs.indexOf(design)
        if (index > -1) {
            this.params.designs.splice(index, 1)
        }
    }
    shiftDesign(design, amt) {        
        let index = this.params.designs.indexOf(design)

        let valid = false
        if (index + amt >= 0 && index + amt <= this.params.designs.length-1) 
            valid = true

        // console.log(index + amt, this.params.designs.length-1, valid)

        if (index > -1 && valid) {
            array_move(this.params.designs, index, index + amt)
        }
    }

    draw(ctx, clear = false, transform) {
        ctx.save()

        if (clear) ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
        if (transform) {
            ctx.transform(transform[0], transform[1], transform[2], transform[3], transform[4], transform[5])
        } else {
            let t = this.params.transform
            ctx.transform(t[0], t[1], t[2], t[3], t[4], t[5])
        }

        let width = this.width
        let height = this.height

        let ccx = ctx.canvas.clientWidth/2
        let ccy = ctx.canvas.clientHeight/2

        // clipping path
        ctx.beginPath()

        ctx.moveTo( ccx - width/2, ccy - height/2 )
        ctx.lineTo( ccx + width/2, ccy - height/2 )
        ctx.lineTo( ccx + width/2, ccy + height/2 )
        ctx.lineTo( ccx - width/2, ccy + height/2 )

        ctx.closePath()
        ctx.clip()

        ctx.fillStyle = this.params.color

        ctx.fillRect( ccx - width/2, ccy - height/2, width, height)

        for (let design of this.params.designs) {
            design.draw(ctx)
        }

        ctx.restore()
    }
    updateSaveAttributes(attr) {
        attr.width = this.width
        attr.height = this.height

        attr.Flag = this
    }
}

// maybe rewrite these to take an object as params and also extend a parent design class so you dont have to rewrite everything every time
const FlagDesign = {
    Stripe: class Stripe {
        constructor(color = 'red', amount = 4, direction = 'horizontal') {
            this.color = color
            this.amount = amount
            this.direction = direction
        }
    
        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            for (let i=0; i<this.amount; i++) {
                if (this.direction === 'horizontal') {
                    ctx.fillRect(scx - width/2 + (width / (this.amount-0.5) * i), scy - height/2, width / (this.amount-0.5)/2, height)
                } else {
                    ctx.fillRect(scx - width/2, scy - height/2 + (height / (this.amount-0.5) * i), width, height / (this.amount-0.5)/2)                    
                }
            }
        }
    },

    Border: class Border {
        constructor(color = 'red', thickness = 8, sides = 'lrtb') {
            this.color = color
            this.thickness = thickness
            this.sides = sides
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            for (let s of this.sides) {
                switch (s) {
                    case 'l':
                        ctx.fillRect(scx - width/2, scy - height/2, this.thickness, height)
                        break
                    case 'r':
                        ctx.fillRect(scx + width/2 - this.thickness, scy - height/2, this.thickness, height)
                        break
                    case 't':
                        ctx.fillRect(scx - width/2, scy - height/2, width, this.thickness)
                        break
                    case 'b':
                        ctx.fillRect(scx - width/2, scy + height/2 - this.thickness, width, this.thickness)
                        break
                }
            }
        }
    },

    Canton: class Canton {
        constructor(color = 'red', width=100, height=100, offsetX = 0, offsetY = 0) {
            this.color = color
            this.width = width
            this.height = height
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            ctx.fillRect(scx - width/2 + this.offsetX, scy - height/2 + this.offsetY, this.width, this.height)
        }
    },

    Quadrant: class Quadrant {
        constructor(color = 'red', position = 'tl') {
            this.color = color
            this.position = position
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            switch (this.position) {
                case 'tl':
                    ctx.fillRect(scx - width/2, scy - height/2, width/2, height/2)
                    break
                case 'tr':
                    ctx.fillRect(scx, scy - height/2, width/2, height/2)
                    break
                case 'bl':
                    ctx.fillRect(scx - width/2, scy, width/2, height/2)
                    break
                case 'br':
                    ctx.fillRect(scx, scy, width/2, height/2)
                    break
            }
        }
    },

    Circle: class Circle {
        constructor(color = 'red', diameter = 100, offsetX = 0, offsetY = 0) {
            this.color = color
            this.diameter = diameter
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2
            
            ctx.beginPath()
            
            ctx.arc(scx + this.offsetX, scy + this.offsetY, this.diameter/2, 0, Math.PI*2)

            ctx.closePath()
            ctx.fill()
        }
    },

    Star: class Star {
        constructor(color = 'red', diameter = 100, offsetX = 0, offsetY = 0, spokes = 5, turning = 2, rotation = 0) {
            this.color = color
            this.diameter = diameter
            this.spokes = spokes
            this.turning = turning
            this.offsetX = offsetX
            this.offsetY = offsetY
            this.rotation = rotation
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2
            
            ctx.beginPath()
            
            let radius = [this.diameter/2, this.diameter/2 * ( Math.cos( Math.PI*this.turning / this.spokes ) / Math.cos( Math.PI * (this.turning - 1) / this.spokes ) )]
            for (let i=0; i<this.spokes*2; i++) {
                ctx[i===0 ? 'moveTo' : 'lineTo'](scx + Math.sin(i/this.spokes/2 * Math.PI*2 + Math.PI + this.rotation) * radius[i%2] + this.offsetX, scy + Math.cos(i/this.spokes/2 * Math.PI*2 + Math.PI + this.rotation) * radius[i%2] + this.offsetY)
            }

            ctx.closePath()
            ctx.fill()
        }
    },

    Cross: class Cross {
        constructor(color = 'red', thickness = 40, offsetX = 0, offsetY = 0) {
            this.color = color
            this.thickness = thickness
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.fillRect(scx - this.thickness/2 + this.offsetX, scy - height/2, this.thickness, height)
            ctx.fillRect(scx - width/2, scy - this.thickness/2 + this.offsetY, width, this.thickness)
        }
    },

    GreekCross: class GreekCross {
        constructor(color = 'red', size = 100, thickness = 30, offsetX = 0, offsetY = 0, rotation = 0) {
            this.color = color
            this.size = size
            this.thickness = thickness
            this.offsetX = offsetX
            this.offsetY = offsetY
            this.rotation = rotation
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            let width = this.Flag.width
            let height = this.Flag.height

            if (this.rotation) {
                ctx.save()

                let xoffset = (scx - this.size/2 + this.offsetX) + 0.5 * this.size
                let yoffset = (scy - this.size/2 + this.offsetY) + 0.5 * this.size

                ctx.translate(xoffset, yoffset)
                ctx.rotate(this.rotation)
                ctx.translate(-xoffset, -yoffset)
            }

            ctx.fillRect(scx - this.thickness/2 + this.offsetX, scy - this.size/2 + this.offsetY, this.thickness, this.size)
            ctx.fillRect(scx - this.size/2 + this.offsetX, scy - this.thickness/2 + this.offsetY, this.size, this.thickness)

            if (this.rotation) ctx.restore()
        }
    },

    Chevron: class Chevron {
        constructor(color = 'red', size = 200, mirrored = false) {
            this.color = color
            this.size = size
            this.mirrored = mirrored
        }
        
        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            let width = this.Flag.width
            let height = this.Flag.height

            if (this.mirrored) {
                ctx.save()
                // ctx.scale(-1, 1)
                // ctx.translate(-sw, 0)
                ctx.translate(scx, scy)
                ctx.rotate(Math.PI)
                ctx.translate(-scx, -scy)
            }

            ctx.beginPath()

            ctx.moveTo(scx - width/2, scy - height/2)
            ctx.lineTo(scx - width/2, scy + height/2)

            ctx.lineTo(scx - width/2 + this.size, scy)

            ctx.closePath()
            ctx.fill()

            if (this.mirrored) ctx.restore()
        }
    },

    Bend: class Bend {
        constructor(color = 'red', thickness = 50, mirrored = false) {
            this.color = color
            this.thickness = thickness
            this.mirrored = mirrored
        }
        
        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.save()

            ctx.translate(scx, scy)
            ctx.rotate(Math.atan( this.Flag.params.aspect.h/this.Flag.params.aspect.w / 1) * (this.mirrored ? -1 : 1))
            ctx.translate(-scx, -scy)

            let bwidth = width * Math.hypot(1, this.Flag.params.aspect.h/this.Flag.params.aspect.w)
            ctx.fillRect(scx - bwidth/2, scy - this.thickness/2, bwidth, this.thickness)

            ctx.restore()
        }
    },

    RightTriangle: class RightTriangle {
        constructor(color = 'red', position = 'tl', size = 0) {
            this.color = color
            this.position = position
            this.size = size
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let scx = ctx.canvas.clientWidth/2
            let scy = ctx.canvas.clientHeight/2

            let width = this.Flag.width
            let height = this.Flag.height

            let size = this.size

            ctx.beginPath()

            let pl = scx - width/2
            let pr = scx + width/2
            let pt = scy - height/2
            let pb = scy + height/2

            switch (this.position) {
                case 'tl':
                    ctx.moveTo(pl, pt)
                    ctx.lineTo(size ? pl + size : pr, pt)
                    ctx.lineTo(pl, pb)

                    break
                case 'tr':
                    ctx.moveTo(pr, pt)
                    ctx.lineTo(size ? pr - size : pl, pt)
                    ctx.lineTo(pr, pb)
                    
                    break
                case 'bl':
                    ctx.moveTo(pl, pb)
                    ctx.lineTo(size ? pl + size : pr, pb)
                    ctx.lineTo(pl, pt)

                    break
                case 'br':
                    ctx.moveTo(pr, pb)
                    ctx.lineTo(size ? pr - size : pl, pb)
                    ctx.lineTo(pr, pt)

                    break
            }

            ctx.closePath()
            ctx.fill()
        }
    }
}

export { Flag, FlagDesign }