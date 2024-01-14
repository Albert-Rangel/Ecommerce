class userDTO {
    static getUserInputFrom = (user) => {
        // console.log("user llego al dtoooooo")
        // console.log(user)
        
        let objectId_ = user.cart[0]._id
        
        let hexString = objectId_
        // Extract the hexadecimal representation
        if(objectId_ != '16548615318348311'){
             hexString = objectId_.toHexString();
        }
        return {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            cui: hexString,
            role: user.role,
            lastConnection : user.lastConnection,
        }
    }
}
export default userDTO