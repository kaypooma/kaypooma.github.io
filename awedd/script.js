const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

document.getElementById('jackpot').volume = 0.3

// let defaultcolors = {
//     bg: '#eee',
//     floor: '#00ff01',
//     tree: '#006401',
//     player: '#fed28b',
//     goal: 'blue',
// }

let map = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1 ],
    [ 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0 ],
    [ 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1 ],
    [ 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0 ],
    [ 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0 ],
    [ 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
]

// let map = [
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
//     [ 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0 ],
//     [ 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1 ],
//     [ 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0 ],
//     [ 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1 ],
//     [ 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0 ],
//     [ 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1 ],
//     [ 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
//     [ 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0 ],
//     [ 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
//     [ 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
// ]
let player = {
    dc: 13,
    dr: 8,
    c: 13,
    r: 8,
}
let trees = [
    {dc: 3, dr: 6, c: 3, r: 6},
    {dc: 5, dr: 10, c: 5, r: 10},
    {dc: 5, dr: 12, c: 5, r: 12},
    {dc: 8, dr: 7, c: 8, r: 7},
    {dc: 10, dr: 16, c: 10, r: 16},
]
let win = {c: 0, r: 10}

let finished = false

const ts = 25

let sw = map[0].length*ts
let sh = map.length*ts

ctx.canvas.width = sw
ctx.canvas.height = sh

//  -------------------- game logic
function checkTree(c, r) {
    for (t of trees) {
        if (t.c === c && t.r === r) {
            return t
            break
        }
    }
    return false
}

function update(c, r, jump) {
    if (player.c + c < 0 || player.c + c > map.length-1 || player.r + r < 0 || player.r + r > map[0].length-1) {
        return
    }

    if (jump) {
        if ( map[player.c + c][player.r + r] === 0 ) {
            for (t of trees) {
                if ( (t.c === player.c+c && t.r === player.r+r) || (t.c === player.c+c*2 && t.r === player.r+r*2) ) {
                    return
                }
            }
            if ( map[player.c + c*2] && map[player.c + c*2][player.r + r*2] && map[player.c + c*2][player.r + r*2] === 1 ) {
                player.c += c*2
                player.r += r*2
            }
        }
    } else {
        if ( map[player.c + c][player.r + r] === 1 ) {
            player.c += c
            player.r += r

            // what
            if (checkTree(player.c, player.r)) {
                let initTree = checkTree(player.c, player.r)

                let treesToMove = []
                let treeProgressFrom = { c: initTree.c, r: initTree.r }
                let treeStopped = false

                treesToMove.push(initTree)
                while (!treeStopped) {
                    treeProgressFrom.c += c
                    treeProgressFrom.r += r

                    if (checkTree(treeProgressFrom.c, treeProgressFrom.r)) {
                        treesToMove.push(checkTree(treeProgressFrom.c, treeProgressFrom.r))
                    } else {
                        treeStopped = true
                    }
                }

                for (t of treesToMove) {
                    t.c += c
                    t.r += r
                }
            }            
        }
    }

    if (player.c === win.c && player.r === win.r) { finished=true }

    // console.log(c, r, jump)

    draw()
}

// timer stuff
let timerStartTime = 0
let timerElapsed = 0
let timerInterval = false

function timerStart() {
    timerStartTime = Date.now()
    timerInterval = setInterval(function() {
        let delta = Date.now() - timerStartTime        
    
        timerElapsed = (delta / 1000).toFixed(2)
        document.getElementById('timer').innerHTML = `${timerElapsed} s`
    }, 100)
}
function timerStop(clear) {
    if (clear !== false) { clearTimeout(clear) ; clear=false }
    timerElapsed = 0
}

let time = 0
let jackpot = false
let animationframe = false

