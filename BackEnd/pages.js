/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Universal Delivery'
    });
};

exports.archivePage = function(req, res) {
    res.render('archivePage', {
        pageTitle: 'My Deliveries'
    });
};

exports.orderPage = function(req, res) {
    res.render('orderPage', {
        pageTitle: 'Order a Delivery'
    });
};

exports.shopPage = function(req, res) {
    res.render('shopPage', {
        pageTitle: 'Mini shop'
    });
};

exports.paymentPage = function(req, res) {
    res.render('paymentPage', {
        pageTitle: 'Pay for Delivery'
    });
};

exports.signUpPage = function(req, res) {
    res.render('signUpPage', {
        pageTitle: 'Sign up'
    });
};

exports.loginPage = function(req, res) {
    res.render('loginPage', {
        pageTitle: 'Login'
    });
};

exports.profilePage = function(req, res) {
    res.render('profilePage', {
        pageTitle: 'Profile'
    });
};

exports.orderParamPage = function(req, res) {
    res.render('orderParamPage', {
        pageTitle: 'Order a Delivery'
    });
};

exports.reserPwdPage = function(req, res) {
    res.render('resetPwdPage', {
        pageTitle: 'Reset Password'
    });
}