const socket = io()

socket.on('AllProducts', (data) => {

    updateProductList(data);
});

function updateProductList(products) {

    const containerDiv = document.getElementById("allProductsContainer");
    let contenidocambiante = ""

    products.docs.forEach(({ thumbnail, price, description, _id, code, stock, status, category, title, owner }) => {
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
                        owner: ${owner}</br> 

                    </div>
                </div>
            </div>
        </div>`

    });

    containerDiv.innerHTML = contenidocambiante
}

let productForm = document.getElementById("formProduct");
productForm.addEventListener('submit', (evt) => {
    evt.preventDefault()

    var emailId = document.getElementById("email").innerText;
    let description = productForm.elements.description.value;
    let title = productForm.elements.title.value;
    let price = productForm.elements.price.value;
    let thumbnail = productForm.elements.thumbnail.value;
    let code = productForm.elements.code.value;
    let stock = productForm.elements.stock.value;
    var status = document.getElementById('status').checked;
    let category = productForm.elements.category.value;

    socket.emit('sendNewProduct', {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        owner: emailId,

    })
    productForm.reset()
})

let productUpdateForm = document.getElementById("formupdProduct");
productUpdateForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let pid = productUpdateForm.elements.pidupd.value;
    var emailId = document.getElementById("email").innerText;
    let description = productUpdateForm.elements.descriptionupd.value;
    let title = productUpdateForm.elements.titleupd.value;
    let price = productUpdateForm.elements.priceupd.value;
    let thumbnail = productUpdateForm.elements.thumbnailupd.value;
    let code = productUpdateForm.elements.codeupd.value;
    let stock = productUpdateForm.elements.stockupd.value;
    var status = document.getElementById('statusupd').checked;
    let category = productUpdateForm.elements.categoryupd.value;

    let data = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        owner: emailId
    }

    socket.emit('updateProduct', {pid, data})
    productUpdateForm.reset()
})


document.getElementById("deleteBoton").addEventListener("click", function () {
    const producttoDelete = document.getElementById("ProductID");
    var uid = document.getElementById("id").innerText;
    const pid = producttoDelete.value;

    socket.emit("functionDeleteProduct", { pid, uid });
    producttoDelete.value = "";
});
