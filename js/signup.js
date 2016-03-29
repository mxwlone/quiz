/**
 * Created by max on 27/03/16.
 */
$(document).ready(function () {
    $('#back_to_login').click(function() {
        location.replace('login.html');
    });
    $('#submit_registration').click(signup);
    $('#clear_users').click(function() {
        localStorage.removeItem("users");
        console.log("Cleared userlist from local storage.");
    });
    $('#show_users').click(function() {
       console.log((localStorage.users));
    });
});

function signup() {
    // get form fields
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();
    var birthdate = $('#birthdate').val();
    var password = $('#password').val();
    var passwordConfirm = $('#passwordConfirm').val();

    // check password
    if (password != passwordConfirm) {
        $('.status-text').html("Password confirmation failed.");
        return;
    } else if (password === "") {
        $('.status-text').html("Please enter a password.");
        return;
    } else {
        $('.status-text').html("");
    }

    // get json user file
    var users = JSON.parse(localStorage.users);
    if (users) {
        for (var user in users) {
            if(email === users[user]["email"]) {
                $('.status-text').html(email + " already registered.");
                return;
            }
        }

        // create new user json object
        var jsonUser = {};
        jsonUser['firstname'] = firstname;
        jsonUser['lastname'] = lastname;
        jsonUser['email'] = email;
        jsonUser['birthdate'] = birthdate;
        jsonUser['password'] = password;

        users.push(jsonUser);
        localStorage.users = JSON.stringify(users);

        location.replace("login.html?msg=User created. You can log in with " + email);
        return false;

        //console.log(JSON.parse(localStorage.users));
    }
}