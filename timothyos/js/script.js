function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

var bootTimeout
var booting = 0
var crashed = 0

if (localStorage['timOSGlobalColor'] === undefined) {
    localStorage['timOSGlobalColor'] = 'rgba(100, 100, 120, 200)'
}

function setGlobalColor(r = 100, g = 100, b = 120, a = 200) {
    if (r === 0 && g === 0 && b === 0) {
        r = 50
        g = 50
        b = 50
    }

    if (r === 255 && g === 255 && b === 255) {
        r = 200
        g = 200
        b = 200
    }

    localStorage['timOSGlobalColor'] = `rgba(${r}, ${g}, ${b}, ${a})`
    $('.taskbar').css('background', localStorage['timOSGlobalColor'])
    $('.sys-titlebar').css('background', localStorage['timOSGlobalColor'])
    $('.errtitlebar').css('background', localStorage['timOSGlobalColor'])
    $('.start-menu').css('background', localStorage['timOSGlobalColor'])
}

function start() {    
    $('.blank').removeClass('hidden')
    $('.desktop').addClass('hidden')

    $('.taskbar').css('background', localStorage['timOSGlobalColor'])
    $('.sys-title').css('background', localStorage['timOSGlobalColor'])
    $('.errtitlebar').css('background', localStorage['timOSGlobalColor'])
    $('.start-menu').css('background', localStorage['timOSGlobalColor'])

    // close('a')

    var sndBeep = new Audio()
    sndBeep.src = 'snd/startup_beep.wav'

    var sndStartup = new Audio()
    sndStartup.src = 'snd/startup.wav'

    sndStartup.volume = 0.25

    setTimeout(function() {
        sndBeep.play()
    }, 1000)

    sndBeep.addEventListener('ended', function() {
        $('.blank').addClass('hidden')
        $('.startup').removeClass('hidden')
        $('.taskbar').addClass('hidden')
        $('.start-menu').addClass('hidden')
        $('.icons').addClass('hidden')

        booting = 1

        bootTimeout = setTimeout(function() {
            $('.blank').removeClass('hidden')
            $('.startup').addClass('hidden')            

            booting = 0

            setTimeout(function() {
                $('.blank').addClass('hidden')
                $('.desktop').removeClass('hidden')

                sndStartup.play()
                
                setTimeout(function() {
                    $('.taskbar').removeClass('hidden')
                    $('.start-menu').removeClass('hidden')
                    setTimeout(function() {
                        $('.icons').removeClass('hidden')
                    }, getRandomInt(200, 500))
                }, getRandomInt(400, 700))
            }, getRandomInt(800, 1400))
        }, getRandomInt(6000, 7000))
    })
}

function cmdLog(msg, color = '#fff') {
    if ($('.runmessage').html() === '') {        
        $('.runmessage').html(`<span style="color: ${color}">${msg}</span>`)
    } else {     
        $('.runmessage').html($('.runmessage').html() + '<br>' + `<span style="color: ${color}">${msg}</span>`)
    }
}

