function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

$(document).ready(function() {
    var zindex = 1;

    $('.err').draggable({ handle: '.hdl', containment: 'main' })
    
    $('main').on('mousedown', '.err', function() {
        zindex++;

        $(this).css('z-index', zindex)

        $('.err').removeClass('active')
        $(this).addClass('active')
    })

    $('main').on('click', '.err .btn', function() {
        for (i=0; i<2; i++) {
            var msgs = [
                $(`<div class="err err-xp" style="transform: scale(0.9); filter: blur(5px);">
                    <img src="img/xp/${rand(1,3)}.png" draggable="false" ondragstart="return false;">
                    
                    <div class="hdl hdl-xp"></div>
                    <div class="btn btn-xp"></div>
                </div>`),
                $(`<div class="err err-98" style="transform: scale(0.9); filter: blur(5px);">
                    <img src="img/98/${rand(1,3)}.png" draggable="false" ondragstart="return false;">
                    
                    <div class="hdl hdl-98"></div>
                    <div class="btn btn-98"></div>
                </div>`),
                $(`<div class="err err-10" style="transform: scale(0.9); filter: blur(5px);">
                    <img src="img/10/${rand(1,3)}.png" draggable="false" ondragstart="return false;">
                    
                    <div class="hdl hdl-10"></div>
                    <div class="btn btn-10"></div>
                </div>`),
            ]

            var choice = rand(0,2)
            var el = msgs[choice]

            $('main').append(el)
            el.draggable({ handle: '.hdl', containment: 'main' })

            zindex++;

            $(el).css('z-index', zindex)

            $('.err').removeClass('active')
            $(el).addClass('active')    

            $(el).css({
                left: rand(0, window.innerWidth-486),
                top: rand(0, window.innerHeight-185),

                filter: 'none',
                transform: 'none'
            })    

            $(this).parent().css({
                filter: 'blur(5px)',
                transform: 'scale(0.9)',
                opacity: '0',
            })
            
            let localWindow = $(this).parent()
            setTimeout(function() {
                localWindow.remove()
            }, 250)

            var asrc = ['audio/xp.wav', 'audio/98.wav', 'audio/10.wav']

            let audio = new Audio(asrc[choice])

            audio.volume = 0.5
            audio.play()
        }
    })
})