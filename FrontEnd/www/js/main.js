(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

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
},{}],2:[function(require,module,exports){
var basil = require('basil.js');
basil = new basil();
exports.get = function (key) {
    return basil.get(key);
};
exports.set = function (key, value) {
    return basil.set(key, value);
};
},{"basil.js":17}],3:[function(require,module,exports){
let API =require('../API');

function parseEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function parsePwd(password){
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;//Minimum eight characters, at least one letter and one number
    return re.test(password);
}
function temp(error, data){
    if (!error){
        console.log(data);
        window.location.href="http://localhost:3989";
    }
}
function sendToBack(error, data) {
    if (!error){
        let user = data;
        console.log("Data from bacK: " + user.email);
        console.log(user);
        if (user.email){
            console.log('200 OK');
            sessionStorage.setItem('user',JSON.stringify(user));
            console.log(sessionStorage.getItem('user'));
            API.homePage(temp);
        }
        else{
            console.log('user does not exist');
            $('#notFound').css({'height':'100px','opacity':'1'});
        }
    }
    else{
        console.log('error');
    }
}

$('#sendUserData').on('click', function () {
    let email = $('#email').val();
    let password = $('#password').val();
    if (!parseEmail(email) || !parsePwd(password)) {
        $('#error').css({'height':'100px','opacity':'1'});
        return;
    }
    else{
        $('#error').css({'height':'0','opacity':'0'});
    }
    let user_data = {
        email: email,
        password: password
    }
    console.log(user_data);
    API.checkUserInSystem(user_data, sendToBack);
});

exports.parsePwd = parsePwd;
},{"../API":1}],4:[function(require,module,exports){
$(function () {
    let homePage = require('./mainPage/home');
    let signUpPage = require('./signUp/forSignUp');
    let archivePage = require('./viewDeliveries/archive');
    let loginPage = require('./login/login');
    let profilePage = require('./profile/profile');
    let orderPage = require('./orderPage/order');
    let payPage = require('./payments/payments');
    let orderParamPage = require('./ordrParamPage/orderParamMain');

    let resetPwdPage = require('./resetPwd/resetPwd');

    let shopPage = require('./shop/shop');
    let productCart = require('./productCart/Cart');
    productCart.initCart();
    shopPage.initializeProducts();
    try {
        archivePage.initializeArchive();
        payPage.initializePayments();
    } catch (e) {

    }
    orderParamPage.initializeOrderParamPage();
    orderParamPage.showGif();
    profilePage.loadProfile();
});
},{"./login/login":3,"./mainPage/home":5,"./orderPage/order":6,"./ordrParamPage/orderParamMain":7,"./payments/payments":8,"./productCart/Cart":9,"./profile/profile":10,"./resetPwd/resetPwd":11,"./shop/shop":12,"./signUp/forSignUp":13,"./viewDeliveries/archive":14}],5:[function(require,module,exports){
$('#my-dels').click(function () {
    if (sessionStorage.getItem('user') === null) {
        window.location.href = 'http://localhost:3989/signup.html';
    }
    else {
        window.location.href = 'http://localhost:3989/archive.html';
    }
});

$('#new-del').click(function () {
    if (sessionStorage.getItem('user') === null) {
        window.location.href = 'http://localhost:3989/signup.html';
    }
    else {
        window.location.href = 'http://localhost:3989/order.html';
    }
});

$('#mini-shop').click(function () {
    if (sessionStorage.getItem('user') === null) {
        window.location.href = 'http://localhost:3989/signup.html';
    }
    else {
        window.location.href = 'http://localhost:3989/shop.html';
    }
});

$('#pay').click(function () {
    if (sessionStorage.getItem('user') === null) {
        window.location.href = 'http://localhost:3989/signup.html';
    }
    else {
        window.location.href = 'http://localhost:3989/payment.html';
    }
});

if (window.location.href === 'http://localhost:3989/'){
    $('.icon').css('display','none');
}
else{
    $('.icon').css('display','block');
}
$('.icon').on('click',function () {
    window.location.href = 'http://localhost:3989/';
})
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("modalIcon")[0];
let $modal = $('.modalBox');
// When the user clicks on the button, open the modal
$('#brand').click(function () {
    $modal.css('display','block');
});

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function () {
        $modal.css('display', 'none');
    }
}
},{}],6:[function(require,module,exports){
let nameCorrect = false;
let surnameCorrect = false;
let countryCodeCorrect = false;
let phoneCorrect = false;

let storage = require('../localStorage');

$('#input-name').on('input', function () {
    let correct = true;
    let name = this.value;
    if (name.length < 5) {
        correct = false
    } else for (let j = 0; j < name.length; j++) {
        let cur = name.charAt(j);
        if ((cur < 'A' || cur > 'Z') && (cur < 'a' || cur > 'z') && cur !== "'" && cur !== '-') {
            correct = false;
        }
    }
    if (correct) {
        storage.set("name", name);
        $('#name-success').show();
        $('#name-failure').hide();
        nameCorrect = true;
        if (nameCorrect && surnameCorrect && countryCodeCorrect && phoneCorrect) {
            $('#btn-next').prop('disabled', false);
        }
    } else {
        $('#name-success').hide();
        $('#name-failure').show();
        nameCorrect = false;
        $('#btn-next').prop('disabled', true);
    }
});

$('#input-surname').on('input', function () {
    let correct = true;
    let surname = this.value;
    if (surname.length < 5) {
        correct = false
    } else for (let j = 0; j < surname.length; j++) {
        let cur = surname.charAt(j);
        if ((cur < 'A' || cur > 'Z') && (cur < 'a' || cur > 'z') && cur !== "'" && cur !== '-') {
            correct = false;
        }
    }
    if (correct) {
        storage.set("surname", surname);
        $('#surname-success').show();
        $('#surname-failure').hide();
        surnameCorrect = true;
        if (nameCorrect && surnameCorrect && countryCodeCorrect && phoneCorrect) {
            $('#btn-next').prop('disabled', false);
        }
    } else {
        $('#surname-success').hide();
        $('#surname-failure').show();
        surnameCorrect = false;
        $('#btn-next').prop('disabled', true);
    }
});

$('#input-country-code').on('input', function () {
    let correct = true;
    let countryCode = this.value;
    if (countryCode.length < 2 || countryCode.length > 4 || countryCode.charAt(0) !== '+') {
        correct = false
    } else for (let j = 1; j < countryCode.length; j++) {
        let cur = countryCode.charAt(j);
        if (cur < '0' || cur > '9') {
            correct = false;
        }
    }
    if (correct) {
        storage.set("country-code", countryCode);
        $('#country-code-success').show();
        $('#country-code-failure').hide();
        countryCodeCorrect = true;
        if (nameCorrect && surnameCorrect && countryCodeCorrect && phoneCorrect) {
            $('#btn-next').prop('disabled', false);
        }
    } else {
        $('#country-code-success').hide();
        $('#country-code-failure').show();
        countryCodeCorrect = false;
        $('#btn-next').prop('disabled', true);
    }
});

$('#input-phone').on('input', function () {
    let correct = true;
    let phone = this.value;
    if (phone.length === 0) {
        correct = false
    } else for (let j = 0; j < phone.length; j++) {
        let cur = phone.charAt(j);
        if (cur < '0' || cur > '9') {
            correct = false;
        }
    }
    if (correct) {
        storage.set("phone", phone);
        $('#phone-success').show();
        $('#phone-failure').hide();
        phoneCorrect = true;
        if (nameCorrect && surnameCorrect && countryCodeCorrect && phoneCorrect) {
            $('#btn-next').prop('disabled', false);
        }
    } else {
        $('#phone-success').hide();
        $('#phone-failure').show();
        phoneCorrect = false;
        $('#btn-next').prop('disabled', true);
    }

    console.log($('#input-name').val());
});

$('#btn-next').click(function () {
    storage.set("destination", $('#planets').val());
});
},{"../localStorage":2}],7:[function(require,module,exports){
function initializeOrderParamPage() {
    try{
        positionRollbar();
    } catch{}
}

let storage = require('../localStorage');
let api = require('../API');
let orderData = "";

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear() + 444;
today = yyyy + '-' + mm + '-' + dd;

let payer = "Sender";

function showGif() {
    if (storage.get('destination') === 'Mercury') {
        $('#mercury-gif').show();
    } else if (storage.get('destination') === 'Venus') {
        $('#venus-gif').show();
    } else if (storage.get('destination') === 'Earth') {
        $('#earth-gif').show();
    } else if (storage.get('destination') === 'Mars') {
        $('#mars-gif').show();
    } else if (storage.get('destination') === 'Jupiter') {
        $('#jupiter-gif').show();
    } else if (storage.get('destination') === 'Saturn') {
        $('#saturn-gif').show();
    } else if (storage.get('destination') === 'Uranus') {
        $('#uranus-gif').show();
    } else if (storage.get('destination') === 'Neptune') {
        $('#neptune-gif').show();
    }
}

$('#input-cost').on('input', function() {
    let val = $(this).val();
    if (!parseEvaluatedCost(val)) {
        $('#cost-success').hide();
        $('#cost-failure').show();
        $('#final-order').prop('disabled', true);
    } else {
        $('#cost-success').show();
        $('#cost-failure').hide();
        $('#final-order').prop('disabled', false);
    }
})

function parseEvaluatedCost(input) {
    let numVal;
    try {
        numVal = Number.parseInt(input);
        if(numVal > 0 && numVal < 200000) return true;
        return false;
    } catch (err) {
        return false;
    }
}

$('#receiver-radio').on('click', function () {
    $(this).prop('checked', true);
    $('#sender-radio').prop('checked', false);

    payer = "Receiver";
})

$('#sender-radio').on('click', function () {
    $(this).prop('checked', true);
    $('#receiver-radio').prop('checked', false);
    payer = "Sender";
})

$('#final-order').click(function () {
    let data = {
        name: storage.get("name"),
        surname: storage.get("surname"),
        phone: storage.get("country-code") + storage.get("phone"),
        destination: storage.get("destination"),
        weight: $('#weight-val').text(),
        description: $('#text-desc').val(),
        date: today,
        cost: $('#input-cost').val() * 10 + Number.parseInt($('#weight-val').text()) * 5 + 500,
        status: "sent",
        payer: payer,
        paid: "false"
    };

    orderData = data;

    $('#span-name').text(data.name);
    $('#span-surname').text(data.surname);
    $('#span-phone').text(data.phone);
    $('#span-destination').text(data.destination);
    $('#span-weight').text("weight: " + data.weight);
    $('#span-description').text("description: " + data.description);
    $('#span-date').text("date: " + data.date);
    $('#span-cost').text("cost: " + data.cost);
    $('#span-status').text("status: " + data.status);
    $('#span-payer').text("payer: " + data.payer);
});

$('#span-name').click(function () {
    $('#name-alter').val($(this).text());
    $(this).hide();
    $('#name-alter').show();
    $('#name-alter').focus();
});

$('#name-alter').focusout(function () {
    $(this).hide();
    let name = $(this).val();
    if (parseName(name)) {
        $('#span-name').text(name);
        orderData.name = $(this).val();
    }
    $('#span-name').show();
});

$('#span-surname').click(function () {
    $('#surname-alter').val($(this).text());
    $(this).hide();
    $('#surname-alter').show();
    $('#surname-alter').focus();
});

$('#surname-alter').focusout(function () {
    $(this).hide();
    let surname = $(this).val();
    if (parseName(surname)) {
        $('#span-surname').text(surname);
        orderData.surname = $(this).val();
    }
    $('#span-surname').show();
});

$('#span-phone').click(function () {
    $('#phone-alter').val($(this).text());
    $(this).hide();
    $('#phone-alter').show();
    $('#phone-alter').focus();
});

$('#phone-alter').focusout(function () {
    $(this).hide();
    let phone = $(this).val();
    if (parsePhone(phone)) {
        $('#span-phone').text(phone);
        orderData.phone = $(this).val();
    }
    $('#span-phone').show();
});

$('#span-destination').click(function () {
    $(this).hide();
    $('#dest-alter').show();
    $('#dest-alter').focus();
});

$('#dest-alter').change(function () {
    let dest = $(this).val();
    $('#span-destination').text(dest);
    orderData.destination = dest;
});

$('#dest-alter').focusout(function () {
    $(this).hide();
    $('#span-destination').show();
});

function parseName(name) {
    let correct = true;
    if (name.length === 0) {
        correct = false
    } else for (let j = 0; j < name.length; j++) {
        let cur = name.charAt(j);
        if ((cur < 'A' || cur > 'Z') && (cur < 'a' || cur > 'z') && cur !== "'" && cur !== '-') {
            correct = false;
        }
    }

    return correct;
}

function parsePhone(phone) {
    if (phone.length < 2 || phone.charAt(0) !== '+') {
        return false;
    } else for (let j = 1; j < phone.length; j++) {
        let cur = phone.charAt(j);
        if (cur < '0' || cur > '9') {
            return false;
        }
    }

    return true;
}

let ismousedown;
jQuery.fn.draggit = function (el, doSmth) {
    var thisdiv = this;
    var thistarget = $(el);
    var relX;
    var targetw = thistarget.width();

    thistarget.css('position','absolute');


    thisdiv.bind('mousedown', function(e){
        var pos = $(el).offset();
        var srcX = pos.left;

        relX = e.pageX - srcX;

        ismousedown = true;
    });

    $(document).bind('mousemove',function(e){
        if(ismousedown)
        {
            targetw = thistarget.width();

            let start = $('#slide').css('left');
            start = start.slice(0, start.length - 2);
            start = Number.parseInt(start);
            let minX = start - 10;
            let maxX = minX + 200;

            var mouseX = e.pageX;

            var diffX = mouseX - relX;

            // check if we are beyond document bounds ...
            if(diffX < minX)   diffX = minX;
            if(diffX > maxX) diffX = maxX;

            $(el).css('left', (diffX)+'px');
            doSmth(diffX);
        }
    });

    $(window).bind('mouseup', function(e){
        ismousedown = false;
    });

    return this;
} // end jQuery draggit function //

function changeWeightLabel(coordX) {
    let start = $('#slide').css('left');
    start = start.slice(0, start.length - 2);
    start = Number.parseInt(start);
    let w = Number.parseInt((coordX + 10 - start) / 2);
    $('#weight-val').text(w);
}

$('#wrap-drag').draggit('#to-drag', changeWeightLabel);

$('#slide').on('click', function (e) {
    $('#to-drag').css('left', (e.pageX)+'px');
    changeWeightLabel(e.pageX);
})

$(window).on('resize', function () {
    try {
        positionRollbar();
    }
    catch (err){}
})

function positionRollbar() {
    let left = $('.container').css('margin-left');
    left = left.slice(0, left.length - 2);
    left = Number.parseInt(left);
    left += 50;
    let w = Number.parseInt($('#weight-val').text());
    $('#slide').css('left', left + 'px');
    $('#zero').css('left', left - 30 + 'px');
    $('#hundred').css('left', left + 220 + 'px');
    $('#to-drag').css('left', left - 10 + 2*w + 'px');
}

$('#btn-order').click(function () {
    let delivery = orderData;
    let user = JSON.parse(sessionStorage.getItem('user'));

    let data = {
        delivery: delivery,
        user: user
    }

    api.createDelivery(data, function (err, data) {
        if (err) {
            console.log("Error at API.createDelivery");
        }
    });

    window.location.href = 'http://localhost:3989/';

});

exports.initializeOrderParamPage = initializeOrderParamPage;
exports.showGif = showGif;
},{"../API":1,"../localStorage":2}],8:[function(require,module,exports){
const templates = require('../viewDeliveries/delTemp');
const server = require('../API');

let viewOptions = false;
let curSort = "status";
let $delList = $("#unpaid-deliveries");
let deliveries = [];
let indexToSplice;

function postInfo(error, data) {
    if (error) {
        console.log(error.toString());
    } else {
        liqpay(data);
    }
}

function liqpay(data) {

    LiqPayCheckout.init({
        data: data.data,
        signature: data.signature,
        embedTo: "#liqpay",
        mode: "popup" // embed ||popup
    }).on("liqpay.callback", function(data) {
        console.log(data.status);
        console.log(data);
        //console.log(data.index);
        deliveries[indexToSplice].paid = 'true';
        server.modifyDelivery(deliveries[indexToSplice], function (err, data) {
            if (err) {
                console.log('View Error!!!');
                console.log(err.toString());
            }
            console.log('Now remove from view');
            deliveries.splice(indexToSplice, 1);
            update();
        })
    }).on("liqpay.ready", function(data) {
        // ready
    }).on("liqpay.close", function(data){
        update();
    });
}

function initializePayments() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        $('#is-paid').css('display', 'block');
        return;
    }
    //console.log(user);
    server.getDeliveries(user, function (err, data) {
        deliveries = [];
        if (err) {
            console.log(err.toString());
        } else {
            deliveries = data;
        }
        //console.log(deliveries);
        if (deliveries.length === 0) {
            $('#is-paid').css('display', 'block');
        }
        let j = 0;
        while (j < deliveries.length) {
            if (deliveries[j].payer !== "Sender" || deliveries[j].paid === 'true') {
                deliveries.splice(j, 1);
            } else {
                j++;
            }
        }
        for (let i = 0; i < deliveries.length; i++) {
            deliveries[i] = {
                id: deliveries[i].id,
                description: deliveries[i].description ? deliveries[i].description : "No description",
                date: deliveries[i].date ? deliveries[i].date.slice(0, 10) : "No Date",
                cost: deliveries[i].cost,
                status: deliveries[i].status ? deliveries[i].status : "No Status",
                destination: deliveries[i].destination,
                fullStatus: deliveries[i].status ? deliveries[i].status : "No Status",
                fullDestination: deliveries[i].destination,
                paid: 'false',
            }
            if(deliveries[i].status.length > 12) {
                deliveries[i].status = deliveries[i].status.substring(0, 9);
                deliveries[i].status += "...";
            }
            if(deliveries[i].destination.length > 14) {
                deliveries[i].destination = deliveries[i].destination.substring(0, 11);
                deliveries[i].destination += "...";
            }
        }
        deliveries.sort(sortByStatusAsc);
        update();
    });
}

