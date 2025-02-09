const fs = require('fs');
const ejs = require('ejs');

exports.deliveryItem = ejs.compile(fs.readFileSync('./Frontend/Templates/deliveryArchived.ejs', "utf8"));

exports.shopIitem = ejs.compile(fs.readFileSync('./Frontend/Templates/shopOneItem.ejs', "utf8"));

exports.cartItem = ejs.compile(fs.readFileSync('./Frontend/Templates/cartOneItem.ejs', "utf8"));