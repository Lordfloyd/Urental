module.exports = {
    getItemPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let itemQuery = "SELECT * FROM items WHERE id = " + req.params.id + "";
                
                db.query(itemQuery, (err, resultItem) => {
                    if (err) return res.status(500).send(err);
                    let item = resultItem[0];
                    let ownerQuery = "SELECT * FROM users WHERE id = " + item.id_owner + "";

                    db.query(ownerQuery, (err, resultOwner) => {
                        let owner = resultOwner[0];
                        let user = resultUser[0];
                        res.render('item/item.ejs', {
                            title: "URental | Location",
                            subTitle: "Louer ce bien",
                            formText: {period: "Période (*) :",
                                    format: "Format (*) :",
                                    startTime: "Début de location (*) :",
                                    submit: "Louer"},
                            formValue: {period: "",
                                        format: null,
                                        startTime: ""},
                            item,
                            user,
                            owner,
                            errors: null,
                            isConnected: true
                        }); 
                    });      
                });
            });
        } else res.redirect('/login');
    },

    getAddItemPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

                db.query(categoriesQuery, (err, resultCategories) => {
                    if (err) return res.status(500).send(err);
                    let user = resultUser;
                    let categories = resultCategories;

                    res.render('item/add-item.ejs', {
                        title: "URental | Ajouter un bien",
                        subTitle: "Ajouter un bien",
                        formText: {name: "Nom (*) :",
                                description: "Description :",
                                category: "Categorie (*) :",
                                price: "Prix (*) :",
                                format: "Format (*) :",
                                caution: "Caution (*) :",
                                submit: "Ajouter"},
                        formValue: {name: "", 
                                    description: "",
                                    category: null,
                                    price: "",
                                    format: null,
                                    caution: ""},
                        categories,
                        errors: null,
                        user,
                        isConnected: true
                    });
                });
            });
        } else res.redirect('/');
    },

    getAddItem: (req, res) => {
        let errors = [];
        let error = false;
        let item = {name: req.body.name, 
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    format: req.body.format,
                    caution: req.body.caution};

        if (item.name == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        if (item.category == "null") {
            errors.push("La catégorie doit être renseigné.");
            error = true;
            item.category = null;
        }
        if (item.price == '') {
            errors.push("Le prix doit être renseigné.");
            error = true;
        }
        if (item.format == "null") {
            errors.push("Le format doit être renseigné.");
            error = true;
            item.format = null;
        }
        if (item.caution == '') {
            errors.push("La caution doit être renseigné.");
            error = true;
        }
        if (error) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

                db.query(categoriesQuery, (err, resultCategories) => {
                    if (err) return res.status(500).send(err);
                    let user = resultUser;
                    let categories = resultCategories;
                    res.render('item/add-item.ejs', {
                        title: "URental | Ajouter un bien",
                        subTitle: "Ajouter un bien",
                        formText: {name: "Nom (*) :",
                                description: "Description :",
                                category: "Catégorie (*) :",
                                price: "Prix (*) :",
                                format: "Format (*) :",
                                caution: "Caution (*) :",
                                submit: "Ajouter"},
                        formValue: {name: item.name, 
                                    description: item.description,
                                    category: item.category,
                                    price: item.price,
                                    format: item.format,
                                    caution: item.caution},
                        categories,
                        errors,
                        user,
                        isConnected: true
                    });
                });
            });
        } else {
            let query = "INSERT INTO items (id_owner, id_category, name, description, price, format, caution) VALUES ('" + req.session.userID + "', '" + item.category + "', '" + item.name + "', '" + item.description + "', '" + item.price + "', '" + item.format + "', '" + item.caution + "')";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/account');
            });
        }
    },

    getModifyItemPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

                db.query(categoriesQuery, (err, resultCategories) => {
                    if (err) return res.status(500).send(err);
                    let itemQuery = "SELECT * FROM items WHERE id = " + req.params.id + "";

                    db.query(itemQuery, (err, resultItem) => {
                        if (err) return res.status(500).send(err);
                        let user = resultUser[0];
                        let item = resultItem[0];
                        let categories = resultCategories;
            
                        res.render('item/modify-item.ejs', {
                            title: "URental | Modifier un bien",
                            subTitle: "Modifier un bien",
                            formText: {name: "Nom (*) :",
                                    description: "Description :",
                                    category: "Categorie (*) :",
                                    price: "Prix (*) :",
                                    format: "Format (*) :",
                                    caution: "Caution (*) :",
                                    submit: "Modifier"},
                            formValue: {name: item.name, 
                                        description: item.description,
                                        category: item.id_category,
                                        price: item.price,
                                        format: item.format,
                                        caution: item.caution},
                            categories,
                            errors: null,
                            user,
                            isConnected: true
                        });
                    });
                });
            });
        } else res.redirect('/');
    },

    getModifyItem: (req, res) => {
        let errors = [];
        let error = false;
        let item = {name: req.body.name, 
                    description: req.body.description,
                    category: req.body.category,
                    price: req.body.price,
                    format: req.body.format,
                    caution: req.body.caution};

        if (item.name == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        if (item.category == "null") {
            errors.push("La catégorie doit être renseigné.");
            error = true;
            item.category = null;
        }
        if (item.price == '') {
            errors.push("Le prix doit être renseigné.");
            error = true;
        }
        if (item.format == "null") {
            errors.push("Le format doit être renseigné.");
            error = true;
            item.format = null;
        }
        if (item.caution == '') {
            errors.push("La caution doit être renseigné.");
            error = true;
        }
        
        if (error) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

                db.query(categoriesQuery, (err, resultCategories) => {
                    if (err) return res.status(500).send(err);
                    let user = resultUser[0];
                    let categories = resultCategories;
                    res.render('item/modify-item.ejs', {
                        title: "URental | Modifier un bien",
                        subTitle: "Modifier un bien",
                        formText: {name: "Nom (*) :",
                                description: "Description :",
                                category: "Categorie (*) :",
                                price: "Prix (*) :",
                                format: "Format (*) :",
                                caution: "Caution (*) :",
                                submit: "Modifier"},
                        formValue: {name: item.name, 
                                    description: item.description,
                                    category: item.category,
                                    price: item.price,
                                    format: item.format,
                                    caution: item.caution},
                        categories,
                        errors,
                        user,
                        isConnected: true
                    });
                });
            });
        } else {
            let query = "UPDATE items SET id_category = " + item.category + ", name = '" + item.name + "', description = '" + item.description + "', price = " + item.price + ", format = '" + item.format + "', caution = " + item.caution + " WHERE id = " + req.params.id + "";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/account');
            });
        }
    },

    getDeleteItem: (req, res) => {
        let query = "DELETE FROM items WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.redirect('/account');
        });
    }
};