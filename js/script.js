var longAutito = 20; //largo y ancho de la imagen del autito
var filTotal = 20; //numero total de filas
var colTotal = 40; //numero total de columnas
var tablero;
var ctx;
var velocidad = 20; //tiempo de refresco del movimiento

//posicion inicial del autito
var autitoX = 20;
var autitoY = 60;

var movX = 0; //movimiento del autito en coordenadas X
var movY = 0; //movimiento del autito en coordenadas Y

//variables globales que se van a usar
var chocado = false;
var enLaMeta = false;
var vidas = 3;
var vuelta = 1;
var nivel = 1;
var ganador = false;

//marcadores
document.getElementById("p-vuelta").innerHTML= `VUELTA: ${vuelta}`;
document.getElementById("p-nivel").innerHTML= `NIVEL: ${nivel}`;
document.getElementById("p-vida").innerHTML= `VIDAS: ${vidas}`;

//funcion que inicia todo
window.onload = function () {
	// Seteo del alto y ancho del tablero
	tablero = document.getElementById("tablero");
	tablero.height = filTotal * longAutito;
	tablero.width = colTotal * longAutito;
	ctx = tablero.getContext("2d");

	pintarBorde();

	pintarTablero();

	pintarAutito();

	pintarMeta();	
		
	pintarNivel(nivel);

	document.addEventListener("keyup", cambiarDireccion); //movimientos
	// Seteo de la velocidad del autito
	setInterval(update, velocidad);
}

//funcion que refresca constantemente los movimientos y acciones
function update() {

	if (ganador) {

		document.getElementById("h1").innerHTML="GANASTE!!!";
		document.getElementById("h2").innerHTML="Fin del juego, reiniciar";

	} else if (vidas===0) {

		document.getElementById("h1").innerHTML="PERDISTE";
		document.getElementById("h2").innerHTML="Fin del juego, reiniciar";

	} else {

		borrarAutito();
	
		posicionAutito();
	
		detectarColision();

		if (chocado) {

			choque();

		} else if (enLaMeta) {

			finDeLaVuelta();

		} else {

			pintarAutito();

		}

	}

}

//funciones que pintan las imagenes que representan los objetos
function pintarBorde(){
	//fondo verde y arriba despues va el tablero negro para la pista
	ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(0, 0, tablero.width, tablero.height);
}

function pintarTablero(){
    // tablero negro para la pista
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(20, 20, tablero.width - 40, tablero.height - 40);
}

//pintar el autito
function pintarAutito(){
    ctx.fillStyle = "rgb(255,0,0)";
	ctx.fillRect(autitoX, autitoY, longAutito, longAutito);
}

//Pintar el pasto interno y obstaculos NIVEL 1
function pintarNivel(n){
	//pasto
	switch(n){
		case 1:
			ctx.fillStyle = "rgb(0,255,0)";
			ctx.fillRect(120, 120, 560, 160);
			break;

		case 2:
			ctx.fillStyle = "rgb(0,255,0)";
			ctx.fillRect(120, 120, 260, 100);
			ctx.fillRect(480, 20, 300, 80);
			ctx.fillRect(380, 200, 300, 80);
			ctx.fillRect(20, 320, 280, 60);
			break;

		case 3:
			ctx.fillStyle = "rgb(0,255,0)";
			ctx.fillRect(120, 120, 80, 160);
			ctx.fillRect(200, 120, 300, 60);
			ctx.fillRect(480, 120, 80, 160);
			ctx.fillRect(560, 200, 120, 80);
			ctx.fillRect(660, 20, 120, 60);
			ctx.fillRect(300, 280, 80, 100);
			break;

	}
	
	//obstaculos
	pintarObstaculos(10);
	
}

