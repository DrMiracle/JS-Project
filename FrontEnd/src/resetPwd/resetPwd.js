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