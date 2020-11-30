module.exports = {
    getContactPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];
                res.render('contact.ejs', {
                    title: "URental | Contact",
                    subTitle: "L'équipe",
                    subTitleContact: "Contactez-nous",
                    user,
                    isConnected: true
                });
            });
        } else {
            res.render('contact.ejs', {
                title: "URental | Contact",
                subTitle: "L'équipe",
                subTitleContact: "Contactez-nous",
                isConnected: false
            });
        }
    }
};