function draw() {
    ctx.clearRect(0, 0, sw, sh)

    // background
    ctx.fillStyle = colors._selected.bg
    ctx.fillRect(0, 0, sw, sh)

    // ground tiles
    ctx.fillStyle = colors._selected.floor
    for (c=0; c<map.length; c++) {
        for (r=0; r<map[c].length; r++) {
            if (map[c][r] === 1) {
                ctx.fillRect(r*ts, c*ts, ts, ts)
            }
        }
    }

    // trees
    ctx.fillStyle = colors._selected.tree
    for (t of trees) {
        ctx.fillRect(t.r*ts+1, t.c*ts+1, ts-2, ts-2)
    }

    // goal
    ctx.fillStyle = colors._selected.goal
    ctx.fillRect(win.r*ts+1, win.c*ts+1, ts-2, ts-2)
    
    // player
    ctx.fillStyle = colors._selected.player
    ctx.fillRect(player.r*ts+1, player.c*ts+1, ts-2, ts-2)

    // if won
    if (finished) {
        ctx.fillStyle = `hsla(${time%360},50%,50%,0.5)`
        ctx.fillRect(0, 0, sw, sh)

        ctx.fillStyle = '#000'
        ctx.font = '48px monospace'
        ctx.textAlign = 'center'

        ctx.save()

        ctx.translate(sw/2, sh/2)
        ctx.rotate( Math.sin(time/32) * (Math.PI/180) * 25 )
        ctx.scale( 1 + Math.sin(time/16)*0.25, 1 + Math.cos(time/16)*0.25 )
        ctx.translate(-sw/2, -sh/2)

        ctx.fillText('Big Winner!', sw/2, sh/2) 

        ctx.font = '16px monospace'
        ctx.fillText('press r to reset', sw/2, sh/2+24) 

        ctx.restore()

        if (!jackpot) { 
            timerStop(timerInterval)
            timerInterval = false

            document.getElementById('timer').innerHTML = ((Date.now() - timerStartTime)/1000).toFixed(4) + ' s' 

            document.getElementById('jackpot').play() ; jackpot=true 
        }

        animationframe = window.requestAnimationFrame(draw)
        time += 1
    }
}

function reset(af) {
    if (af) { window.cancelAnimationFrame(af) ; af = false }

    player.c = player.dc
    player.r = player.dr

    for (t of trees) {
        t.c = t.dc
        t.r = t.dr
    }

    jackpot=false
    finished=false

    timerStop(timerInterval)
    timerInterval = false
    document.getElementById('timer').innerHTML = '0 s'

    draw()
}

// key handling
let keymap = {
    ArrowLeft: {down: false},
    ArrowDown: {down: false},
    ArrowUp: {down: false},
    ArrowRight: {down: false},
    a: {down: false},
    r: {down: false},
}
 
document.body.addEventListener('keydown', e => {
    // const moves = {
    //     ArrowLeft: {c: 0, r: -1},
    //     ArrowDown: {c: 1, r: 0},
    //     ArrowUp: {c: -1, r: 0},
    //     ArrowRight: {c: 0, r: 1},
    // }
    // if (e.key === 'a') {}
    // if (moves[e.key]) { update(moves[e.key].c, moves[e.key].r) }

    if (keymap[e.key]) { 
        keymap[e.key].down = true 
        e.preventDefault()

        if (!timerInterval && !finished) timerStart();
    }

    if (!finished) {    
        if (keymap.ArrowLeft.down) {
            update(0, -1, keymap.a.down)
        }
        if (keymap.ArrowRight.down) {
            update(0, 1, keymap.a.down)
        }
        if (keymap.ArrowUp.down) {
            update(-1, 0, keymap.a.down)
        }
        if (keymap.ArrowDown.down) {
            update(1, 0, keymap.a.down)
        }
    }

    if (keymap.r.down) { reset(animationframe) }
})
document.body.addEventListener('keyup', e => {
    // const moves = {
    //     ArrowLeft: {c: 0, r: -1},
    //     ArrowDown: {c: 1, r: 0},
    //     ArrowUp: {c: -1, r: 0},
    //     ArrowRight: {c: 0, r: 1},
    // }
    // if (e.key === 'a') {}
    // if (moves[e.key]) { update(moves[e.key].c, moves[e.key].r) }

    if (keymap[e.key]) { keymap[e.key].down = false }
})

// -------- color
let colors = {
    _selected: {
        bg: '#eeeeee',
        floor: '#00ff01',
        tree: '#006401',
        player: '#fed28b',
        goal: '#0000ff',
    },

    default: {
        bg: '#eeeeee',
        floor: '#00ff01',
        tree: '#006401',
        player: '#fed28b',
        goal: '#0000ff',
    },

    dark: {
        bg: '#303860',
        floor: '#2C9E2C',
        tree: '#635F31',
        player: '#CC9265',
        goal: '#000087',
    },

    eyeburn: {
        bg: '#FFFF00',
        floor: '#FF00CE',
        tree: '#FF0000',
        player: '#00FFB2',
        goal: '#0000FF',
    },

    grayscale: {
        bg: '#EEEEEE',
        floor: '#AAAAAA',
        tree: '#111111',
        player: '#444444',
        goal: '#FFFFFF',
    },

    custom: {
        bg: '#eeeeee',
        floor: '#00ff01',
        tree: '#006401',
        player: '#fed28b',
        goal: '#0000ff',
    },
}

