const socket = io()
let cid = ""

socket.on('AllProductsCart', (data) => {
    updateProductCatalogList(data);
});
socket.on('changedRole', (success) => {
    updateUserRole(success);
});

async function updateUserRole(success) {
    let content = success.split("|")
    if (content[0] != 'SUC') {
        window.alert(content)
    }else{
        window.alert("Su cambio de rol ha sido exitodo. Verificar en su Informacion personal")
    }
}

socket.on('newProductinCart', (data) => {
    updateProductCounter(data);
});

let bttChangeRol = document.getElementById("bttChangeRol");
// let bttChangeRolpremium = document.getElementById("bttChangeRolpremium");

bttChangeRol.addEventListener("click", (evt) => {
    evt.preventDefault()
    let uid = document.getElementById("uid").innerText;

    socket.emit('changeUserStatus', {
        uid
    })
});

const manegedivShown = () => {
    const counterSpam = document.getElementById("counter");
    counterSpam.style.display = "none";
};

function updateProductCounter(data) {

    const splitString = data.split("|");
    if (splitString[0] == "SUC") {
        const counterSpam = document.getElementById("counter");
        counterSpam.style.display = "block";
        counterSpam.innerHTML = "Se agrego el producto al carrito"
        setTimeout(manegedivShown, 2000);

    } else {
        const counterSpam = document.getElementById("counter");
        counterSpam.style.display = "block";
        counterSpam.innerHTML = "No se pudo agregar al carrito"
        setTimeout(manegedivShown, 2000);

    }
}

// Función para actualizar la lista de productos disponibles en el catalogo en mi página web
async function updateProductCatalogList(productList) {
    console.log("function")
    console.log(productList)
    const catalogDiv = document.getElementById("catalogo");
    let contenidocambiante = ""

    productList.docs.forEach(({ thumbnail, price, description, _id, code, stock, status, category, title, owner }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        Price: ${price} $ </br> 
                        Description : ${description} </br> 
                        Code: ${code}</br> 
                        Stock: ${stock}</br> 
                        Status: ${status}</br> 
                        Category: ${category}</br> 
                        Owner: ${owner}</br> 
                        <button id="btn-catalogo-${_id}" class="btn btn-success">Agregar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
    botonesCatalogo(productList)
}

// Función para actualizar la lista de productos dentro de mi carrito
function updateCartProductsList(CartProductsList) {
    const catalogDiv = document.getElementById("carrito");
    let contenidocambiante = ""

    CartProductsList.forEach(({ thumbnail, _id, title }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        <button id="btn-carrito-${_id}" class="btn btn-danger">Quitar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
}

const botonesCatalogo = async (CatalogList) => {
    for (const catalogo of CatalogList.docs) {
        const botonId = `btn-catalogo-${catalogo.id}`;
        const botonNodo = document.getElementById(botonId);
        let uid = document.getElementById("uid").innerText;
        console.log(uid)

        botonNodo.addEventListener("click", (evt) => {
            evt.preventDefault()
            let pid = catalogo.id;
            const cartid = document.getElementById('cartid').innerHTML;

            socket.emit('addNewProducttoCart', {
                pid, cartid, uid
            })
        });
    }
};

// Función para actualizar la lista de productos dentro de mi carrito
function updateCartProductsList(CartProductsList) {
    const catalogDiv = document.getElementById("carrito");
    let contenidocambiante = ""

    CartProductsList.forEach(({ thumbnail, _id, title }) => {
        contenidocambiante += `<div class="form-container">
            <div>
                <div class="card">
                    <img src= "${thumbnail}" alt="..." class="images">
                    <div class="card-body">
                        Title: ${title} </br> 
                        Id: ${_id} </br> 
                        <button id="btn-carrito-${_id}" class="btn btn-danger">Quitar</button>
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
}
