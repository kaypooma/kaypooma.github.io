const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const ts = 25

let levelwidth = 24
let levelheight = 14

let sw = levelwidth*ts
let sh = levelheight*ts

document.getElementById('title').value = ''
document.getElementById('creator').value = ''
document.getElementById('export_data').value = ''
document.getElementById('import_data').value = ''

// selected tile
let selectedTile
for (s of document.getElementById('selectors').getElementsByTagName('input')) {
    if (s.checked)
        selectedTile = s.getAttribute('value')
}

document.getElementById('selectors').addEventListener('click', (e) => {
    // selectedTile = s.getAttribute('value')
    let el = e.target
    if (el.tagName === 'INPUT') {
        selectedTile = el.getAttribute('value')
    }
})

// level data
let map = [
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
]
let player = {
    c: 0,
    r: 0,
}
let trees = []
let win = {c: 13, r: 23}

// mouse position
let mouse = {x: 0, y: 0, left: false, right: false}
document.addEventListener('mousemove', e => {
    mouse.x = e.pageX - 5
    mouse.y = e.pageY - 5

    if (mouse.x > 0 && mouse.x < ts*levelwidth && mouse.y > 0 && mouse.y < ts*levelheight) 
        update(mouse.x, mouse.y, mouse.left, mouse.right)
})
document.addEventListener('mousedown', e => {
    // if (mouse.x > 0 && mouse.x < ts*24 && mouse.y > 0 && mouse.y < ts*14) 
    //     e.preventDefault();

    switch (e.buttons) {
        case 1:
            mouse.left = true
            break
        case 2:
            mouse.right = true
            break
    }

    if (mouse.x > 0 && mouse.x < ts*levelwidth && mouse.y > 0 && mouse.y < ts*levelheight) 
        update(mouse.x, mouse.y, mouse.left, mouse.right)
})
document.addEventListener('mouseup', e => {
    // if (mouse.x > 0 && mouse.x < ts*24 && mouse.y > 0 && mouse.y < ts*14) 
    //     e.preventDefault();
        
    // switch (e.buttons) {
    //     case 1:
    //         mouse.left = false
    //         break
    //     case 2:
    //         mouse.right = false
    //         break
    // }
    mouse.left = false
    mouse.right = false
})
document.addEventListener('contextmenu', e => {
    if (mouse.x > 0 && mouse.x < ts*levelwidth && mouse.y > 0 && mouse.y < ts*levelheight) 
        e.preventDefault();
})

function updatewidth(width) {
    levelwidth = width
    sw = levelwidth*ts
    ctx.canvas.width = sw

    document.getElementById('level_width').value = width
}
function updateheight(height) {
    levelheight = height
    sh = levelheight*ts
    ctx.canvas.height = sh

    document.getElementById('level_height').value = height
}

// level size
document.getElementById('level_width').addEventListener('change', () => {
    let width = parseInt(document.getElementById('level_width').value)

    updatewidth(width)

    // update map width
    for (c=0; c<map.length; c++) {
        if (map[c].length<width) {
            while (map[c].length<width) {
                map[c].push(0)
            }
        } else {
            map[c].splice(width, map[c].length-width)
        }
    }
    // remove trees that are out of range
    for (i=0; i<trees.length; i++) {
        let t = trees[i]

        if (t.r>width-1)
            trees.splice(i, 1)
    }

    update(0,0,false,false)
})
document.getElementById('level_height').addEventListener('change', () => {
    let height = parseInt(document.getElementById('level_height').value)

    updateheight(height)

    // update map height
    for (c=0; c<map.length; c++) {
        if (map.length<height) {
            while (map.length<height) {
                map.push('0'.repeat(levelwidth).split('').map(x => parseInt(x)))
            }
        } else {
            map.splice(height, map.length-height)
        }
    }
    // remove trees that are out of range
    for (i=0; i<trees.length; i++) {
        let t = trees[i]
        if (t.c>height-1)
            trees.splice(i, 1)
    }

    update(0,0,false,false)
})

// image import
let currentImage
document.getElementById('image_data').addEventListener('change', e => {
    document.getElementById('dropzone').innerHTML = 'or drop file here'

    let el = document.getElementById('image_data')
    let reader
    let image = new Image()

    if (el.files && el.files[0]) {
        reader = new FileReader()

        reader.onload = function(e) {
            image.src = e.target.result

            image.onload = function() {
                currentImage = image
            }
        }

        reader.readAsDataURL(el.files[0])
    }
})

document.getElementById('dropzone').addEventListener('dragover', e => {
    e.preventDefault()

    document.getElementById('dropzone').style.backgroundColor = 'rgba(0,0,0,0.1)'
})
document.getElementById('dropzone').addEventListener('dragleave', e => {
    e.preventDefault()

    document.getElementById('dropzone').style.backgroundColor = 'rgba(0,0,0,0)'
})

