const imageUrl = "http://localhost:8080/images/";

const contrastingColors = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#808080'
]

const heightPctToPx = window.innerHeight / 100;
const widthPctToPx = window.innerWidth / 100;

function getContainedSize(img) {
    var ratio = img.naturalWidth / img.naturalHeight
    var width = img.height * ratio
    var height = img.height

    if (width > img.width) {
        width = img.width
        height = img.width / ratio
    }
    return [width, height]
}

function drawBoxes()
{
    // Remove all boxes
    var boxes = document.getElementsByClassName("box");
    while(boxes[0]) {
        boxes[0].parentNode.removeChild(boxes[0]);
    }

    var imgElement = document.getElementById("image-display");
    var imgSize =  getContainedSize(imgElement);
    var imgElementWidth = imgSize[0];
    var imgElementHeight = imgSize[1];

    var leftOffset = (35 * widthPctToPx) - (0.5 * imgElementWidth);
    var topOffset = 10 * heightPctToPx;

    if (imgElementWidth > imgElementHeight) {
        var extraTopOffset = ((heightPctToPx * 60) - imgElementHeight) / 2;
        topOffset += extraTopOffset;
    }

    for (var i = 0; i < curImgData.boxes.length; i++)
    {
        var box = curImgData.boxes[i];
        var boxElement = document.createElement("div");

        var boxX = box[0] * imgElementWidth;
        var boxY = box[1] * imgElementHeight;
        var boxW = box[2] * imgElementWidth;
        var boxH = box[3] * imgElementHeight;

        boxElement.id = "box-" + i;
        boxElement.className = "box";
        boxElement.style.left = leftOffset + boxX + "px";
        boxElement.style.top = topOffset + boxY + "px";
        boxElement.style.width = boxW + "px";
        boxElement.style.height = boxH + "px";
        boxElement.style.borderColor = contrastingColors[i % contrastingColors.length];

        var boxText = document.createElement("span");
        boxText.className = "box-text";
        boxText.innerHTML = curImgData.phrases[i];
        boxText.style.left = "0px";
        boxText.style.top = "0px";
        boxText.style.backgroundColor = contrastingColors[i % contrastingColors.length];
        boxElement.appendChild(boxText);

        document.getElementById("boxes-container").appendChild(boxElement);
    }
}

function fillBoxesList()
{
    var boxesList = document.getElementById("boxes-list");
    while(boxesList.firstChild) {
        boxesList.removeChild(boxesList.firstChild);
    }

    var addBoxButton = document.createElement("button");
    addBoxButton.innerHTML = "Add Box";
    addBoxButton.className = "boxes-list-add";

    addBoxButton.onclick = function() {
        curImgData.boxes.push([0.4, 0.4, 0.2, 0.2]);
        curImgData.phrases.push("");
        updateBoxDisplays();
    }

    boxesList.appendChild(addBoxButton);

    for (var i = 0; i < curImgData.boxes.length; i++)
    {
        var boxElement = document.createElement("div");
        boxElement.id = "box-list-item-" + i;
        boxElement.className = "boxes-list-item";
        boxElement.style.backgroundColor = contrastingColors[i % contrastingColors.length];

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "X";
        deleteButton.className = "boxes-list-item-delete";

        deleteButton.onclick = function() {
            curImgData.boxes.splice(this.parentNode.id.split("-")[3], 1);
            curImgData.phrases.splice(this.parentNode.id.split("-")[3], 1);
            updateBoxDisplays();
        }

        var boxText = document.createElement("input");
        boxText.className = "boxes-list-item-text";
        boxText.value = curImgData.phrases[i];

        boxText.onchange = function() {
            curImgData.phrases[this.parentNode.id.split("-")[3]] = this.value;
            updateBoxDisplays();
        }

        boxElement.appendChild(deleteButton);
        boxElement.appendChild(boxText);

        boxElement.onclick = function() {
            highLightBox(this.id.split("-")[3]);
        }

        boxesList.appendChild(boxElement);
    }
}