//pintar la meta de llegada
function pintarMeta(){
	//linea verde
    ctx.fillStyle = "rgb(0,255,0)";
    ctx.fillRect(20, 120, 100, 20);
	//cuadricula
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(20, 140, 100, 10);
	ctx.fillRect(20, 150, 10, 10);
	ctx.fillRect(40, 150, 10, 10);
	ctx.fillRect(60, 150, 10, 10);
	ctx.fillRect(80, 150, 10, 10);
	ctx.fillRect(100, 150, 10, 10);
	ctx.fillRect(30, 160, 10, 10);
	ctx.fillRect(50, 160, 10, 10);
	ctx.fillRect(70, 160, 10, 10);
	ctx.fillRect(90, 160, 10, 10);
	ctx.fillRect(110, 160, 10, 10);
	ctx.fillRect(20, 170, 10, 10);
	ctx.fillRect(40, 170, 10, 10);
	ctx.fillRect(60, 170, 10, 10);
	ctx.fillRect(80, 170, 10, 10);
	ctx.fillRect(100, 170, 10, 10);
	ctx.fillRect(30, 180, 10, 10);
	ctx.fillRect(50, 180, 10, 10);
	ctx.fillRect(70, 180, 10, 10);
	ctx.fillRect(90, 180, 10, 10);
	ctx.fillRect(110, 180, 10, 10);
	ctx.fillRect(20, 190, 100, 10);
}

//pintar obstaculos aleatoriamente, evitando el autito, la meta y el pasto
function pintarObstaculos(cant){
	//obstaculos verticales
    for (i=0; i<cant; i++){//repite hasta alcanzar la cantidad de ostaculos pedidos

		do{//repite hasta encontrar area no ocupada
			var xi = Math.random() * tablero.width;
        	var yi = Math.random() * tablero.height;
			var obstaculo = ctx.getImageData(xi, yi, 60, 60);//crea una imagen de 60x60 pixeles
			var areaOcupada = false;

			for (var byte = 0; byte < 14400; byte += 4){//14400 es 60x60pixeles x 4byte
				//verde (0, 255, 0)
				if (obstaculo.data[byte] == 0 && obstaculo.data[byte+1] == 255 && obstaculo.data[byte+2] == 0){
					areaOcupada = true;
					break;
				}
				//rojo (255, 0, 0)
				if (obstaculo.data[byte] == 255 && obstaculo.data[byte+1] == 0 && obstaculo.data[byte+2] == 0){
					areaOcupada = true;
					break;
				}
				//blanco (255, 255, 255)
				if (obstaculo.data[byte] == 255 && obstaculo.data[byte+1] == 255 && obstaculo.data[byte+2] == 255){
					areaOcupada = true;
					break;
				}
			}

		} while (areaOcupada);

        //Pinto el obstaculo, dentro del area de 60x60
        ctx.fillStyle = "rgb(0,255,0";
        ctx.fillRect(xi+25, yi+5, 5, 50);

	}
	//obstaculos horizontales
	for (i=0; i<cant; i++){//repite hasta alcanzar la cantidad de ostaculos pedidos

		do{//repite hasta encontrar area no ocupada
			var xi = Math.random() * tablero.width;
        	var yi = Math.random() * tablero.height;
			var obstaculo = ctx.getImageData(xi, yi, 60, 60);//crea una imagen de 60x60 pixeles
			var areaOcupada = false;

			for (var byte = 0; byte < 14400; byte += 4){//14400 es 60x60pixeles x 4byte
				//verde (0, 255, 0)
				if (obstaculo.data[byte] == 0 && obstaculo.data[byte+1] == 255 && obstaculo.data[byte+2] == 0){
					areaOcupada = true;
					break;
				}
				//rojo (255, 0, 0)
				if (obstaculo.data[byte] == 255 && obstaculo.data[byte+1] == 0 && obstaculo.data[byte+2] == 0){
					areaOcupada = true;
					break;
				}
				//blanco (255, 255, 255)
				if (obstaculo.data[byte] == 255 && obstaculo.data[byte+1] == 255 && obstaculo.data[byte+2] == 255){
					areaOcupada = true;
					break;
				}
			}

		} while (areaOcupada);

        //Pinto el obstaculo, dentro del area de 60x60
        ctx.fillStyle = "rgb(0,255,0";
        ctx.fillRect(xi+5, yi+25, 50, 5);

	}
}

