/**
 Get data from server
 */
const crypto = require('crypto');
const mysql = require("mysql");
const bcrypt = require('bcrypt');

let array = []
const sql = "INSERT INTO users(name, email, password) VALUES(?, ?, ?)";
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "js_project",
    password: "y1e2v3g4e5n6",
    timezone: "local"
});

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});
exports.homePage = function (req, res) {
    res.send('Loading home page...');
}

exports.checkUserInSystem = function (req, res) {
    let user = req.body;
    let exist = false;
    connection.query("SELECT * FROM users",
        function (err, results, fields) {
            console.log(err);
            console.log(results);// собственно данные
            if (results.length === 0){
                console.log('Db is empty');
                res.send([]);
                return;
            }
            console.log(results[0].password);
            console.log(user.password);
            for (let i = 0; i < results.length; i++) {
                if (results[i].email === user.email && bcrypt.compareSync(user.password, results[i].password)){
                    console.log('Match');
                    exist = true;
                    user.name = results[i].name;
                    res.send(user);
                }
            }
            if (!exist) {
                console.log('Does not Match');
                res.send([]);
            }
        });

}
exports.createUser = function (req, res) {
    let user = req.body;
    let hash = bcrypt.hashSync(user.password, 10);
    console.log(user.password);
    console.log(hash);
    let db_user = [user.firstname, user.email, hash];
    if (array.includes(user)) {
        res.send('user exist');
    } else {
        connection.query(sql, db_user, function(err, results) {
            if(err) console.log(err);
            else console.log("Данные добавлены");
        });
        array.push(user);
        res.send(array);
    }
}

exports.getDeliveries = function (req, res) {
    //console.log("Get deliveries!!!");
    let user = req.body;
    if (!user) {
        console.log("Register please:)");
        res.send([]);
        return;
    }
    connection.query("SELECT * FROM users",
        function (err, results, fields) {
            console.log(err);
            //console.log(results);// собственно данные
            let id = findUserByPwd(user, results);
            if (id === -1) {
                console.log('Error: no such user');
                res.send([]);
                return;
            }
            //console.log('id: ', id);
            let query = "select * from deliveries where user_id = " + id;
            connection.query(query,
                function (err, in_res){
                    let deliveries = [];
                    for (let j = 0; j < in_res.length; j++) {
                        deliveries.push({
                            id: in_res[j].id,
                            name: in_res[j].name,
                            surname: in_res[j].surname,
                            phone: in_res[j].phone,
                            destination: in_res[j].destination,
                            description: in_res[j].description,
                            date: in_res[j].date,
                            cost: in_res[j].cost,
                            status: in_res[j].status,
                            payer: in_res[j].payer,
                            paid: in_res[j].paid
                        });
                    }
                    //console.log('deliveries: ', deliveries);
                    res.send(deliveries);
                });
        });
}

exports.createDelivery = function(req, res) {
    let data = req.body;
    let user = data.user;
    let delivery = data.delivery;

    connection.query('select * from users',
        function (err, users) {
            if(err) {
                console.log(err.toString());
                return;
            }
            let id = findUserByPwd(user, users);
            if (id === -1) {
                console.log("user not found");
                return;
            }
            let query = insertQuery(delivery, id);
            connection.query(query, function (err, res) {
                if (err) {
                    console.log(err.toString());
                } else {
                    console.log("Delivery added successfully");
                }
            })
        });
}

exports.modifyDelivery = function (req, res) {
    console.log('Modifying Delivery');
    let delivery = req.body;
    if (!delivery) {
        return;
    }
    let findQuery = "select * from deliveries where id = " + delivery.id;
    console.log(delivery.id);
    connection.query(findQuery,
        function (err, result) {
            if (err || result.length !== 1) {
                console.log("Delivery id is wrong!!!");
                return;
            }
            console.log('Delivery Found!');
            let oldInfo = result[0];
            if (delivery.description) {
                oldInfo.description = delivery.description;
            }
            if (delivery.payer) {
                oldInfo.payer = delivery.payer;
            }
            if (delivery.paid) {
                oldInfo.paid = delivery.paid;
            }
            let deleteQuery = 'DELETE FROM `js_project`.`deliveries`\n' +
                'WHERE id = ' + delivery.id;
            console.log(insertQuery(oldInfo, oldInfo.user_id));
            connection.query(insertQuery(oldInfo, oldInfo.user_id), function (err, r) {
                if (err) {
                    console.log(err.toString());
                    return;
                }
                connection.query(deleteQuery,
                    function (err, res) {
                    });
            });
        });
}

