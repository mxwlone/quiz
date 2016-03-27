/**
 * Created by max on 26/03/16.
 */
"use strict";

$(document).ready(function() {
    $('#login').click(auth);
    $('#signup').click(register);
});

function register() {
    location.replace("register.html");
}

function auth() {
    var email = $('#email').val();
    var password = $('#password').val();

    var users;
    $.getJSON("json/users.json", function(json) {
        console.log(json);
        for (var user in json.users) {
            if(email === json.users[user]["email"] && password == json.users[user]["password"]) {
                console.log(email + " authenticated.")
                return login(json.users[user])
            }
        }

        $('.status-login').html("Login failed.");
    });
}

function login(user) {
    console.log("Login with object");
    console.log(user);
    sessionStorage.user = user.firstname + " " + user.lastname;
    sessionStorage.email = user.email;

    location.replace("index.html")
}