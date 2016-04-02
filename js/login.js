/**
 * Created by max on 26/03/16.
 */
"use strict";

$(document).ready(function() {
    $.getJSON("json/users.json", function(json) {
        if (!localStorage.users) {
            localStorage.users = JSON.stringify(json.users);
            console.log('Local storage for users created.')
        }
    });

    // set button functions
    $('#login').click(auth);
    $('#signup').click(register);

    // get status message
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

function getCookieFunc(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookieFunc(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function auth() {
    var email = $('#email').val();
    var password = $('#password').val();
    var setCookie = $('#remember-box').is(':checked');

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
                return login(users[user], setCookie);
            }
        }

        $('.status-text').html("Login failed.");
    });

}

function login(user, setCookie) {
    console.log("Login with object:");
    console.log(user);
    sessionStorage.user = user.firstname + " " + user.lastname;
    sessionStorage.email = user.email;

    console.log("Set cookie? " + setCookieFunc);
    if(setCookie) {
        setCookieFunc('user', user.email + "," + user.firstname + " " + user.lastname, 365);
    }

    location.replace("index.html");
    return false;
}