$('.slideup-for-sort').on('click', function () {
    if (!viewOptions) {
        let height = $('.slideup-for-sort').height();
        $('.slideup-for-sort').css("bottom", 8*height);
        $('.sort-item').css('visibility', 'visible');
        $('#date-pay').css("bottom", 2*height);
        $('#dest-pay').css("bottom", 4*height);
        $('#status-pay').css("bottom", 6*height);
        viewOptions = true;
    } else {
        $('.slideup-for-sort').css("bottom", "0");
        $('#date-pay').css("bottom", "0");
        $('#dest-pay').css("bottom", "0");
        $('#status-pay').css("bottom", "0");
        setTimeout(function() {
            $('.sort-item').css('visibility', 'hidden');
        }, 500);
        viewOptions = false;
    }
});

$('#date-pay').on('click', function() {
    templateToSortByOtherVal('date');
});

$('#dest-pay').on('click', function() {
    templateToSortByOtherVal('dest');
});

$('#cost-pay').on('click', function() {
    templateToSortByOtherVal('cost');
});

$('#status-pay').on('click', function() {
    templateToSortByOtherVal('status');
});

function templateToSortByOtherVal(sortBy) {
    if(curSort === sortBy) return;
    curSort = sortBy;
    if (sortBy !== "date") {
        $('#date-arrow-down-pay').css('visibility', 'hidden');
        $('#date-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#date-arrow-down-pay').css('visibility', 'visible');
        $('#date-arrow-down-pay').css('opacity', '0.5');
        $('#date-arrow-up-pay').css('visibility', 'visible');
        $('#date-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "cost") {
        $('#cost-arrow-down-pay').css('visibility', 'hidden');
        $('#cost-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#cost-arrow-down-pay').css('visibility', 'visible');
        $('#cost-arrow-down-pay').css('opacity', '0.5');
        $('#cost-arrow-up-pay').css('visibility', 'visible');
        $('#cost-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "dest") {
        $('#dest-arrow-down-pay').css('visibility', 'hidden');
        $('#dest-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#dest-arrow-down-pay').css('visibility', 'visible');
        $('#dest-arrow-down-pay').css('opacity', '0.5');
        $('#dest-arrow-up-pay').css('visibility', 'visible');
        $('#dest-arrow-up-pay').css('opacity', '1');
    }
    if (sortBy !== "status") {
        $('#status-arrow-down-pay').css('visibility', 'hidden');
        $('#status-arrow-up-pay').css('visibility', 'hidden');
    } else {
        $('#status-arrow-down-pay').css('visibility', 'visible');
        $('#status-arrow-down-pay').css('opacity', '0.5');
        $('#status-arrow-up-pay').css('visibility', 'visible');
        $('#status-arrow-up-pay').css('opacity', '1');
    }
    let text = 'Delivery ';
    if (sortBy === 'date') {
        text += "Date";
        deliveries.sort(sortByDateAsc);
    }
    if (sortBy === 'dest') {
        text += "Destination";
        deliveries.sort(sortByDestinationAsc);
    }
    if (sortBy === 'cost') {
        text += "Cost";
        deliveries.sort(sortByCostAsc);
    }
    if (sortBy === 'status') {
        text += "Status";
        deliveries.sort(sortByStatusAsc);
    }
    $('.slideup-for-sort span').text(text);
    $('#main-arrow-down-pay').css('display', 'none');
    $('#main-arrow-up-pay').css('display', 'block');

    update();
}

$('#date-arrow-down-pay').on('click', function () {
    templateForArrowClick('date', 'down');
    deliveries.sort(sortByDateDesc);
    update();
});

$('#date-arrow-up-pay').on('click', function () {
    templateForArrowClick('date', 'up');
    deliveries.sort(sortByDateAsc);
    update();
});

$('#status-arrow-down-pay').on('click', function () {
    templateForArrowClick('status', 'down');
    deliveries.sort(sortByStatusDesc);
    update();
});

$('#status-arrow-up-pay').on('click', function () {
    templateForArrowClick('status', 'up');
    deliveries.sort(sortByStatusAsc);
    update();
});

$('#dest-arrow-down-pay').on('click', function () {
    templateForArrowClick('dest', 'down');
    deliveries.sort(sortByDestinationDesc);
    update();
});

$('#dest-arrow-up-pay').on('click', function () {
    templateForArrowClick('dest', 'up');
    deliveries.sort(sortByDestinationAsc);
    update();
});

$('#cost-arrow-down-pay').on('click', function () {
    templateForArrowClick('cost', 'down');
    deliveries.sort(sortByCostDesc);
    update();
});

$('#cost-arrow-up-pay').on('click', function () {
    templateForArrowClick('cost', 'up');
    deliveries.sort(sortByCostAsc);
    update();
});

function templateForArrowClick(sortBy, dir) {
    if (dir !== 'up' && dir !== 'down') return;
    let clicked = '#' + sortBy + '-arrow-down-pay';
    let opposite = '#' + sortBy + '-arrow-up-pay';
    if(dir === 'up') {
        let temp = clicked;
        clicked = opposite;
        opposite = temp;
    }
    if($(clicked).css('opacity') === '1') {
        return;
    }
    $(clicked).css('opacity', '1');
    $(opposite).css('opacity', '0.5');
    if (dir === 'up') {
        $('#main-arrow-up-pay').css('display', 'block');
        $('#main-arrow-down-pay').css('display', 'none');
    } else {
        $('#main-arrow-down-pay').css('display', 'block');
        $('#main-arrow-up-pay').css('display', 'none');
    }
}

function sortByStatusAsc(delivery1, delivery2) {
    if (delivery1.status < delivery2.status) return -1;
    else if (delivery1.status === delivery2.status) return 0;
    else return 1;
}

function sortByStatusDesc(delivery1, delivery2) {
    return -sortByStatusAsc(delivery1, delivery2);
}

function sortByDestinationAsc(delivery1, delivery2) {
    if (delivery1.destination < delivery2.destination) return -1;
    else if (delivery1.destination === delivery2.destination) return 0;
    else return 1;
}

function sortByDestinationDesc(delivery1, delivery2) {
    return -sortByDestinationAsc(delivery1, delivery2);
}

function sortByDateAsc(delivery1, delivery2) {
    if (delivery1.date < delivery2.date) return -1;
    else if (delivery1.date === delivery2.date) return 0;
    else return 1;
}

function sortByDateDesc(delivery1, delivery2) {
    return -sortByDateAsc(delivery1, delivery2);
}

function sortByCostAsc(delivery1, delivery2) {
    if (delivery1.cost < delivery2.cost) return -1;
    else if (delivery1.cost === delivery2.cost) return 0;
    else return 1;
}

function sortByCostDesc(delivery1, delivery2) {
    return -sortByCostAsc(delivery1, delivery2);
}

function update () {
    $delList.html("");
    let cnt = 0;
    for (let i = 0; i < deliveries.length; i++) {
        let $html_code = templates.deliveryItem({
            numId: i,
            description: deliveries[i].description,
            date: deliveries[i].date,
            cost: deliveries[i].cost,
            status: deliveries[i].status,
            fullStatus: deliveries[i].fullStatus,
            destination: deliveries[i].destination,
            fullDestination: deliveries[i].fullDestination
        });
        if (deliveries[i].paid === 'false') {
            $delList.append($html_code);
            cnt++;
        }
    }

    if (cnt === 0) {
        $('#is-paid').css('display', 'block');
        return;
    }
    let n = deliveries.length;
    for (let i = 0; i < n; i++) {
        let id = "#item" + i;
        $(id).on('click', function () {
            //console.log("id: ", id);
            let desc = "Payment info" +
                "\r\nDescription: " + deliveries[i].description +
                "\r\nDate: " + deliveries[i].date +
                "\r\nStatus: " + deliveries[i].status + '.';
            let payment_info = {
                amount: deliveries[i].cost,
                description: desc,
            };
            indexToSplice = i;
            server.createPayment(payment_info, postInfo);
        });
    }
}

exports.initializePayments = initializePayments;
},{"../API":1,"../viewDeliveries/delTemp":15}],9:[function(require,module,exports){
let templates = require('../viewDeliveries/delTemp');
let storage = require('../localStorage');
let Cart = []
let sum = 0;
let shop = require('../shop/shop')

function initCart() {
    let json_data = storage.get('productsInCart');
    if (json_data){
        let array = JSON.parse(json_data);
        setCart(array);
        $("#cart-len").text(array.length);
    }
}

function writeProductsInLocalStorage() {
    let array = [];
    for (let i = 0; i < Cart.length;i++){
        array.push(Cart[i]);
    }
    storage.set("productsInCart",JSON.stringify(array));

}

function addToCart(product){
    if (!containsObject(product,Cart)) {
        Cart.push({
            quantity: 1,
            product: product
        });
    }
    else{
        console.log('exist');
    }

    writeProductsInLocalStorage();
    $('#cart-len').text(Cart.length);
    console.log(Cart);
}
function containsObject(obj, list) {
    let i;
    for (i = 0; i < list.length; i++) {
        if (list[i].product.id === obj.id) {
            list[i].quantity++;
            return true;
        }
    }

    return false;
}
let $modalText = $('.modal-body');

function getCart() {
    return Cart;
}

function setCart(newCart){
    Cart = newCart;
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика

    let number = Cart.indexOf(cart_item);
    Cart.splice(number,1);

    //Після видалення оновити відображення
    showProductInCart();
}
function calculateSum() {
    sum = 0;
    for (let i = 0; i < Cart.length;i++){
        sum += Cart[i].product.cost * Cart[i].quantity;
    }
    return sum;
}

function showProductInCart() {
    $modalText.html('');
    writeProductsInLocalStorage();
    $("#totalSum").text(calculateSum());
    $('#cart-len').text(Cart.length);
    function showOneProductInCart(product) {
        let html_code =templates.cartItem({product:product});
        let $node = $(html_code);
        $node.find('#removeFromCart').on('click',function () {
            console.log('Removing from cart');
            removeFromCart(product);
        })
        $modalText.append($node);
    }
    Cart.forEach(showOneProductInCart);
}
exports.showProductInCart = showProductInCart;
exports.addToCart = addToCart;
exports.getCart = getCart;
exports.setCart = setCart;
exports.initCart = initCart;

},{"../localStorage":2,"../shop/shop":12,"../viewDeliveries/delTemp":15}],10:[function(require,module,exports){
const server = require('../API');
let user = JSON.parse(sessionStorage.getItem('user'));
if (user) {
    $('#profileEmail').text(user.email);
    $('#full_name').text(user.name);
}
$("#sign_out").on('click', function () {
    sessionStorage.removeItem('user');
    window.location.href='http://localhost:3989';
});

function loadProfile() {
    if (!user) return;
    server.getDeliveries(user, function (err, data) {
        if (err) {
            console.log(err.toString());
            return;
        }
        if (!data) {
            console.log("Bad data");
        }
        $('#num-orders').text(data.length);
        let rating = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].paid === 'true') {
                rating += 100;
            } else {
                rating += 50;
            }
        }
        if (rating === 0) {
            $('#user-rating').text("Not Rated");
        } else {
            $('#user-rating').text(rating);
        }
    })
}

