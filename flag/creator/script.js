import { Flag, FlagDesign } from './../flaggen.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 400
canvas.height = 300

let testVar = 0
let testVar2 = 0
let testVar3 = 0

function updateAllFlags(ctx, arr) {
    if (arr.length === 0) {
        ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
        return
    }

    for (let i=0; i<arr.length; i++) {
        arr[i].draw(ctx, i===0) // clear if first flag drawn
    }
}
function updateAllControls(elem, arr) {
    elem.innerHTML = ''

    for (let i=0; i<arr.length; i++) {
        arr[i].append( elem )
    }
}
function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
}

const DesignParams = {
    Stripe: (control) => {
        control.addHeader(control.elem, 'Stripe')

        control.addOption(control.elem, 'color', { type: 'color', value: '#FF0000' }, (color) => {
            control.FlagDesign.color = color
        })
        control.addOption(control.elem, 'amount', { type: 'range', min: 0.5, max: 100.5, step: 0.5, value: 4 }, (amount) => {
            control.FlagDesign.amount = amount
        })
        control.addOption(control.elem, 'horizontal', { type: 'checkbox', value: false }, (checked) => {
            control.FlagDesign.direction = checked ? 'vertical' : 'horizontal'
        })
    },

    Border: (control) => {
        control.addHeader(control.elem, 'Border')

        control.addOption(control.elem, 'color', { type: 'color', value: '#FF0000' }, (color) => {
            control.FlagDesign.color = color
        })
        control.addOption(control.elem, 'thickness', { type: 'range', min: 1, max: 1000, step: 1, value: 8 }, (th) => {
            control.FlagDesign.thickness = th
        })

        // this is entirely my fault for writing the function like this
        control.save.left = true
        control.save.right = true
        control.save.bottom = true
        control.save.top = true

        control.save.sides = 'lrtb'

        let generate = () => {
            control.save.sides = ''

            if (control.save.left) control.save.sides += 'l'
            if (control.save.right) control.save.sides += 'r'
            if (control.save.bottom) control.save.sides += 'b'
            if (control.save.top) control.save.sides += 't'
        }

        control.addOption(control.elem, 'left', { type: 'checkbox', value: true }, (value) => {
            control.save.left = value
            generate()

            control.FlagDesign.sides = control.save.sides
        })
        control.addOption(control.elem, 'right', { type: 'checkbox', value: true }, (value) => {
            control.save.right = value
            generate()

            control.FlagDesign.sides = control.save.sides
        })
        control.addOption(control.elem, 'top', { type: 'checkbox', value: true }, (value) => {
            control.save.top = value
            generate()

            control.FlagDesign.sides = control.save.sides
        })
        control.addOption(control.elem, 'bottom', { type: 'checkbox', value: true }, (value) => {
            control.save.bottom = value
            generate()

            control.FlagDesign.sides = control.save.sides
        })
    },
}