// Movimiento del autito - usamos addEventListener
function cambiarDireccion(e) {
	if (e.code == "ArrowUp" && movY != 1) {
		// si se presiona la flecha arriba con este if...
		// autito no se va a mover en la direccion contraria
		movX = 0;
		movY = -1;
	}
	else if (e.code == "ArrowDown" && movY != -1) {
		//si se presiona flecha abajo
		movX = 0;
		movY = 1;
	}
	else if (e.code == "ArrowLeft" && movX != 1) {
		//si se presiona flecha izquierda
		movX = -1;
		movY = 0;
	}
	else if (e.code == "ArrowRight" && movX != -1) {
		//si se presiona flecha derecha
		movX = 1;
		movY = 0;
	}
}

//actualizar posicion del autito
function posicionAutito(){
    autitoX += movX; //actualizando la posicion del autito en las coordenadas X
    autitoY += movY; //actualizando la posicion del autito en las coordenadas Y
}//en el ejemplo carGame el movimiento es mas tosco al multiplicar x la longitud del auto
//sacando eso se logra un movimiento mas fluido refrescando mas rapido el update
//pero solamente borramos y pintamos el autito, no todo (linea 127)

//Deteccion de colision con los bordes, obstaculos o con la meta
function detectarColision() {
    var autito = ctx.getImageData(autitoX, autitoY, longAutito, longAutito);

    var pixels = longAutito*longAutito; //Porque la imagen es un cuadrado
    var elementos = pixels*4; //Porque cada pixel tiene 4 byte (RGBA)

    //Recorro en busca del verde (borde/obstaculo) o del blanco (meta)
    for (var i = 0; i < elementos; i += 4){

        //verde (0, 255, 0)
        if (autito.data[i] == 0 && autito.data[i+1] == 255 && autito.data[i+2] == 0){
			chocado = true;
			vidas -= 1;
            break;
        }

        //blanco (255, 255, 255)
        if (autito.data[i] == 255 && autito.data[i+1] == 255 && autito.data[i+2] == 255){
            enLaMeta = true;
			vuelta += 1;
            break;
        }

    }

}

//borrar el autito antes de moverlo
// (está idea la saqué de https://www.jairogarciarincon.com/clase/videojuego-sencillo-con-html5)
// para evitar volver a pintar todo el tablero, pasto, obstaculos y meta
// (y así poder pintar aleatoriamente los obstaculos que de la otra forma no se podía)
function borrarAutito(){
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(autitoX, autitoY, longAutito, longAutito);
}

//boton de reinicio
function reiniciar(){
	location.reload();
}

//funcion de acciones cuando hay colision
function choque(){
	movX = 0;
	movY = 0;
    autitoX = 20;
	autitoY = 60;
	chocado = false;
	document.getElementById("p-vida").innerHTML= `VIDAS: ${vidas}`;
}

//funcion de acciones cuando se llega a la meta
function finDeLaVuelta(){
	movX = 0;
	movY = 0;
    autitoX = 20;
	autitoY = 60;
	enLaMeta = false;

	//cuando finaliza la vuelta 3
	if(vuelta===4){
		nivel += 1;
		vuelta = 1;
	}

	//cuando finaliza el nivel 3
	if(nivel===4){
		ganador = true;
	} else {
		document.getElementById("p-vuelta").innerHTML= `VUELTA: ${vuelta}`;
		document.getElementById("p-nivel").innerHTML= `NIVEL: ${nivel}`;
		document.getElementById("p-velocidad").innerHTML= `velocidad: ${velocidad}`;
	
		borrarNivel();
		pintarMeta();
		pintarNivel(nivel);
	}

}

function borrarNivel(){
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(20, 20, tablero.width - 40, tablero.height - 40);
}