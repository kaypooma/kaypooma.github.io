let menuActive = false

const expandbtn = document.getElementById('menu-expand')
const expanddiv = document.getElementById('menu-divider')
const expandbg = document.getElementById('menu-background-transition')

const menu = document.getElementById('menu')
const menuitems = menu.getElementsByTagName('li')

expandbtn.addEventListener('click', () => {
    if (menuActive) {
        expandbtn.classList.remove('menu-expand-active')
        expandbg.classList.remove('menu-background-active')
        expanddiv.classList.remove('menu-divider-active')

        for (let m of menuitems) {
            m.classList.remove('menu-item-active')
        }

        menuActive = false
    } else {
        expandbtn.classList.add('menu-expand-active')
        expandbg.classList.add('menu-background-active')
        expanddiv.classList.add('menu-divider-active')

        for (let m of menuitems) {
            m.classList.add('menu-item-active')
        }

        menuActive = true
    }
})