const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const sw = 600
const sh = 350

const ts = 25

document.getElementById('jackpot').volume = 0.3

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

// --------------------- level loading stuff

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
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, sw, sh)

    // ground tiles
    ctx.fillStyle = '#00ff01'
    for (c=0; c<map.length; c++) {
        for (r=0; r<map[c].length; r++) {
            if (map[c][r] === 1) {
                ctx.fillRect(r*ts, c*ts, ts, ts)
            }
        }
    }

    // trees
    ctx.fillStyle = '#006401'
    for (t of trees) {
        ctx.fillRect(t.r*ts+1, t.c*ts+1, ts-2, ts-2)
    }

    // goal
    ctx.fillStyle = 'blue'
    ctx.fillRect(win.r*ts+1, win.c*ts+1, ts-2, ts-2)
    
    // player
    ctx.fillStyle = '#fed28b'
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

function importlevel(data) {
    data = LZString.decompressFromUTF16(data)
    const sections = data.split('|')

    if (sections.length !== 6) 
        return alert('invalid level data')

    // ground
    let ground = sections[0].split(',')

    if (ground.length !== 14)
        return alert('invalid ground data')

    for (c=0; c<ground.length; c++) {
        let data = ground[c].split('')
        for (i=0; i<data.length; i++) {
            if (isNaN(parseInt(data[i])))
                return alert('invalid ground data')

            data[i] = parseInt(data[i])
        }

        if (data.length !== 24)
            return alert('invalid ground data')

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
                return alert('invalid tree data')

            for (p of pos) {
                if (isNaN(parseInt(p)))
                    return alert('invalid tree data')
            }

            trees.push({ dc: parseInt(pos[0]), dr: parseInt(pos[1]), c: parseInt(pos[0]), r: parseInt(pos[1]) })
        }
    }

    // player start
    let playerdata = sections[2].split('.')

    if (playerdata.length !== 2)
        return alert('invalid player data')

    for (p of playerdata) {
        if (isNaN(parseInt(p)))
            return alert('invalid player data')
    }

    player.dc = parseInt(playerdata[0])
    player.dr = parseInt(playerdata[1])
    player.c = parseInt(playerdata[0])
    player.r = parseInt(playerdata[1])

    // level end
    let enddata = sections[3].split('.')

    if (enddata.length !== 2)
        return alert('invalid end data')
    for (p of enddata) {
        if (isNaN(parseInt(p)))
            return alert('invalid end data')
    }

    win.c = parseInt(enddata[0])
    win.r = parseInt(enddata[1])
    
    // title/creator
    document.getElementById('leveldata').innerHTML = sections[4] + ' by ' + sections[5]

}

document.getElementById('import').addEventListener('click', () => {
    importlevel(document.getElementById('import_data').value)
    reset(animationframe)

    draw()
    update()
})

draw()