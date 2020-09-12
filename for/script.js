var c = [];


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


for (i=0; i<9; i++) {
  c.push( `hsl(${getRandomInt(0,360)}, ${getRandomInt(40,60)}%, ${getRandomInt(40,60)}%)` )
}

for (i = 0; i < 32; i++) {
  let colorindex = getRandomInt(0, c.length - 1)
  $('.sq-con').append(`<div class="sq" data-cindex="${colorindex}" style="background: ${c[colorindex]}"></div>`)
}

$('.sq').on('click', function(e) {
  var oC = $(this).css('background');
  let oInd = $(this).attr('data-cindex')
  let nInd = (parseInt(oInd) + getRandomInt(1,6)) % c.length

  $(this).css('background', c[nInd]);
  $(this).attr('data-cindex', nInd);

  var eX = e.clientX;
  var eY = e.clientY;

  var el = $('<div class="mouse-ex"></div>');

  $('body').append(el);

  el.css('left', `${eX - 30}px`);
  el.css('top', `${eY - 30}px`);
  el.css('background', oC)

  setTimeout(function() {
    el.remove();
  }, 550)
})