exports.loadProfile = loadProfile;

},{"../API":1}],11:[function(require,module,exports){
const server = require('../API');
const mailSender = require('../signUp/forSignUp');
const login = require('../login/login');

let code = 1000;
let emailAddress;

$('#main-reset-btn').on('click', function () {
    if ($('#new-password').css('display') === 'none') {
        let email = {
            email: $('#email').val()
        };
        emailAddress = email.email;
        // console.log(email);
        server.checkUserByEmail(email, function (err, data) {
            if (err) {
                console.log(err.toString());
                return;
            }
            if (!data) {
                console.log('Bad data');
                return;
            }
            if (data === 'false') {
                $('#notFound').css({'height': '100px', 'opacity': '1'});
            } else {
                $('#notFound').css({'height': '0px', 'opacity': '0'});
                $('#ver-code-label').css('display', 'block');
                $('#verification-code').css('display', 'block');
                code = mailSender.sendMail('User', 'of our website', email.email);
                //console.log("Code: ", code);
            }
        });
    } else {
        let password = $('#new-password').val();
        if (!login.parsePwd(password)) {
            //console.log('bad pwd');
            $('#invalid-password').css('display', 'inline');
            return;
        } else {
            server.modifyUser({
                email: emailAddress,
                password: password
            }, function (err, data) {
                // sessionStorage.setItem('user',JSON.stringify(data));
                console.log(sessionStorage.getItem('user'));
                server.homePage(function (error, data) {
                    if (!error){
                        console.log(data);
                        window.location.href="http://localhost:3989/login.html";
                    }
                });
            });
        }
    }
});

$('#verification-code').on('input', function () {
    let entryCode = Number.parseInt($(this).val());
    if (entryCode < 1000 || entryCode > 9999) return;
    if (entryCode === code) {
        $('#bad-code').css('display', 'none');
        $('#ver-code-label').css('display', 'none');
        $(this).css('display', 'none');
        $('#new-password-label').css('display', 'block');
        $('#new-password').css('display', 'block');
    } else {
        $('#bad-code').css('display', 'block');
    }
});
},{"../API":1,"../login/login":3,"../signUp/forSignUp":13}],12:[function(require,module,exports){
let $products = $('#products');
let storage = require('../localStorage');
const templates = require('../viewDeliveries/delTemp');
const ProductCart = require('../productCart/Cart');
let productList = []
let API = require('../API')
function initializeProducts() {
    let products;

    API.getProducts([],function (err, data) {
        products = [];
        if (err) {
            console.log(err.toString());
            return;
        } else {
            products = data;
        }
        // console.log('hello from back',products);
        if (products.length === 0) {
            $('#is-empty').css('display', 'block');
        }
        for (let i = 0; i < products.length; i++) {
            productList.push({
                id: products[i].id,
                description: products[i].description,
                date: products[i].date,
                cost: products[i].cost,
                icon: products[i].icon,
            });
        }
        updateShop();
    });
}

$('#buyProducts').click(function (){
    if (ProductCart.getCart().length===0){
        console.log(ProductCart.getCart());
        alert("Cart is empty");
        return;
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear() + 444;
    today = yyyy + '-' + mm + '-' + dd;
    console.log('hello');
    let sum = $("#totalSum").text();
    let delivery = {
        name: storage.get("name"),
        surname: storage.get("surname"),
        phone: storage.get("country-code") + storage.get("phone"),
        destination: storage.get("destination"),
        date: today,
        cost: sum,
        status: "sent",
        description: "Cool math stuff",
        paid: "false",
        payer: "Sender"
    };
    let user = JSON.parse(sessionStorage.getItem('user'));
    let data = {
        delivery: delivery,
        user: user
    }
    API.createDelivery(data, function (error, data) {
        if (error){
            console.log("Wrong in creating delivery from shop products");
        }
    });
    alert('Great! Check deliveries to see your order')

    $('#myModal').css("display","none");
});
let ascPrice = 0;
let ascDescription = 0;
function sortByCostAsc(product1, product2) {
    if (product1.cost < product2.cost) return -1;
    else if (product1.cost === product2.cost) return 0;
    else return 1;
}

function sortByCostDesc(product1, product2) {
    return -sortByCostAsc(product1, product2);
}
function sortByDescriptionAsc(product1, product2) {
    if (product1.description < product2.description) return -1;
    else if (product1.description === product2.description) return 0;
    else return 1;
}

function sortByDescriptionDesc(product1, product2) {
    return -sortByDescriptionAsc(product1, product2);
}
$("#price").on('click',function () {
    if (ascPrice===0){
        productList.sort(sortByCostAsc);
        ascPrice = 1;
    }
    else{
        productList.sort(sortByCostDesc);
        ascPrice = 0;
    }
    updateShop();
})

$("#description").on('click',function () {
    if (ascDescription===0){
        productList.sort(sortByDescriptionAsc);
        ascDescription = 1;
    }
    else{
        productList.sort(sortByDescriptionDesc);
        ascDescription = 0;
    }
    updateShop();
})

function updateShop () {
    $products.html("");
    function showOneProduct(product){
        let html_code =templates.shopIitem({product:product});
        let $node = $(html_code);

        $node.find('.addProductToCart').click(function () {
            ProductCart.addToCart(product);
        });
        $products.append($node);
        }

    productList.forEach(showOneProduct);
}

if (window.location.href !=='http://localhost:3989/shop.html'){
    $('#basket').css('display','none');
    $('#cart-len').css('display','none');

}
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
let $modal = $('#myModal');
// When the user clicks on the button, open the modal
$('#basket').click(function () {
   $modal.css('display','block');
   ProductCart.showProductInCart();
});
$('#cart-len').click(function () {
    $modal.css('display','block');
    ProductCart.showProductInCart();
});

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function () {
        $modal.css('display', 'none');
    }
}

exports.initializeProducts = initializeProducts;
exports.updateShop = updateShop;
},{"../API":1,"../localStorage":2,"../productCart/Cart":9,"../viewDeliveries/delTemp":15}],13:[function(require,module,exports){
let firstname;
let lastname;
let address;
let code;
let codeResent = 0;

let API = require('../API');

function sendMail(name, surname, email) {
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
        //max & min inclusive
    }
    const code = getRandomInt(1000, 9999);
    Email.send({
        Host: "smtp.gmail.com",
        Username: "universal.delivery.noreply@gmail.com",
        Password: "uasrveldnvryiilee",
        To: email,
        From: "universal.delivery.noreply@gmail.com",
        Subject: "Verification Letter",
        Body: "Dear " + name + " " + surname + ",\r\n"
                + "You are registering at our website.\r\n"
                + "To confirm your email addres, please enter the following code:\r\n"
                + code,
    })
        .then(function (message) {
            // alert("mail sent successfully")
        });
    return code;
}

$('#resend').click(function () {
    let name = $('#input-name').val();
    name = trim(name);
    let surname = $('#input-surname').val();
    surname = trim(surname);
    let email = $('#input-email').val();
    email = trim(email);
    codeResent = sendMail(name, surname, email);
    alert("Code recent successfully! Please check your email again")
});

$('#sign-up-btn').on('click', function () {
    $('#format-request').hide();
    $('#learn-name').show();
    $('#move-signup').show();
});
let user = {

};
$('#move-signup').on('click', function () {
    if ($('#learn-name').css('display') !== 'none') {
        let name = $('#input-name').val();
        name = trim(name);
        if(!parseName(name)) {
            $('#invalid-name').show();
        } else {
            $('#learn-name').hide();
            $('#learn-surname').show();
            firstname = name;
            user.firstname = firstname;
        }

    } else if ($('#learn-surname').css('display') !== 'none') {
        let surname = $('#input-surname').val();
        surname = trim(surname);
        if(!parseName(surname)) {
            $('#invalid-surname').show();
        } else {
            $('#learn-surname').hide();
            $('#learn-email').show();
            lastname = surname;
            user.lastname = lastname;
        }

    } else if ($('#learn-email').css('display') !== 'none') {
        let email = $('#input-email').val();
        email = trim(email);
        if(!parseEmail(email)) {
            $('#invalid-email').show();
        } else {
            $('#learn-email').hide();
            $('#validate-email').show();
            $('#resend').show();
            address = email;
            code = sendMail(firstname, lastname, address);
            user.email = email;
        }

    } else if ($('#validate-email').css('display') !== 'none') {
        let number = Number.parseInt($('#input-code').val());
        if (codeResent) {
            code = codeResent;
        }
        if(number !== code) {
            $('#invalid-code').show();
        } else {
            $('#validate-email').hide();
            $('#resend').hide();
            $('#learn-password').show();
        }

    } else if ($('#learn-password').css('display') !== 'none') {
        let password = $('#input-password').val();
        password = trim(password);
        console.log(password);
        if(!parsePwd(password)) {
            $('#invalid-password').show();
        } else {
            $('#learn-password').hide();
            user.password = password;
            API.createUser(user, sendToBack);
        }

    }
});

$('#profile').on('click', function () {
    console.log(sessionStorage.getItem('user'));
    if (sessionStorage.getItem('user') === null) {
        window.location.href = 'http://localhost:3989/signup.html';
    }
    else{
        window.location.href = 'http://localhost:3989/profile.html';
    }
});

function sendToBack(error, data){
    if (!error){
        console.log(data);
        window.location.href='http://localhost:3989/signup.html';
    }
    else{
        console.log('error');
    }
}
function parseName(name) {
    if(!name) return false;
    for(let i = 0; i < name.length; i++) {
        if (name[i] >= 'a' && name[i] <= 'z') continue;
        if (name[i] >= 'A' && name[i] <= 'Z') continue;
        if (name[i] === '-' || name[i] === '`' || name[i] === '\'') continue;
        return false;
    }
    return true;
}

function trim(str) {
    if(!str) return str;
    while (str && str[0] === ' ') str = str.substring(1);
    while (str && str[str.length - 1] === ' ') str = str.substring(0, str.length - 1);
    return str;
}

function parseEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function parsePwd(password){
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;//Minimum eight characters, at least one letter and one number
    return re.test(password);
}

exports.sendMail = sendMail;
},{"../API":1}],14:[function(require,module,exports){
const templates = require('./delTemp');
const deliveriesList = require('./deliveriesList');
const serverInteract = require('../API');

let viewOptions = false;
let curSort = "status";
let $delList = $("#add-deliveries");
let deliveries;
let newDescription = "";
let payerChanged = false;
let modifyInd = -1;

function initializeArchive() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        $('#is-empty').css('display', 'block');
        return;
    }
    //console.log(user);
    serverInteract.getDeliveries(user, function (err, data) {
        deliveries = [];
        if (err) {
            console.log(err.toString());
            return;
        } else {
            deliveries = data;
        }
        //console.log(deliveries);
        if (deliveries.length === 0) {
            $('#is-empty').css('display', 'block');
        }
        for (let i = 0; i < deliveries.length; i++) {
            deliveries[i] = {
                id: deliveries[i].id,
                description: deliveries[i].description ? deliveries[i].description : "No description",
                date: deliveries[i].date ? deliveries[i].date.slice(0, 10) : "No Date",
                cost: deliveries[i].cost,
                status: deliveries[i].status ? deliveries[i].status : "No Status",
                destination: deliveries[i].destination,
                fullStatus: deliveries[i].status ? deliveries[i].status : "No Status",
                fullDestination: deliveries[i].destination,
                payer: deliveries[i].payer,
                paid: deliveries[i].paid,
                name: deliveries[i].name,
                surname: deliveries[i].surname,
                phone: deliveries[i].phone
            }
            if(deliveries[i].status.length > 12) {
                deliveries[i].status = deliveries[i].status.substring(0, 9);
                deliveries[i].status += "...";
            }
            if(deliveries[i].destination.length > 14) {
                deliveries[i].destination = deliveries[i].destination.substring(0, 11);
                deliveries[i].destination += "...";
            }
        }
        if (deliveries) deliveries.sort(sortByStatusAsc);
        updateArchive();
    });
}

