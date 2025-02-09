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