function highLightBox(index)
{
    var boxElement = document.getElementById("box-" + index);
    var handles = document.getElementsByClassName("box-handle");

    while(handles[0]) {
        handles[0].parentNode.removeChild(handles[0]);
    }

    var boxes = document.getElementsByClassName("box");
    for (var i = 0; i < boxes.length; i++)
    {
        boxes[i].style.zIndex = 1;
        boxes[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
    }

    boxElement.style.zIndex = 99;
    boxElement.style.backgroundColor = "rgba(0, 0, 0, 0.4)";

    var color = contrastingColors[index % contrastingColors.length];

    var topLeftDrag = document.createElement("div");
    topLeftDrag.className = "box-handle";
    topLeftDrag.style.left = "0px";
    topLeftDrag.style.top = "0px";
    topLeftDrag.style.backgroundColor = color;

    topLeftDrag.onmousedown = function(e) {
        handleDrag("top-left", e);
    }

    var topRightDrag = document.createElement("div");
    topRightDrag.className = "box-handle";
    topRightDrag.style.right = "0px";
    topRightDrag.style.top = "0px";
    topRightDrag.style.backgroundColor = color;

    topRightDrag.onmousedown = function(e) {
        handleDrag("top-right", e);
    }

    var bottomLeftDrag = document.createElement("div");
    bottomLeftDrag.className = "box-handle";
    bottomLeftDrag.style.left = "0px";
    bottomLeftDrag.style.bottom = "0px";
    bottomLeftDrag.style.backgroundColor = color;

    bottomLeftDrag.onmousedown = function(e) {
        handleDrag("bottom-left", e);
    }

    var bottomRightDrag = document.createElement("div");
    bottomRightDrag.className = "box-handle";
    bottomRightDrag.style.right = "0px";
    bottomRightDrag.style.bottom = "0px";
    bottomRightDrag.style.backgroundColor = color;

    bottomRightDrag.onmousedown = function(e) {
        handleDrag("bottom-right", e);
    }

    var centerDrag = document.createElement("div");
    centerDrag.className = "box-handle";
    centerDrag.style.width = "75%";
    centerDrag.style.height = "75%";
    centerDrag.style.left = "12.5%";
    centerDrag.style.top = "12.5%";
    centerDrag.style.backgroundColor = "rgba(0, 0, 0, 0)";

    centerDrag.onmousedown = function(e) {
        handleDrag("center", e);
    }
    
    boxElement.appendChild(topLeftDrag);
    boxElement.appendChild(topRightDrag);
    boxElement.appendChild(bottomLeftDrag);
    boxElement.appendChild(bottomRightDrag);
    boxElement.appendChild(centerDrag);
}

function handleDrag(corner, e)
{
    var boxElement = e.target.parentNode;
    var boxElementIndex = boxElement.id.split("-")[1];

    var imgElement = document.getElementById("image-display");
    var imgSize =  getContainedSize(imgElement);
    var imgElementWidth = imgSize[0];
    var imgElementHeight = imgSize[1];

    var leftOffset = (35 * widthPctToPx) - (0.5 * imgElementWidth);
    var topOffset = 10 * heightPctToPx;

    if (imgElementWidth > imgElementHeight) {
        var extraTopOffset = ((heightPctToPx * 60) - imgElementHeight) / 2;
        topOffset += extraTopOffset;
    }

    var boxX = boxElement.offsetLeft - leftOffset;
    var boxY = boxElement.offsetTop - topOffset;
    var boxW = boxElement.offsetWidth;
    var boxH = boxElement.offsetHeight;

    var mouseStartX = e.clientX;
    var mouseStartY = e.clientY;

    var mouseMove = function(e) {
        var mouseDeltaX = e.clientX - mouseStartX;
        var mouseDeltaY = e.clientY - mouseStartY;

        // Constrain mouse movement to image bounds and other box anchors
        if (corner == "top-left") {
            if (boxX + mouseDeltaX < 0) {
                mouseDeltaX = -boxX;
            }
            
            if (boxY + mouseDeltaY < 0) {
                mouseDeltaY = -boxY;
            }

            if (boxX + mouseDeltaX > boxX + boxW) {
                mouseDeltaX = boxW;
            }

            if (boxY + mouseDeltaY > boxY + boxH) {
                mouseDeltaY = boxH;
            }
        }

        if (corner == "top-right") {
            if (boxX + boxW + mouseDeltaX > imgElementWidth) {
                mouseDeltaX = imgElementWidth - boxX - boxW;
            }

            if (boxY + mouseDeltaY < 0) {
                mouseDeltaY = -boxY;
            }

            if (boxY + mouseDeltaY > boxY + boxH) {
                mouseDeltaY = boxH;
            }
        }

        if (corner == "bottom-left") {
            if (boxX + mouseDeltaX < 0) {
                mouseDeltaX = -boxX;
            }

            if (boxY + boxH + mouseDeltaY > imgElementHeight) {
                mouseDeltaY = imgElementHeight - boxY - boxH;
            }

            if (boxX + mouseDeltaX > boxX + boxW) {
                mouseDeltaX = boxW;
            }
        }

        if (corner == "bottom-right") {
            if (boxX + boxW + mouseDeltaX > imgElementWidth) {
                mouseDeltaX = imgElementWidth - boxX - boxW;
            }

            if (boxY + boxH + mouseDeltaY > imgElementHeight) {
                mouseDeltaY = imgElementHeight - boxY - boxH;
            }
        }

        if (corner == "center") {
            if (boxX + mouseDeltaX < 0) {
                mouseDeltaX = -boxX;
            }

            if (boxY + mouseDeltaY < 0) {
                mouseDeltaY = -boxY;
            }

            if (boxX + boxW + mouseDeltaX > imgElementWidth) {
                mouseDeltaX = imgElementWidth - boxX - boxW;
            }

            if (boxY + boxH + mouseDeltaY > imgElementHeight) {
                mouseDeltaY = imgElementHeight - boxY - boxH;
            }
        }

        if (corner == "top-left") {
            boxElement.style.left = leftOffset + boxX + mouseDeltaX + "px";
            boxElement.style.top = topOffset + boxY + mouseDeltaY + "px";
            boxElement.style.width = boxW - mouseDeltaX + "px";
            boxElement.style.height = boxH - mouseDeltaY + "px";
        }
        else if (corner == "top-right") {
            boxElement.style.top = topOffset + boxY + mouseDeltaY + "px";
            boxElement.style.width = boxW + mouseDeltaX + "px";
            boxElement.style.height = boxH - mouseDeltaY + "px";
        }
        else if (corner == "bottom-left") {
            boxElement.style.left = leftOffset + boxX + mouseDeltaX + "px";
            boxElement.style.width = boxW - mouseDeltaX + "px";
            boxElement.style.height = boxH + mouseDeltaY + "px";
        }
        else if (corner == "bottom-right") {
            boxElement.style.width = boxW + mouseDeltaX + "px";
            boxElement.style.height = boxH + mouseDeltaY + "px";
        }
        else if (corner == "center") {
            boxElement.style.left = leftOffset + boxX + mouseDeltaX + "px";
            boxElement.style.top = topOffset + boxY + mouseDeltaY + "px";
        }
    }

    var mouseUp = function(e) {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);

        var boxX = (boxElement.offsetLeft - leftOffset) / imgElementWidth;
        var boxY = (boxElement.offsetTop - topOffset) / imgElementHeight;
        var boxW = boxElement.offsetWidth / imgElementWidth - 0.005;
        var boxH = boxElement.offsetHeight / imgElementHeight - 0.005;

        console.log(boxY);

        curImgData.boxes[boxElementIndex] = [boxX, boxY, boxW, boxH];

        updateBoxDisplays();
        highLightBox(boxElementIndex);
    }

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
}

