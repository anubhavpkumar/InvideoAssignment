var targetImage = undefined;
var imagesCount = 0;
var PicsumObject = undefined;
window.onload = renderImagesPanel();

function toggleCanvasOrientation(){
    var canvas = document.getElementById("main_canvas");
    var height = canvas.height;
    var width = canvas.width;
    canvas.height = width;
    canvas.width = height;
}

function renderImagesPanel(){
    console.log("Callling getImagesUrl")
    PicsumObject = getImagesUrl();
}

function renderImagesIntoPanel(imgSrc){
    var imagesDiv = document.createElement("div");
    //ondrop="drop(event)" ondragover="allowDrop(event)" class="area"
    imagesDiv.setAttribute("ondrop","drop(event)");
    imagesDiv.setAttribute("ondragover","allowDrop(event)");
    imagesDiv.setAttribute("class","area");
    var imgTag = document.createElement("img"); 
    imgTag.setAttribute("id", ("image"+imagesCount));
    imagesCount = imagesCount + 1;
    imgTag.setAttribute("class","fitToScreen");
    //draggable="true" ondragstart="drag(event)" src="https://image.shutterstock.com/image-photo/cars-sale-stock-row-car-600w-636632101.jpg"
    imgTag.setAttribute("draggable","true");
    imgTag.setAttribute("ondragstart", "drag(event)");
    imgTag.setAttribute("src",imgSrc);
    imagesDiv.appendChild(imgTag);
    document.querySelector("#imagepanel").appendChild(imagesDiv);
}

function getImagesUrl() {
    console.log("Getting Images Url"); 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log("Setting PicsumObject"); 
        PicsumObject = JSON.parse(this.responseText);
        console.log("Accessing now. = ", PicsumObject);
        for (i=0; i < PicsumObject.length; i++){
            ImagesObject = PicsumObject[i];
            imageSource = ImagesObject.download_url;
            renderImagesIntoPanel(imageSource);
        }
        
    };
    xhttp.open("GET", "https://picsum.photos/v2/list", true);
    xhttp.send();
}















function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
    console.log("Text = ", ev.dataTransfer.getData("text"));
}

function allowDrop(ev){
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function dropIntoCanvas(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    targetImage = document.getElementById(data);
    rendercanvas();
}


var targetImage = undefined;

function rendercanvas(){
    var ctx = document.getElementById('main_canvas').getContext('2d');
    var img = new Image();
    
    img.onload = function() {
        var canvasWidth = document.getElementById('main_canvas').width;
        var canvasHeight = document.getElementById('main_canvas').height;
        console.log(canvasHeight, canvasWidth);
        var imageHeight = targetImage.naturalHeight;
        var imageWidth = targetImage.naturalWidth;
        ctx.filter = 'blur(4px)'
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        ctx.filter = 'none';
        var measurements = GetPositionAndSize(canvasHeight, canvasWidth, imageHeight, imageWidth);
        ctx.drawImage(img,measurements.xPos,measurements.yPos,measurements.newWidth,measurements.newHeight);
    };
    img.src = targetImage.src;
}

function GetPositionAndSize(cHeight, cWidth, iHeight, iWidth){
    var heightRatio = cHeight/iHeight;
    var widthRatio = cWidth/iWidth;
    var newIHeight, newIWidth, xPos, yPos;
    if (widthRatio > heightRatio)
    {
        console.log("1");
        newIWidth = iWidth * heightRatio;
        newIHeight = cHeight;
        xPos = Math.ceil(Math.abs(cWidth - newIWidth) / 2);
        yPos = 0;
    }
    else
    {
        console.log("2");
        newIWidth = cWidth;
        newIHeight = iHeight * widthRatio;
        yPos = Math.ceil(Math.abs(cHeight - newIHeight) / 2);
        xPos = 0;
    }
    return {
        "newHeight": newIHeight,
        "newWidth": newIWidth,
        "xPos": xPos,
        "yPos": yPos
    }
}