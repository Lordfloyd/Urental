module.exports = {
    getIndexPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let itemsQuery = "SELECT * FROM items LIMIT 3";
                
                db.query(itemsQuery, (err, resultItems) => {
                    if (err) return res.status(500).send(err);
                    let user = resultUser[0];
                    let items = resultItems;
                    res.render('index.ejs', {
                        title: "URental | Accueil",
                        subTitleAbout: "A propos",
                        subTitleRents: "Les locations",
                        subTitleContact: "Contactez-nous",
                        items,
                        user,
                        isConnected: true
                    });
                });
            });
        } else {
            let itemsQuery = "SELECT * FROM items LIMIT 3";
                
            db.query(itemsQuery, (err, resultItems) => {
                if (err) return res.status(500).send(err);
                let items = resultItems;
                res.render('index.ejs', {
                    title: "URental | Accueil",
                    subTitleAbout: "A propos",
                    subTitleRents: "Les locations",
                    subTitleContact: "Contactez-nous",
                    items,
                    isConnected: false
                });
            });
        }
    }
};