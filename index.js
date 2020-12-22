// variables
/**
  - indices:
      aguacate = 0
      ajo = 1
      cebolla = 2
      pepino = 3
      puerro = 4
      tomate = 5
      zanahoria = 6
 
 - Puntuaciones:
      zanahoria = 1 => 1 moneda, caso 1z
      zanahoria = 2 => 4 monedas, caso 2z
      zanahoria = 3 => 10 monedas, caso 3z
      2 hortalizas iguales != zanahorias = 2 monedas, caso 2h
      3 hortalizas iguales != zanahorias = 5 monedas, caso 3h
      2 hortalizas iguales + 1 zanahoria = 3 monedas, caso 2h + 1z
 */

// ----------------------------------------------------------------
// VARIABLES GLOBLES
// ----------------------------------------------------------------

let monedas = 0;
let ganancias = 0;
let historial = [];

const txtDiv = document.getElementById("texto");
// audio de la animación
let clickS = null;
// audio sonido dinero
const dineroS = new Audio("sonidos/dinero.mp3");
// audio insertar moneda
const insertarS = new Audio("sonidos/nueva_moneda.mp3");
// arreglo de hortalizas
const hortaliza = [
  "aguacate.png",
  "ajo.png",
  "cebolla.png",
  "pepino.png",
  "puerro.png",
  "tomate.png",
  "zanahoria.png",
];

/* const hortalizaC = [
  "aguacate.png",
  "ajo.png",
  "cebolla.png",
  "pepino.png",
  "puerro.png",
  "tomate.png",
  "zanahoria.png",
];
const hortalizaD = [
  "aguacate.png",
  "ajo.png",
  "cebolla.png",
  "pepino.png",
  "puerro.png",
  "tomate.png",
  "zanahoria.png",
]; */

// INICIAMOS LA APLICACIÓN
(function () {
  console.log("iniciamos la app");
  // añadimos un listener al evento resize
  window.addEventListener("resize", ajustarAltoHistorial);

  iniciarAplicacion();
})();

/**
 * Función para inciar el ejercicio
 *
 */
function iniciarAplicacion() {
  // iniciamos la aplicación, reiniciamos las variables
  monedas = 0;
  ganancias = 0;
  historial = [];
  // cambiamos el estado de los botones (por si reiniciamos)
  estadoBoton("btnInsertar");
  estadoBoton("btnJugar", true);
  estadoBoton("btnFinalizar", true);
  // eliminamos los datos de la tabla (por si reiniciamos)
  document.getElementById("tb-body").innerHTML = "";
  // mostramos el mensaje
  mensaje();
}

/**
 * función que se ejecuta cada vez que se pulsa el botón jugar
 */
function jugar() {
  // si no hay monedas monstramos el mensaje pertinente
  if (monedas < 1) {
    //mostrar mensaje
    estadoBoton("btnJugar", true);
    mensaje("No tienes ninguna moneda...");
    return;
  }
  // al jugar cambiamos el estado de los botones
  estadoBoton("btnInsertar", true);
  estadoBoton("btnFinalizar");
  // perdemos una moneda
  monedas--;
  // generamos un mensaje con el número de monedas actualizadas
  mensaje("Monedas: " + monedas + " | Ganancias: " + ganancias);
  // comenzamos la jugada
  comenzarJugada();
}

/**
 * Método para finalizar el juego
 */
function finalizarJuego() {
  // mostramos un alert con las ganacias
  let texto = `Has conseguido un premio total de ${ganancias} moneda/s.\n`;
  texto += `Te has gastado ${historial.length} monedas.\n`;

  const res = ganancias - historial.length;
  texto +=
    res <= 0 ?
    `Has perdido ${res * -1} monedas.` :
    `Tus ganancias reales son ${res} monedas.`;
  alert(texto);
  // reiniciamos el juego
  iniciarAplicacion();
}

/**
 * Método para crear un número random entre dos valores
 * @param int min - valor mínimo por defecto 1
 * @param int max - valor máximo por defecto 7
 * @returns int Numero aleatorio - entre los valores min y max
 */
