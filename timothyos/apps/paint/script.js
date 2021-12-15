var canvas = document.getElementById('c')
var ctx = canvas.getContext('2d')

var m = 0;
var drawColor = '#000'
var drawSize = 2;

var mX
var mY

var currText = 0
var currLine = 0

var lineState = 0

ctx.fillStyle = 'white'
ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.fillStyle = drawColor

function setSize(n) {
    if (n < 1) {
        n = 1
    }

    drawSize = n
    $('.cursor').css('width', n + 'px')
    $('.cursor').css('height', n + 'px')

    $('.sizedisplay').text(drawSize)
}

$(document).on('mousemove', function(e) {
    var w = parseInt($('.cursor').css('width'))
    var h = parseInt($('.cursor').css('height'))

    mX = e.clientX
    mY = e.clientY

    $('.cursor').css('left', e.clientX - w / 2 + 'px')
    $('.cursor').css('top', e.clientY - h / 2 + 'px')
})

$(document).on('mousedown', function() {
    m = 1
}).on('mouseup', function() {
    m = 0
})

$('#c').on('mousedown', function(e) {
    ctx.strokeStyle = drawColor
    ctx.beginPath()
    ctx.lineWidth = drawSize
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
})

$('#c').on('mousemove', function(e) {
    if (m === 1) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
        ctx.stroke()
    }
})

$('.sizedown').on('click', function() {
    setSize(drawSize - 1)
})

$('.sizeup').on('click', function() {
    setSize(drawSize + 1)
})

$('.sizedowne').on('click', function() {
    setSize(drawSize - 10)
})

$('.sizeupe').on('click', function() {
    setSize(drawSize + 10)
})

$('.colorpick').on('change', function(e) {
    drawColor = e.target.value
    $('.cursor').css('border-color', e.target.value)
})

$('.clear').on('click', function() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = drawColor
})

$(document).on('keydown', function(e) {
    if (e.keyCode === 84 && currText === 0) {
        el = $('<input type="text" class="text-input" placeholder="put text here and press enter">')

        el.css('left', mX + 'px')
        el.css('top', mY + 'px')
        el.css('font-size', drawSize)
        el.css('color', drawColor)

        currText = 1
        el.appendTo('body')
        setTimeout(function() {
            el.focus()
        }, 10)
    }

    if (e.keyCode === 76 && currText === 0) {
        var el = $('<div class="line-i"></div>')
            .css('left', mX - (drawSize / 2))
            .css('top', mY - (drawSize / 2))
            .css('width', drawSize)
            .css('height', drawSize)

        function r() { el.remove() }

        if (lineState === 0) {
            el.appendTo('body')

            ctx.closePath()
            ctx.strokeStyle = drawColor
            ctx.beginPath()
            ctx.lineWidth = drawSize
            ctx.moveTo(mX - canvas.offsetLeft, mY - canvas.offsetTop)

            lineState = 1

            currLine = 1
        } else if (lineState === 1) {
            ctx.lineTo(mX - canvas.offsetLeft, mY - canvas.offsetTop)
            ctx.stroke()

            lineState = 0
            currLine = 0

            $('.line-i').remove()
        }
    }
})

$(document).on('keydown', '.text-input', function(e) {
    if (e.keyCode === 13) {
        var text = $(this).val()
        var size = parseInt($(this).css('font-size'))
        var color = $(this).css('color')
        var x = parseInt($(this).css('left'))
        var y = parseInt($(this).css('top'))

        ctx.font = `${size}px Helvetica`
        ctx.fillStyle = color
        ctx.textBaseline = 'top'
        ctx.fillText(text, x - canvas.offsetLeft, y - canvas.offsetTop)

        currText = 0
        $(this).remove()
    }

    if (e.keyCode === 27) {
        $(this).remove()
        currText = 0
    }
})

$('.save').on('click', function() {
    var url = canvas.toDataURL()
    var a = $('<a>')
        .attr('href', url)
        .attr('download', 'draw_' + Date.now() + '.png')
        .appendTo('body')

    a[0].click()

    a.remove()
})