function sysDialog(options = {title: 'title', content: 'content', buttons: ['OK'], position: ['center', 'center'], image: false}) {
    if (!('title' in options)) options.title = 'TimothyOS Dialog Box'
    if (!('content' in options)) options.content = 'Content'
    if (!('buttons' in options)) options.buttons = ['OK']
    if (!('position' in options)) options.position = ['center', 'center']
    if (!('image' in options)) options.image = false

    var title = options.title
    var content = options.content
    var buttons = options.buttons
    var x = options.position[0]
    var y = options.position[1]
    var image = options.image

    var imageHTML

    if (image) {
        imageHTML = `<img class="erricon" style="width: 64px; height: 64px;" src="${image}">`
    } else {
        imageHTML = ''
    }
    
    var buttonsHTML = ''

    for (i = 0; i < buttons.length; i++) {
        buttonsHTML = buttonsHTML + `<div class="sys-button btn-${buttons[i]}">${buttons[i]}</div>`
    }

    var chime = new Audio()
    chime.src = 'snd/system/chime.wav'
    chime.volume = 0.25

    var el = $(`       
            <div class="sys-error" id="sys-error">
                <div class="errtitlebar">
                    <div class="errtitle">${title}</div>
                    <div class="sys-close"></div>
                </div>
                <div class="errbottom">
                    ${imageHTML}
                    <div class="errcontent">${content}</div>
                    <div class="errbuttons">
                        ${buttonsHTML}
                    </div>
                </div>
            </div>
            `)

    el.addClass('open')
    
    $('.sys-error').css('z-index', '20')
    $('.sys-window').css('z-index', '20')
    el.css('z-index', '600')

    $('.sys-error .errtitlebar, .sys-titlebar').css('background', '#ddd')
    el.first().next().css('background', localStorage['timOSGlobalColor'])

    if (x !== 'center' && y !== 'center') {
        el.css('left', x + 'px')
        el.css('top', y + 'px')     
    }
    
    if (x === 'center' && y === 'center') {
        el.css('margin', 'auto')
        el.css('top', (window.innerHeight / 2) - 175 + 'px')
        el.css('left', (window.innerWidth / 2) - 100 + 'px')
    }
    
    if (x === 'center' && y === 'center' && $('.sys-error').length > 0) {
        el.css('margin', 'auto')
        el.css('top', 30 * $('.sys-error').length + (window.innerHeight / 2) - 175 + 'px')
        el.css('left', 30 * $('.sys-error').length + (window.innerWidth / 2) - 100 + 'px')
    }

    var elt = parseInt(el.css('top'))
    var elh = parseInt(el.css('height'))
    
    // if (elt + 200 >= window.innerHeight - 60) {
    //     el.css('top', window.innerHeight - 60 + 'px')
    // }
    
    el.appendTo('.desktop')
    el.draggable({
        cancel: '.errbottom,.sys-close',
        scroll: false
    })
    chime.play()
}

function sysWindow(options = {title: 'TimothyOS Window', content: '', size: ['350', '200'], position: ['0', '0'], resizable: true}) {
    if (!('title' in options)) options.title = 'TimothyOS Window'
    if (!('content' in options)) options.content = ''
    if (!('size' in options)) options.size = ['350', '200']
    if (!('position' in options)) options.position = ['0', '0']
    if (!('resizable' in options)) options.resizable = true

    var el = $(`
            <div class="sys-window">
                <div class="sys-titlebar">${options.title}
                    <div class="sys-wclose"></div>
                </div>
                <div class="sys-wcontent">${options.content}</div>
            </div>
            `)

    el.css('width', options.size[0])
    el.css('height', options.size[1])

    el.css('left', options.position[0] + 'px')
    el.css('top', options.position[1] + 'px')
    
    $('.sys-error').css('z-index', '20')
    $('.sys-window').css('z-index', '20')
    el.css('z-index', '600')

    $('.sys-error .errtitlebar, .sys-titlebar').css('background', '#ddd')
    el.first().next().css('background', localStorage['timOSGlobalColor'])

    el.addClass('open')

    el.appendTo('.desktop')
    el.draggable({
        cancel: '.sys-wcontent,.sys-wclose',
        scroll: false
    })    
    
    // if (options.resizable) {
    //     el.resizable({        
    //         minWidth: 200,
    //         minHeight: 200
    //     })
    // }
}

function close(o = 'a') {
    if (o === 'w') {
        $('.sys-wclose').click()
    } else if (o === 'd') {
        $('.sys-close').click()
    } else if (o === 'a') {
        $('.sys-close, .sys-wclose').click()
    }
}

$(document).ready(function() {
    // var sndBeep = new Audio()
    // sndBeep.src = 'snd/startup_beep.wav'

    // setTimeout(function() {
    //     sndBeep.play()
    // }, 1000)

    // sndBeep.addEventListener('ended', function() {
    //     $('.blank').addClass('hidden')
    //     $('.startup').removeClass('hidden')

    //     setTimeout(function() {
    //         $('.blank').removeClass('hidden')
    //         $('.startup').addClass('hidden')

    //         setTimeout(function() {
    //             $('.blank').addClass('hidden')
    //             $('.desktop').removeClass('hidden')
    //         }, getRandomInt(800, 1400))
    //     }, getRandomInt(6000, 7000))
    // })

    start()

    $('.icons').css('width', window.innerWidth + 'px')
    $('.icons').css('height', window.innerHeight - 60 + 'px')
})

