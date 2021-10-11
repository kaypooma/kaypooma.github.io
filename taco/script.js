var rot = 0
var accel = 0

var rotations = 0

var ding = 0
var aOpacity = 0

var speedCap = 50

var achievements = [
    [10, 'congratulations, you figured out the game'],
    [50, 'actually i\'m not really sure if this is a game'],
    [80, 'it\'s more of an experience'],
    [125, 'so, how has your day been'],
    [150, "i've been developing this"],
    [175, "it's a very good use of my free time"],

    [250, "this was supposed to be an achievements system but now i'm just talking through it"],
    
    [300, "insert sparta reference here"],
    [375, "okay i think i'll stop talking now"],

    [500, "you have reached the milestone of 500 spins"],
    [530, "i think you should get an award for that"],
    [600, "hold on, i'll go find a trophy"],

    [700, "i couldn't find a trophy"],
    [730, "but i did find this star pin"],
    [750, "so i'll just put that somewhere"],
    [800, "..."],
    [850, "i think here's good"],
    [930, "actually it might look better over here"],
    [1000, "maybe here?"],
    [1050, "wait"],
    [1075, "you're at 1000 already?"],
    [1125, "huh"],
    [1150, "well, this time i'll go buy an actual trophy!"],
    [1200, "just wait here while i go out, i'll be back in a jiffy"],

    [1500, "i'm back!"],
    [1525, "i found a really good deal for this trophy"],
    [1550, "and it even came with a custom engraving!"],

    [1580, "okay, let's put this somewhere"],
    [1630, "..."],
    [1660, "there aren't any surfaces here"],
    [1725, "i'll find something, give me a sec"],

    [1825, "okay, i found this plank in my garage"],
    [1875, "i'll just place that..."],
    [1925, 'here...'],

    [1975, 'and we can put the trophy...'],
    [2000, 'there'],

    [2050, "hmm..."],
    [2080, "now that i'm looking at it closely, the trophy looks a little..."],
    [2110, "cheap"],

    [2180, "eh, whatever"],
    [2200, "it only cost me 5 bucks anyway"],
    [2220, "plus tax"],

    [2300, "well, the next milestone is a while away..."],
    [2340, "so i think i'm gonna go out for a little"],

    [2380, "have fun with your..."],
    [2410, "experience"],

    [5000, "hey"],
    [5025, "i'm back from my trip"],

    [5075, "this was supposed to be the next milestone, but..."],
    [5130, "to be honest, i'm a little exhausted"],

    [5160, "so, maybe just pretend that i gave you an award?"],

    [5230, "well, i'm gonna go take a nap"],
    [5260, "see you later"],

    [10000, "wait, you're still here?"],
    [10050, "..."],
    [10100, "you know, i don't think i have any more awards to give you"],
    [10130, "but i can give you this..."],
    [10160, ""],
]

$(document).on('keyup', function(e) {
    if (e.keyCode == 32) {
        accel += 1;
    }

    $('.mash').hide()
})

// 2021 deltatime update

let delta = 0
let oldtime = 0
let newtime = 0

function update() {
    newtime = Date.now()
    delta = newtime-oldtime
    oldtime = newtime

    delta /= 8

    rot += accel;
    if (accel > 0) {
        accel -= 0.075*delta;
    } else {
        accel = 0
    }

    if ( rot>360 ) {
        rotations += 1
        rot = 0

        $('.rotations').text(rotations)

        for (i of achievements) {
            if (rotations == i[0]) {
                $('.achievement').text(i[1])
                aOpacity = 1;

                if (i[0] == 850) {
                    $('.a-500').show()

                    $('.a-500').css({
                        left: 20,
                        right: 'auto',
                        
                        top: 30,
                        bottom: 'auto',
                    })
                }

                if (i[0] == 930) {
                    $('.a-500').css({
                        left: 20,
                        right: 'auto',
                        
                        top: 'auto',
                        bottom: 50,
                    })
                }

                if (i[0] == 1000) {
                    $('.a-500').css({
                        left: 'auto',
                        right: 30,
                        
                        top: 10,
                        bottom:'auto',
                    })
                }

                if (i[0] == 1925) {
                    $('.shelf').show()
                }

                if (i[0] == 2000) {
                    $('.a-1000').show()
                }

                if (i[0] == 10160) {
                    $('.free').show()
                }
            }
        } 

        ding = 1
    }

    if (ding > 0) {
        ding -= 0.05*delta;
    } else {
        ding = 0;
    }

    if (aOpacity > 0) {
        aOpacity -= 0.002*delta;
    } else {
        aOpacity = 0;
    }

    accel = Math.min(accel, speedCap)

    $('.taco').css('transform', 'rotate(' + rot + 'deg)')
    $('.rotations').css('opacity', ding)
    $('.achievement').css('opacity', aOpacity)

    $('.speed').text('taco speed: '+Math.ceil(accel)+' mph')    

    window.requestAnimationFrame(update)
}

window.requestAnimationFrame(update)