const Control = class Control {
    constructor(index) {
        this.elem = document.createElement('div')

        this.elem.classList.add('box')

        this.save = {}
    }

    addHeader(el, text) {
        let header = document.createElement('header')

        let title = document.createElement('span')
        title.setAttribute('contenteditable', 'true')
        title.innerHTML = text

        let moveup = document.createElement('button')
        moveup.classList.add('move_up')
        moveup.innerHTML = '&#10514;'

        let movedown = document.createElement('button')
        movedown.classList.add('move_down')
        movedown.innerHTML = '&#10515;'

        let close = document.createElement('button')
        close.classList.add('close')
        close.innerHTML = '&#x2715;'

        header.appendChild(title)
        header.appendChild(moveup)
        header.appendChild(movedown)
        header.appendChild(close)

        el.appendChild(header)
    }

    addButton(el, text, className, link) {
        let button = document.createElement('button')

        button.innerHTML = text
        button.classList.add(className)

        button.addEventListener('click', () => link(button))

        el.appendChild(button)
    }

    addOption(el, label, control, link) {
        if (!el.querySelector('.options')) {
            let options = document.createElement('div')
            options.classList.add('options')

            el.appendChild(options)
        }
        let options = el.querySelector('.options')

        let option = document.createElement('div')
        option.classList.add('option')

        let elabel = document.createElement('label')
        elabel.innerHTML = label

        let value = document.createElement('div')
        value.classList.add('value')

        let edisplay = document.createElement('input')
        edisplay.classList.add('valuedisplay')
        edisplay.setAttribute('type', 'text')

        let showdisplay = true

        // this is very good code
        if (control.type === 'range') {
            let econtrol = document.createElement('input')

            econtrol.setAttribute('type', 'range')
            econtrol.setAttribute('min', control.min)
            econtrol.setAttribute('max', control.max)
            econtrol.setAttribute('step', control.step)
            econtrol.setAttribute('value', control.value)

            edisplay.value = econtrol.value

            econtrol.addEventListener('input', () => {
                link(parseFloat(econtrol.value))
                edisplay.value = econtrol.value

                updateAllFlags(ctx, Flags)
            })
            edisplay.addEventListener('blur', () => {
                econtrol.value = edisplay.value
                econtrol.dispatchEvent(new Event('input'))
            })

            value.appendChild(econtrol)
        } else if (control.type === 'checkbox') {
            let econtrol = document.createElement('input')

            econtrol.setAttribute('type', 'checkbox')
            // econtrol.setAttribute('checked', control.value)
            if (control.value) econtrol.setAttribute('checked', 'true')

            edisplay.value = econtrol.checked ? 'true' : 'false'

            showdisplay = false

            econtrol.addEventListener('click', () => {
                link(econtrol.checked)
                edisplay.innerHTML = econtrol.checked ? 'true' : 'false'
                
                updateAllFlags(ctx, Flags)
            })

            value.appendChild(econtrol)
        } else if (control.type === 'text') {
            let econtrol = document.createElement('input')

            econtrol.setAttribute('type', 'text')
            econtrol.setAttribute('value', control.value)

            showdisplay = false

            econtrol.addEventListener('input', () => {
                link(econtrol.value)
                
                updateAllFlags(ctx, Flags)
            })

            value.appendChild(econtrol)
        } else if (control.type === 'color') {
            let econtrol = document.createElement('input')

            econtrol.setAttribute('type', 'color')
            econtrol.setAttribute('value', control.value)

            edisplay.value = econtrol.value

            econtrol.addEventListener('input', () => {
                link(econtrol.value)
                edisplay.value = econtrol.value
                
                updateAllFlags(ctx, Flags)
            })
            edisplay.addEventListener('blur', () => {
                econtrol.value = edisplay.value
                econtrol.dispatchEvent(new Event('input'))
            })

            value.appendChild(econtrol)
        }

        option.appendChild(elabel)
        option.appendChild(value)
        if (showdisplay) option.appendChild(edisplay)

        options.appendChild(option)
    }

    append(el) {
        el.appendChild(this.elem)
    }
}
const DesignControl = class DesignControl extends Control {
    constructor(parentDesign, parentControl) {
        super()
        
        this.elem.classList.add('design_object')
        this.FlagDesign = parentDesign
        this.FlagControl = parentControl
    }

    addHeader(el, text) {
        super.addHeader(el, text)     

        this.elem.querySelector('header .move_up').addEventListener('click', () => {
            this.FlagDesign.Flag.shiftDesign(this.FlagDesign, -1)

            let index = this.FlagControl.DesignControls.indexOf(this)
            if (index > -1 && index !== 0) {
                array_move(this.FlagControl.DesignControls, index, index-1)

                updateAllFlags(ctx, Flags)
                updateAllControls( this.FlagControl.elem.querySelector('.designs'), this.FlagControl.DesignControls)
            }
        })

        this.elem.querySelector('header .move_down').addEventListener('click', () => {
            this.FlagDesign.Flag.shiftDesign(this.FlagDesign, 1)

            let index = this.FlagControl.DesignControls.indexOf(this)
            if (index > -1 && index !== this.FlagControl.DesignControls.length-1) {
                array_move(this.FlagControl.DesignControls, index, index+1)

                updateAllFlags(ctx, Flags)
                updateAllControls( this.FlagControl.elem.querySelector('.designs'), this.FlagControl.DesignControls)
            }
        })
        
        this.elem.querySelector('header .close').addEventListener('click', () => {
            // console.log(this.FlagDesign.Flag)
            this.FlagDesign.Flag.removeDesign(this.FlagDesign)
            let index = this.FlagControl.DesignControls.indexOf(this)
            if (index > -1) {
                this.FlagControl.DesignControls.splice(index, 1)

                updateAllFlags(ctx, Flags)
                updateAllControls( this.FlagControl.elem.querySelector('.designs'), this.FlagControl.DesignControls)
            }
        })
    }
}
const FlagControl = class FlagControl extends Control {
    constructor(parentFlag) {
        super()
        
        this.elem.classList.add('flag_object')
        this.Flag = parentFlag

        this.DesignControls = []
    }

    addHeader(el, text) {
        super.addHeader(el, text)     

        this.elem.querySelector('header .move_up').addEventListener('click', () => {
            // console.log(this.Flag)
            let index = Flags.indexOf(this.Flag)
            if (index > -1 && index !== 0) {
                // Flags.splice(index, 1)
                // FlagControls.splice(index, 1)
                array_move(Flags, index, index-1)
                array_move(FlagControls, index, index-1)

                updateAllFlags(ctx, Flags)
                updateAllControls( document.getElementById('flag_objects'), FlagControls)
            }
        })

        this.elem.querySelector('header .move_down').addEventListener('click', () => {
            // console.log(this.Flag)
            let index = Flags.indexOf(this.Flag)
            if (index > -1 && index !== Flags.length-1) {
                // Flags.splice(index, 1)
                // FlagControls.splice(index, 1)
                array_move(Flags, index, index+1)
                array_move(FlagControls, index, index+1)

                updateAllFlags(ctx, Flags)
                updateAllControls( document.getElementById('flag_objects'), FlagControls)
            }
        })
        
        this.elem.querySelector('header .close').addEventListener('click', () => {
            // console.log(this.Flag)
            let index = Flags.indexOf(this.Flag)
            if (index > -1) {
                Flags.splice(index, 1)
                FlagControls.splice(index, 1)

                updateAllFlags(ctx, Flags)
                updateAllControls( document.getElementById('flag_objects'), FlagControls)
            }
        })
    }

    addDesignButton(el) {
        let parent = document.createElement('div')
        parent.classList.add('add_design_con')

        let selectedDesign = document.createElement('select')
        for (let d in DesignParams) {
            let option = document.createElement('option')
            option.value = d
            option.innerHTML = d

            selectedDesign.appendChild(option)
        }

        parent.appendChild(selectedDesign)

        let button = document.createElement('button')
        button.classList.add('add_design')
        button.innerHTML = '+ add'

        button.addEventListener('click', () => {
            let design = new FlagDesign[selectedDesign.value]()
            let designControl = new DesignControl(design, this)

            DesignParams[selectedDesign.value](designControl)

            this.addDesignControl(this.elem, designControl)
            this.Flag.addDesign(design)

            updateAllFlags(ctx, Flags)
        })

        parent.appendChild(button)

        el.appendChild(parent)
    }

    addDesignControl(el, control) {
        if (!el.querySelector('.designs')) {
            let designs = document.createElement('div')
            designs.classList.add('designs')

            el.appendChild(designs)
        }
        let designs = el.querySelector('.designs')

        designs.appendChild(control.elem)
        this.DesignControls.push(control)
    }
}

