
var running = false;
var temperature = 2.0;

function makeTile(size) {
  var tile = document.createElement("div");
  tile.style.position = "relative";
  tile.style.width  = (size*5) + "px";
  tile.style.height = (size*5) + "px";
  tile.style.overflow = "auto";
  for (var i = 0; i < size; ++i) {
    for(var j = 0; j < size; ++j){
      var cell = document.createElement("div");
      cell.id = "cell" + j + "x" + i;
      cell.style.display = "block";
      cell.style.position = "absolute";
      cell.style.left = (j*5) + "px";
      cell.style.top = (i*5) + "px";
      cell.style.width = "5px";
      cell.style.height = "5px";
      cell.style.margin = "0px";
      cell.style.padding = "0px";
      cell.style.overflow = "hidden";
      cell.innerHTML = "&nbsp;";
      if(Math.random() < 0.5){
        cell.style.backgroundColor = "#fff";
        cell.ising = 1;
      }else{
        cell.style.backgroundColor = "#000";
        cell.ising = -1;
      }
      tile.appendChild(cell);
    }
  }
  return tile;
}

function step(size) {
  ix = Math.floor(Math.random()*size)
  iy = Math.floor(Math.random()*size)
  name = "cell" + ix + "x" + iy;
  td = document.getElementById(name);
  if(td){
    up = document.getElementById("cell"+ix+"x"+((iy+size-1)%size));
    down = document.getElementById("cell"+ix+"x"+((iy+1)%size));
    left = document.getElementById("cell"+((ix+size-1)%size)+"x"+iy);
    right = document.getElementById("cell"+((ix+1)%size)+"x"+iy);
    e = td.ising*up.ising   + td.ising*down.ising +
        td.ising*left.ising + td.ising*left.ising;
    r = Math.exp(-2*e/temperature);
    document.getElementById("tempBox").innerHTML = temperature;
    if(Math.random() < r){
      if(td.ising > 0){
        td.style.backgroundColor = "#000";
        td.ising = -1;
      }else{
        td.style.backgroundColor = "#fff";
        td.ising = 1;
      }
    }
  }
  setTimeout("step("+size+");", 100);
}

function makeCanvas() {
  var canvas = document.getElementById("canvas");
  if (canvas) {
    var size = 25;
    var tile = makeTile(size);
    canvas.appendChild(tile);
    var val = document.createElement("div");
    val.id = "tempBox";
    canvas.appendChild(val);
    var temp = document.createElement("input");
    temp.type = "text";
    temp.size = "5";
    temp.value = temperature;
    temp.onchange = function(){
      temperature = parseFloat(temp.value);
    }
    canvas.appendChild(temp);
    setTimeout("step("+size+");", 100);
  }else{
    document.println("canvas not found");
  }
}

window.onload = makeCanvas;
