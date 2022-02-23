'use strict';

(() => {
    const main = document.getElementById('main')
    const parallax = document.querySelectorAll('.parallax')
    const slides = document.querySelectorAll('.slide')

    // Update location hash to whatever slide is currently on screen when scrolling stops
    const scrollUpdate = {checking: false, lastScrollCheck: 0}
    const scrollCheck = () => {
        // If last checked scroll position equals current scroll position, start looping through each slide's position
        if (main.scrollLeft === scrollUpdate.lastScrollCheck) {
            for (let el of slides) {
                // Set location hash to slide that is currently fully on screen
                if (main.scrollLeft === main.scrollLeft + el.getBoundingClientRect().left) {
                    window.history.pushState('1', '1', window.location.href.split('#')[0] + '#' + el.getAttribute('id'))
                    break
                }
            }

            clearInterval(scrollUpdate.interval)
            scrollUpdate.checking = false
        }

        scrollUpdate.lastScrollCheck = main.scrollLeft
    }

    // Counter-scroll parallax elements based on parallax amount specified (0 = normal, 1 = static)
    const updateParallax = () => {
        for (let el of parallax) {
            el.style.left = `calc(${el.dataset.parallaxOffset || '0px'} + ${-el.parentElement.getBoundingClientRect().left * el.dataset.parallax}px)`
        }
    }

    // Update parallax positions and start checking for when user stops scrolling 
    main.addEventListener('scroll', e => {
        if (!scrollUpdate.checking) {
            scrollUpdate.interval = setInterval(scrollCheck, 100)
            scrollUpdate.checking = true
        }

        updateParallax()
    })   

    // Scroll to correct section when a sidebar link is clicked
    const slideLinks = document.querySelectorAll('#start a')
    for (let el of slideLinks) {
        el.addEventListener('click', e => {                
            e.preventDefault()

            // Cancel any scroll checking intervals, prevent any new ones from starting during smooth scrolling
            scrollUpdate.checking = true
            if (scrollUpdate.interval) clearInterval(scrollUpdate.interval)

            main.scrollTo({
                left: document.querySelector(el.getAttribute('href')).getBoundingClientRect().left,
                behavior: 'smooth'
            })

            // Allow scroll checking to start again when smooth scrolling stops
            let position = null
            let staticCheck = setInterval(() => {
                if (position === main.scrollLeft) {
                    scrollUpdate.checking = false
                    clearInterval(staticCheck)
                }
                position = main.scrollLeft
            }, 10)

            window.history.pushState('1', '1', window.location.href.split('#')[0] + el.getAttribute('href'))
        })
    }

    // THis is Supposed to smooth scroll when link is changed manually but it is not working and i dont feel like fixing it
    window.addEventListener('hashchange', e => {      
        let section = document.getElementById(window.location.href.split('#')[1]) || document.getElementById('start')

        scrollUpdate.checking = true
        if (scrollUpdate.interval) clearInterval(scrollUpdate.interval)
        
        main.scrollTo({
            left: main.scrollLeft + section.getBoundingClientRect().left,
            behavior: 'smooth'
        })

        let position = null
        const staticCheck = setInterval(() => {
            if (position === main.scrollLeft) {
                scrollUpdate.checking = false
                clearInterval(staticCheck)
            }
            position = main.scrollLeft
        }, 10)
    })

    // Make sure correct slide is on screen when page is loaded
    window.addEventListener('load', e => {
        if (window.location.hash !== '' && document.querySelector(window.location.hash)) {
            main.scrollTo({
                left: main.scrollLeft + document.querySelector(window.location.hash).getBoundingClientRect().left,
            })
        }
    })

    // woffy slush
    const secretCode = {string: '', interval: null}
    const webdingAllChildren = el => {
        el.childNodes.forEach(node => {
            webdingAllChildren(node)
            if (node.style) node.style.fontFamily = 'Webdings'
        })
    }
    document.addEventListener('keypress', e => {
        if (secretCode.interval) clearInterval(secretCode.interval)
        secretCode.interval = setInterval( () => secretCode.string = '', 1000 )
        
        secretCode.string += e.key

        if (secretCode.string.indexOf('woffy') > -1) {
            webdingAllChildren(document.body)
        }
    })

    // Initialize load animations
    const startAnim = document.querySelectorAll('.start_anim')
    window.addEventListener('load', () => {
        for (let el of startAnim) {
            setTimeout( () => { el.classList.remove('start_anim') }, parseFloat(el.dataset.animdelay) )            
        }    
    })
})()