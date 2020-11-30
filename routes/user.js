module.exports = {
    getAccountPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

            db.query(userQuery, (err, resultUser) => {
                if (err) return res.status(500).send(err);
                let itemsQuery = "SELECT * FROM items WHERE id_owner = '" + req.session.userID + "'";

                db.query(itemsQuery, (err, resultItems) => {
                    if (err) return res.status(500).send(err);
                    let rentsQuery = "SELECT * FROM rents WHERE id_renter = '" + req.session.userID + "'";

                    db.query(rentsQuery, (err, resultRents) => {
                        if (err) return res.status(500).send(err);
                        let rentsOwnerQuery = "SELECT * FROM rents WHERE id_owner = '" + req.session.userID + "'";

                        db.query(rentsOwnerQuery, (err, resultRentsOwner) => {
                            if (err) return res.status(500).send(err);
                            let user = resultUser[0];
                            let rents = resultRents;
                            let items = resultItems;
                            let rentsOwner = resultRentsOwner;

                            res.render('user/account.ejs', {
                                title: "URental | Mon compte",
                                subTitle: "Mon compte",
                                subTitleInfos: "Mes informations",
                                subTitleActions: "Mes fonctionnalités",
                                subTitleItems: "Mes biens",
                                subTitleRents: "Mes locations",
                                subTitleRentsOwner: "Mes locataires",
                                user,
                                items,
                                rents,
                                rentsOwner,
                                isConnected: true
                            });
                        });
                    });
                });
            });
        } else res.redirect('/login');
    },

    getLoginPage: (req, res) => {
        res.render('user/login.ejs', {
            title: "URental | Connexion",
            subTitle: "Connexion",
            formText: {email: "Email (*) :", 
                       password: "Mot de passe (*) :", 
                       submit: "Se connecter"},
            formValue: {email: ""},
            errors: null,
            isConnected: false
        });
    },

    getLogin: (req, res) => {
        let errors = [];
        let error = false;
        let email = req.body.email;
        let password = req.body.password;
        let connectQuery = "SELECT * FROM users WHERE email = '" + email + "'";

        db.query(connectQuery, (err, resultConnect) => {
            if (err) return res.status(500).send(err);
            if (resultConnect.length == 0) {
                errors.push("L'email n'existe pas.");
                error = true;
            } else {
                if (resultConnect[0].password != password) {
                    errors.push("Le mot de passe ne correspond pas.");
                    error = true;
                }
            }
            if (error) {
                res.render('user/login.ejs', {
                    title: "URental | Connexion",
                    subTitle: "Connexion",
                    formText: {email: "Email (*) :", 
                               password: "Mot de passe (*) :", 
                               submit: "Connexion"},
                    formValue: {email: email},
                    errors,
                    isConnected: false
                });
            } else {
                req.session.userID = resultConnect[0].id;
                req.session.addressEthereum = resultConnect[0].address_ethereum;
                res.redirect('/');
            }
        });
    },

    getLogout: (req, res) => {
        delete req.session.userID;
        res.redirect('/login');
    },

    getSubscribePage: (req, res) => {
        res.render('user/subscribe.ejs', {
            title: "URental | Inscription",
            subTitle: "Inscription",
            formText: {firstname: "Prénom (*) :", 
                       lastname: "Nom (*) :", 
                       email: "Email (*) :", 
                       password: "Mot de passe (*) :", 
                       verifPassword: "Confirmation (*) :", 
                       submit: "S'inscrire"},
            formValue: {firstname: "", 
                        lastname: "", 
                        email: ""},
            errors: null,
            isConnected: false
        });
    },

    getSubscribe: (req, res) => {
        let errors = [];
        let error = false;
        let user = {firstname: req.body.firstname, 
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    verifPassword: req.body.verifPassword};
        
        let emailExistQuery = "SELECT * FROM users WHERE email = '" + user.email + "'";

        if (user.firstname == '') {
            errors.push("Le prénom doit être renseigné.");
            error = true;
        }
        if (user.lastname == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        if (user.password != user.verifPassword) {
            errors.push("La confirmation doit correspondre avec le mot de passe.");
            error = true;
        }
        db.query(emailExistQuery, (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length > 0) {
                errors.push("Un utilisateur utilise déjà cette email.");
                error = true;
            }
            if (error) {
                res.render('user/subscribe.ejs', {
                    title: "URental | Inscription",
                    subTitle: "Inscription",
                    formText: {firstname: "Prénom (*) :", 
                                lastname: "Nom (*) :", 
                                email: "Email (*) :", 
                                password: "Mot de passe (*) :", 
                                verifPassword: "Confirmation (*) :", 
                                submit: "S'inscrire"},
                    formValue: {firstname: user.firstname, 
                                lastname: user.lastname, 
                                email: user.email},
                    errors,
                    isConnected: false
                });
            } else {
                let query = "INSERT INTO users (firstname, lastname, email, password) VALUES ('" + user.firstname + "', '" + user.lastname + "', '" + user.email + "', '" + user.password + "')";
                
                db.query(query, (err, result) => {
                    if (err) return res.status(500).send(err);
                    res.redirect('/login');
                });
            }
        }); 
    },

    getModifyAccountPage: (req, res) => {
        if (req.session.userID) {
            let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

                db.query(userQuery, (err, resultUser) => {
                    if (err) return res.status(500).send(err);
                    let user = resultUser[0];
                    res.render('user/modify-account.ejs', {
                        title: "URental | Modifier mes informations",
                        subTitle: "Modifier mes informations",
                        formText: {firstname: "Prénom (*) :", 
                                   lastname: "Nom (*) :", 
                                   email: "Email (*) :",
                                   addressEthereum: "Adresse ethereum :",
                                   submit: "Modifier"},
                        formValue: {firstname: user.firstname, 
                                    lastname: user.lastname,
                                    email: user.email,
                                    addressEthereum: user.address_ethereum},
                        errors: null,
                        user,
                        isConnected: true
                    });
                });
        } else res.redirect('/login');
    },

    getModifyAccount: (req, res) => {
        let errors = [];
        let error = false;
        let user = {firstname: req.body.firstname, 
                    lastname: req.body.lastname,
                    email: req.body.email,
                    addressEthereum: req.body.addressEthereum};

        if (user.firstname == '') {
            errors.push("Le prénom doit être renseigné.");
            error = true;
        }
        if (user.lastname == '') {
            errors.push("Le nom doit être renseigné.");
            error = true;
        }
        
        if (error) {
            res.render('user/modify-account.ejs', {
                title: "URental | Modifier mes informations",
                subTitle: "Modifier mes informations",
                formText: {firstname: "Prénom (*) :", 
                           lastname: "Nom (*) :", 
                           email: "Email (*) :",
                           addressEthereum: "Adresse ethereum :",
                           submit: "Modifier"},
                formValue: {firstname: user.firstname, 
                            lastname: user.lastname, 
                            email: user.email,
                            addressEthereum: user.address_ethereum},
                errors,
                user,
                isConnected: true
            });
        } else {
            let query = "UPDATE users SET firstname = '" + user.firstname + "', lastname = '" + user.lastname + "', email = '" + user.email + "', address_ethereum = '" + user.addressEthereum + "' WHERE id = " + req.session.userID + "";
            
            db.query(query, (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/account');
            });
        }
    }
};