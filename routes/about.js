module.exports = {
    getAboutPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];
                res.render('about.ejs', {
                    title: "URental | A propos",
                    subTitle: "A propos",
                    user,
                    isConnected: true
                });
            });
        } else {
            res.render('about.ejs', {
                title: "URental | A propos",
                subTitle: "A propos",
                isConnected: false
            });
        }
    }
};