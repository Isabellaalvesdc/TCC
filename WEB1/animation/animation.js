
var h = window.innerHeight;
var w = window.innerWidth;
//npm install --save kute.js
//bower install --save kute.js

//------------------- Flood -------------------
var ocean1 = document.getElementById("water");

ocean1.style.bottom = "0%";

var flood1 = 0;

function flood(percentage){ // flood values between 0 and 1
	if(flood1 != 0 && flood1.playing) 
		flood1.stop();
	
	percentage = convertScale(percentage, 5, 8);
	flood1 = KUTE.to(ocean1, {height: percentage / 100 * h + ""}, {duration: 3000});
	flood1.start();
}


//--------------- Day & Night ---------------


var dayBtn = document.getElementById("day");
var nightBtn = document.getElementById("night");
var blueSky = document.getElementById("blueSky");
var isDay = true;

function turnDay() {
	if (!isDay) KUTE.to(document.getElementById("temperature"), {color: "black"}, {duration: 5000}).start();
	if (!isDay) KUTE.to(blueSky, {opacity: 1}, {duration: 5000}).start();
	isDay = true;
	setTemperature(getGasFactor(slider));
};

function turnNight() {
	if (isDay) KUTE.to(document.getElementById("temperature"), {color: "white"}, {duration: 5000}).start();
	if (isDay) KUTE.to(blueSky, {opacity: 0}, {duration: 5000}).start();
	isDay = false;
	setTemperature(getGasFactor(slider));
}



//--------------- Popups ---------------


function openPopup(src) {
	var popupsPanel = document.getElementById("popupsPanel");
	
	document.getElementById("frame").src = src;
	popupsPanel.style.backgroundColor = "rgba(150, 150, 150, 0.7)";
	popupsPanel.style.visibility = "visible";
}

function closePopup() {
	var popupsPanel = document.getElementById("popupsPanel");
	
	popupsPanel.style.visibility = "hidden";
	document.getElementById("frame").src = "";
}



/*--------------- Thermometer ---------------*/

function setTemperature(factor){ // factor values between 0 and 1
	//var height = isDay ? convertScale(factor, 5, 12) : convertScale(factor, 1, 9);
	var height = convertScale(factor, 3, 10);
	var div = document.getElementById("therm3");
	var div2 = document.getElementById("temperature");
	
	KUTE.to(div, {height: height / 100 * h}, {duration: 3000}).start();
	div2.innerHTML = convertScale(height / 12, 15, 35).toFixed(2) + "&#176;C";
}

/*--------------- Miscellaneous ---------------*/

function sleep (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function getGasFactor(slider){
	return slider.value / 100;
}

function convertScale(factor, begin, end) { // factor values between 0 and 1
	return factor * (end - begin) + begin;
}

/*--------------- Raios ---------------*/

function moverRaio(){
	var raio1 = document.getElementById("raio1");
	var raio2 = document.getElementById("raio2");
	var raio3 = document.getElementById("raio3");
	var raio4 = document.getElementById("raio4");
	
	var t11 = KUTE.fromTo(
		raio1, 
		{marginBottom: "0", marginLeft: "0", opacity: "1"}, 
		{marginBottom: "-200px", marginLeft: "150px", opacity: "1"}, 
		{duration: 1500}
	);
	var t12 = KUTE.to(
		raio1,
		{marginBottom: "-250px", marginLeft: "200px", opacity: "0"}, 
		{duration: 500}
	);
	t11.chain(t12);
	t12.chain(t11);
	t11.start();
	
	var t21 = KUTE.fromTo(
		raio2, 
		{marginBottom: "0", marginRight: "0", opacity: "1"}, 
		{marginBottom: "-200px", marginRight: "150px", opacity: "1"}, 
		{duration: 1500}
	);
	var t22 = KUTE.to(
		raio2,
		{marginBottom: "-250px", marginRight: "200px", opacity: "0"}, 
		{duration: 500}
	);
	t21.chain(t22);
	t22.chain(t21);
	t21.start();
	
	var t31 = KUTE.fromTo(
		raio3, 
		{marginBottom: "0", opacity: "1"}, 
		{marginBottom: "-200px", opacity: "1"}, 
		{duration: 1500}
	);
	var t32 = KUTE.to(
		raio3,
		{marginBottom: "-250px", opacity: "0"}, 
		{duration: 500}
	);
	t31.chain(t32);
	t32.chain(t31);
	t31.start();
	
	var t41 = KUTE.fromTo(
		raio4, 
		{marginBottom: "0", opacity: "1"}, 
		{marginBottom: "-200px", opacity: "1"}, 
		{duration: 1500}
	);
	var t42 = KUTE.to(
		raio4,
		{marginBottom: "-250px", opacity: "0"}, 
		{duration: 500}
	);
	t41.chain(t42);
	t42.chain(t41);
	t41.start();
	
}
moverRaio();

//--------------- Logic ---------------

var slider = document.getElementById("slideBar");

slider.oninput = function() {
    flood(getGasFactor(this));
    setTemperature(getGasFactor(this));
}

setTemperature(getGasFactor(slider));

var magnifier = document.getElementById("magnifier");

magnifier.style.cursor = 'pointer';
magnifier.onclick = function() {
    //openPopup("matter-radiation.html");
	

};


//------------------- InfraRedPanel 

var infraredPanel = document.getElementById("infraRedPanel");
var count = 0;
//var velocity = 0.1; // pixels per milliseconds
var velocity = (2 * h + 300) / 15000;

function emiteIR(focusX, focusY, radius, opacity){ //focus values between 0 and 1
	var div = document.createElement("DIV");
	
	div.classList.add("divs", "emiter");
	div.id = "emiter" + count;
	infraredPanel.appendChild(div);
	
	KUTE.fromTo(
		div,
		{height: "0px", width: "0px", left: (focusX * w) + "px", top: (focusY * h) + "px", opacity: opacity}, 
		{height: (2 * radius) + "px", width: (2 * radius) + "px", left: (focusX * w - radius) + "px", top: (focusY * h - radius), opacity: 0}, 
		{duration: radius / velocity, complete: () => {infraredPanel.removeChild(div);}}
	).start();
	
	count += 1;
}

function continuousIR(focusX, focusY, radius, opacity, delay, condition){
	if (condition()) emiteIR(focusX, focusY, radius, opacity());
	sleep(delay).then(() => {
		continuousIR(focusX, focusY, radius, opacity, delay, condition);
	});
}

/*--------------- Logic ---------------*/

var slider = document.getElementById("slideBar");

slider.oninput = function() {
    flood(getGasFactor(this));
    setTemperature(getGasFactor(this));
}

setTemperature(getGasFactor(slider));

var r1 = 2 * h + 300;
var r2 = 0.4 * h - 100;
var timeInterval = 8000;

var opacity = function () {
	return convertScale(getGasFactor(slider), 0.7, 1);
}

continuousIR(0.5, 2, r1 - 300, opacity, timeInterval, () => {return true;}); // earth

var fakeOutdoor = document.getElementById("fakeOutdoor");

fakeOutdoor.style.cursor = 'pointer';
fakeOutdoor.onclick = function() {
    openPopup("agreements.html");
};

var magnifier = document.getElementById("magnifier");

magnifier.style.cursor = 'pointer';
magnifier.onclick = function() {
    openPopup("matter-radiation.html");
};

var help = document.getElementById("help");

help.style.cursor = 'pointer';
help.onclick = function() {
    openPopup("introduction2.html");
};

openPopup("introduction2.html");