$('.slideup-for-sort').on('click', function () {
    if (!viewOptions) {
        let height = $('.slideup-for-sort').height();
        $('.slideup-for-sort').css("bottom", 8*height);
        $('.sort-item').css('visibility', 'visible');
        $('#date').css("bottom", 2*height);
        $('#dest').css("bottom", 4*height);
        $('#status').css("bottom", 6*height);
        viewOptions = true;
    } else {
        $('.slideup-for-sort').css("bottom", "0");
        $('#date').css("bottom", "0");
        $('#dest').css("bottom", "0");
        $('#status').css("bottom", "0");
        setTimeout(function() {
            $('.sort-item').css('visibility', 'hidden');
        }, 500);
        viewOptions = false;
    }
});

$('#date').on('click', function() {
    templateToSortByOtherVal('date');
});

$('#dest').on('click', function() {
    templateToSortByOtherVal('dest');
});

$('#cost').on('click', function() {
    templateToSortByOtherVal('cost');
});

$('#status').on('click', function() {
    templateToSortByOtherVal('status');
});

$('#date-arrow-down').on('click', function () {
    templateForArrowClick('date', 'down');
    if (deliveries) deliveries.sort(sortByDateDesc);
    updateArchive();
});

$('#date-arrow-up').on('click', function () {
    templateForArrowClick('date', 'up');
    if (deliveries) deliveries.sort(sortByDateAsc);
    updateArchive();
});