function insertQuery (delivery, id) {
    return "INSERT INTO `js_project`.`deliveries`\n" +
        "(\n" +
        "`user_id`,\n" +
        "`name`,\n" +
        "`surname`,\n" +
        "`phone`,\n" +
        "`destination`,\n" +
        "`description`,\n" +
        "`date`,\n" +
        "`cost`,\n" +
        "`status`,\n" +
        "`payer`,\n" +
        "`paid`)\n" +
        "VALUES\n" +
        "(\n" +
        id + ",\n" +
        (delivery.name ? '"' + delivery.name + '"' : "null") + ",\n" +
        (delivery.surname ? '"' + delivery.surname + '"' : "null") + ",\n" +
        (delivery.phone ? "'" + delivery.phone + "'" : "null") + ",\n" +
        '"' + delivery.destination + '"' + ",\n" +
        (delivery.description ? '"' + delivery.description + '"' : "null") + ",\n" +
        (delivery.date ? "'" + delivery.date + "'" : "null") + ",\n" +
        delivery.cost + ",\n" +
        (delivery.status ? "'" + delivery.status + "'" : "null") + ",\n" +
        "'" + delivery.payer + "'" + ",\n" +
        "'" + delivery.paid + "'" + ");";
}


exports.getProducts = function (req, res) {

    connection.query("SELECT * FROM products",
        function (err, results) {
        console.log(err);
        //console.log(results);// собственно данные
                let products = [];
                for (let j = 0; j < results.length; j++) {
                    products.push({
                        id: results[j].id,
                        description: results[j].description,
                        date: results[j].date,
                        cost: results[j].cost,
                        icon: results[j].icon
                    });
                }
                // console.log('products: ', products);
                res.send(products);
            });
}
function findUserByPwd(user, users) {
    let id = -1;
    for(let i = 0; i < users.length; i++) {
        if (bcrypt.compareSync(user.password, users[i].password)) {
            id = users[i].id;
            break
        }
    }
    return id;
}

exports.createPayment = function(req, res) {
    var payment_info = req.body;

    var payment = {
        version: 3,
        public_key: 'sandbox_i36114102730',
        action: "pay",
        amount: payment_info.amount,
        currency: "UAH",
        description: payment_info.description,
        order_id: Math.random(),
        //!!!Важливо щоб було 1, бо інакше візьме гроші!!!
        sandbox: 1
    };
    var data = base64(JSON.stringify(payment));
    var signature = sha1('sandbox_WwsOjjQLPLAUNUMZeUwpzArLqcctuviHNFbx3hx3' + data + 'sandbox_WwsOjjQLPLAUNUMZeUwpzArLqcctuviHNFbx3hx3');

    res.send({
        data: data,
        signature: signature,
        success: true
    });
};

function base64(str) {
    return new Buffer.from(str).toString('base64');
}

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

exports.checkUserByEmail = function (req, res) {
    let email = req.body.email;
    console.log('Check user by email: ', email);
    let query = 'select * from users where email = "' + email + '"';
    connection.query(query, function (err, result) {
        if (err) {
            console.log(err.toString());
            return;
        }
        if (result && result.length > 0) res.send('true');
        else res.send('false');
    });
};

exports.modifyUser = function (req, res) {
    console.log('Array: ', array);
    let user = req.body;
    console.log("query: ", 'select * from users where email = "' + user.email + '"');
    connection.query('select * from users where email = "' + user.email + '"', function (e, result){
        if (e) {
            console.log(e.toString());
            return;
        }
        let oldUser = result[0];
        oldUser.password = bcrypt.hashSync(user.password, 10);
        let db_user = [oldUser.name, oldUser.email, oldUser.password];
        for (let i = 0; i < array.length; i++) {
            if (array[i].email === oldUser.email) {
                array.splice(i, 1);
                return;
            }
        }
        let updateQuery = 'update users set password = "' + oldUser.password + '" where id = ' +
            oldUser.id;
        console.log(updateQuery);
        connection.query(updateQuery, function (error, rr) {
            if (error) {
                console.log(error.toString());
                return;
            }
            console.log('Success***');
            res.send({
                name: oldUser.name,
                email: oldUser.email,
                password: user.password
            });
        });
    });

}