/**
 * Created by maxwel on 2/27/2016.
 */

var current = 0;
var correct = 0;

document.addEventListener("DOMContentLoaded", function(event) {
    current = 0;
    update(current);
    $('#button-back').hide();
    $('#status').html('&nbsp;');
});

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
            btn_next.remove();
        }
    }

    if(current == 0) {
        btn_back.hide();
    } else {
        btn_back.show();
    }
}

function showResults() {
    $('#answers').html('&nbsp;');
    $('#question').text('');
    $('#status').text('');
    $('#button-next').hide();
    $('#message').text('Congratulations, you finished the QIUZ!');
}

function submit() {
    if ($('input[name=answer]:checked').length == 0) {
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
            $('#status').html('&nbsp;');
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
            $('#button-next').show();
            $('#status').html('&nbsp;');
            $('#message').text('');
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
    answersDiv.find(':radio[value!='+correctAnswerValue+']').closest('div').find('label').addClass('wrong');
    answersDiv.find(':radio[value='+correctAnswerValue+']').closest('div').find('label').addClass('right');

    if (isCorrectAnswer) {
        correct++;
        var correctAnswersDiv = document.getElementById("correctAnswers");
        correctAnswersDiv.innerHTML = correct;
        $('#status').text('Correct!');
    } else {
        $('#status').text('Wrong!');
    }

    allQuestions[current]["selectedAnswer"] = parseInt(answerInput.val());
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
    answerDiv.innerHTML = null;
    for (var i in data["choices"]) {
        var isOld = data["selectedAnswer"] != null;
        var div = document.createElement("div");
        var input = document.createElement("input");
        input.id = 'radio_'+i;
        input.type = "radio";
        input.name = "answer";
        input.value = i;
        var label = document.createElement("label");
        label.setAttribute('for', 'radio_'+i);
        label.innerHTML = data["choices"][i];

        if (isOld) {
            input.disabled = true;
            if (data["selectedAnswer"] == i) {
                label.setAttribute('class', 'right');
                input.checked = true;
            } else {
                label.setAttribute('class', 'wrong');
            }
        }
        div.appendChild(input);
        div.appendChild(label);
        answerDiv.appendChild(div);
    }
}