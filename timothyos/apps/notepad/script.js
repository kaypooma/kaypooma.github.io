// bold
$('.t-bold').on('click', function() {
    var sobj = document.getSelection().getRangeAt(0)
    var sect = sobj.extractContents()

    var elem = document.createElement('span')

    elem.style.fontWeight ? elem.style.fontWeight = 'normal' : elem.style.fontWeight = 'bold'
    
    elem.appendChild(sect)

    sobj.insertNode(elem)
})