document.getElementById('dropzone').addEventListener('drop', e => {
    e.preventDefault()
    document.getElementById('dropzone').style.backgroundColor = 'rgba(0,0,0,0)'

    document.getElementById('image_data').value = ''

    let item
    if (e.dataTransfer.items) {
        // let items = []
        // Use DataTransferItemList interface to access the file(s)
        // for (var i = 0; i < e.dataTransfer.items.length; i++) {
        //   // If dropped items aren't files, reject them
        //   if (e.dataTransfer.items[i].kind === 'file') {
        //     var file = e.dataTransfer.items[i].getAsFile();
        //     items.push(file)
        //   }
        // }

        item = e.dataTransfer.items[0].getAsFile()
    } else {
        // Use DataTransfer interface to access the file(s)
        // for (var i = 0; i < e.dataTransfer.files.length; i++) {
        //   console.log('... file[' + i + '].name = ' + e.dataTransfer.files[i].name);
        // }
        item = e.dataTransfer.files[0]
    }

    if (item.type === 'image/png' || item.type === 'image/jpeg') {
        document.getElementById('dropzone').innerHTML = item.name
        
        let reader
        let image = new Image()
        // console.log(item.getData())
        reader = new FileReader()

        reader.onload = function(e) {
            image.src = e.target.result

            image.onload = function() {
                currentImage = image
            }
        }

        reader.readAsDataURL(item)
    } else {
        alert('only types "image/png" and "image/jpeg" accepted')
    }
})

document.getElementById('submitimage').addEventListener('click', () => {
    handleImage(currentImage)
})

document.getElementById('threshold').addEventListener('input', () => {
    document.getElementById('threshold_value').innerHTML = `floor threshold: ${document.getElementById('invert').checked ? '&gt;' : '&lt;'}${document.getElementById('threshold').value}`
    // document.getElementById('dark_threshold_value').innerHTML = `tree threshold: &lt;${document.getElementById('threshold').value}`
    // document.getElementById('dark_threshold').value = document.getElementById('threshold').value - 10
})
document.getElementById('dark_threshold').addEventListener('input', () => {
    // document.getElementById('threshold_value').innerHTML = `floor threshold: &gt;${parseInt(document.getElementById('dark_threshold').value) + 10}`
    document.getElementById('dark_threshold_value').innerHTML = `tree threshold: ${document.getElementById('invert').checked ? '&gt;' : '&lt;'}${document.getElementById('dark_threshold').value}`
    // document.getElementById('threshold').value = parseInt(document.getElementById('dark_threshold').value) + 10
})

document.getElementById('invert').addEventListener('click', () => {
    document.getElementById('threshold_value').innerHTML = `floor threshold: ${document.getElementById('invert').checked ? '&gt;' : '&lt;'}${document.getElementById('threshold').value}`
    document.getElementById('dark_threshold_value').innerHTML = `tree threshold: ${document.getElementById('invert').checked ? '&gt;' : '&lt;'}${document.getElementById('dark_threshold').value}`
})

function handleImage(image) {
    // console.log(image.src, image.width, image.height)
    map = []
    for (c=0; c<levelheight; c++) {
        map.push( '0'.repeat(levelwidth).split('').map(x => parseInt(x)) )
    }
    trees = []

    let imagecanvas = document.createElement('canvas')

    imagecanvas.width = levelwidth
    imagecanvas.height = levelheight

    imagecanvas.getContext('2d').drawImage(image, 0, 0, levelwidth, levelheight)

    for (r=0; r<levelwidth; r++) {
        for (c=0; c<levelheight; c++) {
            let cdata = imagecanvas.getContext('2d').getImageData(r, c, 1, 1).data
            let average = (cdata[0]+cdata[1]+cdata[2])/3

            // console.log(average)
            if (document.getElementById('invert').checked) {
                if (average>parseInt(document.getElementById('threshold').value)) {
                    map[c][r] = 1
                }
                if (average>parseInt(document.getElementById('dark_threshold').value)) {
                    trees.push( {c: c, r: r} )
                }
            } else {
                if (average<parseInt(document.getElementById('threshold').value)) {
                    map[c][r] = 1
                }
                if (average<parseInt(document.getElementById('dark_threshold').value)) {
                    trees.push( {c: c, r: r} )
                }
            }
            // console.log( average )
        }
    }

    update(0,0,false,false)
}

