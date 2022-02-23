'use strict';

(() => {
    const projList = document.querySelector('#project_list')
    const projects = [
        { title: 'No context', description: 'questionable message collection', id: 'nocontext' },
        { title: 'Taco from bfb spin', description: 'new hit experience', id: 'taco' },       
        { title: 'Error', description: 'windows simulator', id: 'error' },       
        { title: 'Flag generator', description: 'slightly more developed now', id: 'flag' },       
        { title: 'For', description: 'click the colors', id: 'for' },   
        { title: 'Trails', description: 'leaving a mark', id: 'trails' },     
        { title: 'Wiggle', description: 'shake it', id: 'wiggle' },     
        { title: 'Awedd', description: 'recreation of a stagecast creator game', id: 'awedd' },      
        { title: 'Fart', description: 'web development', id: 'fart' },    
        { title: 'Color graph', description: 'graph image colors along a line', id: 'colorgraph' },      
        { title: 'Spunch', description: 'make the funny gif', id: 'spunch' },     
        { title: 'Cool S', description: 'cool s generator', id: 'cool_s' }, 
        { title: 'kew', description: 'peek a boo', id: 'kewlook' },                           
    ]
    for (let i=0; i<projects.length; i++) {
        let proj = projects[i]

        let link = document.createElement('a')
        link.setAttribute('href', proj.id)

        let el = document.createElement('div')

        el.classList.add('start_anim')
        el.dataset.animdelay = i*50

        el.style.backgroundImage = `none, url(img/plus.png),
            linear-gradient(to right, transparent 0% 46%, #002b36 46% 47%, transparent 47% 51%, #002b36 51% 52%, transparent 52% 54%, #002b36 54% 55%, transparent 55% 100%),
            linear-gradient(to right, transparent 0% 55%, transparent 55% 56%, #002b36 56% 57%, transparent 57% 57.5%, #002b36 57.5% 58.5%, transparent 58.5% 58.75%, #002b36 58.75% 100%), 
            linear-gradient(hsla(314, 50%, 10%, 0.75) 0 100%),
            url(img/projects/${proj.id}.png)`

        el.classList.add('project')
        el.innerHTML = `
            <p class="projtitle">${[...proj.title].map(x => /^[A-Z]*$/.test(x) ? `<span class="bigletter">${x}</span>` : x).join('')}</p>
            <p class="projdesc">${proj.description}</p>
            <p class="projnum">:: ${i+1}</p>
        `

        link.appendChild(el)
        projList.appendChild(link)
    }

    // Animate background circles
    const animate = (time) => {
        window.requestAnimationFrame(animate)

        document.querySelector('#pcircle').style.strokeDashoffset = `${-time/2000-projList.scrollTop/100}%`
        document.querySelector('#pcircle_2').style.strokeDashoffset = `${time/2000+projList.scrollTop/50}%`
    }
    window.requestAnimationFrame(animate)

    // Offset designs for cool Parallax Effects:tm:
    projList.addEventListener('scroll', e => {
        document.querySelector('#ruler').style.backgroundPosition = `0 ${-projList.scrollTop*0.75}px, 0 calc(2.5% + ${-projList.scrollTop*0.75}px)`
        document.querySelector('#squares').style.backgroundPositionY = `${-projList.scrollTop*0.5}px`
        document.querySelector('#squares_small').style.backgroundPositionY = `${-projList.scrollTop*0.25}px`

        document.querySelector('#project_list').style.backgroundPosition = `-10vw ${-projList.scrollTop*0.25}px`
    })

    // Scale project title if it's too long
    window.addEventListener('load', () => {
        const projTitles = document.querySelectorAll('.projtitle')
        for (let el of projTitles) {
            let maxWidth = document.documentElement.clientWidth/100*13.5        
            if (el.offsetWidth > maxWidth) el.style.transform = `scaleX(${maxWidth/el.offsetWidth})`
        }        
    })
})()