$('#status-arrow-down').on('click', function () {
   templateForArrowClick('status', 'down');
    if (deliveries) deliveries.sort(sortByStatusDesc);
    updateArchive();
});

$('#status-arrow-up').on('click', function () {
    templateForArrowClick('status', 'up');
    if (deliveries) deliveries.sort(sortByStatusAsc);
    updateArchive();
});

$('#dest-arrow-down').on('click', function () {
    templateForArrowClick('dest', 'down');
    if (deliveries) deliveries.sort(sortByDestinationDesc);
    updateArchive();
});

$('#dest-arrow-up').on('click', function () {
    templateForArrowClick('dest', 'up');
    if (deliveries) deliveries.sort(sortByDestinationAsc);
    updateArchive();
});

$('#cost-arrow-down').on('click', function () {
    templateForArrowClick('cost', 'down');
    if (deliveries) deliveries.sort(sortByCostDesc);
    updateArchive();
});

$('#cost-arrow-up').on('click', function () {
    templateForArrowClick('cost', 'up');
    if (deliveries) deliveries.sort(sortByCostAsc);
    updateArchive();
});

function templateForArrowClick(sortBy, dir) {
    if (dir !== 'up' && dir != 'down') return;
    let clicked = '#' + sortBy + '-arrow-down';
    let opposite = '#' + sortBy + '-arrow-up';
    if(dir === 'up') {
        let temp = clicked;
        clicked = opposite;
        opposite = temp;
    }
    if($(clicked).css('opacity') === '1') {
        return;
    }
    $(clicked).css('opacity', '1');
    $(opposite).css('opacity', '0.5');
    if (dir === 'up') {
        $('#main-arrow-up').css('display', 'block');
        $('#main-arrow-down').css('display', 'none');
    } else {
        $('#main-arrow-down').css('display', 'block');
        $('#main-arrow-up').css('display', 'none');
    }
}