for (c in colors) {
    if (c !== '_selected') {
        let selector = document.getElementById('scheme')
        let option = document.createElement('option')

        option.setAttribute('value', c)
        option.innerHTML = c

        selector.appendChild(option)
    }
}

// set to last used scheme    
let lastSelected = localStorage.getItem('awedd_scheme') || 'default'
setcolors(colors[lastSelected])
document.getElementById('scheme').value = lastSelected

// load custom color scheme if there is one
let savedCustom = localStorage.getItem('awedd_customscheme') || '#eeeeee,#00ff01,#006401,#fed28b,#0000ff'
savedCustom = savedCustom.split(',')

colors.custom.bg = savedCustom[0]
colors.custom.floor = savedCustom[1]
colors.custom.tree = savedCustom[2]
colors.custom.player = savedCustom[3]
colors.custom.goal = savedCustom[4]

let cel = ['bg_color', 'floor_color', 'tree_color', 'player_color', 'goal_color']
if (document.getElementById('scheme').value === 'custom') {
    for (i of cel) {
        document.getElementById(i).removeAttribute('disabled')
        setcolors(colors.custom)
    }
} else {
    for (i of cel) {
        document.getElementById(i).setAttribute('disabled', 'true')
    }
}

document.getElementById('scheme').addEventListener('change', e => {
    let selected = document.getElementById('scheme').value
    let cel = ['bg_color', 'floor_color', 'tree_color', 'player_color', 'goal_color']
    if (selected === 'custom') {
        for (i of cel) {
            document.getElementById(i).removeAttribute('disabled')
        }
    } else {
        for (i of cel) {
            document.getElementById(i).setAttribute('disabled', 'true')
        }
    }

    setcolors(colors[selected])
    localStorage.setItem('awedd_scheme', selected)
})

for (i of cel) {
    let el = document.getElementById(i)
    el.addEventListener('change', e => {
        let string = ''
        for (i=0; i<cel.length; i++) {
            colors.custom[document.getElementById(cel[i]).getAttribute('name')] = document.getElementById(cel[i]).value
            string += document.getElementById(cel[i]).value
            if (i < cel.length-1)
                string += ','
        }

        localStorage.setItem('awedd_customscheme', string)
        setcolors(colors.custom)
    })
}

function setcolors(schemeorbg, floor, tree, player, goal) {
    if (typeof schemeorbg === 'object') {
        colors._selected.bg = schemeorbg.bg
        colors._selected.floor = schemeorbg.floor
        colors._selected.tree = schemeorbg.tree
        colors._selected.player = schemeorbg.player
        colors._selected.goal = schemeorbg.goal

        document.getElementById('bg_color').value = schemeorbg.bg
        document.getElementById('floor_color').value = schemeorbg.floor
        document.getElementById('tree_color').value = schemeorbg.tree
        document.getElementById('player_color').value = schemeorbg.player
        document.getElementById('goal_color').value = schemeorbg.goal
    } else {    
        colors._selected.bg = schemeorbg
        colors._selected.floor = floor
        colors._selected.tree = tree
        colors._selected.player = player
        colors._selected.goal = goal

        document.getElementById('bg_color').value = schemeorbg
        document.getElementById('floor_color').value = floor
        document.getElementById('tree_color').value = tree
        document.getElementById('player_color').value = player
        document.getElementById('goal_color').value = goal
    }

    draw()
}

// -------- level loading

