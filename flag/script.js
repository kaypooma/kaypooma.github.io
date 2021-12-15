const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sw = 600
const sh = 400

const scx = sw/2
const scy = sh/2

const saveAttributes = {
    width: 400,
    height: 400
}

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
        ctx.save()

        if (clear) ctx.clearRect(0, 0, sw, sh)

        let width = this.width
        let height = this.height

        // clipping path
        ctx.beginPath()

        ctx.moveTo( scx - width/2, scy - height/2 )
        ctx.lineTo( scx + width/2, scy - height/2 )
        ctx.lineTo( scx + width/2, scy + height/2 )
        ctx.lineTo( scx - width/2, scy + height/2 )

        ctx.closePath()
        ctx.clip()

        ctx.fillStyle = this.params.color

        ctx.fillRect( scx - width/2, scy - height/2, width, height)

        for (let design of this.params.designs) {
            design.draw(ctx)
        }

        ctx.restore()
    }
    updateSaveAttributes() {
        saveAttributes.width = this.width
        saveAttributes.height = this.height
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
        constructor(color = 'red', diameter = 100, offsetX = 0, offsetY = 0) {
            this.color = color
            this.diameter = diameter
            this.offsetX = offsetX
            this.offsetY = offsetY
        }

        draw(ctx) {
            ctx.fillStyle = this.color
            
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
            
            ctx.beginPath()
            
            let radius = [this.diameter/2, this.diameter/2 * ( Math.cos( Math.PI*this.turning / this.spokes ) / Math.cos( Math.PI * (this.turning - 1) / this.spokes ) )]
            for (let i=0; i<this.spokes*2; i++) {
                // console.log(i)
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
        constructor(color = 'red', size = 200, mirrored = false) {
            this.color = color
            this.size = size
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

            let width = this.Flag.width
            let height = this.Flag.height

            ctx.save()

            ctx.translate(scx, scy)
            ctx.rotate(Math.atan( this.Flag.params.aspect.h/this.Flag.params.aspect.w / 1) * (this.mirrored ? -1 : 1))
            ctx.translate(-scx, -scy)

            // if (this.mirrored) {
            //     ctx.scale(-1, 1)
            //     ctx.translate(-sw, 0)
            // }

            // ctx.beginPath()

            // let thicknessAdjust = this.thickness / Math.SQRT2
            // let aspectAdjust

            // ctx.moveTo(scx - width/2, scy + height/2 - thicknessAdjust)
            // ctx.lineTo(scx - width/2, scy + height/2)
            // ctx.lineTo(scx - width/2 + thicknessAdjust, scy + height/2)

            // ctx.lineTo(scx + width/2, scy - height/2 + thicknessAdjust)
            // ctx.lineTo(scx + width/2, scy - height/2)
            // ctx.lineTo(scx + width/2 - thicknessAdjust, scy - height/2)

            // ctx.closePath()
            // ctx.fill()

            let bwidth = width * Math.hypot(1, this.Flag.params.aspect.h/this.Flag.params.aspect.w)
            ctx.fillRect(scx - bwidth/2, scy - this.thickness/2, bwidth, this.thickness)

            ctx.restore()
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

    funny.setSize(500)

    let starters = [
        () => {
            // ---- suriname
            funny.setColor('#b40a2d')
            funny.setAspectRatio(3, 2)
        
            funny.addDesign(new FlagDesign.Border('white', funny.height/20 * 6, 'tb'))
            funny.addDesign(new FlagDesign.Border('#377e3f', funny.height/20 * 4, 'tb'))
            funny.addDesign(new FlagDesign.Star('#ecc81d', funny.height/20 * 8, 0, funny.height/20 * ((3 - Math.sqrt(5)) / 2)))
        },
        () => {
            // ---- japan
            funny.setColor('#fff')
            funny.setAspectRatio(3, 2)

            funny.addDesign(new FlagDesign.Circle('#bc002d', funny.height * 3/5))
        },
        () => {            
            // ---- germany
            funny.setColor('#ff0000')
            funny.setAspectRatio(5, 3)
        
            funny.addDesign(new FlagDesign.Border('#000', funny.height/3, 't'))
            funny.addDesign(new FlagDesign.Border('#fc0', funny.height/3, 'b'))
        },
        () => {            
            // ---- taiwan
            funny.setColor('#F20000')
            funny.setAspectRatio(3, 2)
        
            funny.addDesign( new FlagDesign.Canton('#0029CC', funny.width/2, funny.height/2) )
        
            funny.addDesign( new FlagDesign.Star('#FFF', funny.height/80*30, -funny.width/4, -funny.height/4, 12, 5) )
        
            funny.addDesign( new FlagDesign.Circle('#0029CC', funny.height/80*17, -funny.width/4, -funny.height/4) )
            funny.addDesign( new FlagDesign.Circle('#FFF', funny.height/80*15, -funny.width/4, -funny.height/4) )
        },
        () => {            
            // ---- us
            funny.setColor('#FFFFFF')
            funny.setAspectRatio(19, 10)
        
            funny.addDesign( new FlagDesign.Stripe('#B22234', 7, 'vertical') )
            funny.addDesign( new FlagDesign.Canton('#3C3B6E', funny.width * 2/5, funny.height * 7/13) )

            for (let r=0; r<5; r++) {
                for (let c=0; c<6; c++) {
                    let spx = funny.width * 2/5 / 12
                    let spy = funny.height * 7/13 / 10
                    funny.addDesign( new FlagDesign.Star('#FFFFFF', funny.height/13 * (4/5), -funny.width/2 + spx + spx*c*2, -funny.height/2 + spy + spy*r*2) )
                }
            }
        
            for (let r=0; r<4; r++) {
                for (let c=0; c<5; c++) {
                    let spx = funny.width * 2/5 / 12
                    let spy = funny.height * 7/13 / 10
                    funny.addDesign( new FlagDesign.Star('#FFFFFF', funny.height/13 * (4/5), -funny.width/2 + spx*2 + spx*c*2, -funny.height/2 + spy*2 + spy*r*2) )
                }
            }
        },
        () => {
            // ---- armenia
            funny.setColor('#0033A0')
            funny.setAspectRatio(2, 1)

            funny.addDesign( new FlagDesign.Border('#D90012', funny.height/3, 't') )
            funny.addDesign( new FlagDesign.Border('#F2A800', funny.height/3, 'b') )
        },
        () => {
            // ---- burundi
            funny.setColor('#CF0921')
            funny.setAspectRatio(5, 3)

            funny.addDesign( new FlagDesign.Chevron('#18B637', funny.width/2) )
            funny.addDesign( new FlagDesign.Chevron('#18B637', funny.width/2, true) )

            funny.addDesign( new FlagDesign.Bend('#fff', funny.width*0.09) )
            funny.addDesign( new FlagDesign.Bend('#fff', funny.width*0.09, true) )

            funny.addDesign( new FlagDesign.Circle('#fff', funny.height/1.8) )

            let spos = [
                [0, -funny.height/8],
                [-funny.height/8, funny.height/12],
                [funny.height/8, funny.height/12],
            ]

            for (let i=0; i<spos.length; i++) {
                funny.addDesign( new FlagDesign.Star('#18B637', funny.height*0.14, spos[i][0], spos[i][1], 6, 2) )
                funny.addDesign( new FlagDesign.Star('#CF0921', funny.height*0.12, spos[i][0], spos[i][1], 6, 2) )
            }
        },
        () => {
            // ---- denmark
            funny.setColor('#d00c33')
            funny.setAspectRatio(37, 28)

            funny.addDesign( new FlagDesign.Cross('#fff', funny.height/28*4, -funny.width/2 + funny.height/28*4/2 + funny.height/28*12, 0) )
        },
        () => {
            // ---- norway
            funny.setColor('#bb042b')
            funny.setAspectRatio(22, 16)

            funny.addDesign( new FlagDesign.Cross('#fff', funny.height/16*4, -funny.width/2 + funny.height/16*4/2 + funny.height/16*6) )
            funny.addDesign( new FlagDesign.Cross('#001a5b', funny.height/16*2, -funny.width/2 + funny.height/16*4/2 + funny.height/16*6) )
        },
        () => {
            // ---- iceland
            funny.setColor('#02529C')
            funny.setAspectRatio(25, 18)

            funny.addDesign( new FlagDesign.Cross('#fff', funny.height/18*4, -funny.width/2 + funny.height/18*4/2 + funny.height/18*7) )
            funny.addDesign( new FlagDesign.Cross('#DC1E35', funny.height/18*2, -funny.width/2 + funny.height/18*4/2 + funny.height/18*7) )
        },
        () => {
            // ---- sweden
            funny.setColor('#005a99')
            funny.setAspectRatio(16, 10)

            funny.addDesign( new FlagDesign.Cross('#fcd115', funny.height/10*2, -funny.width/2 + funny.height/10*2/2 + funny.height/10*5) )
        },
        () => {
            // ---- finland
            funny.setColor('#fff')
            funny.setAspectRatio(18, 11)

            funny.addDesign( new FlagDesign.Cross('#002f6c', funny.height/11*3, -funny.width/2 + funny.height/11*3/2 + funny.height/11*5) )
        },
        () => {
            // ---- china
            funny.setColor('#ee1d24')
            funny.setAspectRatio(30, 20)

            let unit = funny.width/30

            funny.addDesign( new FlagDesign.Star('#ffff00', unit*6, -funny.width/2 + unit*5, -funny.height/2 + unit*5) )
            
            // it took me way too long to figure out the math for this
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*10, -funny.height/2 + unit*2, 5, 2, Math.PI/2 - Math.atan(3/5) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*12, -funny.height/2 + unit*4, 5, 2, Math.PI/2 - Math.atan(1/7) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*12, -funny.height/2 + unit*7, 5, 2, Math.PI/2 - Math.atan(2/7) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*10, -funny.height/2 + unit*9, 5, 2, Math.PI/2 - Math.atan(4/5) ) ) 
        },
    ]

    arrayRand(starters)()

    // switch (frand) {
    //     case 1:
    //         // ---- suriname
    //         funny.setColor('#b40a2d')
    //         funny.setAspectRatio(3, 2)
        
    //         funny.addDesign(new FlagDesign.Border('white', funny.height/20 * 6, 'tb'))
    //         funny.addDesign(new FlagDesign.Border('#377e3f', funny.height/20 * 4, 'tb'))
    //         funny.addDesign(new FlagDesign.Star('#ecc81d', funny.height/20 * 8, 0, funny.height/20 * ((3 - Math.sqrt(5)) / 2)))
            
    //         break
    //     case 2:
    //         // ---- japan
    //         funny.setColor('#fff')
    //         funny.setAspectRatio(3, 2)

    //         funny.addDesign(new FlagDesign.Circle('#bc002d', funny.height * 3/5))

    //         break
    //     case 3:    
    //         // ---- germany
    //         funny.setColor('#ff0000')
    //         funny.setAspectRatio(5, 3)
        
    //         funny.addDesign(new FlagDesign.Border('#000', funny.height/3, 't'))
    //         funny.addDesign(new FlagDesign.Border('#fc0', funny.height/3, 'b'))

    //         break
    //     case 4:
    //         // ---- taiwan
    //         funny.setColor('#F20000')
    //         funny.setAspectRatio(3, 2)
        
    //         funny.addDesign( new FlagDesign.Canton('#0029CC', funny.width/2, funny.height/2) )
        
    //         funny.addDesign( new FlagDesign.Star('#FFF', funny.height/80*30, -funny.width/4, -funny.height/4, 12, 5) )
        
    //         funny.addDesign( new FlagDesign.Circle('#0029CC', funny.height/80*17, -funny.width/4, -funny.height/4) )
    //         funny.addDesign( new FlagDesign.Circle('#FFF', funny.height/80*15, -funny.width/4, -funny.height/4) )

    //         break
    //     case 5:
    //         // ---- us
    //         funny.setColor('#FFFFFF')
    //         funny.setAspectRatio(19, 10)
        
    //         funny.addDesign( new FlagDesign.Stripe('#B22234', 7, 'vertical') )
    //         funny.addDesign( new FlagDesign.Canton('#3C3B6E', funny.width * 2/5, funny.height * 7/13) )

    //         for (let r=0; r<5; r++) {
    //             for (let c=0; c<6; c++) {
    //                 let spx = funny.width * 2/5 / 12
    //                 let spy = funny.height * 7/13 / 10
    //                 funny.addDesign( new FlagDesign.Star('#FFFFFF', funny.height/13 * (4/5), -funny.width/2 + spx + spx*c*2, -funny.height/2 + spy + spy*r*2) )
    //             }
    //         }
        
    //         for (let r=0; r<4; r++) {
    //             for (let c=0; c<5; c++) {
    //                 let spx = funny.width * 2/5 / 12
    //                 let spy = funny.height * 7/13 / 10
    //                 funny.addDesign( new FlagDesign.Star('#FFFFFF', funny.height/13 * (4/5), -funny.width/2 + spx*2 + spx*c*2, -funny.height/2 + spy*2 + spy*r*2) )
    //             }
    //         }

    //         break
    // } 
    
    funny.draw(ctx)
    funny.updateSaveAttributes()

    // ----------------------------------------------

    function arrayRand(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
    function arrayRand_nr(array) {
        var copy = array.slice(0)
        return function() {
            if (copy.length < 1) { copy = array.slice(0) }
            var index = Math.floor(Math.random() * copy.length)
            var item = copy[index]
            copy.splice(index, 1)
            return item
        }
    }
    function hexToHSL(H) {
        // Convert hex to RGB first
        let r = 0, g = 0, b = 0;
        if (H.length == 4) {
            r = "0x" + H[1] + H[1];
            g = "0x" + H[2] + H[2];
            b = "0x" + H[3] + H[3];
            } else if (H.length == 7) {
            r = "0x" + H[1] + H[2];
            g = "0x" + H[3] + H[4];
            b = "0x" + H[5] + H[6];
        }
        // Then to HSL
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0)
            h = 0;
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        else if (cmax == g)
            h = (b - r) / delta + 2;
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        if (h < 0)
            h += 360;

        l = (cmax + cmin) / 2;
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return [h,s,l]
    }
    function rad(deg) {
        return deg * (Math.PI/180)
    }

    const FlagRandom = {
        palettes: [
            ['#FF5959', '#FFAD5A', '#4F9DA6', '#1A0841'],
            ['#BFF4ED', '#280F34', '#E41655', '#B30753'],
            ['#161853', '#292C6D', '#FAEDF0', '#EC255A'],
            ['#E8505B', '#F9D56E', '#F3ECC2', '#14B1AB'],
            ['#E6DEDD', '#8F1D14', '#1B120F', '#F89D13'],

            ['#08D9D6', '#252A34', '#FF2E63', '#EAEAEA'],
            ['#384259', '#F73859', '#7AC7C4', '#C4EDDE'],
            ['#3DB2FF', '#FFEDDA', '#FFB830', '#FF2442'],
            ['#000', '#FFF', '#333', '#666', '#999', '#AAA', '#CCC'],
            ['#F00', '#FFF', '#FF0', '#0FF', '#00FF0C'],
    
            ['#006400', '#FFD200', '#D40000', '#000000', '#FFFFFF', '#FFCC00'],
            ['#00247D', '#FFFFFF', '#CF142B', '#FFCE00', '#5B97B1'],
            ['#AA151B', '#F1BF00', '#0039F0', '#CCCCCC', '#ED72AA', '#058E6E'],
            ['#5EB6E4', '#FFFFFF', '#F1BF31', '#D99F31', '#658D5C', '#94BB79'],
            ['#D21034', '#007168', '#000000', '#FFFFFF', '#FCE100'],
            ['#00209F', '#D21034', '#FFFFFF', '#016A16', '#F1B517'],
        ],

        aspectRatios: [
            [1, 1],
            [3, 2],
            [2, 1],
            [8, 5],
            [18, 11],
            [5, 3],
            [28, 11],
            [335, 189],
            [11, 7],
            [19, 10],
            [(1 + Math.sqrt(5)) / 2, 1],
        ],

        designs: {
            border: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.height/3, 'tb' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.width/3, 'lr' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.02, 'lrtb' ) )
                },
            ],

            star: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, 0, 0, 5, 2 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, -flag.width/4, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, flag.width/4, 0 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, 0, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, -flag.width/4, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, flag.width/4, 0 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, -flag.width/4, -flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, flag.width/4, -flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, -flag.width/4, flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, flag.width/4, flag.height/4 ) )
                },
                (h,s,l, flag) => {
                    for (i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
                (h,s,l, flag) => {
                    for (i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6 + flag.width/4, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
                (h,s,l, flag) => {
                    for (i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6 - flag.width/4, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
            ],

            circle: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4) )
                },       
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3) )
                },      
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, -flag.width/6) )
                },        
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, flag.width/6) )
                },       
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3, -flag.width/6) )
                },        
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3, flag.width/6) )
                },         
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*4/3, -flag.width/4) )
                },        
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*4/3, flag.width/4) )
                },                      
            ],

            bend: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },

                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, true ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, true ) )

                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
            ],

            cross: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, -flag.width/5 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, flag.width/5 ) )
                },

                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, -flag.width/5 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, -flag.width/5 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, flag.width/5 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, flag.width/5 ) )
                },
            ],

            chevron: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2 ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2, true ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2 ) )
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2, true ) )
                },
            ],

            right: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tl' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tr' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'bl' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'br' ) )
                },
            ],

            quadrant: [
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'tl' ) )
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'br' ) )
                },
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'tr' ) )
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'bl' ) )
                },
            ],
        }
    }

    document.getElementById('generate').addEventListener('click', () => {
        let rand = new Flag()

        let aspect = arrayRand(FlagRandom.aspectRatios)
        rand.setAspectRatio( aspect[0], aspect[1] )

        let palette = arrayRand(FlagRandom.palettes)
        rand.setColor(palette[0])

        // 0 = background, 1 = midground, 2 = foreground
        let ordering = {
            border: 0,
            quadrant: 0,

            bend: 1,
            cross: 1,
            chevron: 1,
            right: 1,

            star: 2,
            circle: 2,
        }

        let draworder = [[],[],[]]
        
        for (let i=0; i<document.getElementById('design_num').value; i++) {
            let randDesign = arrayRand_nr(Object.keys(FlagRandom.designs))()
            let designFunc = arrayRand(FlagRandom.designs[randDesign])

            // console.log(ordering[randDesign])
            draworder[ordering[randDesign]].push( designFunc )
        }
        
        let colorindex = 0
        for (let i=0; i<draworder.length; i++) {
            for (let d=0; d<draworder[i].length; d++) {
                // console.log(draworder[i][d])
                let designFunc = draworder[i][d]
                
                let c = hexToHSL(palette[(colorindex%(palette.length-1))+1])
                designFunc(c[0], c[1], c[2], rand)

                colorindex++
            }
        }

        rand.draw(ctx, true)
        rand.updateSaveAttributes()
    })

    document.getElementById('design_num').addEventListener('input', () => {
        document.getElementById('dlabel').innerHTML = `number of designs: ${document.getElementById('design_num').value}`
    })

    document.getElementById('download').addEventListener('click', () => {
        let save = document.createElement('canvas')
        let savectx = save.getContext('2d')

        let imgdata = ctx.getImageData(scx - saveAttributes.width/2, scy - saveAttributes.height/2, saveAttributes.width, saveAttributes.height)

        save.width = saveAttributes.width
        save.height = saveAttributes.height

        savectx.putImageData(imgdata, 0, 0)

        let download = document.createElement('a')
        download.setAttribute('download', `flag-${Date.now()}.png`)

        save.toBlob(blob => {
            let url = URL.createObjectURL(blob)

            download.setAttribute('href', url)
            download.click()
        })
    })
})();