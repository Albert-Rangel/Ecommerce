const socket = io()


socket.on('AllProductsCart', (data) => {
    const cid = document.getElementById("cid").innerHTML;
    obtainPersonalCart(cid);
});

// Función para llamar al carrito personal
async function obtainPersonalCart(cid) {

    socket.emit('obtainCartInfo', cid.substring(1))

    socket.on('cartProducts', async (products) => {
        
       await updateProductCatalogList(products);
    });

}

// Función para actualizar la lista de productos disponibles en el carrito en mi página web
async function updateProductCatalogList(products) {
    const catalogDiv = document.getElementById("catalogo");
    let contenidocambiante = ""


    products.docs[0].products.id.forEach(({ thumbnail, price, description, _id, code, stock, status, category, title }) => {
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
                    </div>
                </div>
            </div>
        </div>`

    });

    catalogDiv.innerHTML = contenidocambiante
}




