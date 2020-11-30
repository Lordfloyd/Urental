let Web3 = require("web3");
const abi = require("../assets/js/contractABI");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8575"));
const urentalContract = new web3.eth.Contract(abi.abi, '0x00838625d3BAf935a4ac15c7a945b14B3472059C');

module.exports = {
    getRentPage: (req, res) => {
        let itemsQuery = "SELECT * FROM items WHERE 1 = 1";

        db.query(itemsQuery, (err, resultItems) => {
            if (err) return res.status(500).send(err);
            let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

            db.query(categoriesQuery, (err, resultCategories) => {
                if (err) return res.status(500).send(err);
                let items = resultItems;
                let categories = resultCategories;
                if (req.session.userID) {
                    let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

                    db.query(userQuery, (err, resultUser) => {
                        if (err) return res.status(500).send(err);
                        let user = resultUser[0];
                        res.render('rent.ejs', {
                            title: "URental | Locations",
                            subTitle: "Locations",
                            subTitleCategories: "Catégories",
                            items,
                            categories,
                            user,
                            isConnected: true
                        });
                    });
                } else {
                    res.render('rent.ejs', {
                        title: "URental | Locations",
                        subTitle: "Locations",
                        subTitleCategories: "Catégories",
                        items,
                        categories,
                        isConnected: false
                    });
                }
            });
        });
    },

    getRentCategoryPage: (req, res) => {
        let itemsQuery = "SELECT * FROM items WHERE id_category = " + req.params.id + "";

        db.query(itemsQuery, (err, resultItems) => {
            if (err) return res.status(500).send(err);
            let categoriesQuery = "SELECT * FROM categories WHERE 1 = 1";

            db.query(categoriesQuery, (err, resultCategories) => {
                if (err) return res.status(500).send(err);
                let items = resultItems;
                let categories = resultCategories;
                if (req.session.userID) {
                    let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

                    db.query(userQuery, (err, resultUser) => {
                        if (err) return res.status(500).send(err);
                        let user = resultUser[0];
                        res.render('rent.ejs', {
                            title: "URental | Locations",
                            subTitle: "Locations",
                            subTitleCategories: "Catégories",
                            items,
                            categories,
                            user,
                            isConnected: true
                        });
                    });
                } else {
                    res.render('rent.ejs', {
                        title: "URental | Locations",
                        subTitle: "Locations",
                        subTitleCategories: "Catégories",
                        items,
                        categories,
                        isConnected: false
                    });
                }
            });
        });
    },

    getRent: (req, res) => {
        console.log("ok 1");
        let errors = [];
        let error = false;
        let rent = {idItem: req.body.idItem, 
                    idRenter: req.session.userID,
                    idOwner: req.body.idOwner,
                    startTime: req.body.startTime,
                    period: req.body.period,
                    format: req.body.format};

        if (rent.period == '') {
            errors.push("La période doit être renseigné.");
            error = true;
        }
        if (rent.format == "null") {
            errors.push("Le format doit être renseigné.");
            error = true;
            rent.format = null;
        }
        if (rent.startTime == '') {
            errors.push("La date de début doit être renseigné.");
            error = true;
        }

        let itemQuery = "SELECT * FROM items WHERE id = " + req.params.id + "";
        db.query(itemQuery, (err, resultItem) => {
            if (err) return res.status(500).send(err);
            let item = resultItem[0];
            let ownerQuery = "SELECT * FROM users WHERE id = " + item.id_owner + "";
            db.query(ownerQuery, (err, resultOwner) => {
                if (err) return res.status(500).send(err);
                if (error) {
                    let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

                    db.query(userQuery, (err, resultUser) => {
                        if (err) return res.status(500).send(err);
                        let owner = resultOwner[0];
                        let user = resultUser[0];
                        res.render('item/item.ejs', {
                            title: "URental | Location",
                            subTitle: "Louer ce bien",
                            formText: {period: "Période (*) :",
                                       format: "Format (*) :",
                                       startTime: "Début de location (*) :",
                                       submit: "Louer"},
                            formValue: {period: rent.period,
                                        format: rent.format,
                                        startTime: rent.startTime},
                            item,
                            user,
                            owner,
                            errors,
                            isConnected: true
                        });
                    });
                } else {
                    let period = rent.period;
                    while (rent.format !== "seconde") {
                        switch (rent.format) {
                        case "mois":
                            period *= 30;
                            rent.format = "jour";
                            break;
                        case "jour":
                            period *= 24;
                            rent.format = "heure";
                            break;
                        case 'heure':
                            period *= 60;
                            rent.format = "minute";
                            break;
                        case 'minute':
                            period *= 60;
                            rent.format = "seconde";
                            break;
                        }
                    }
                    req.body.newPeriod = period;
                    let query = "INSERT INTO rents (id_item, id_renter, id_owner, start_time, period) VALUES ('" + rent.idItem + "', '" + rent.idRenter + "', '" + rent.idOwner + "', '" + rent.startTime + "', '" + period + "')";

                    console.log( rent.idOwner+ "" + req.body.caution + "" + period + "" + req.session.userID);
                    db.query(query, (err, result) => {
                        if (err) return res.status(500).send(err);
                        let userQuery = "SELECT * FROM users WHERE id = '" + req.session.userID + "'";

                        db.query(userQuery, (err, resultUser) => {
                            if (err) return res.status(500).send(err);
                            req.body.userBuyer = resultUser[0];
                            let userQuery = "SELECT * FROM users WHERE id = '" + rent.idOwner + "'";

                            db.query(userQuery, (err, resultUser) => {
                                if (err) return res.status(500).send(err);
                                req.body.userSeller = resultUser[0];
                                let finalPrice = parseFloat(req.body.caution) + (parseFloat(req.body.price) * parseFloat(rent.period));
                                let hash = web3.utils.keccak256(result.insertId + "" + req.body.userSeller.address_ethereum + "" + req.body.caution + "" + req.body.newPeriod  + "" + req.body.userBuyer.address_ethereum);
                                let hexHash = web3.utils.toHex(hash);
                                urentalContract.methods.rent(hexHash, req.body.userSeller.address_ethereum, web3.utils.toWei(req.body.caution.toString(), "ether"), req.body.newPeriod ).send({
                                    from: req.body.userBuyer.address_ethereum,
                                    gasPrice: web3.utils.toHex(20000000000),
                                    gasLimit: web3.utils.toHex(4700000),
                                    value: web3.utils.toWei( finalPrice.toString(), "ether")
                                })
                                    .on('error', function (error) {
                                        console.log("error : ");
                                        console.log(error)
                                    })
                                    .on('transactionHash', function (transactionHash) {
                                    })
                                    .on('receipt', function (receipt) {
                                        console.log("receipt : ");
                                        console.log(receipt)
                                    })
                                    .on('confirmation', function (confirmationNumber, receipt) {
                                        console.log("confirmation");
                                        console.log(receipt);
                                        console.log(confirmationNumber);
                                        let hash = web3.utils.keccak256(result.insertId + "" + req.body.userSeller.address_ethereum + "" + req.body.caution + "" + req.body.newPeriod  + "" + req.body.userBuyer.address_ethereum);
                                        let hashQuery = "UPDATE rents SET hash = '" + hash + "' WHERE id = " + result.insertId + "";
                                        db.query(hashQuery, (err, result) => {
                                            if (err) return res.status(500).send(err);
                                            res.redirect('/account');
                                        });
                                    });
                            });
                        });
                    });
                }
            });
        });
    },

    getDeleteRent: (req, res) => {
        let query = "DELETE FROM rents WHERE id = " + req.params.id + "";
        
        db.query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.redirect('/account');
        });
    }
};