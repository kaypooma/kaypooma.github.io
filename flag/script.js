import { Flag, FlagDesign } from './flaggen.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const saveAttributes = {}

// preload audio i think
for (let audio of ['kalimba.ogg', 'zip.ogg', 'boing.ogg']) {
    let preload = new Audio(`sound/${audio}`)
};

(() => {
    function updateDownloadRes() {
        let resmult = document.getElementById('resolution')
        let rlabel = document.getElementById('rlabel')

        rlabel.innerHTML = `download resolution: ${Math.floor(saveAttributes.Flag.width * resmult.value)}x${Math.floor(saveAttributes.Flag.height * resmult.value)} (${resmult.value}x)`
    }
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
    function playSound(dir, volume) {
        let sound = new Audio(`sound/${dir}`)
        sound.volume = volume
        sound.play()
    }

    // -------- starter flag
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
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*10, -funny.height/2 + unit*2, 5, 2, Math.PI/2 + Math.atan(3/5) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*12, -funny.height/2 + unit*4, 5, 2, Math.PI/2 + Math.atan(1/7) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*12, -funny.height/2 + unit*7, 5, 2, Math.PI/2 - Math.atan(2/7) ) )
            funny.addDesign( new FlagDesign.Star('#ffff00', unit*2, -funny.width/2 + unit*10, -funny.height/2 + unit*9, 5, 2, Math.PI/2 - Math.atan(4/5) ) ) 
        },
        () => {
            // ---- antigua and barbuda
            funny.setColor('#0064be')
            funny.setAspectRatio(3, 2)

            let unit = funny.width/138

            funny.addDesign( new FlagDesign.Border('#000', unit*36, 't') )

            funny.addDesign( new FlagDesign.Star('#ffcb00', unit*60, 0, unit*-10, 16, 7) )

            funny.addDesign( new FlagDesign.Border('#0064be', unit*56, 'b') )
            funny.addDesign( new FlagDesign.Border('#fff', unit*36, 'b') )

            funny.addDesign( new FlagDesign.RightTriangle('#cf132a', 'bl', funny.width/2) )
            funny.addDesign( new FlagDesign.RightTriangle('#cf132a', 'br', funny.width/2) )
        },
        () => {
            // ---- chile
            funny.setColor('#fff')
            funny.setAspectRatio(3, 2)

            let unit = funny.width/12

            funny.addDesign( new FlagDesign.Border('#cc0c2f', funny.height/2, 'b') )
            funny.addDesign( new FlagDesign.Canton('#00338d', unit*4, unit*4) )

            funny.addDesign( new FlagDesign.Star('#fff', unit*2, -funny.width/2 + unit*2, -funny.height/2 + unit*2) )
        },
        () => {
            // ---- cuba
            funny.setColor('#fff')
            funny.setAspectRatio(2, 1)

            let unit = funny.width/60

            funny.addDesign( new FlagDesign.Stripe('#002663', 3, 'vertical') )
            funny.addDesign( new FlagDesign.Chevron('#cc0c2f', unit*Math.sqrt(675)) )
            funny.addDesign( new FlagDesign.Star('#fff', unit*10, -funny.width/2 + unit*8.66, -funny.height/2 + unit*15) )
        },
    ]

    arrayRand(starters)()
    
    funny.draw(ctx)
    funny.updateSaveAttributes(saveAttributes)
    updateDownloadRes()

    // -------- random generation code
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
                // fess
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.height/3, 'tb' ) )
                },
                // pale
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.width/3, 'lr' ) )
                },
            ],
            border_fore: [                
                // border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Border( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.02, 'lrtb' ) )
                },
            ],

            star: [
                // large star in middle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, 0, 0, 5, 2 ) )
                },
                // two stars on sides
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, -flag.width/4, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, flag.width/4, 0 ) )
                },
                // large star with two smaller stars
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, 0, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, -flag.width/4, 0 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/8, flag.width/4, 0 ) )
                },
                // four stars in quadrants
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, -flag.width/4, -flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, flag.width/4, -flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, -flag.width/4, flag.height/4 ) )
                    flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/10, flag.width/4, flag.height/4 ) )
                },
                // star ring middle
                (h,s,l, flag) => {
                    for (let i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
                // star ring right
                (h,s,l, flag) => {
                    for (let i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6 + flag.width/4, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
                // star ring left
                (h,s,l, flag) => {
                    for (let i=0; i<15; i++) {
                        flag.addDesign( new FlagDesign.Star( `hsl(${h}, ${s}%, ${l}%)`, flag.width/12, Math.cos( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6 - flag.width/4, Math.sin( i/15 * Math.PI*2 - Math.PI/10 ) * flag.width/6, 5, 2, -rad(i/15 * 360) ) )
                    }
                },
            ],

            circle: [
                // large circle in middle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4) )
                },       
                // large circle on left
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3, -flag.width/6) )
                }, 
                // large circle on right       
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3, flag.width/6) )
                },      

                // smaller circle in middle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*2/3) )
                },   
                // smaller circle on left   
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, -flag.width/6) )
                },        
                // smaller circle on right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.width/4, flag.width/6) )
                },     

                // overflow circle on left   
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*4/3, -flag.width/4) )
                },     
                // overflow circle on right   
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Circle( `hsl(${h}, ${s}%, ${l}%)`, flag.height*4/3, flag.width/4) )
                },                      
            ],

            greekcross: [
                // large cross in middle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/2, flag.height/6) )
                },       
                // large cross on left
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/2, flag.height/6, -flag.width/12) )
                }, 
                // large cross on right       
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/2, flag.height/6, flag.width/12) )
                },      

                // small cross in middle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/4, flag.height/12) )
                },       
                // small cross on left
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/4, flag.height/12, -flag.width/4) )
                }, 
                // small cross on right       
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/4, flag.height/12, flag.width/4) )
                },     
                
                // amsterdam
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/3, flag.height/8, 0, 0, Math.PI/4) )
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/3, flag.height/8, -flag.width/3.5, 0, Math.PI/4) )
                    flag.addDesign( new FlagDesign.GreekCross( `hsl(${h}, ${s}%, ${l}%)`, flag.height/3, flag.height/8, flag.width/3.5, 0, Math.PI/4) )
                },       
            ],

            bend: [
                // bend from top left -> bottom right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                // bend from bottom left -> top right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
                // saltire
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },

                // bend from top left -> bottom right with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                // bend from bottom left -> top right with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, true ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
                // saltire with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, true ) )

                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                    flag.addDesign( new FlagDesign.Bend( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, true ) )
                },
            ],

            cross: [
                // centered cross
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                // left shifted
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, -flag.width/5 ) )
                },
                // right shifted
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, flag.width/5 ) )
                },

                // centered cross with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1 ) )
                },
                // left shifted with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, -flag.width/5 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, -flag.width/5 ) )
                },
                // right shifted with border
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${Math.max(l+50, 100)}%)`, flag.width*0.15, flag.width/5 ) )
                    flag.addDesign( new FlagDesign.Cross( `hsl(${h}, ${s}%, ${l}%)`, flag.width*0.1, flag.width/5 ) )
                },
            ],

            chevron: [
                // left chevron
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2 ) )
                },
                // right chevron
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2, true ) )
                },
                // double chevron
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2 ) )
                    flag.addDesign( new FlagDesign.Chevron( `hsl(${h}, ${s}%, ${l}%)`, flag.width/2, true ) )
                },
            ],

            right: [
                // top left triangle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tl' ) )
                },
                // top right triangle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tr' ) )
                },
                // bottom left triangle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'bl' ) )
                },
                // bottom right triangle
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'br' ) )
                },
            ],
            right_fore: [        
                // bottom left + bottom right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'bl', flag.width/2 ) )
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'br', flag.width/2 ) )
                },

                // top left + top right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tl', flag.width/2 ) )
                    flag.addDesign( new FlagDesign.RightTriangle( `hsl(${h}, ${s}%, ${l}%)`, 'tr', flag.width/2 ) )
                },
            ],

            quadrant: [
                // top left, bottom right
                (h,s,l, flag) => {
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'tl' ) )
                    flag.addDesign( new FlagDesign.Quadrant( `hsl(${h}, ${s}%, ${l}%)`, 'br' ) )
                },
                // top right, bottom left
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
        if (document.getElementById('usecustompalette').checked) {
            let custom = document.getElementById('custompalette').value.replace(/ /g, '').split(';')
            if (custom.length > 1) palette = custom

            // console.log(custom)
        }        

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
            right_fore: 2,
            border_fore: 2,
            greekcross: 2,
        }

        let draworder = [[],[],[]]
        
        for (let i=0; i<document.getElementById('design_num').value; i++) {
            let randDesign = arrayRand_nr(Object.keys(FlagRandom.designs))()
            let designFunc = arrayRand(FlagRandom.designs[randDesign])

            draworder[ordering[randDesign]].push( designFunc )
        }
        
        let colorindex = Math.floor(Math.random() * (101))
        for (let i=0; i<draworder.length; i++) {
            for (let d=0; d<draworder[i].length; d++) {
                let designFunc = draworder[i][d]
                
                let c = hexToHSL(palette[(colorindex%(palette.length-1))+1])
                designFunc(c[0], c[1], c[2], rand)

                // console.log(c[0], c[1], c[2])

                colorindex++
            }
        }

        rand.draw(ctx, true)
        rand.updateSaveAttributes(saveAttributes)
        updateDownloadRes()

        playSound('kalimba.ogg', 0.3)
    })

    document.getElementById('design_num').addEventListener('input', () => {
        document.getElementById('dlabel').innerHTML = `number of designs: ${document.getElementById('design_num').value}`

        playSound('zip.ogg', 0.3)
    })

    document.getElementById('resolution').addEventListener('input', () => {
        updateDownloadRes()

        playSound('zip.ogg', 0.3)
    })

    document.getElementById('download').addEventListener('click', () => {
        let save = document.createElement('canvas')
        let savectx = save.getContext('2d')

        let resmult = document.getElementById('resolution').value

        save.width = saveAttributes.width*resmult
        save.height = saveAttributes.height*resmult

        saveAttributes.Flag.draw(savectx, true, [resmult, 0, 0, resmult, save.width/2, save.height/2])

        let download = document.createElement('a')
        download.setAttribute('download', `flag-${Date.now()}.png`)

        save.toBlob(blob => {
            let url = URL.createObjectURL(blob)

            download.setAttribute('href', url)
            download.click()
        })

        playSound('boing.ogg', 0.2)
    })

    // -------- set up navigation buttons for customization
    const navcon = document.getElementById('navcon')
    const navpages = Array.from(navcon.children).filter(el => el.className === 'options')
    const pagedisplay = Array.from(document.getElementById('navpagedisplay').children)

    let currentPage = 0

    for (let page of navpages) {
        page.style.display = 'none'
    }

    function showNavPage(n) {
        for (let page of navpages) {
            page.style.display = 'none'
        }        
        navpages[n % navpages.length].style.display = 'flex'

        for (let d of pagedisplay) {
            d.classList.remove('pagecurrent')
        }
        pagedisplay[n % pagedisplay.length].classList.add('pagecurrent')

        // console.log(pagedisplay)
    }

    showNavPage(0)

    document.getElementById('options_back').addEventListener('click', () => { 
        showNavPage(--currentPage) 

        playSound('zip.ogg', 0.3)
    })
    document.getElementById('options_next').addEventListener('click', () => { 
        showNavPage(++currentPage)

        playSound('zip.ogg', 0.3)
    })

    // custom palette
    document.getElementById('usecustompalette').addEventListener('click', () => {
        document.getElementById('usecustompalette').checked ? document.getElementById('custompalette').removeAttribute('disabled') : document.getElementById('custompalette').setAttribute('disabled', 'true')
    
        playSound('zip.ogg', 0.3)
    })
})();