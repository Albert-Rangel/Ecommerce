const socket = io()
let cid = ""

socket.on('productbought', (success) => {
    updateMessage(success);
});

async function updateMessage(success) {
    let content = success.split("|")
    if (content[0] != 'SUC') {
        window.alert(content)
    } else {
        window.alert("La compra ha sido exitosa. Verifica tu correo para que veas eld etalle")
        window.location.href = 'https://ecommerce-production-f895.up.railway.app/products';
    }
}

let bttbuy = document.getElementById("buybotton");

bttbuy.addEventListener("click", (evt) => {
    evt.preventDefault()

    const cid = document.getElementById("cid").innerHTML;
    const email = document.getElementById("email").innerHTML;

    socket.emit('buyprod', {
        cid, email
    })
});


