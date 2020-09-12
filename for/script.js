var c = ['CD4A4A', 'FF6E4A', 'FFCF48', 'BAB86C', '1CA9C9', '5D76CB', '8F509D'];

function shuffle(array) {
  var m = array.length, t, i;
  while (m > 0) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (i = 0; i < 32; i++) {getRandomInt(0, c.length - 1)
  let colorindex = getRandomInt(0, c.length - 1)
  $('.sq-con').append(`<div class="sq" data-cindex="${colorindex}" style="background: #${c[colorindex]}"></div>`)
}

$('.sq').on('click', function(e) {
  var oC = $(this).css('background');
  let oInd = $(this).attr('data-cindex')
  let nInd = (parseInt(oInd) + getRandomInt(1,6)) % 7

  $(this).css('background', `#${c[nInd]}`);
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