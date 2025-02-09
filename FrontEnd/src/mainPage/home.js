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