const Flags = []
const FlagControls = [];

// let test = new FlagControl()
// test.addHeader(test.elem, 'Test')
// test.addOption(test.elem, 'Test', { type: 'range', min: 1, max: 100, step: 1 }, (e) => console.log(e))
// test.addButton(test.elem, '+ add design', 'add_design', (e) => console.log(e.parentElement))
// test.append(document.getElementById('flag_objects'))

// let dtest = new DesignControl()
// dtest.addHeader(dtest.elem, 'Test')
// dtest.addOption(dtest.elem, 'Test', { type: 'range', min: 1, max: 100, step: 1 }, (e) => console.log(e))
// test.addDesignControl(test.elem, dtest)

(() => {
    document.getElementById('add_flag').addEventListener('click', () => {
        let flag = new Flag()
        let flagControl = new FlagControl(flag)

        flagControl.addHeader(flagControl.elem, `Flag ${Flags.length}`)
        flagControl.addOption(flagControl.elem, 'color', { type: 'color', value: '#FF0000' }, (color) => {
            flag.setColor(color)
        })
        flagControl.addOption(flagControl.elem, 'size', { type: 'range', min: 0, max: 1000, step: 1, value: 400 }, (size) => {
            flag.setSize(size)
        })

        flagControl.save.aspectw = 4
        flagControl.save.aspecth = 3

        flagControl.addOption(flagControl.elem, 'aspect.w', { type: 'range', min: 1, max: 100, step: 0.1, value: 4 }, (aspectw) => {
            flagControl.save.aspectw = aspectw

            flag.setAspectRatio(flagControl.save.aspectw, flagControl.save.aspecth)
        })
        flagControl.addOption(flagControl.elem, 'aspect.h', { type: 'range', min: 1, max: 100, step: 0.1, value: 3 }, (aspecth) => {
            flagControl.save.aspecth = aspecth

            flag.setAspectRatio(flagControl.save.aspectw, flagControl.save.aspecth)
        })

        flagControl.save.translatex = 0
        flagControl.save.translatey = 0

        flagControl.addOption(flagControl.elem, 'translate.x', { type: 'range', min: -500, max: 500, step: 0.1, value: 0 }, (tx) => {
            flagControl.save.translatex = tx

            flag.setTransform(1, 0, 0, 1, flagControl.save.translatex, flagControl.save.translatey)
        })
        flagControl.addOption(flagControl.elem, 'translate.y', { type: 'range', min: -500, max: 500, step: 0.1, value: 0 }, (ty) => {
            flagControl.save.translatey = ty

            flag.setTransform(1, 0, 0, 1, flagControl.save.translatex, flagControl.save.translatey)
        })

        flagControl.addDesignButton(flagControl.elem)

        Flags.push(flag)
        FlagControls.push(flagControl)

        flagControl.append( document.getElementById('flag_objects') )
        updateAllFlags(ctx, Flags)
    })
})()