$('.desktop').on('click', '.sys-error .errtitlebar .sys-close', function() {
    var el = $(this).parent().parent()
    el.addClass('close')
    setTimeout(function() {
        el.remove()
    }, 500)

    console.log('user closed dialog')
})

$('.desktop').on('click', '.sys-error .errbuttons .sys-button', function() {
    var el = $(this).parent().parent().parent()
    el.addClass('close')
    setTimeout(function() {
        el.remove()
    }, 500)

    console.log('user pressed ' + $(this).text())
})

$('.desktop').on('mousedown', '.sys-error, .sys-window', function() {
    $('.sys-error').css('z-index', '20')
    $('.sys-window').css('z-index', '20')
    $(this).css('z-index', '600')

    $('.sys-error .errtitlebar, .sys-titlebar').css('background', '#ddd')
    console.log($(this).children().eq(0).css('background', localStorage['timOSGlobalColor']))   
})

$('body').on('keydown', function() {
    if (booting && !crashed) {
        var snd = new Audio()
        snd.src = 'snd/sadmac.wav'

        var errorBlink = 0

        clearTimeout(bootTimeout)
        $('.loading-icon').addClass('hidden')
        $('.loading-text').addClass('hidden')
        $('.startup').css('background', 'black')
        $('.tim').css('background-image', 'url("img/sadtimothy.png")')
        
        snd.play()

        snd.addEventListener('ended', function() {
            setInterval(function() {
                if (errorBlink === 0) {
                    $('.error-code').removeClass('hidden')
                    errorBlink = 1
                } else if (errorBlink === 1) {
                    $('.error-code').addClass('hidden') 
                    errorBlink = 0
                }
            }, 1000)
        })

        crashed = 1
    } 
})

$('.desktop').on('click', '.btn-Restart', function() {
    console.log('tes')
    start()
})

$('.icons, .taskbar, .start-menu').on('click', function() {
    $('.errtitlebar, .sys-titlebar').css('background', '#ddd')
    $('.sys-error').css('z-index', '20')
    $('.sys-window').css('z-index', '20')
})

var startMenuDown = 1;

$('.start, .smenuapp, .start-menu').click(function() {
    if ($(this).attr('class') === 'start-menu') return
    if (startMenuDown === 1) {        
        $('.start-menu').removeClass('sdown')
        startMenuDown = 0
    } else {     
        $('.start-menu').addClass('sdown')
        startMenuDown = 1
    }
})

$('.taskbar, .smenuapp, .start-menu').on('click', function(e) {
    if ($(this).attr('class') === 'smenuapp' && $(this).attr('class') !== 'start-menu') return
    e.stopPropagation();
});

$('.desktop').on('click', function() {
    if (startMenuDown === 0) {
        $('.start-menu').addClass('sdown')
        startMenuDown = 1
    }
})

$('.desktop').on('click', '.sys-wclose', function() {
    var el = $(this).parent().parent()
    el.addClass('close')
    setTimeout(function() {
        el.remove()
    }, 500)
})

// Apps

function runPaintApp() {
    sysWindow({ title: '10583paint', content: '<iframe src="apps/paint/index.html" width="670" height="600"></iframe>', size: [670, 605] })
}

function testApp() {
    var title = prompt('title (leave blank for default)')
    var content = prompt('content (leave blank for default)')
    var buttons = prompt('button content seperated by commas (leave blank for default)')
    var position = prompt('position (x,y) (leave blank for default)')

    if (title === '') {
        title = 'TimothyOS Dialog Box'
    }

    if (content === '') {
        content = 'Content'
    }

    if (buttons === '') {
        buttons = false
    }

    if (position === '') {
        position = false
    }

    sysDialog({ title: title, content: content, buttons: buttons === false ? ['OK'] : buttons.split(','), position: position === false ? ['center', 'center'] : position.split(',') })
}

function bombApp() {
    for (i = 0; i < 20; i++) {
        setTimeout(function() {
            sysDialog({ title: 'Error', content: 'Sorry, a system error occured. <br> unimplemented trap <br> To temporarily turn off extensions, restart and hold down the shift key.', buttons: ['Restart'], image: 'img/ico/bomb-2.png', position: [getRandomInt(0, window.innerWidth - 350), getRandomInt(0, window.innerHeight - 200)] })
        }, i * 100)
    }
}

