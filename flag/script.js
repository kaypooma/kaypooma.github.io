const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sw = 600
const sh = 400

const scx = sw/2
const scy = sh/2

class Flag {
    // static #defaultParams = {
    //     color: 'red',

    //     size: 400,
    //     aspect: { w: 4, h: 3 },

    //     designs: [],
    // }
    #updateWH() {
        this.width = this.params.size
        this.height = this.params.size*(this.params.aspect.h/this.params.aspect.w)
    }

    constructor(pa) {
        // this.params = Flag.defaultParams
        // console.log(Flag.#defaultParams)

        // default
        this.params = {
            color: 'red',
    
            size: 400,
            aspect: { w: 4, h: 3 },
    
            designs: [],
        }
        // for (let p in Flag.#defaultParams) {
        //     this.params[p] = Flag.#defaultParams[p]
        // }

        // console.log(Flag.#defaultParams)

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

    addDesign(design) {
        design.Flag = this
        this.params.designs.push( design )
    }

    draw(ctx, clear = false) {
        if (clear) ctx.clearRect(0, 0, sw, sh)

        // clipping path
        // ctx.beginPath()

        // ctx.moveTo( scx - width/2, scy - height/2 )
        // ctx.lineTo( scx + width/2, scy - height/2 )
        // ctx.lineTo( scx + width/2, scy + height/2 )
        // ctx.lineTo( scx - width/2, scy + height/2 )

        // ctx.closePath()
        // ctx.clip()

        ctx.fillStyle = this.params.color

        let width = this.width
        let height = this.height

        ctx.fillRect( scx - width/2, scy - height/2, width, height)

        for (let design of this.params.designs) {
            design.draw(ctx)
        }

        // ctx.restore()
    }
}

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
        constructor(color = 'red', thickness = 8, sides = 'ldur') {
            this.color = color
            this.thickness = thickness
            this.sides = sides
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

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
        constructor(color = 'red', size = 100, offsetX = 0, offsetY = 0) {
            this.color = color
            this.size = size
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color
            
            ctx.beginPath()
            
            ctx.arc(scx + this.offsetX, scy + this.offsetY, this.size/2, 0, Math.PI*2)

            ctx.closePath()
            ctx.fill()
        }
    },

    Star: class Star {
        constructor(color = 'red', size = 100, spokes = 5, offsetX = 0, offsetY = 0) {
            this.color = color
            this.size = size
            this.spokes = spokes
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color
            
            ctx.beginPath()
            
            let radius = [this.size/2, this.size/2*0.39]
            for (let i=0; i<this.spokes*2; i++) {
                // console.log(i)
                ctx[i===0 ? 'moveTo' : 'lineTo'](scx + Math.sin(i/this.spokes/2 * Math.PI*2 + Math.PI) * radius[i%2] + this.offsetX, scy + Math.cos(i/this.spokes/2 * Math.PI*2 + Math.PI) * radius[i%2] + this.offsetY)
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

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.fillRect(scx - this.thickness/2 + this.offsetX, scy - height/2, this.thickness, height)
            ctx.fillRect(scx - width/2, scy - this.thickness/2 + this.offsetY, width, this.thickness)
        }
    },

    GreekCross: class GreekCross {
        constructor(color = 'red', size = 100, thickness = 30, offsetX = 0, offsetY = 0) {
            this.color = color
            this.size = size
            this.thickness = thickness
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.fillRect(scx - this.thickness/2 + this.offsetX, scy - this.size/2 + this.offsetY, this.thickness, this.size)
            ctx.fillRect(scx - this.size/2 + this.offsetX, scy - this.thickness/2 + this.offsetY, this.size, this.thickness)
        }
    },

    Chevron: class Chevron {
        constructor(color = 'red', size = 200) {
            this.color = color
            this.size = size
        }
        
        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.beginPath()

            ctx.moveTo(scx - width/2, scy - height/2)
            ctx.lineTo(scx - width/2, scy + height/2)

            ctx.lineTo(scx - width/2 + this.size, scy)

            ctx.closePath()
            ctx.fill()
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

            let width = this.Flag.width
            let height = this.Flag.height

            if (this.mirrored) {
                ctx.save()
                ctx.scale(-1, 1)
                ctx.translate(-sw, 0)
            }

            ctx.beginPath()

            // bottom left
            ctx.moveTo(scx - width/2, scy + height/2 - this.thickness)
            ctx.lineTo(scx - width/2, scy + height/2)
            ctx.lineTo(scx - width/2 + this.thickness, scy + height/2)

            ctx.lineTo(scx + width/2, scy - height/2 + this.thickness)
            ctx.lineTo(scx + width/2, scy - height/2)
            ctx.lineTo(scx + width/2 - this.thickness, scy - height/2)

            ctx.closePath()
            ctx.fill()

            if (this.mirrored) ctx.restore()
        }
    },

    RightTriangle: class RightTriangle {
        constructor(color = 'red', position = 'tl') {
            this.color = color
            this.position = position
        }

        draw(ctx) {
            ctx.fillStyle = this.color

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.beginPath()

            let pl = scx - width/2
            let pr = scx + width/2
            let pt = scy - height/2
            let pb = scy + height/2
            switch (this.position) {
                case 'tl':
                    ctx.moveTo(pl, pt)
                    ctx.lineTo(pr, pt)
                    ctx.lineTo(pl, pb)
                    break
                case 'tr':
                    ctx.moveTo(pr, pt)
                    ctx.lineTo(pl, pt)
                    ctx.lineTo(pr, pb)
                case 'bl':
                    ctx.moveTo(pl, pb)
                    ctx.lineTo(pr, pb)
                    ctx.lineTo(pl, pt)
                case 'br':
                    ctx.moveTo(pr, pb)
                    ctx.lineTo(pl, pb)
                    ctx.lineTo(pr, pt)
            }

            ctx.closePath()
            ctx.fill()
        }
    }
};

(() => {
    let funny = new Flag()

    funny.setColor('#b40a2d')
    funny.setAspectRatio(3, 2)

    funny.addDesign(new FlagDesign.Border('white', 80, 'tb'))
    funny.addDesign(new FlagDesign.Border('#377e3f', 50, 'tb'))
    funny.addDesign(new FlagDesign.Star('#ecc81d', 110, 5, 0, 5))
    
    funny.draw(ctx)

    document.getElementById('generate').addEventListener('click', () => {
        let rand = new Flag()

        rand.addDesign(new FlagDesign.RightTriangle('blue', 'tl'))

        rand.draw(ctx, true)
    })
})();