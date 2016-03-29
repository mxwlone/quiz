/**
 * Created by max on 26/03/16.
 */
"use strict";

$(document).ready(function() {
    $('#login').click(auth);
    $('#signup').click(register);

    $.getJSON("json/users.json", function(json) {
        if (!localStorage.users) {
            localStorage.users = JSON.stringify(json.users);
            console.log('Local storage for users created.')
        }
    });

    var params = window.location.search.substr(1);
    if (params) {
        if (params.split('=')[0] === 'msg') {
            $('.status-text').html(decodeURIComponent(params.split('=')[1]));
        }
    }
});

function register() {
    location.replace("signup.html");
    return false;
}

function auth() {
    var email = $('#email').val();
    var password = $('#password').val();
    var cookie = $('#remember-box').is(':checked');

    $.getJSON("json/users.json", function(json) {
        //console.log(json);
        var users;
        if (!localStorage.users) {
            localStorage.users = JSON.stringify(json.users);
            console.log("creating local storage (users)");
            users = json.users;
        } else {
            users = JSON.parse(localStorage.users);
        }

        //console.log(JSON.stringify(users));
        for (var user in users) {
            if(email === users[user]["email"] && password == users[user]["password"]) {
                console.log(email + " authenticated.");
                return login(users[user]);
            }
        }

        $('.status-text').html("Login failed.");
    });

}

function login(user) {
    console.log("Login with object:");
    console.log(user);
    sessionStorage.user = user.firstname + " " + user.lastname;
    sessionStorage.email = user.email;

    location.replace("index.html");
    return false;
}