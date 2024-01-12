const socket = io()
let user_ = ""

Swal.fire({
    title: 'Ingresa un correo',
    input: 'text',
    confirmButtonText: 'Ingresar',
}).then((result) => {
    user_ = result.value;
})

const boxelement = document.getElementById("box");
const contentelement = document.getElementById("content");

boxelement.addEventListener('change', (e) => {
    socket.emit('message', {
        user: user_,
        message: e.target.value,
    });
});


socket.on('newMessage', (data) => {
    const mensajes = data.map(({ user, message}) => {
        return `<p>${user} dijo: ${message}</p>`;
    });
    contentelement.innerHTML = mensajes.join('');
});