// update
function update(x, y, left, right) {
    // selected tile
    let selectedX = Math.min(Math.floor(x/ts), levelwidth-1)
    let selectedY = Math.min(Math.floor(y/ts), levelheight-1)
    if (selectedX<0) selectedX=0;
    if (selectedY<0) selectedY=0;

    // ----- handle tile updating
    if (left) {
        if (selectedTile === 'ground') {
            if ( map[selectedY][selectedX] === 0 )
                map[selectedY][selectedX] = 1;
        } else if (selectedTile === 'tree') {
            placed = false

            for (t of trees) {
                if (t.r === selectedX && t.c === selectedY) {
                    placed = true
                    break
                }
            }

            if (!placed) {
                trees.push( {c: selectedY, r: selectedX} )
            }
        } else if (selectedTile === 'player') {
            player.r = selectedX
            player.c = selectedY
        } else if (selectedTile === 'end') {
            win.r = selectedX
            win.c = selectedY
        }
    } else if (right) {
        if (selectedTile === 'ground') {
            if ( map[selectedY][selectedX] === 1 )
                map[selectedY][selectedX] = 0;
        } else if (selectedTile === 'tree') {
            for (i=0; i<trees.length; i++) {
                let t = trees[i]
                if (t.r === selectedX && t.c === selectedY) {
                    trees.splice(i, 1)
                }
            }
        }
    }

    // ----- draw
    ctx.clearRect(0, 0, sw, sh)
    ctx.fillStyle="#eeeeee"
    ctx.fillRect(0,0,sw,sh)

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

    // selected    
    ctx.fillStyle = 'rgba(0,0,0,0.2)'
    ctx.fillRect(selectedX*ts, selectedY*ts, ts, ts)

    // gridlines
    ctx.fillStyle = '#ddd'
    
    for (i=0; i<levelwidth-1; i++) {
        ctx.fillRect((i+1)*ts, 0, 1, sh)
    }
    for (i=0; i<levelheight-1; i++) {
        ctx.fillRect(0, (i+1)*ts, sw, 1)
    } 
}

function exportlevel(map, trees, player, end) {
    let mapstr = ''

    // ground
    for (c=0; c<map.length; c++) {
        for (r=0; r<map[0].length; r++) {
            mapstr += map[c][r].toString()
        }

        if (c<map.length-1)
            mapstr += ',';
    }

    mapstr += '|'

    // trees
    for (i=0; i<trees.length; i++) {
        let t = trees[i]
        mapstr += t.c.toString() + '.' + t.r.toString()

        if (i<trees.length-1)
            mapstr += ',';
    }

    mapstr += '|'

    // player start
    mapstr += player.c.toString() + '.' + player.r.toString()

    mapstr += '|'

    // level end
    mapstr += win.c.toString() + '.' + win.r.toString()
    
    // level title
    mapstr += '|'
    mapstr += document.getElementById('title').value.replace(/\|/gm, ' ')

    // level creator
    mapstr += '|'
    mapstr += document.getElementById('creator').value.replace(/\|/gm, ' ')

    // level size
    // mapstr += '|'
    // mapstr += levelwidth + '.' + levelheight

    return LZString.compressToBase64(mapstr)
}