function crearNumRandom(min = 1, max = 7) {
  // comprobamos si el valor max es <= que min y devolvemos 0
  if (max <= min) {
    return 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * funcion para comenzar una jugada - se llama desde jugar()
 */
function comenzarJugada() {
  // el botón jugar lo desactivamos mientras dure la jugada
  estadoBoton("btnJugar", true);
  // generamos la tirada aleatoria
  let tirada = generarTiradaAleatoria();
  // ponemos el soniquete, instanciamos a cada jugada para evitar que falle el sonido
  clickS = new Audio("sonidos/118240_1430216-lq.mp3");
  clickS.play();
  // creamos la animación para cada uno de los slots
  animarImagen("imgIzq", tirada[0], 0);
  animarImagen("imgCentro", tirada[1], 2);
  animarImagen("imgDer", tirada[2], 4, true);

  // calculamos la puntuación
  const gananciasTirada = calcularPuntuacion(tirada);
  // asignamos a las variable
  ganancias += gananciasTirada;
  monedas += gananciasTirada;

  // añadimos la jugada al historial
  historial.push({
    tirada: historial.length + 1,
    jugada: tirada,
    ganado: gananciasTirada,
    monedas: monedas,
  });
  // actualizamos los textos y el historial
  mensaje(null, 1800);
}

/**
 * Función que genera una tirada aleatoria y se devuelve la tirada en un arreglo int[3]
 * @returns int[] array Arreglo de enteros, ejemplo: [1,2,3]
 */
function generarTiradaAleatoria() {
  const tirada = [];
  tirada.push(crearNumRandom() - 1);
  tirada.push(crearNumRandom() - 1);
  tirada.push(crearNumRandom() - 1);
  return tirada;
}

/**
 * función para generar el mensaje de la estadística tras una tirada
 * @param  string, Opcional, texto a mostrar, si es null se muestra la estadística actual
 * @param int, opcional retardo en milisegundos para mostrar los datos
 */
function mensaje(texto = null, retardo = 0) {
  // si no hay un texto definido lo muestro y asignamos un retardo dependiendo del valor del parámetro
  if (!texto) {
    setTimeout(() => {
      txtDiv.innerHTML = "Monedas: " + monedas + " | Ganancias: " + ganancias;
      // actualizamos el historial
      if (historial.length > 0) {
        const tbBody = document.getElementById("tb-body");
        const numElementos = tbBody.childElementCount;
        // si no tenemos ya todos los datos del array en la tabla hacemos un preppend
        if (numElementos < historial.length) {
          const tmp = tbBody.innerHTML;
          tbBody.innerHTML = filaEstadisticas() + tmp;
        }
      }
    }, retardo);
  } else {
    txtDiv.innerHTML = texto;
  }
}

/**
 * Función para insertar una moneda
 */
function insertarMoneda() {
  insertarS.play();
  monedas++;
  // actualizar el mensaje en el navegador
  mensaje();
  estadoBoton("btnJugar");
}

/**
 * funcion para cambiar el estado de un botón
 * @param string - identificador DOM del elemento a cambiar el estado
 * @param boolean - Opcional defecto FALSE, estado que se asigna al elemento
 */
function estadoBoton(idBoton, disabled = false) {
  const ele = document.getElementById(idBoton);
  if (disabled) {
    ele.setAttribute("disabled", disabled);
  } else {
    ele.removeAttribute("disabled");
  }
}

/**
 * Función que añade una imagen a la caja correspondiente, durante la tirada a modo de animación
 * @string Atributo id del DOM para asignar la imagen correspondiente
 * @string Nombre de la imagen a asignar
 */
function seleccionarImagen(idEle, img) {
  const ele = document.getElementById(idEle);
  ele.style["background-image"] = "url(img/" + img + ")";
}

/**
 * Función que calcula la puntuación tras una tirada
 * @array Arreglo con los datos de la tirada, [izq, centro, derecha]
 * @returns int ganancias de la tirada
 */
function calcularPuntuacion(tirada) {
  //debug const tirada = [6, 1, 1];
  let gananciasTirada = 0;
  // posición del array otras hortalizas distintas a la zanahoria que es 6
  const otrasHortalizas = [0, 1, 2, 3, 4, 5];
  // array de premios, zanahorias y otras
  /**
   * de esta manera comprobamos en base al número de zanahorias los puntos
   * en una tirada salen 2 zanahorias -> premioZanahorias[2] = 4 puntos
   * misma operativa para las otras hortalizas
   */
  const premioZanahorias = [0, 1, 4, 10];
  const premioOtras = [0, 0, 2, 5];

  // contamos las zanahorias usando filter, es lo mismo que un for solo que devuelve un array con
  // las coincidencias en base al filtro
  const z = tirada.filter((t) => t === 6).length;
  // según el nº de zanahorias puntuamos en base al array puntos
  gananciasTirada += premioZanahorias[z];
  // si hay más de 1 zanahoria hemos finalizado y devolvemos las ganancias
  if (z > 1) {
    // retornamos las ganancias totales
    return gananciasTirada;
  }
  // en caso que haya menos de dos zanahorias comprobamos las otras hortalizas
  otrasHortalizas.forEach((otro) => {
    const t = tirada.filter((t) => t === otro).length;
    gananciasTirada += premioOtras[t];
  });
  // retornamos las ganancias totales
  return gananciasTirada;
}

/**
 * Función para generar la animación de cada slot
 * @param string - identificador del elemento
 * @param int - identificador de la hortaliza que ha ganado
 * @param int - Opcional numero de elementos a repetir en la animación
 * @param int - opcional parámetro para para el sonido y cambiar los estados
 */
function animarImagen(eleId, tirada, elementosMas = 0, pararSoniquete = false) {
  // asignamos el elemento del DOM a una variable
  const ele = document.getElementById(eleId);

  // creo una tirada aleatoria
  let tiradaAleatoria = generarAnimacionAleatoria(tirada);
  /* 
  añadimos elementos a la tirada repitiendo el patrón de la animación aleatorio creado 
  con el fin de hacer que cada tirada se alargue N animaciones +
  usamos splice y spread operator
  */
  tiradaAleatoria.splice(6, 0, ...tiradaAleatoria.slice(0, elementosMas));
  let pos = 0;
  const frames = tiradaAleatoria.length;
  const id = setInterval(frame, 150);
  const ding = new Audio("sonidos/ding_final.mp3");

  function frame() {
    if (pos == frames) {
      clearInterval(id);
      if (pararSoniquete) {
        // hacemos sonar el ding final
        clickS.pause();
        estadoBoton("btnJugar");
      }
      ding.play();
    } else {
      const id = tiradaAleatoria[pos++];
      const img = hortaliza[id];
      ele.innerHTML = elemento(img);
    }
  }
}

/**
 * función que cambia el estado del juego, por ejemplo cuando no hay monedas, se llama despues de cada tirada tras terminar la animación de la última imagen
 */
function cambiarEstadoJuego() {
  //paramos el soniquete
  clickS.pause();
  // si tenemos premio ponemos en marcha el sonido de monedas
  if (historial[historial.length - 1].ganado > 0) {
    dineroS.play();
  }
  // habilitamos el botón
  estadoBoton("btnJugar", false);
}

/**
 * función recursiva para crear una animación de hortalizas aleatoria
 * @param id de la hortaliza ganadora
 * @param Array Opcional arreglo con la tirada actual - a efectos de recursion
 */
function generarAnimacionAleatoria(idGanador, tActual = []) {
  const tmp = tActual;
  const n = crearNumRandom(0, hortaliza.length - 1);

  // si está repetida o es la ganadora, repetimos la tirada
  if (tmp.indexOf(n) > -1 || n === idGanador) {
    // seguimos generando aleatorios
    return generarAnimacionAleatoria(idGanador, tmp);
  } else {
    // al no existir el numero generado -> la agregamos al arreglo
    tmp.push(n);
    // comprobamos si tenemos la tirada completa y retornamos el arreglo
    if (tmp.length === hortaliza.length - 1) {
      // añadimos el id de la hortaliza ganadora
      tmp.push(idGanador);
      return tmp;
    }
    // si llegamos aquí es que aún no tenemos todos los elementos y tenemos que añadir otro elemento al arreglo
    return generarAnimacionAleatoria(idGanador, tmp);
  }
}

/**
 * funcion para crear un elemento dinámico con la imagen que corresponde
 * @param  string cadena de texto que se corresponde con la imagen, ejemplo zahanoria.png
 * @returns string Cadena HTML para incluir en el DOM
 */
function elemento(img) {
  const ele = `
    <div class="imagen-anim fade-in" style="background-image:url('img/${img}');">
    </div>`;
  return ele;
}

/**
 * funcion para crear una fila para la tabla de estadísticas e incluirla en el DOM
 */
function filaEstadisticas() {
  // recogemos los datos del historial
  const c = historial[historial.length - 1];
  const img1 = hortaliza[c.jugada[0]];
  const img2 = hortaliza[c.jugada[1]];
  const img3 = hortaliza[c.jugada[2]];
  // devolvemos el html creado
  return `
        <tr class="fade-in">
        <td class="col-premio">${c["tirada"]}</td>
        <td style="padding:4px 0px 4px 0px;">
          <div style="padding:0; text-align: center;">
          <img class="img-mini" src="img/${img1}">
          <img class="img-mini" src="img/${img2}">
          <img class="img-mini" src="img/${img3}">
        </div>       
        </td>
          <td class="col-premio">${c["ganado"]}</td>
          <td class="col-premio">1</td>
          <td class="col-premio">${c["monedas"]}</td>
        </tr>
        `;
}

/**
 * función para actualizar el alto del div del historial con el fin de que ajuste al máximo en la pantalla
 * esta función se ejecuta al añadir un elemento al historial
 *
 */
function ajustarAltoHistorial() {
  // alto fijo de todos los elementos
  const altoFijo = 660;
  //calculamos el máximo que se ve en pantalla la tabla
  const alto = window.innerHeight - altoFijo;
  // finalmente ajustamos el alto a toda la parte visible
  document.getElementById("historial").style.height = alto + "px";
}