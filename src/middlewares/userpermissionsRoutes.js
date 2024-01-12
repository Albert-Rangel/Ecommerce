const userpermissionsRoutes = (req, res, next) => {
 
    if (req.session.user == undefined || req.session.user.role === "Admin"|| req.session.user.role === "Premium") {
        return res.redirect('/products');
    }

    next()
}
export default userpermissionsRoutes