document.getElementById('export').addEventListener('click', () => {
    // let mapstr = ''

    // // ground
    // for (c=0; c<map.length; c++) {
    //     for (r=0; r<map[0].length; r++) {
    //         mapstr += map[c][r].toString()
    //     }

    //     if (c<map.length-1)
    //         mapstr += ',';
    // }

    // mapstr += '|'

    // // trees
    // for (i=0; i<trees.length; i++) {
    //     let t = trees[i]
    //     mapstr += t.c.toString() + '.' + t.r.toString()

    //     if (i<trees.length-1)
    //         mapstr += ',';
    // }

    // mapstr += '|'

    // // player start
    // mapstr += player.c.toString() + '.' + player.r.toString()

    // mapstr += '|'

    // // level end
    // mapstr += win.c.toString() + '.' + win.r.toString()
    
    // // level title
    // mapstr += '|'
    // mapstr += document.getElementById('title').value.replace(/\|/gm, ' ')

    // // level creator
    // mapstr += '|'
    // mapstr += document.getElementById('creator').value.replace(/\|/gm, ' ')

    document.getElementById('export_data').value = exportlevel(map, trees, player, end)
})

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
    let ground = sections[0].split(',')

    // if (ground.length !== 14)
    //     throw new levelerror('invalid ground data')
    updateheight(ground.length)

    for (c=0; c<ground.length; c++) {
        let data = ground[c].split('')
        for (i=0; i<data.length; i++) {
            if (isNaN(parseInt(data[i])))
                throw new levelerror('invalid ground data')

            data[i] = parseInt(data[i])
        }

        // if (data.length !== 24)
        //     throw new levelerror('invalid ground data')
        updatewidth(data.length)

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

            trees.push({ c: parseInt(pos[0]), r: parseInt(pos[1]) })
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
    document.getElementById('title').value = sections[4]
    document.getElementById('creator').value = sections[5]

    update(0,0,false,false)
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

    // if (ground.length !== 14)
    //     throw new levelerror('invalid ground data')
    updateheight(ground.length)

    for (c=0; c<ground.length; c++) {
        let data = ground[c].split('')
        for (i=0; i<data.length; i++) {
            if (isNaN(parseInt(data[i])))
                throw new levelerror('invalid ground data')

            data[i] = parseInt(data[i])
        }

        // if (data.length !== 24)
        //     throw new levelerror('invalid ground data')
        updatewidth(data.length)

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

            trees.push({ c: parseInt(pos[0]), r: parseInt(pos[1]) })
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
    document.getElementById('title').value = sections[4]
    document.getElementById('creator').value = sections[5]

    update(0,0,false,false)
}

document.getElementById('import').addEventListener('click', () => {
    // const mapstr = LZString.decompressFromUTF16(document.getElementById('import_data').value)
    // const sections = mapstr.split('|')

    // if (sections.length !== 6) 
    //     return alert('invalid level data')

    // // ground
    // let ground = sections[0].split(',')

    // if (ground.length !== 14)
    //     return alert('invalid ground data')

    // for (c=0; c<ground.length; c++) {
    //     let data = ground[c].split('')
    //     for (i=0; i<data.length; i++) {
    //         if (isNaN(parseInt(data[i])))
    //             return alert('invalid ground data')

    //         data[i] = parseInt(data[i])
    //     }

    //     if (data.length !== 24)
    //         return alert('invalid ground data')

    //     map[c] = data

    //     // console.log(data)
    // }
    
    // // trees
    // trees = []
    // let treedata = sections[1].split(',')

    // if (treedata.length>0 && treedata[0] !== '') {
    //     for (i=0; i<treedata.length; i++) {
    //         let pos = treedata[i].split('.')
    //         if (pos.length !== 2)
    //             return alert('invalid tree data')

    //         for (p of pos) {
    //             if (isNaN(parseInt(p)))
    //                 return alert('invalid tree data')
    //         }

    //         trees.push({ c: pos[0], r: pos[1] })
    //     }
    // }

    // // player start
    // let playerdata = sections[2].split('.')

    // if (playerdata.length !== 2)
    //     return alert('invalid player data')

    // for (p of playerdata) {
    //     if (isNaN(parseInt(p)))
    //         return alert('invalid player data')
    // }

    // player.c = playerdata[0]
    // player.r = playerdata[1]

    // // level end
    // let enddata = sections[3].split('.')

    // if (enddata.length !== 2)
    //     return alert('invalid end data')
    // for (p of enddata) {
    //     if (isNaN(parseInt(p)))
    //         return alert('invalid end data')
    // }

    // win.c = enddata[0]
    // win.r = enddata[1]
    
    // // title/creator
    // document.getElementById('title').value = sections[4]
    // document.getElementById('creator').value = sections[5]

    // update(0,0,false,false)
    if (document.getElementById('oldcom').checked) {
        importlevel_old(document.getElementById('import_data').value)         
    } else {
        importlevel(document.getElementById('import_data').value)
    }
})

update(0,0,false,false)

// ---- dark mode stuff
let darkEnabled = parseInt(localStorage.getItem('awedd_dark')) || 0
if (darkEnabled) {
    document.body.style.backgroundColor = '#111'
    document.body.style.color = '#eee'

    let els = document.body.getElementsByTagName('*')
    for (el of els) {
        el.classList.add('_darkmode')
    }

    document.getElementById('dark').checked = true
} else {
    document.body.style.backgroundColor = '#fff'
    document.body.style.color = '#000'

    let els = document.body.getElementsByTagName('*')
    for (el of els) {
        el.classList.remove('class', '_darkmode')
    }

    document.getElementById('dark').checked = false
}

let dark = document.getElementById('dark')
dark.addEventListener('click', () => {
    if (dark.checked) {
        document.body.style.backgroundColor = '#111'
        document.body.style.color = '#eee'

        let els = document.body.getElementsByTagName('*')
        for (el of els) {
            el.classList.add('_darkmode')
        }

        localStorage.setItem('awedd_dark', '1')
    } else {
        document.body.style.backgroundColor = '#fff'
        document.body.style.color = '#000'

        let els = document.body.getElementsByTagName('*')
        for (el of els) {
            el.classList.remove('class', '_darkmode')
        }

        localStorage.setItem('awedd_dark', '0')
    }
})