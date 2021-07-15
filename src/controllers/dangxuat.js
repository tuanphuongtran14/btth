exports.logout = function(req, res) {
    if(req.session.user) {
        let username = req.session.user.username;
        req.session.destroy(function(err) {
            if(err)
                throw new Error(err.message || "Error while you logging out");
                return res.render('trang_dang_xuat', {username});
        });
    } else {
        return res.redirect('/');
    }
}