function templateToSortByOtherVal(sortBy) {
    if(curSort === sortBy) return;
    curSort = sortBy;
    if (sortBy !== "date") {
        $('#date-arrow-down').css('visibility', 'hidden');
        $('#date-arrow-up').css('visibility', 'hidden');
    } else {
        $('#date-arrow-down').css('visibility', 'visible');
        $('#date-arrow-down').css('opacity', '0.5');
        $('#date-arrow-up').css('visibility', 'visible');
        $('#date-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "cost") {
        $('#cost-arrow-down').css('visibility', 'hidden');
        $('#cost-arrow-up').css('visibility', 'hidden');
    } else {
        $('#cost-arrow-down').css('visibility', 'visible');
        $('#cost-arrow-down').css('opacity', '0.5');
        $('#cost-arrow-up').css('visibility', 'visible');
        $('#cost-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "dest") {
        $('#dest-arrow-down').css('visibility', 'hidden');
        $('#dest-arrow-up').css('visibility', 'hidden');
    } else {
        $('#dest-arrow-down').css('visibility', 'visible');
        $('#dest-arrow-down').css('opacity', '0.5');
        $('#dest-arrow-up').css('visibility', 'visible');
        $('#dest-arrow-up').css('opacity', '1');
    }
    if (sortBy !== "status") {
        $('#status-arrow-down').css('visibility', 'hidden');
        $('#status-arrow-up').css('visibility', 'hidden');
    } else {
        $('#status-arrow-down').css('visibility', 'visible');
        $('#status-arrow-down').css('opacity', '0.5');
        $('#status-arrow-up').css('visibility', 'visible');
        $('#status-arrow-up').css('opacity', '1');
    }
    let text = 'Delivery ';
    if (sortBy === 'date') {
        text += "Date";
        if (deliveries) deliveries.sort(sortByDateAsc);
    }
    if (sortBy === 'dest') {
        text += "Destination";
        if (deliveries) deliveries.sort(sortByDestinationAsc);
    }
    if (sortBy === 'cost') {
        text += "Cost";
        if (deliveries) deliveries.sort(sortByCostAsc);
    }
    if (sortBy === 'status') {
        text += "Status";
        if (deliveries) deliveries.sort(sortByStatusAsc);
    }
    $('.slideup-for-sort span').text(text);
    $('#main-arrow-down').css('display', 'none');
    $('#main-arrow-up').css('display', 'block');

    updateArchive();
}

function sortByStatusAsc(delivery1, delivery2) {
    if (delivery1.status < delivery2.status) return -1;
    else if (delivery1.status === delivery2.status) return 0;
    else return 1;
}

function sortByStatusDesc(delivery1, delivery2) {
    return -sortByStatusAsc(delivery1, delivery2);
}

function sortByDestinationAsc(delivery1, delivery2) {
    if (delivery1.destination < delivery2.destination) return -1;
    else if (delivery1.destination === delivery2.destination) return 0;
    else return 1;
}

function sortByDestinationDesc(delivery1, delivery2) {
    return -sortByDestinationAsc(delivery1, delivery2);
}

function sortByDateAsc(delivery1, delivery2) {
    if (delivery1.date < delivery2.date) return -1;
    else if (delivery1.date === delivery2.date) return 0;
    else return 1;
}

function sortByDateDesc(delivery1, delivery2) {
    return -sortByDateAsc(delivery1, delivery2);
}

function sortByCostAsc(delivery1, delivery2) {
    if (delivery1.cost < delivery2.cost) return -1;
    else if (delivery1.cost === delivery2.cost) return 0;
    else return 1;
}

function sortByCostDesc(delivery1, delivery2) {
    return -sortByCostAsc(delivery1, delivery2);
}

function updateArchive () {
    $delList.html("");
    if (!deliveries) return;
    for (let i = 0; i < deliveries.length; i++) {
        let html_code = templates.deliveryItem({
            numId: -(i + 1),
            description: deliveries[i].description,
            date: deliveries[i].date,
            cost: deliveries[i].cost,
            status: deliveries[i].status,
            fullStatus: deliveries[i].fullStatus,
            destination: deliveries[i].destination,
            fullDestination: deliveries[i].fullDestination
        });
        $delList.append($(html_code));
    }

    let n = deliveries.length;
    for (let i = 0; i < n; i++) {
        let id = "#item-" + (i + 1);
        let curDel = $(id);
        curDel.attr('data-toggle', 'modal');
        curDel.attr('data-target', '#delivery-info');
        curDel.on('click', function () {
            if (deliveries[i].paid === 'true') {
                $('#modal-payer').css('cursor', 'auto');
            } else {
                $('#modal-payer').css('cursor', 'pointer');
            }
            newDescription = "";
            payerChanged = false;
            modifyInd = i;
            $('#modify-delivery').css('display', 'none');
            $('#change-description').css('display', 'none');
            $('#modal-description').css('display', 'inline');
            $('#modal-payer').css('display', 'inline');

            $('#modal-description').text(deliveries[i].description);
            $('#modal-destination').text(deliveries[i].destination);
            $('#modal-date').text(deliveries[i].date);
            $('#modal-cost').text(deliveries[i].cost);
            $('#modal-status').text(deliveries[i].status);
            $('#modal-receiver').text(deliveries[i].name + ' ' + deliveries[i].surname);
            $('#modal-phone').text(deliveries[i].phone);
            $('#modal-payer').text(deliveries[i].payer);
            $('#modal-paid').text(deliveries[i].paid === 'true' ? 'Yes' : 'No');
        });
    }
}

$('#modal-description').on('click', function () {
    $('#change-description').attr('placeholder', deliveries[modifyInd].description);
    $('#change-description').css('display', 'inline');
    $('#change-description').focus();
    $('#modal-description').css('display', 'none');
    $('#modify-delivery').css('display', 'flex');
});

$('#change-description').on('focusout', function () {
    newDescription = $('#change-description').val();
    if (newDescription && newDescription.length > 0) {
        $('#modal-description').text(newDescription);
    } else if (!payerChanged) {
        $('#modify-delivery').hide();
    }
    $('#change-description').css('display', 'none');
    $('#modal-description').css('display', 'inline');
});

$('#modal-payer').on('click', function () {
    if (deliveries[modifyInd].paid === 'true') {
        return;
    }
    let payer = $(this).text();
    if (payer === "Sender") {
        $('#modal-payer').text("Receiver");
    } else {
        $('#modal-payer').text("Sender");
    }
    payerChanged = !payerChanged;
    if (payerChanged) {
        $('#modify-delivery').css('display', 'flex');
    } else if (!newDescription || newDescription.length === 0) {
        $('#modify-delivery').css('display', 'none');
    }
});

$('#modify-delivery').on('click', function () {
    let modifyNeeded = false;
    if (newDescription.length > 0) {
        deliveries[modifyInd].description = newDescription;
        modifyNeeded = true;
    }
    if (payerChanged) {
        modifyNeeded = true;
        if (deliveries[modifyInd].payer === "Sender") {
            deliveries[modifyInd].payer = "Receiver";
        } else {
            deliveries[modifyInd].payer = "Sender";
        }
    }
    if (!modifyNeeded) {
        return;
    }
    $('#delivery-info').modal('hide');
    serverInteract.modifyDelivery(deliveries[modifyInd], function (err) {
        if (err) {
            console.log(err.toString());
        }
        updateArchive();
    })
});

$('#delivery-info').on('hide.bs.modal', function () {
    updateArchive();
})

$('[data-toggle="tooltip"]').tooltip();

exports.initializeArchive = initializeArchive;
},{"../API":1,"./delTemp":15,"./deliveriesList":16}],15:[function(require,module,exports){

const ejs = require('ejs');

exports.deliveryItem = ejs.compile("<div class = 'del-list' id = 'item<%=numId%>'>\r\n    <span class = 'item-description' data-toggle=\"tooltip\" data-placement = 'bottom' title = \"<%=description%>\"><%=description%></span>\r\n    <div class = 'right-side'>\r\n        <div class = 'item-date' data-toggle=\"tooltip\" data-placement = 'bottom' title = \"<%=date%>\"><span><%=date%></span></div>\r\n        <div class = 'item-cost' data-toggle=\"tooltip\" data-placement = 'bottom' title = \"<%=cost%>₴\"><%=cost%>₴</div>\r\n    </div>\r\n    <br>\r\n    <span class = 'item-status' data-toggle=\"tooltip\" data-placement = 'bottom' title = \"<%=fullStatus%>\">Status: <%=status%></span>\r\n    <span class = 'item-dest' data-toggle=\"tooltip\" data-placement = 'bottom' title = \"<%=fullDestination%>\">Destination: <%=destination%></span>\r\n</div>");

exports.shopIitem = ejs.compile("<div class = 'col-sm-12 col-md-6 col-lg-4 col-xl-4 product-list mr-auto' id = '<%=product.id%>'>\r\n    <img src=\"<%=product.icon%>\" alt=\"\">\r\n    <p class = 'item-description'><%=product.description%></p>\r\n    <div class = 'right-side'>\r\n        <div class = 'item-date'><span><%=product.date%></span></div>\r\n        <p class = 'price'><%=product.cost%>₴</p>\r\n    </div>\r\n    <br>\r\n    <button class=\"addProductToCart\">Buy</button>\r\n</div>\r\n\r\n");

exports.cartItem = ejs.compile("<div id = 'item<%=product.product.id%>' class=\"productInCart\">\r\n    <img src=\"<%= product.product.icon%>\" alt=\"\" class=\"imageInCart\">\r\n    <br>\r\n    <span class = 'item-description'><%=product.product.description%></span>\r\n    <br>\r\n    <span class = 'item-cost'><%=product.product.cost%>₴</span>\r\n    <br>\r\n    <span class=\"product-quantity\">Quantity: <%= product.quantity%></span>\r\n    <br>\r\n    <button class=\"btn btn-danger\" id=\"removeFromCart\">Remove</button>\r\n</div>");
},{"ejs":19}],16:[function(require,module,exports){
function getDeliveries() {
    let deliveries = [
        {
            description: "Some description 0",
            date: "Date 0",
            cost: 100,
            status: "Status 0",
            destination: "Destination 0"
        },
        {
            description: "Some description 1",
            date: "Date 1",
            cost: 10,
            status: "some Status 1",
            destination: "Destination 1"
        },
        {
            description: "Some description 2",
            date: "Date 2",
            cost: 1,
            status: "some Status 2",
            destination: "some Destination 2"
        },
        {
            description: "Some description 3",
            date: "Date 3",
            cost: 200,
            status: "Status 3",
            destination: "Destination 3"
        },
        {
            description: "Some description 4",
            date: "Date 4",
            cost: 1,
            status: "Status 4",
            destination: "Destination 4"
        },
        {
            description: "Some description 5",
            date: "Date 5",
            cost: 200,
            status: "Status 5",
            destination: "Destination 5",
        }
    ];
    return deliveries;
}

exports.getDeliveries = getDeliveries;
},{}],17:[function(require,module,exports){
(function () {
	// Basil
	var Basil = function (options) {
		return Basil.utils.extend({}, Basil.plugins, new Basil.Storage().init(options));
	};

	// Version
	Basil.version = '0.4.11';

	// Utils
	Basil.utils = {
		extend: function () {
			var destination = typeof arguments[0] === 'object' ? arguments[0] : {};
			for (var i = 1; i < arguments.length; i++) {
				if (arguments[i] && typeof arguments[i] === 'object')
					for (var property in arguments[i])
						destination[property] = arguments[i][property];
			}
			return destination;
		},
		each: function (obj, fnIterator, context) {
			if (this.isArray(obj)) {
				for (var i = 0; i < obj.length; i++)
					if (fnIterator.call(context, obj[i], i) === false) return;
			} else if (obj) {
				for (var key in obj)
					if (fnIterator.call(context, obj[key], key) === false) return;
			}
		},
		tryEach: function (obj, fnIterator, fnError, context) {
			this.each(obj, function (value, key) {
				try {
					return fnIterator.call(context, value, key);
				} catch (error) {
					if (this.isFunction(fnError)) {
						try {
							fnError.call(context, value, key, error);
						} catch (error) {}
					}
				}
			}, this);
		},
		registerPlugin: function (methods) {
			Basil.plugins = this.extend(methods, Basil.plugins);
		},
		getTypeOf: function (obj) {
			if (typeof obj === 'undefined' || obj === null)
				return '' + obj;
			return Object.prototype.toString.call(obj).replace(/^\[object\s(.*)\]$/, function ($0, $1) { return $1.toLowerCase(); });
		}
	};

	// Add some isType methods: isArguments, isBoolean, isFunction, isString, isArray, isNumber, isDate, isRegExp, isUndefined, isNull.
	var types = ['Arguments', 'Boolean', 'Function', 'String', 'Array', 'Number', 'Date', 'RegExp', 'Undefined', 'Null'];
	for (var i = 0; i < types.length; i++) {
		Basil.utils['is' + types[i]] = (function (type) {
			return function (obj) {
				return Basil.utils.getTypeOf(obj) === type.toLowerCase();
			};
		})(types[i]);
	}

	// Plugins
	Basil.plugins = {};

	// Options
	Basil.options = Basil.utils.extend({
		namespace: 'b45i1',
		storages: ['local', 'cookie', 'session', 'memory'],
		expireDays: 365,
		keyDelimiter: '.'
	}, window.Basil ? window.Basil.options : {});

	// Storage
	Basil.Storage = function () {
		var _salt = 'b45i1' + (Math.random() + 1)
				.toString(36)
				.substring(7),
			_storages = {},
			_isValidKey = function (key) {
				var type = Basil.utils.getTypeOf(key);
				return (type === 'string' && key) || type === 'number' || type === 'boolean';
			},
			_toStoragesArray = function (storages) {
				if (Basil.utils.isArray(storages))
					return storages;
				return Basil.utils.isString(storages) ? [storages] : [];
			},
			_toStoredKey = function (namespace, path, delimiter) {
				var key = '';
				if (_isValidKey(path)) {
					key += path;
				} else if (Basil.utils.isArray(path)) {
					path = Basil.utils.isFunction(path.filter) ? path.filter(_isValidKey) : path;
					key = path.join(delimiter);
				}
				return key && _isValidKey(namespace) ? namespace + delimiter + key : key;
 			},
			_toKeyName = function (namespace, key, delimiter) {
				if (!_isValidKey(namespace))
					return key;
				return key.replace(new RegExp('^' + namespace + delimiter), '');
			},
			_toStoredValue = function (value) {
				return JSON.stringify(value);
			},
			_fromStoredValue = function (value) {
				return value ? JSON.parse(value) : null;
			};

		// HTML5 web storage interface
		var webStorageInterface = {
			engine: null,
			check: function () {
				try {
					window[this.engine].setItem(_salt, true);
					window[this.engine].removeItem(_salt);
				} catch (e) {
					return false;
				}
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				window[this.engine].setItem(key, value);
			},
			get: function (key) {
				return window[this.engine].getItem(key);
			},
			remove: function (key) {
				window[this.engine].removeItem(key);
			},
			reset: function (namespace) {
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0) {
						this.remove(key);
						i--;
					}
				}
			},
			keys: function (namespace, delimiter) {
				var keys = [];
				for (var i = 0, key; i < window[this.engine].length; i++) {
					key = window[this.engine].key(i);
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key, delimiter));
				}
				return keys;
			}
		};

		// local storage
		_storages.local = Basil.utils.extend({}, webStorageInterface, {
			engine: 'localStorage'
		});
		// session storage
		_storages.session = Basil.utils.extend({}, webStorageInterface, {
			engine: 'sessionStorage'
		});

		// memory storage
		_storages.memory = {
			_hash: {},
			check: function () {
				return true;
			},
			set: function (key, value, options) {
				if (!key)
					throw Error('invalid key');
				this._hash[key] = value;
			},
			get: function (key) {
				return this._hash[key] || null;
			},
			remove: function (key) {
				delete this._hash[key];
			},
			reset: function (namespace) {
				for (var key in this._hash) {
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace, delimiter) {
				var keys = [];
				for (var key in this._hash)
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key, delimiter));
				return keys;
			}
		};

		// cookie storage
		_storages.cookie = {
			check: function (options) {
				if (!navigator.cookieEnabled)
					return false;
				if (window.self !== window.top) {
					// we need to check third-party cookies;
					var cookie = 'thirdparty.check=' + Math.round(Math.random() * 1000);
					document.cookie = cookie + '; path=/';
					return document.cookie.indexOf(cookie) !== -1;
				}
				// if cookie secure activated, ensure it works (not the case if we are in http only)
				if (options && options.secure) {
					try {
						this.set(_salt, _salt, options);
						var hasSecurelyPersited = this.get(_salt) === _salt;
						this.remove(_salt);
						return hasSecurelyPersited;
					} catch (error) {
						return false;
					}
				}
				return true;
			},
			set: function (key, value, options) {
				if (!this.check())
					throw Error('cookies are disabled');
				options = options || {};
				if (!key)
					throw Error('invalid key');
				var cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
				// handle expiration days
				if (options.expireDays) {
					var date = new Date();
					date.setTime(date.getTime() + (options.expireDays * 24 * 60 * 60 * 1000));
					cookie += '; expires=' + date.toGMTString();
				}
				// handle domain
				if (options.domain && options.domain !== document.domain) {
					var _domain = options.domain.replace(/^\./, '');
					if (document.domain.indexOf(_domain) === -1 || _domain.split('.').length <= 1)
						throw Error('invalid domain');
					cookie += '; domain=' + options.domain;
				}
				// handle same site
				if (options.sameSite && ['lax','strict','none'].includes(options.sameSite.toLowerCase())) {
					cookie += '; SameSite=' + options.sameSite;
				}
				// handle secure
				if (options.secure === true) {
					cookie += '; Secure';
				}
				document.cookie = cookie + '; path=/';
			},
			get: function (key) {
				if (!this.check())
					throw Error('cookies are disabled');
				var encodedKey = encodeURIComponent(key);
				var cookies = document.cookie ? document.cookie.split(';') : [];
				// retrieve last updated cookie first
				for (var i = cookies.length - 1, cookie; i >= 0; i--) {
					cookie = cookies[i].replace(/^\s*/, '');
					if (cookie.indexOf(encodedKey + '=') === 0)
						return decodeURIComponent(cookie.substring(encodedKey.length + 1, cookie.length));
				}
				return null;
			},
			remove: function (key) {
				// remove cookie from main domain
				this.set(key, '', { expireDays: -1 });
				// remove cookie from upper domains
				var domainParts = document.domain.split('.');
				for (var i = domainParts.length; i > 1; i--) {
					this.set(key, '', { expireDays: -1, domain: '.' + domainParts.slice(- i).join('.') });
				}
			},
			reset: function (namespace) {
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = cookie.substr(0, cookie.indexOf('='));
					if (!namespace || key.indexOf(namespace) === 0)
						this.remove(key);
				}
			},
			keys: function (namespace, delimiter) {
				if (!this.check())
					throw Error('cookies are disabled');
				var keys = [],
					cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0, cookie, key; i < cookies.length; i++) {
					cookie = cookies[i].replace(/^\s*/, '');
					key = decodeURIComponent(cookie.substr(0, cookie.indexOf('=')));
					if (!namespace || key.indexOf(namespace) === 0)
						keys.push(_toKeyName(namespace, key, delimiter));
				}
				return keys;
			}
		};

		return {
			init: function (options) {
				this.setOptions(options);
				return this;
			},
			setOptions: function (options) {
				this.options = Basil.utils.extend({}, this.options || Basil.options, options);
			},
			support: function (storage) {
				return _storages.hasOwnProperty(storage);
			},
			check: function (storage) {
				if (this.support(storage))
					return _storages[storage].check(this.options);
				return false;
			},
			set: function (key, value, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key, options.keyDelimiter)))
					return false;
				value = options.raw === true ? value : _toStoredValue(value);
				var where = null;
				// try to set key/value in first available storage
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					_storages[storage].set(key, value, options);
					where = storage;
					return false; // break;
				}, null, this);
				if (!where) {
					// key has not been set anywhere
					return false;
				}
				// remove key from all other storages
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (storage !== where)
						_storages[storage].remove(key);
				}, null, this);
				return true;
			},
			get: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key, options.keyDelimiter)))
					return null;
				var value = null;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage, index) {
					if (value !== null)
						return false; // break if a value has already been found.
					value = _storages[storage].get(key, options) || null;
					value = options.raw === true ? value : _fromStoredValue(value);
				}, function (storage, index, error) {
					value = null;
				}, this);
				return value;
			},
			remove: function (key, options) {
				options = Basil.utils.extend({}, this.options, options);
				if (!(key = _toStoredKey(options.namespace, key, options.keyDelimiter)))
					return;
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].remove(key);
				}, null, this);
			},
			reset: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					_storages[storage].reset(options.namespace);
				}, null, this);
			},
			keys: function (options) {
				options = options || {};
				var keys = [];
				for (var key in this.keysMap(options))
					keys.push(key);
				return keys;
			},
			keysMap: function (options) {
				options = Basil.utils.extend({}, this.options, options);
				var map = {};
				Basil.utils.tryEach(_toStoragesArray(options.storages), function (storage) {
					Basil.utils.each(_storages[storage].keys(options.namespace, options.keyDelimiter), function (key) {
						map[key] = Basil.utils.isArray(map[key]) ? map[key] : [];
						map[key].push(storage);
					}, this);
				}, null, this);
				return map;
			}
		};
	};

	// Access to native storages, without namespace or basil value decoration
	Basil.memory = new Basil.Storage().init({ storages: 'memory', namespace: null, raw: true });
	Basil.cookie = new Basil.Storage().init({ storages: 'cookie', namespace: null, raw: true });
	Basil.localStorage = new Basil.Storage().init({ storages: 'local', namespace: null, raw: true });
	Basil.sessionStorage = new Basil.Storage().init({ storages: 'session', namespace: null, raw: true });

	// browser export
	window.Basil = Basil;

	// AMD export
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return Basil;
		});
	// commonjs export
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = Basil;
	}

})();

},{}],18:[function(require,module,exports){

},{}],19:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

