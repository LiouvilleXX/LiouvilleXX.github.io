var inp_flag=0;//Если inp_flag==0, то обрыбатываем ввод значений пользователя с клавиатуры, в противном случае стандартные инпуты
var colorR="#FF0000";//Подсветка красный
var colorY="#F7AA4B";//Подсветка желтый
var delay=800;//задержка

//Если мобильный
if(isMobile.any()) inp_flag=1;
	
// Случайное целое на промежутке
function getRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//Переменный для добавления кривой
var ns = 'http://www.w3.org/2000/svg';
var svg = document.getElementById("svg");


//Кросс-браузерная функция для получения символа из события keypress
function getChar(event) {
  if (event.which == null) { 
    if (event.keyCode < 32) return null; 
    return String.fromCharCode(event.keyCode)
  }

  if (event.which != 0 && event.charCode != 0) {
    if (event.which < 32) return null; 
    return String.fromCharCode(event.which); 
  }
  return null; 
}

//Функция показывает инпут и рисует кривую
function inpAndDraw(start,end,count) {	
	var obj=document.getElementById("inp" + count);
	var QD=axis.path(start,end);//координаты кривой
	var inpXY=QD.q;//координаты для инпута
	var prev=count-1;
		
	setTimeout(function() {
		if(count!=2) {
			axis.draw(QD.d);
			obj.style.left=inpXY[0] - obj.offsetWidth / 2 + "px";
			obj.style.top=inpXY[1] -  obj.offsetHeight - 5 + "px";
		} else {
			obj.background="none";
			obj.style.borderColor="white";
		}
		if(count >0 ) {
			var inpPrev=document.getElementById("inp"+ prev);
			inpPrev.style.borderColor="white";
			outs[prev].style.background="none";
			if(inp_flag==1) inpPrev.disabled=true;
		}
		if(inp_flag==1) {
			obj.disabled=false;obj.focus();
		}
		obj.style.borderColor="grey";
		obj.style.opacity="1";
		obj.value="";
		check=0;//разрешаем обработку нажатий
	}, delay);	
	
}

//Функция для нахождения кривой Безье
function getPath(start,end) {
  var X1 = this.axisX + start * this.step;
  var distance = this.step * (end - start);
  var X2 = X1 + distance;
  var Qx = X1 + distance / 2;
  var Qy = this.axisY - distance / 2;
  //Возвращаем массив с кривое Безье и координатами для инпута(из уравнения кривой)
  var data={
	  d:"M" + X1 + "," + this.axisY + "Q" + Qx + "," + Qy + " " + X2 + "," + this.axisY  + "",
	  q:[Qx,0.5*this.axisY + 0.5*Qy]
  }
  return data;
  
}

//Деление, координаты оси
var axis = {
  step: 39,
  axisX: 35,
  axisY: document.getElementById("container").offsetHeight - 63,
  path:getPath,
  draw:function(p) {
		var newpath = document.createElementNS(ns, 'path');
		newpath.setAttributeNS(null, "d", p);  
		newpath.setAttributeNS(null, "stroke", "#B7568B"); 
		newpath.setAttributeNS(null, "stroke-width", 2);  
		newpath.setAttributeNS(null, "marker-end", "url(#triangle)");
		newpath.setAttributeNS(null, "fill", "none");
		svg.appendChild(newpath);
  }
}

var inpCount=0;//Счетчик инпутов

//Подбираем числа и выводим
var leftRand=getRand(6,9),rightRand=getRand(11-leftRand,14-leftRand),res=leftRand+rightRand;
document.getElementById("plus").innerHTML="<span>" + leftRand + "</span> + <span>" + rightRand + "</span> = <input id='inp2' type='text' value='?' maxlength='2' disabled>"; 
var outArr=[leftRand, rightRand, res];//Массив для связи ввода и вывода
var outs=document.getElementsByTagName("span");

//первый инпут и кривая
inpAndDraw(0,leftRand,0);

var check=0;//флаг для предотвращения обработки нажатия в случае очень быстрого набора 

//Если inp_flag==0, то обрыбатываем ввод значений пользователя с клавиатуры, в противном случае стандартные инпуты
if(inp_flag==0) {
	addEventListener("keypress", function(e) {
		if(check!=1){
			e = e || event;
			var code = e.which || e.keyCode || e.charCode;
			var num=getChar(e);
			if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)) {
				var inp=document.getElementById("inp" + inpCount);
				if(inpCount!=2) {
					inp.value=num;
				} else if(inp.value.length>1) {
					inp.value=num;  
				}	
				  else {
					inp.value=inp.value+num;  
				  }
				//Верный ответ или нет, для последнего инпута особые условия
				if(inp.value!=outArr[inpCount]){
					if(inpCount!=2) {
						inp.style.color=colorR;
					} else if(inp.value.length>1) {
						inp.style.color=colorR;
					}
				} else {
					inp.style.color="black";
					if(inpCount!=2) {		
					outs[inpCount].style.background=colorY;
					inpCount++;
					check=1;//блокируем обработку пока не завершится функция inpAndDraw
					inpAndDraw(num,+num+outArr[inpCount],inpCount);
					} else {
					inp.style.borderColor="white";
					check=1;
					}
				}
			}
		}
	});
} else {
	document.getElementById("inp0").disabled=false;
	//Без jquery вешаем oninput на все инпуты
	[].forEach.call( document.querySelectorAll('input'), function(el) {
	   el.oninput = function() {
			if(check!=1){
			var num=el.value;
			if (num.match(/[0-9]/)) {
				var inp=document.getElementById("inp" + inpCount);
				//Верный ответ или нет, для последнего инпута особые условия
				if(inp.value!=outArr[inpCount]){
					if(inpCount!=2) {
						inp.style.color=colorR;
					} else if(inp.value.length>1) {
						inp.style.color=colorR;
					}
				} else {
					inp.style.color="black";
					if(inpCount!=2) {		
					outs[inpCount].style.background=colorY;
					inpCount++;
					check=1;//блокируем обработку пока не завершится функция inpAndDraw
					inpAndDraw(num,+num+outArr[inpCount],inpCount);
					} else {
					inp.style.borderColor="white";
					inp.disabled=true;
					check=1;
					}
				}
			} else {
			el.value='';	
			}
		}
	  };
	});
}

