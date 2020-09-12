function rand(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

var styles = ['horizontal', 'vertical']

$('.generate').on('click', function() {
    var sChoice = styles[rand(0,styles.length-1)]

    var stripeNumber = rand(1,5)

    var showTriangle = rand(0,200)%2===0
    var showStar

    if (showTriangle) {
        showStar = false
    } else {
        showStar = rand(100,300)%2===0
    }

    // make stripes
    var el = $('.'+sChoice)

    $('.style').hide()

    el.show()
    el.empty()

    for (i=0; i<stripeNumber; i++) {
        var st = $(`<div></div>`)

        el.append(st)
        st.css('background', `hsl(${rand(0,720)}, 100%, 50%)`)
    }

    // triangle?

    if (sChoice === 'vertical' && stripeNumber>1 && showTriangle) {
        $('.triangle').show()
        $('.triangle').css('border-left-color', `hsl(${rand(0,720)}, 100%, 50%)`)
    } else {
        $('.triangle').hide()
    }

    // star?

    if (showStar) {
        document.body.style.setProperty('--star-color', `hsl(${rand(0,720)}, 100%, 50%)`)
        $('.star').show()
    } else {
        $('.star').hide()
    }

    console.log('triangle: '+showTriangle)
    console.log('star: '+showStar)
})