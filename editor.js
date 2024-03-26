let layer
let resizeArr
let rotateArr
let editorContent = document.querySelector('.editor-content')
editorContent.addEventListener("dragover", (e) => e.preventDefault());
function move(event) {

    layer.style.position = 'absolute';
    layer.style.zIndex = 1000;
    layer.style.margin = ''
    layer.style.top = 'initial'
    layer.style.right = 'initial'
    layer.style.bottom = 'initial'
    layer.style.left = 'initial'
    document.body.append(layer);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        layer.style.left = pageX - layer.querySelector('.layer-img').offsetWidth / 2 + 'px';
        layer.style.top = pageY - layer.querySelector('.layer-img').offsetHeight / 2 + 'px';

    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        layer.onmouseup = null;
    };

};

function blockDragStart() {
    return false
}

function resizing(difference, layerSize) {
    let editorPosition = layer.getBoundingClientRect()

    let layerPosition = layer.querySelector('.layer-img').getBoundingClientRect()
    let currentStyle = getComputedStyle(layer.querySelector('.layer-img'))
    let currentScale = 1
    let coeff = 0.04
    if (difference > 0) {
        currentScale += coeff
    } else if (difference < 0) {
        currentScale += coeff * -1
    }
    console.log(editorPosition.width)
    layer.querySelector('.layer-img').style.width = layerPosition.width * currentScale + 'px'
}

function resize(event, el) {
    event.stopPropagation()
    let layerCenter = {
        x: layer.getBoundingClientRect().x + layer.getBoundingClientRect().width / 2,
        y: layer.getBoundingClientRect().y + layer.getBoundingClientRect().height / 2
    }
    // console.log(layerCenter)
    let layerSize = {width: layer.getBoundingClientRect().width, height: layer.getBoundingClientRect().height}
    let backCoord
    if (!backCoord) {
        backCoord = {x: event.x, y: event.y}
    }

    function eventResize(e) {
        let rot = layer.style.rotate
        layer.style.rotate = ''
        let distanceBack = Math.abs(((backCoord.x - layerCenter.x) ** 2 + (backCoord.y - layerCenter.y) ** 2) ** 1 / 2)
        let distanceCurrent = Math.abs(((e.x - layerCenter.x) ** 2 + (e.y - layerCenter.y) ** 2) ** 1 / 2)
        // console.log(distanceBack, distanceCurrent)
        backCoord = {x: e.x, y: e.y}
        resizing(distanceCurrent - distanceBack, layerSize)
        layer.style.rotate = rot

    }

    document.body.style.cursor = getComputedStyle(el).cursor
    document.addEventListener('mousemove', eventResize);
    document.onmouseup = function () {
        document.removeEventListener('mousemove', eventResize);
        document.body.style.cursor = 'initial'
    }

}

function rotation(deg) {
    layer.style.rotate = deg + 'deg'
}

function rotate(event, el) {
    event.stopPropagation()
    let layerCenter = {
        x: layer.getBoundingClientRect().x + layer.getBoundingClientRect().width / 2,
        y: layer.getBoundingClientRect().y + layer.getBoundingClientRect().height / 2
    }
    console.log(layerCenter)
    let layerSize = {width: layer.getBoundingClientRect().width, height: layer.getBoundingClientRect().height}
    let shift = (-Math.atan((event.y - layerCenter.y) / (event.x - layerCenter.x)) * 180 / Math.PI * 2) + (+layer.style.rotate.replaceAll('deg', ''))

    function eventRotate(e) {
        let degCurrent = Math.atan((e.y - layerCenter.y) / (e.x - layerCenter.x)) * 180 / Math.PI * 2
        console.log(degCurrent)
        rotation(degCurrent + shift)
    }
    document.body.style.cursor = getComputedStyle(el).cursor
    document.addEventListener('mousemove', eventRotate);
    document.onmouseup = function () {
        document.removeEventListener('mousemove', eventRotate);
        document.body.style.cursor = 'initial'
    }
}


function focusAdd() {
    layer.classList.add('active')
}

setInterval(() => {
    if (layer) {
        let copyRotate = layer.style.rotate
        layer.style.rotate = ''
        window.sharedSpace = {
            name: window.top.currentLayer,
            width: layer.getBoundingClientRect().width,
            rotate: copyRotate,
            top: (layer.getBoundingClientRect().top / editorContent.getBoundingClientRect().height) * 100,
            left: (layer.getBoundingClientRect().left / editorContent.getBoundingClientRect().width) * 100,
        }
        layer.style.rotate = copyRotate
        console.log(layer.getBoundingClientRect().width)
    }
}, 1000)

function dropping (e,layerPath) {
    console.log(layerPath)
    if (!layerPath){
        layerPath =window.top.currentLayer
    }
    if (!layer) {
        editorContent.innerHTML += `<div draggable="true" tabindex="0" class="container-layer">
        <img class="layer-img" draggable="false"  src="img/layers-big/${layerPath}">
        <button draggable="false"  style="top: -0.5rem;right: -0.5rem;" class="rotate top right"></button>
        <button draggable="false"  style="top: -0.5rem;left: -0.5rem" class="rotate top left"></button>
        <button draggable="false"  style="bottom: -0.5rem;right: -0.5rem" class="rotate bottom right"></button>
        <button draggable="false"  style="bottom: -0.5rem;left: -0.5rem" class="rotate bottom left"></button>


        <button draggable="false"  style="top: -0.25rem;right: -0.25rem;cursor: nesw-resize;" class="resize top right"></button>
        <button draggable="false"  style="top: -0.25rem;left: -0.25rem;cursor: nwse-resize" class="resize top left"></button>
        <button draggable="false"  style="bottom: -0.25rem;right: -0.25rem;cursor: nwse-resize" class="resize bottom right"></button>
        <button draggable="false"  style="bottom: -0.25rem;left: -0.25rem;cursor: nesw-resize" class="resize bottom left"></button>

    </div>`
        layer = document.querySelector('.container-layer')
        layer.addEventListener("dragover", (e) => e.preventDefault());
        layer.ondrop = dropping
        layer.addEventListener('mousedown', move)
        layer.addEventListener('focus', focusAdd)
        layer.addEventListener('focusout', ({currentTarget, relatedTarget}) => {
            if (currentTarget.contains(relatedTarget)) return;
            layer.classList.remove('active')
        })
        layer.ondragstart = blockDragStart
        resizeArr = document.querySelectorAll('.resize')
        rotateArr= document.querySelectorAll('.rotate')
        for (let i = 0; i < resizeArr.length; i++) {
            resizeArr[i].addEventListener('mousedown', e => resize(e, resizeArr[i]))
        }
        for (let i = 0; i < rotateArr.length; i++) {
            rotateArr[i].addEventListener('mousedown', e => rotate(e, rotateArr[i]))
        }
    } else {
        layer.querySelector('.layer-img').setAttribute('src', 'img/layers-big/' + layerPath)
    }
    let copyRotate = layer.style.rotate
    layer.style.rotate = ''
    window.sharedSpace = {
        name: layerPath,
        width: layer.getBoundingClientRect().width,
        rotate: copyRotate,
        top: (layer.getBoundingClientRect().top / editorContent.getBoundingClientRect().height) * 100,
        left: (layer.getBoundingClientRect().left / editorContent.getBoundingClientRect().width) * 100,
    }
    layer.style.rotate = copyRotate
}

editorContent.ondrop = dropping
window.onmessage = (e)=>{
    dropping(e,e.data)
}