'use strict';

/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var scopeOptionWarned = false;
/** @type {string} */
var _VERSION_STRING = require('../package.json').version;
var _DEFAULT_OPEN_DELIMITER = '<';
var _DEFAULT_CLOSE_DELIMITER = '>';
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS_PASSABLE_WITH_DATA = ['delimiter', 'scope', 'context', 'debug', 'compileDebug',
  'client', '_with', 'rmWhitespace', 'strict', 'filename', 'async'];
// We don't allow 'cache' option to be passed in the data obj for
// the normal `render` call, but this is where Express 2 & 3 put it
// so we make an exception for `renderFile`
var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Promise implementation -- defaults to the native implementation if available
 * This is mostly just for testability
 *
 * @type {PromiseConstructorLike}
 * @public
 */

exports.promiseImpl = (new Function('return this;'))().Promise;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} [isDir=false] whether the parent file path is a directory
 * @return {String}
 */
exports.resolveInclude = function(name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Try to resolve file path on multiple directories
 *
 * @param  {String}        name  specified path
 * @param  {Array<String>} paths list of possible parent directory paths
 * @return {String}
 */
function resolvePaths(name, paths) {
  var filePath;
  if (paths.some(function (v) {
    filePath = exports.resolveInclude(name, v, true);
    return fs.existsSync(filePath);
  })) {
    return filePath;
  }
}

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options) {
  var includePath;
  var filePath;
  var views = options.views;
  var match = /^[A-Za-z]+:\\|^\//.exec(path);

  // Abs path
  if (match && match.length) {
    path = path.replace(/^\/*/, '');
    if (Array.isArray(options.root)) {
      includePath = resolvePaths(path, options.root);
    } else {
      includePath = exports.resolveInclude(path, options.root || '/', true);
    }
  }
  // Relative paths
  else {
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = exports.resolveInclude(path, options.filename);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look in any views directories
    if (!includePath && Array.isArray(views)) {
      includePath = resolvePaths(path, views);
    }
    if (!includePath && typeof options.includer !== 'function') {
      throw new Error('Could not find the include file "' +
          options.escapeFunction(path) + '"');
    }
  }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  if (!cb) {
    if (typeof exports.promiseImpl == 'function') {
      return new exports.promiseImpl(function (resolve, reject) {
        try {
          result = handleCache(options)(data);
          resolve(result);
        }
        catch (err) {
          reject(err);
        }
      });
    }
    else {
      throw new Error('Please provide a callback function');
    }
  }
  else {
    try {
      result = handleCache(options)(data);
    }
    catch (err) {
      return cb(err);
    }

    cb(null, result);
  }
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath){
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  if (typeof options.includer === 'function') {
    var includerResult = options.includer(path, opts.filename);
    if (includerResult) {
      if (includerResult.filename) {
        opts.filename = includerResult.filename;
      }
      if (includerResult.template) {
        return handleCache(opts, includerResult.template);
      }
    }
  }
  return handleCache(opts);
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements {RethrowCallback}
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} flnm     file name of the EJS file
 * @param {Number} lineno   line number of the error
 * @param {EscapeCallback} esc
 * @static
 */

function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

function stripSemi(str){
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} [opts] compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * Note that the return type of the function also depends on the value of `opts.async`.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {(String|Promise<String>)}
 * Return value type depends on `opts.async`.
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var args = Array.prototype.slice.call(arguments);
  var filename = args.shift();
  var cb;
  var opts = {filename: filename};
  var data;
  var viewOpts;

  // Do we have a callback?
  if (typeof arguments[arguments.length - 1] == 'function') {
    cb = args.pop();
  }
  // Do we have data/opts?
  if (args.length) {
    // Should always have data obj
    data = args.shift();
    // Normal passed opts (data obj + opts obj)
    if (args.length) {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, args.pop());
    }
    // Special casing for Express (settings + opts-in-data)
    else {
      // Express 3 and 4
      if (data.settings) {
        // Pull a few things from known locations
        if (data.settings.views) {
          opts.views = data.settings.views;
        }
        if (data.settings['view cache']) {
          opts.cache = true;
        }
        // Undocumented after Express 2, but still usable, esp. for
        // items that are unsafe to be passed along with data, like `root`
        viewOpts = data.settings['view options'];
        if (viewOpts) {
          utils.shallowCopy(opts, viewOpts);
        }
      }
      // Express 2 and lower, values set in app.locals, or people who just
      // want to pass options in their data. NOTE: These values will override
      // anything previously set in settings  or settings['view options']
      utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
    }
    opts.filename = filename;
  }
  else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

/**
 * EJS template class
 * @public
 */
exports.Template = Template;

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  /** @type {string | null} */
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
  options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.includer = opts.includer;
  options.outputFunctionName = opts.outputFunctionName;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
  options.views = opts.views;
  options.async = opts.async;
  options.destructuredLocals = opts.destructuredLocals;
  options.legacyInclude = typeof opts.legacyInclude != 'undefined' ? !!opts.legacyInclude : true;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    var open = utils.escapeRegExpChars(this.opts.openDelimiter);
    var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
    str = str.replace(/%/g, delim)
      .replace(/</g, open)
      .replace(/>/g, close);
    return new RegExp(str);
  },

  compile: function () {
    /** @type {string} */
    var src;
    /** @type {ClientFunction} */
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    /** @type {EscapeCallback} */
    var escapeFn = opts.escapeFunction;
    /** @type {FunctionConstructor} */
    var ctor;
    /** @type {string} */
    var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : 'undefined';

    if (!this.source) {
      this.generateSource();
      prepended +=
        '  var __output = "";\n' +
        '  function __append(s) { if (s !== undefined && s !== null) __output += s }\n';
      if (opts.outputFunctionName) {
        prepended += '  var ' + opts.outputFunctionName + ' = __append;' + '\n';
      }
      if (opts.destructuredLocals && opts.destructuredLocals.length) {
        var destructuring = '  var __locals = (' + opts.localsName + ' || {}),\n';
        for (var i = 0; i < opts.destructuredLocals.length; i++) {
          var name = opts.destructuredLocals[i];
          if (i > 0) {
            destructuring += ',\n  ';
          }
          destructuring += name + ' = __locals.' + name;
        }
        prepended += destructuring + ';\n';
      }
      if (opts._with !== false) {
        prepended +=  '  with (' + opts.localsName + ' || {}) {' + '\n';
        appended += '  }' + '\n';
      }
      appended += '  return __output;' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
        + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
        + '  , __filename = ' + sanitizedFilename + ';' + '\n'
        + 'try {' + '\n'
        + this.source
        + '} catch (e) {' + '\n'
        + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
        + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }
    if (opts.debug) {
      console.log(src);
    }
    if (opts.compileDebug && opts.filename) {
      src = src + '\n'
        + '//# sourceURL=' + sanitizedFilename + '\n';
    }

    try {
      if (opts.async) {
        // Have to use generated function for this, since in envs without support,
        // it breaks in parsing
        try {
          ctor = (new Function('return (async function(){}).constructor;'))();
        }
        catch(e) {
          if (e instanceof SyntaxError) {
            throw new Error('This environment does not support async/await');
          }
          else {
            throw e;
          }
        }
      }
      else {
        ctor = Function;
      }
      fn = new ctor(opts.localsName + ', escapeFn, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
        if (!opts.async) {
          e.message += '\n';
          e.message += 'Or, if you meant to create an async function, pass `async: true` as an option.';
        }
      }
      throw e;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = opts.client ? fn : function anonymous(data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    if (opts.filename && typeof Object.defineProperty === 'function') {
      var filename = opts.filename;
      var basename = path.basename(filename, path.extname(filename));
      try {
        Object.defineProperty(returnedFn, 'name', {
          value: basename,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (e) {/* ignore */}
    }
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r` and empty lines don't work well with the `m` flag.
      this.templateText =
        this.templateText.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var closing;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with openDelimiter + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf(o + d) === 0        // If it is a tag
          && line.indexOf(o + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + c || closing == '-' + d + c || closing == '_' + d + c)) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        self.scanLine(line);
      });
    }

  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  _addOutput: function (line) {
    if (this.truncate) {
      // Only replace single leading linebreak in the line after
      // -%> tag -- this is the single, trailing linebreak
      // after the tag that the truncation mode replaces
      // Handle Win / Unix / old Mac linebreaks -- do the \r\n
      // combo first in the regex-or
      line = line.replace(/^(?:\r\n|\r|\n)/, '');
      this.truncate = false;
    }
    if (!line) {
      return line;
    }

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    this.source += '    ; __append("' + line + '")' + '\n';
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;
    var newLineCount = 0;

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
    case o + d:
    case o + d + '_':
      this.mode = Template.modes.EVAL;
      break;
    case o + d + '=':
      this.mode = Template.modes.ESCAPED;
      break;
    case o + d + '-':
      this.mode = Template.modes.RAW;
      break;
    case o + d + '#':
      this.mode = Template.modes.COMMENT;
      break;
    case o + d + d:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + '\n';
      break;
    case d + d + c:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + '\n';
      break;
    case d + c:
    case '-' + d + c:
    case '_' + d + c:
      if (this.mode == Template.modes.LITERAL) {
        this._addOutput(line);
      }

      this.mode = null;
      this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
      break;
    default:
      // In script mode, depends on type of tag
      if (this.mode) {
        // If '//' is found without a line break, add a line break.
        switch (this.mode) {
        case Template.modes.EVAL:
        case Template.modes.ESCAPED:
        case Template.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
            line += '\n';
          }
        }
        switch (this.mode) {
        // Just executing code
        case Template.modes.EVAL:
          this.source += '    ; ' + line + '\n';
          break;
          // Exec, esc, and output
        case Template.modes.ESCAPED:
          this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
          break;
          // Exec and output
        case Template.modes.RAW:
          this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
          break;
        case Template.modes.COMMENT:
          // Do nothing
          break;
          // Literal <%% mode, append as raw output
        case Template.modes.LITERAL:
          this._addOutput(line);
          break;
        }
      }
      // In string mode, just add the output
      else {
        this._addOutput(line);
      }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}

},{"../package.json":21,"./utils":20,"fs":18,"path":22}],20:[function(require,module,exports){
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */

'use strict';

var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, '\\$&');
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements {Cache}
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  remove: function (key) {
    delete this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};

/**
 * Transforms hyphen case variable into camel case.
 *
 * @param {String} string Hyphen case string
 * @return {String} Camel case string
 * @static
 * @private
 */
exports.hyphenToCamel = function (str) {
  return str.replace(/-[a-z]/g, function (match) { return match[1].toUpperCase(); });
};

},{}],21:[function(require,module,exports){
module.exports={
  "_from": "ejs@^3.1.6",
  "_id": "ejs@3.1.6",
  "_inBundle": false,
  "_integrity": "sha512-9lt9Zse4hPucPkoP7FHDF0LQAlGyF9JVpnClFLFH3aSSbxmyoqINRpp/9wePWJTUl4KOQwRL72Iw3InHPDkoGw==",
  "_location": "/ejs",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "ejs@^3.1.6",
    "name": "ejs",
    "escapedName": "ejs",
    "rawSpec": "^3.1.6",
    "saveSpec": null,
    "fetchSpec": "^3.1.6"
  },
  "_requiredBy": [
    "#USER",
    "/"
  ],
  "_resolved": "https://registry.npmjs.org/ejs/-/ejs-3.1.6.tgz",
  "_shasum": "5bfd0a0689743bb5268b3550cceeebbc1702822a",
  "_spec": "ejs@^3.1.6",
  "_where": "C:\\Users\\liubo\\WebstormProjects\\Git\\final-proj",
  "author": {
    "name": "Matthew Eernisse",
    "email": "mde@fleegix.org",
    "url": "http://fleegix.org"
  },
  "bin": {
    "ejs": "bin/cli.js"
  },
  "bugs": {
    "url": "https://github.com/mde/ejs/issues"
  },
  "bundleDependencies": false,
  "dependencies": {
    "jake": "^10.6.1"
  },
  "deprecated": false,
  "description": "Embedded JavaScript templates",
  "devDependencies": {
    "browserify": "^16.5.1",
    "eslint": "^6.8.0",
    "git-directory-deploy": "^1.5.1",
    "jsdoc": "^3.6.4",
    "lru-cache": "^4.0.1",
    "mocha": "^7.1.1",
    "uglify-js": "^3.3.16"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "homepage": "https://github.com/mde/ejs",
  "jsdelivr": "ejs.min.js",
  "keywords": [
    "template",
    "engine",
    "ejs"
  ],
  "license": "Apache-2.0",
  "main": "./lib/ejs.js",
  "name": "ejs",
  "repository": {
    "type": "git",
    "url": "git://github.com/mde/ejs.git"
  },
  "scripts": {
    "test": "mocha"
  },
  "unpkg": "ejs.min.js",
  "version": "3.1.6"
}

},{}],22:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":23}],23:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[4]);