function runRunApp() {
    var acontent = `
                    <input type="text" class="run-command" placeholder="Put command here...">
                    <div class="sys-button btn-runcmd">Run command</div>
                    <div class="runmessage"></div>`
    sysWindow({ title: 'Run', position: [20, 20], content: acontent, size: [400, 200] })
}

function runColorApp() {
    var content = `<div class="changecolor color-r" data-color="244,67,54,200"></div>
                <div class="changecolor color-o" data-color="255,152,0,200"></div>
                <div class="changecolor color-y" data-color="255,235,59,200"></div> 
                <div class="changecolor color-g" data-color="76,175,80,200"></div> 
                <div class="changecolor color-b" data-color="33,150,243,200"></div> 
                <div class="changecolor color-p" data-color="156,39,176,200"></div>`
    sysWindow({ title: 'Color', content: content, size: [418, 100]})
}

function creditsApp() {
    sysWindow({ title: 'Credits', position: [(window.innerWidth / 2) - (450 / 2), (window.innerHeight / 2) - (450 / 2)], size: [450, 450], content: '<h3>Active developers</h3><hr><p class="credit" style="background-image: url(\'img/avatar/discord.png\')">kaypooma - Main developer, final graphic designer</p><p class="credit" style="background-image: url(\'img/avatar/timothy.png\')">timothy10583 - Co-developer, original idea</p><p class="credit" style="background-image: url(\'img/avatar/tgk.png\')">TheGoldKnight - Artist</p><p class="credit" style="background-image: url(\'img/avatar/jaskeret.png\')">Jaskeret - Concept artist</p><p class="credit" style="background-image: url(\'img/avatar/sebastian.png\')">Sebastian - Concept artist</p><hr><h3>Other</h3><p class="credit" style="background-image: url(\'img/avatar/unknown.png\')">Jario - Timothy drawing</p><p class="credit" style="background-image: url(\'img/avatar/unknown.png\')">Alex - Startup sound</p><p class="credit" style="background-image: url(\'img/avatar/apple.png\')">Apple - Start beep, crash sound</p>' })
}

function evalCmd() {
    var cmd = $('.run-command').val()
    var args = cmd.split(' ').slice(1)

    if (cmd.startsWith('close')) {
        close(args[0])
        cmdLog(`closed all windows that match "${args[0]}"`)
    }

    if (cmd.startsWith('dialog')) {
        var options = {}
        var c = args.join(' ').split(',')

        for (i = 0; i < c.length; i++) {
            var k = c[i].split(':')
            var p
            if (k[0] === 'position') {
                p = k[1].split(';')
                options[k[0]] = [p[0], p[1]]
            } else if (k[0] === 'buttons') {
                var b = k[1].split(';')
                var s = []
                for (j = 0; j < b.length; j++) {
                    s.push(b[j])
                }
                options[k[0]] = s
            } else {
                options[k[0]] = k[1]
            }
        }

        sysDialog(options)

        cmdLog('dialog box created with options "' + args + '"')
    }

    if (cmd.startsWith('setglobalcolor')) {
        if (args.length < 3) {
            cmdLog('error: missing arguments', '#f66')
        } else {
            setGlobalColor(args[0], args[1], args[2], 200)
            cmdLog(`set color to "${args}"`)
        }
    }
}

$('.desktop').on('click', '.btn-runcmd', function() {
    evalCmd()
    $('.runmessage').scrollTop($('.runmessage').scrollTop() * 500)
})

setInterval(function() {
    var d = new Date()
    var day = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()

    var hour24 = d.getHours()
    var minute = d.getMinutes()
    var seconds = d.getSeconds()
    
    var hour12 = hour24;
    var am;

    if (hour12 > 12) {
        hour12 = hour12 - 12
        am = 'PM'
    } else {
        hour12 = hour12
        am = 'AM'        
    }

    if (minute < 10) {
        minute = '0' + minute
    }

    $('.time-time').text(`${hour12}:${minute} ${am}`)
    $('.time-date').text(`${month}/${day}/${year}`)
}, 1000)

$('.desktop').on('click', '.changecolor', function() {
    var h = $(this).data('color').split(',')
    setGlobalColor(h[0], h[1], h[2], h[3])
})