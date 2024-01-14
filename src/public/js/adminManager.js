const socket = io()

socket.on('updateUSers', (data) => {
    updateUserGV(data);
});

socket.on('userDeleted', (data) => {
    announceUserDeleted(data);
});


socket.on('changedRole', (success) => {
    updateUserRole(success);
});

async function updateUserRole(success) {
    let content = success.split("|")
    if (content[0] != 'SUC') {
        window.alert(content)

    } else {
        await socket.emit('obtainUsers')
        window.alert("Su cambio de rol ha sido exitodo")
    }
}
async function announceUserDeleted(data) {


    if (typeof data === "string") {
        window.alert('No se pudo eliminar el usuario')
    }
    else {
        await updateUserGV(data)
        window.alert("Se elimino el usuario")
    }
}

// Función para actualizar la lista de productos disponibles en el catalogo en mi página web
async function updateUserGV(userInfo) {
    console.log(userInfo)
    const GVUsersInfo = document.getElementById("GVUsersInfo");

    let contentChangeable = ""
    userInfo.forEach(({ firstname, _id, lastname, email, role, lastConnection, cui }) => {
        contentChangeable += ` <div class="form-container">
        <div>
          <div class="card">
            <div class="card-body">
              <table class="table"> <tbody>
                  <tr>
                    <th>First Name</th>
                    <td>${firstname}</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td>${lastname}</td>
                  </tr>
                  <tr>
                    <th>UId</th>
                    <td>${_id}</td>
                  </tr>
                  <tr>
                  <th>CId</th>
                  <td>${cui}</td>
                </tr>
                  <tr>
                    <th>Email</th>
                    <td>${email}</td>
                  </tr>
                  <tr>
                    <th>Role</th>
                    <td>${role}</td>
                  </tr>
                  <tr>
                    <th>Last Connection</th>
                    <td>${lastConnection}</td>
                  </tr>
                  <tr>
                    <td colspan="2" class="text-center"> 
                    <button id="btn-Change-${_id}" class="btn btn-primary">Change Rol</button>
                    <button id="btn-DeleteUsers-${_id}" class="btn btn-danger">Delete User</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`

    });

    document.getElementById("GVUsersInfo").removeAttribute("hidden");
    GVUsersInfo.innerHTML = contentChangeable
    ChangeRolorDelete(userInfo)

}

function ChangeRolorDelete(userInfo) {

    for (const user of userInfo) {

        const botonChange = `btn-Change-${user._id}`;
        const botonChanger = document.getElementById(botonChange);

        const botonDelete = `btn-DeleteUsers-${user._id}`;
        const botonDeleter = document.getElementById(botonDelete);

        let uid = botonDelete.split("-")[2]

        botonChanger.addEventListener("click", (evt) => {
            evt.preventDefault()

            socket.emit('changeUseRole', {
                uid
            })
        });

        botonDeleter.addEventListener("click", (evt) => {
            evt.preventDefault()

            socket.emit('DeleteUser', {
                uid
            })
        });
    }
};

