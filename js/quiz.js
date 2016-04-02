/**
 * Created by maxwel on 2/27/2016.
 */

var current = 0;
var correct = 0;
var allQuestions = null;

document.addEventListener("DOMContentLoaded", function(event) {
    var cookie = getCookieFunc('user');
    if (cookie) {
        console.log('Cookie found: ' + cookie);
        var email = cookie.split(',')[0];
        var username = cookie.split(',')[1];

        sessionStorage.email = email;
        sessionStorage.user = username;
    } else {
        console.log("No cookie found.");

        if (!sessionStorage.user && !sessionStorage.email) {
            console.log("No session data found, redirect to login.");
            location.replace("login.html");
            return false;
        }
    }

    $('#status').html('&nbsp;');
    $('#userName').html(sessionStorage.user);
    $('#btn_logout').click(logout);

    current = 0;
    $.getJSON("json/questions.json", function(json) {
        allQuestions = json;
        update(current);
    });
});

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

function logout() {
    sessionStorage.clear();
    var cookie = getCookieFunc('user');
    if (cookie != "") {
        console.log("Cookie found: " + cookie);
        console.log("Delete cookie.");

        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

    location.replace("login.html");
    return false;
}

function toggle_btns(next) {
    var btn_next = $('#button-next');
    var btn_back = $('#button-back');

    if (next == 'submit' && allQuestions[current]["selectedAnswer"] == null) {
        btn_next.attr('onclick', "submit()");
        btn_next.text('Submit');
    } else if (next == 'next') {
        if (current < allQuestions.length) {
            btn_next.attr('onclick', "next()");
            btn_next.text('Next');
        } else {
            btn_next.removeAttr('onclick');
            btn_next.addClass('disabled');
        }
    }

    if(current == 0) {
        btn_back.addClass('disabled');
    } else {
        if (btn_back.hasClass('disabled')) {
            btn_back.removeClass('disabled');
        }
    }
}

function showResults() {
    toggle_btns('next');
    $('#answers').html('&nbsp;');
    $('#question').text('Congratulations, you finished the QIUZ!');
    $('#status').text('');
}

function submit() {
    if ($('input[name=answer]:checked').length == 0) {
        var statusDiv = $('#status');
        if (statusDiv.hasClass('green-text')) {
            statusDiv.removeClass('green-text');
        } else if (statusDiv.hasClass('red-text')) {
            statusDiv.removeClass('red-text');
        }
        $('#status').text('Please select one of the options.');
        return;
    }
    checkAnswer();
    toggle_btns('next');
}

function next() {
    if (current + 1 < allQuestions.length) {
        $('#fade_area').fadeToggle('fast', function() {
            update(++current);
            toggle_btns('submit');
            $('#fade_area').fadeToggle('fast');
        });
    } else {
        $('#fade_area').fadeToggle('fast', function() {
            ++current;
            showResults();
        });
    }
}
function back() {
    if (current - 1 >= 0) {
        $('#fade_area').fadeOut('fast', function() {
            update(--current);
            if ($('#button-next').hasClass('disabled'))
                $('#button-next').removeClass('disabled');
            toggle_btns('next');
            $('#fade_area').fadeIn('fast');
        });
    }
}

function checkAnswer() {
    var answerInput = $('input[name=answer]:checked');
    var correctAnswerValue = allQuestions[current]["correctAnswer"];
    var isCorrectAnswer = answerInput.val() == correctAnswerValue;

    var answersDiv = $('#answers');
    answersDiv.find(':radio').prop('disabled', true);
    answersDiv.find(':radio[value!='+correctAnswerValue+']').closest('div').find('label').addClass('wrong-answer');
    answersDiv.find(':radio[value='+correctAnswerValue+']').closest('div').find('label').addClass('right-answer');

    var statusDiv = $('#status');

    if (isCorrectAnswer) {
        correct++;
        var correctAnswersDiv = document.getElementById("correctAnswers");
        correctAnswersDiv.innerHTML = correct;
        statusDiv.text('Correct!');
        statusDiv.addClass('green-text');
        if (statusDiv.hasClass('red-text'))
            statusDiv.removeClass('red-text');
    } else {
        statusDiv.text('Wrong!');
        statusDiv.addClass('red-text');
        if (statusDiv.hasClass('green-text'))
            statusDiv.removeClass('green-text');
    }

    allQuestions[current]["status"] = $('#status-wrapper').html();
    allQuestions[current]["selectedAnswer"] = parseInt(answerInput.val());
    statusDiv.hide();
    statusDiv.fadeIn('slow');
    console.log(allQuestions[current]);
}

function update() {
    var data = allQuestions[current];
    var questionDiv = document.getElementById("question");
    var answerDiv = document.getElementById("answers");
    var currentQuestionDiv = document.getElementById("currentQuestion");
    var correctAnswersDiv = document.getElementById("correctAnswers");
    correctAnswersDiv.innerHTML = correct;

    currentQuestionDiv.innerHTML = current+1 + "/" + allQuestions.length;
    questionDiv.innerHTML = data["question"];

    var isOld = data["selectedAnswer"] != null;
    if (isOld) {
        $('#status-wrapper').html(data['status']);
    } else {
        $('#status').html('&nbsp');
    }

    answerDiv.innerHTML = null;
    for (var i in data["choices"]) {
        var div = document.createElement("div");
        var input = document.createElement("input");
        input.id = 'radio_'+i;
        input.type = "radio";
        input.name = "answer";
        input.value = i;
        input.className = "with-gap";
        var label = document.createElement("label");
        label.setAttribute('for', 'radio_'+i);
        label.innerHTML = data["choices"][i];

        if (isOld) {
            input.disabled = true;
            if (data["selectedAnswer"] == i) {
                label.setAttribute('class', 'right-answer');
                input.checked = true;
            } else {
                label.setAttribute('class', 'wrong-answer');
            }
        }
        div.appendChild(input);
        div.appendChild(label);
        answerDiv.appendChild(div);
    }



}