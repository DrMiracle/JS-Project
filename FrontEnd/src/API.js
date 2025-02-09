
/**
 * Created by chaika on 09.02.16.
 */
var API_URL = "http://localhost:3989";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.homePage =  function (callback) {
    backendGet('/',callback);
}

exports.checkUserInSystem = function (user_data, callback) {
    backendPost("/", user_data, callback);
}
exports.createUser = function (user, call_back) {
    backendPost("/login.html", user, call_back);
}

exports.createPayment = function(payment_info, callback) {
    backendPost("/api/create-payment/", payment_info, callback);
}

exports.getDeliveries = function (user, callback) {
    backendPost('/api/get-deliveries/', user, callback);
}

exports.createDelivery = function (data, callback) {
    backendPost('/api/create-delivery/', data, callback);
}

exports.modifyDelivery = function (data, callback) {
    backendPost('/api/modify-delivery/', data, callback);
}

exports.checkUserByEmail = function (data, callback) {
    backendPost('/resetPwd.html', data, callback);
}

exports.modifyUser = function (data, callback) {
    backendPost('/api/modify-user', data, callback);
}
exports.getProducts = function (data, callback) {
    backendPost('/api/get-products/',data, callback);
}