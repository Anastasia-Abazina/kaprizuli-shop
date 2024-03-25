const glitch = document.getElementById('glitch')
const scrollLine = document.querySelector('.scroll-line')
const pointsArray = document.querySelectorAll('.point-area')
const numbers = document.querySelectorAll('.number-opacity')
const customVariant = document.querySelectorAll('.variant-print')
const editorComponent = document.getElementById('editor')
const resultMerch = document.querySelector('.result-merch')
const indicatorLayer = document.querySelector('.indicator')
function startGlitch(count, speed) {
    for (let i = 0; i < count; i++) {
        let elGlitch = document.createElement('div')
        elGlitch.className = 'glitch-box'
        glitch.appendChild(elGlitch)
    }
    setInterval(() => {
        let glitchBoxArr = document.querySelectorAll('.glitch-box')
        for (let i = 0; i < glitchBoxArr.length; i++) {
            glitchBoxArr[i].style.left = Math.floor(Math.random() * (100 + 20) - 20) + '%'
            glitchBoxArr[i].style.top = Math.floor(Math.random() * (100 + 20) - 20) + '%'
            glitchBoxArr[i].style.width = Math.floor(Math.random() * 8) + 'rem'
            glitchBoxArr[i].style.height = Math.floor(Math.random() * 8) + 'rem'
            glitchBoxArr[i].style.backgroundPositionX = Math.floor(Math.random() * (100 + 100) - 100) + '%'
            glitchBoxArr[i].style.backgroundPositionY = Math.floor(Math.random() * (100 + 100) - 100) + '%'
        }
    }, speed)
}

function marquee() {
    const wrapper = scrollLine.childNodes[1]
    let offset = 1
    const colorBlock = wrapper.childNodes[1]
    setInterval(() => {
        offset += 2
        wrapper.style.transform = `translateX(${-offset}px)`
        let size = wrapper.getBoundingClientRect()
        if (size.right - 100 < window.innerWidth) {
            offset -= colorBlock.getBoundingClientRect().width
        }
    }, 30)
}


// for (let i = 0; i < pointsArray.length; i++) {
//     pointsArray[i].style.top = Math.floor(Math.random() * 90) + '%'
//     pointsArray[i].style.left = Math.floor(Math.random() * 90) + '%'
//
//     pointsArray[i].addEventListener('mousemove', (e) => {
//         if (pointsArray[i].getBoundingClientRect().y + (pointsArray[i].getBoundingClientRect().height / 2) <= e.y) {
//             let point = pointsArray[i].querySelector('.point')
//             pointsArray[i].style.top = +getComputedStyle(pointsArray[i]).top.replace('px', '') - 50 + 'px'
//         } else {
//             pointsArray[i].style.top = +getComputedStyle(pointsArray[i]).top.replace('px', '') + 50 + 'px'
//         }
//         if (pointsArray[i].getBoundingClientRect().x + (pointsArray[i].getBoundingClientRect().width / 2) <= e.x) {
//             pointsArray[i].style.left = +getComputedStyle(pointsArray[i]).left.replace('px', '') - 50 + 'px'
//         } else {
//             pointsArray[i].style.left = +getComputedStyle(pointsArray[i]).left.replace('px', '') + 50 + 'px'
//
//         }
//     })
// }

for (let i = 0; i < pointsArray.length; i++) {
    pointsArray[i].style.top = Math.floor(Math.random() * 90) + '%'
    pointsArray[i].style.left = Math.floor(Math.random() * 90) + '%'
    let point = pointsArray[i].querySelector('.point')
    pointsArray[i].addEventListener('mouseover', (e) => {
        if (point.getBoundingClientRect().y + (point.getBoundingClientRect().height / 2) <= e.y) {
            point.style.transform += 'translateX(-150%)'
        } else {
            point.style.transform += 'translateX(150%)'
        }
        if (point.getBoundingClientRect().x + (point.getBoundingClientRect().width / 2) <= e.x) {
            point.style.transform += 'translateY(-150%)'
        } else {
            point.style.transform += 'translateY(150%)'
        }
    })
    pointsArray[i].addEventListener('mouseout', (e) => {
        point.style.transform = ''
    })
}


function numberOpacity() {
    let timers = new Array(numbers.length).fill(null)
    window.addEventListener('scroll', () => {
        let delay = 0
        for (let i = 0; i < numbers.length; i++) {
            clearTimeout(timers[i])
            numbers[i].style.opacity = 0
            let coordY = window.pageYOffset + numbers[i].getBoundingClientRect().y
            if (coordY > window.pageYOffset && coordY < window.pageYOffset + window.innerHeight) {
                timers[i] = setTimeout(() => {
                    numbers[i].style.opacity = 1
                }, delay)
                delay += 500
            }
        }
        delay = 0
    })
}

const layersColor={
    'catalog-layer1.svg':'180deg',
    'catalog-layer2.svg':'0deg',
    'catalog-layer3.svg':'180deg',
    'catalog-layer4.svg':'0deg',
}
startGlitch(30, 500)
numberOpacity()
for (let i = 0; i < customVariant.length; i++) {
    customVariant[i].addEventListener('dragstart', (e) => {
        console.log(e)
        window.currentLayer = e.target.currentSrc.split('/').pop()
    })
    customVariant[i].onclick = function (e){
        console.log(e)
        window.currentLayer = e.target.currentSrc.split('/').pop()
        window.frames.editor.postMessage( e.target.currentSrc.split('/').pop())
    }
}
setInterval(() => {
    if (editorComponent?.contentWindow?.sharedSpace) {
        let resultLayerImg = resultMerch.querySelector('.result-layer')
        let resultEditor = editorComponent.contentWindow.sharedSpace
        if (!resultLayerImg) {
            let resultLayer = document.createElement("img")
            resultLayer.classList.add('result-layer')
            resultMerch.appendChild(resultLayer)
        }
        indicatorLayer.style.rotate = layersColor[resultEditor.name]
        resultLayerImg.setAttribute('src','img/layers-big/'+resultEditor.name)
        resultLayerImg.style.top = ((resultEditor.top)/100)*resultMerch.getBoundingClientRect().height +'px'
        resultLayerImg.style.left = ((resultEditor.left)/100)*resultMerch.getBoundingClientRect().width +'px'
        resultLayerImg.style.width = resultEditor.width+'px'
        resultLayerImg.style.rotate = resultEditor.rotate

    }
}, 1000)