function levelerror(msg) {
    alert(msg)

    this.message = msg
    this.name = 'LevelDataError'
}
levelerror.prototype.toString = function() {
    return `${this.name}: ${this.message}`
}
function importlevel(data) {
    data = LZString.decompressFromBase64(data)

    if (!data) 
        throw new levelerror('invalid level data')

    const sections = data.split('|')

    if (sections.length !== 6) 
        throw new levelerror('invalid level data')

    // ground
    map = []
    let ground = sections[0].split(',')

    // if (ground.length !== 14)
    //     throw new levelerror('invalid ground data')
    sh = ground.length*ts
    ctx.canvas.height = ground.length*ts

    for (c=0; c<ground.length; c++) {
        let data = ground[c].split('')
        for (i=0; i<data.length; i++) {
            if (isNaN(parseInt(data[i])))
                throw new levelerror('invalid ground data')

            data[i] = parseInt(data[i])
        }

        // if (data.length !== 24)
        //     throw new levelerror('invalid ground data')
        sw = data.length*ts
        ctx.canvas.width = data.length*ts

        map[c] = data

        // console.log(data)
    }
    
    // trees
    trees = []
    let treedata = sections[1].split(',')

    if (treedata.length>0 && treedata[0] !== '') {
        for (i=0; i<treedata.length; i++) {
            let pos = treedata[i].split('.')
            if (pos.length !== 2)
                throw new levelerror('invalid tree data')

            for (p of pos) {
                if (isNaN(parseInt(p)))
                    throw new levelerror('invalid tree data')
            }

            trees.push({ dc: parseInt(pos[0]), dr: parseInt(pos[1]), c: parseInt(pos[0]), r: parseInt(pos[1]) })
        }
    }

    // player start
    let playerdata = sections[2].split('.')

    if (playerdata.length !== 2)
        throw new levelerror('invalid player data')

    for (p of playerdata) {
        if (isNaN(parseInt(p)))
            throw new levelerror('invalid player data')
    }

    player.dc = parseInt(playerdata[0])
    player.dr = parseInt(playerdata[1])
    player.c = parseInt(playerdata[0])
    player.r = parseInt(playerdata[1])

    // level end
    let enddata = sections[3].split('.')

    if (enddata.length !== 2)
        throw new levelerror('invalid end data')
    for (p of enddata) {
        if (isNaN(parseInt(p)))
            throw new levelerror('invalid end data')
    }

    win.c = parseInt(enddata[0])
    win.r = parseInt(enddata[1])
    
    // title/creator
    document.getElementById('leveldata').innerHTML = `"${sections[4]}" by "${sections[5]}"`

}
function importlevel_old(data) {
    data = LZString.decompressFromUTF16(data)

    if (!data) 
        throw new levelerror('invalid level data')

    const sections = data.split('|')

    if (sections.length !== 6) 
        throw new levelerror('invalid level data')

    // ground
    let ground = sections[0].split(',')
    map = []

    // if (ground.length !== 14)
    //     throw new levelerror('invalid ground data')
    sh = ground.length*ts
    ctx.canvas.height = ground.length*ts

    for (c=0; c<ground.length; c++) {
        let data = ground[c].split('')
        for (i=0; i<data.length; i++) {
            if (isNaN(parseInt(data[i])))
                throw new levelerror('invalid ground data')

            data[i] = parseInt(data[i])
        }

        // if (data.length !== 24)
        //     throw new levelerror('invalid ground data')
        sw = data.length*ts
        ctx.canvas.width = data.length*ts

        map[c] = data

        // console.log(data)
    }
    
    // trees
    trees = []
    let treedata = sections[1].split(',')

    if (treedata.length>0 && treedata[0] !== '') {
        for (i=0; i<treedata.length; i++) {
            let pos = treedata[i].split('.')
            if (pos.length !== 2)
                throw new levelerror('invalid tree data')

            for (p of pos) {
                if (isNaN(parseInt(p)))
                    throw new levelerror('invalid tree data')
            }

            trees.push({ dc: parseInt(pos[0]), dr: parseInt(pos[1]), c: parseInt(pos[0]), r: parseInt(pos[1]) })
        }
    }

    // player start
    let playerdata = sections[2].split('.')

    if (playerdata.length !== 2)
        throw new levelerror('invalid player data')

    for (p of playerdata) {
        if (isNaN(parseInt(p)))
            throw new levelerror('invalid player data')
    }

    player.dc = parseInt(playerdata[0])
    player.dr = parseInt(playerdata[1])
    player.c = parseInt(playerdata[0])
    player.r = parseInt(playerdata[1])

    // level end
    let enddata = sections[3].split('.')

    if (enddata.length !== 2)
        throw new levelerror('invalid end data')
    for (p of enddata) {
        if (isNaN(parseInt(p)))
            throw new levelerror('invalid end data')
    }

    win.c = parseInt(enddata[0])
    win.r = parseInt(enddata[1])
    
    // title/creator
    document.getElementById('leveldata').innerHTML = `"${sections[4]}" by "${sections[5]}"`

    reset(animationframe)

    draw()
    update()
}

document.getElementById('import').addEventListener('click', () => {
    if (document.getElementById('oldcom').checked) {
        importlevel_old(document.getElementById('import_data').value)
    } else {
        importlevel(document.getElementById('import_data').value)
        reset(animationframe)
    
        draw()
        update()
    }
})

draw()