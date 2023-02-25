//Variables y selectores   
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

//Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}

//Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    //Añadir nuevo gasto al array de gastos usando spreadoperator
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        //console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        console.log(gastado);
        console.log(this.restante);
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);        
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

        formulario.addEventListener('submit', agregarGasto);

    }

    imprimirAlerta(mensaje, tipo){
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje de error

        divMensaje.textContent = mensaje;

        //Insertar en HTML

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //QUitarlo
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //Agregar atributo personalizado de HTML5 data-id
            nuevoGasto.dataset.id = id;

            console.log(nuevoGasto);

            //Crear HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class"badge badge-primary badge-pill">$ ${cantidad} </span>`;

            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar al html
            gastoListado.appendChild(nuevoGasto);

        });

    }

    limpiarHTML() {
        while (gastoListado.lastChild) {
            gastoListado.lastChild.remove();
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if(restante <= (presupuesto*0.25)){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if(restante <= (presupuesto*0.5)){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //Si el total es 0 o menos
        if(restante <= 0){
            this.imprimirAlerta('El presupuesto se agotó', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

    }
}


//Instanciar
let presupuesto;
const ui = new UI();

//Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?');
    //console.log(presupuestoUsuario);

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        alert('Ingresa un presupuesto válido para continuar');
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    //Leer datos

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad inválida', 'error');
        return;
    }

    //Genera objeto gasto

    //Usar object literal enchanced (lo contrario de destructuring)
    const gasto = {nombre, cantidad, id: Date.now()};
    //Añadir nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Manda mensaje y reinicia el formulario
    ui.imprimirAlerta('Gasto agregado correctamente');
    formulario.reset();

    //Imprimir gastos

    //extraer el array gastos del objeto presupuesto y actualizar el restante
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}

function eliminarGasto(id) {
    const {gastos, restante} = presupuesto;
    presupuesto.eliminarGasto(id);
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}