function updateBoxDisplays()
{
    drawBoxes();
    fillBoxesList();
}

function loadAnnotation(idx)
{
    // Load annotation from server at endpoint /get_annotation/{idx}
    fetch("/get_annotation/" + idx)
        .then(response => response.json())
        .then(data => {
            document.getElementById("image-display").src = imageUrl + data.image_path;
            document.getElementById("annotation-index").value = currentIdx;

            window.dataLoaded = false;
            window.curImgData = data;

            document.getElementById("image-display").onload = function() {
                updateBoxDisplays();
                document.getElementById("image-caption").value = curImgData.caption;
                document.getElementById("image-path").innerHTML = curImgData.image_path;
                window.dataLoaded = true;
            }
        });
}

function nextAnnotation()
{
    saveAnnotation();

    currentIdx += 1;
    loadAnnotation(currentIdx);
}

function prevAnnotation()
{
    saveAnnotation();

    currentIdx -= 1;
    loadAnnotation(currentIdx);
}

function changeAnnotation()
{
    saveAnnotation();

    currentIdx = parseInt(document.getElementById("annotation-index").value);
    loadAnnotation(currentIdx);
}

function saveAnnotation()
{
    if (!confirm("Are you sure you want to save the annotation?")) {
        return false;
    }

    var imgCaption = document.getElementById("image-caption").value;
    var imgBoxes = curImgData.boxes;
    var imgPhrases = curImgData.phrases;

    var data = {
        "caption": imgCaption,
        "boxes": imgBoxes,
        "phrases": imgPhrases
    }

    fetch("/update_annotation/" + currentIdx, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return true;
}

window.onload = function() {
    window.currentIdx = 0;

    loadAnnotation(currentIdx);
}