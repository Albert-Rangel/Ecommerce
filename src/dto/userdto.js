class userDTO {
    static getUserInputFrom = (user) => {
        const objectId_ = user.cart[0]._id
        var swUndefined= false
        const hexString = objectId_
        // Extract the hexadecimal representation
        if(objectId_ != '16548615318348311'){
             hexString = objectId_.toHexString();
        }
        return {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            age: user.age,
            email: user.email,
            cart: hexString,
            role: user.role,
        }
    }
}
export default userDTO