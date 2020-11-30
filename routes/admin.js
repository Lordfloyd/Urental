module.exports = {
    getAdminIndexPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    res.render('admin/index.ejs', {
                        title: "URental | Admin | Accueil",
                        subTitleUsers: "Utilisateurs",
                        subTitleItems: "Biens",
                        subTitleRents: "Locations",
                        isConnected: true
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminUsersPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    let usersQuery = "SELECT * FROM users WHERE 1 = 1";

                    db.query(usersQuery, (err, resultUsers) => {
                        if (err) return res.status(500).send(err);
                        let users = resultUsers;
                        res.render('admin/users.ejs', {
                            title: "URental | Admin | Utilisateurs",
                            subTitle: "Utilisateurs",
                            users,
                            isConnected: true
                        });
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminRentsPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    let rentsQuery = "SELECT * FROM rents WHERE 1 = 1";

                    db.query(rentsQuery, (err, resultRents) => {
                        if (err) return res.status(500).send(err);
                        let rents = resultRents;
                        res.render('admin/rents.ejs', {
                            title: "URental | Admin | Locations",
                            subTitle: "Locations",
                            rents,
                            isConnected: true
                        });
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminItemsPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    let itemsQuery = "SELECT * FROM items WHERE 1 = 1";

                    db.query(itemsQuery, (err, resultItems) => {
                        if (err) return res.status(500).send(err);
                        let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

                        db.query(categoriesQuery, (err, resultCategories) => {
                            if (err) return res.status(500).send(err);
                            let items = resultItems;
                            let categories = resultCategories
                            res.render('admin/items.ejs', {
                                title: "URental | Admin | Biens",
                                subTitleItems: "Biens",
                                subTitleCategories: "Catégories",
                                items,
                                categories,
                                isConnected: true
                            });
                        });
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminAddCategoryPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    res.render('admin/category/add-category.ejs', {
                        title: "URental | Admin | Ajouter une catégorie",
                        subTitle: "Ajouter une catégorie",
                        formText: {name: "Nom (*) :", 
                                    submit: "Ajouter"},
                        formValue: {name: ""},
                        isConnected: true,
                        errors: null
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminModifyCategoryPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";
            
            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let user = resultUser[0];

                if (user.email == "baptiste.louyot@gmail.com") {
                    let categoryQuery = "SELECT * FROM categories WHERE id = '" + req.params.id + "'";

                    db.query(categoryQuery, (err, resultCategory) => {
                        if (err) return res.status(500).send(err);
                        let category = resultCategory[0];
                        res.render('admin/category/modify-category.ejs', {
                            title: "URental | Admin | Modifier une catégorie",
                            subTitle: "Modifier une catégorie",
                            formText: {name: "Nom (*) :", 
                                        submit: "Modifier"},
                            formValue: {name: category.name},
                            isConnected: true,
                            errors: null
                        });
                    });
                } else res.redirect('/');
            });
        } else res.redirect('/login');
    },

    getAdminAddCategory: (req, res) => {
        let errors = [];
        let error = false;
        let category = {name: req.body.name};

        if (category.name == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        if (error) {
            res.render('admin/category/modify-category.ejs', {
                title: "URental | Admin | Modifier une catégorie",
                subTitle: "Modifier une catégorie",
                formText: {name: "Nom (*) :", 
                            submit: "Modifier"},
                formValue: {name: category.name},
                isConnected: true,
                errors
            });
        } else {
            let query = "INSERT INTO categories (name) VALUES ('" + category.name + "')";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/admin/items');
            });
        }
    },

    getAdminModifyCategory: (req, res) => {
        let errors = [];
        let error = false;
        let category = {name: req.body.name};

        if (category.name == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        if (error) {
            res.render('admin/category/modify-category.ejs', {
                title: "URental | Admin | Modifier une catégorie",
                subTitle: "Modifier une catégorie",
                formText: {name: "Nom (*) :", 
                            submit: "Modifier"},
                formValue: {name: category.name},
                isConnected: true,
                errors
            });
        } else {
            let query = "UPDATE categories SET name = '" + category.name + "' WHERE id = " + req.params.id + "";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/admin/items');
            });
        }
    },

    getAdminDeleteCategory: (req, res) => {
        let query = "DELETE FROM categories WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.redirect('/admin/items');
        });
    },

    getAdminDeleteItem: (req, res) => {
        let query = "DELETE FROM items WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.redirect('/admin/items');
        });
    },

    getAdminDeleteUser: (req, res) => {
        let query = "DELETE FROM users WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            let query = "DELETE FROM items WHERE id_owner = " + req.params.id + "";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                let query = "DELETE FROM rents WHERE id_renter = " + req.params.id + "";
                
                db.query(query, (err, result) => {
                    if (err) return res.status(500).send(err);
                    res.redirect('/admin/users');
                });
            });
        });
    },

    getAdminDeleteRent: (req, res) => {
        let query = "DELETE FROM rents WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.redirect('/admin/rents');
        });
    },
};