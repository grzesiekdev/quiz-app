function getSetsOfQuestions(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function createSetCard(name, description, id, numberOfQuestions) {
    // Create the card structure using jQuery
    const card = $('<div class="col-md-3 my-2" data-quiz-id="' + id + '">')
        .append($('<div class="card-sl">')
            .append($('<div class="card-image">')
                .append('<img src="https://altc.alt.ac.uk/blog/wp-content/uploads/sites/1112/2022/08/Blog-Cover-Guidlines-707x409.png">')
            )
            .append($('<a class="card-action"><i class="fa fa-times"></i></a>'))
            .append($('<div class="card-heading set-title">').html(name + '<a class="mx-1 copy-link" href="' + window.location.href + 'set-of-questions/' + id + '" title="Click to copy link to this quiz and share it with friends!"><i class="fa-solid fa-share"></i></a>'))
            .append($('<div class="card-text set-number-of-questions" style="font-size:12px;">').text("Number of questions: " + numberOfQuestions))
            .append($('<div class="card-text set-description">').text(description))
            .append('<div class="card-text set-date"><!-- TODO: Date will be here... --></div>')
            .append('<a href="/set-of-questions/' + id + '" class="card-button">Take the quiz</a>')
        );

    // Append the card to the parent container
    $('.list-of-quizes').append(card);
}

function handleSetsOfQuestions(){
getSetsOfQuestions('/sets-of-questions/')
    .then(data => {
        data.forEach(set => {
            let numberOfQuestions = set.questions.length;
            createSetCard(set.name, set.description, set.id, numberOfQuestions);
              $(".copy-link").on("click", function (e) {
              e.preventDefault();
              navigator.clipboard.writeText($('.copy-link').attr('href')).then(() => {
                  console.log("Link copied succesfully!");
                  $(".alert.alert-success").remove();
                    let successBanner = $('<div class="alert alert-success" role="alert">Link copied succesfully!</div>');
                    $(".list-of-quizes").before(successBanner);
                    setTimeout(function() {
                      successBanner.remove();
                    }, 5000);
                }, () => {
                  console.log("Couldn't copy link");
                });
          });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function quizFlow(){
    let currentQuestionIndex = 0;
    const $questionContainers = $('.question');
    const $nextButton = $('.next-question-button');
    const $finishButton = $('.finish-button');

    function showQuestion(index) {
        $questionContainers.attr('hidden', true);
        $questionContainers.eq(index).removeAttr('hidden');

        if (index === 0) {
            $('.previous-question-button').attr('hidden', true);
        } else {
            $('.previous-question-button').removeAttr('hidden');
        }

        if (index === $questionContainers.length - 1) {
            $nextButton.hide();
            $finishButton.removeAttr('hidden');
        } else {
            $nextButton.show();
            $finishButton.attr('hidden', true);
        }
    }

    showQuestion(currentQuestionIndex);

    $nextButton.on('click', function () {
        if (currentQuestionIndex < $questionContainers.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        }
    });

    $('.previous-question-button').on('click', function () {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
        }
    });
}

function addNewQuiz() {
    $(".new-quiz-form").submit(function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Get the form data
      var quizName = $("#quizName").val();
      var quizDescription = $("#quizDescription").val();

      // Prepare the data to send
      var data = {
        'name': quizName,
        'description': quizDescription,
      };

      // Make a POST request to the FastAPI endpoint
      fetch("/set-of-questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to submit the form");
          }
        })
        .then((data) => {
          // Handle the response from the server
          console.log("Server response:", data);

          $("#quizName").val("");
          $("#quizDescription").val("");
          $(".alert.alert-success").remove();
          let successBanner = $('<div class="alert alert-success" role="alert">Quiz added successfully! You can now <a href="/new-question">Add some questions</a></div>');
          $("form").before(successBanner);
        })
        .catch((error) => {
          console.error(error);
        });
    });
}

function editQuiz() {
    $(".edit-quiz-form").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the form data
        var quizName = $("#quizName").val();
        var quizDescription = $("#quizDescription").val();
        var setId = $("#setId").val(); // Add a hidden input field for the set_id in your HTML

        // Prepare the data to send
        var data = {
            'name': quizName,
            'description': quizDescription,
        };

        // Make a PUT request to the FastAPI endpoint
        fetch(`/set-of-questions/${setId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to submit the form");
            }
        })
        .then((data) => {
            // Handle the response from the server
            console.log("Server response:", data);
            $(".alert.alert-success").remove();
            let successBanner = $('<div class="alert alert-success" role="alert">Quiz edited successfully! <a href="/set-of-questions/'+data.id+'">Take a look</a></div>');
            $("form").before(successBanner);
        })
        .catch((error) => {
            console.error(error);
        });
    });
}

function initializeCardDelete() {
    $('.list-of-quizes').on('click', '.card-action', function(event) {
        event.preventDefault();

        const card = $(this).closest('.col-md-3.my-2');
        const setId = card.data('quiz-id');

        $.ajax({
            url: `/set-of-questions/${setId}`,
            type: 'DELETE',
            success: function(data) {
                $(".alert.alert-success").remove();
                let successBanner = $('<div class="alert alert-success" role="alert">Quiz deleted successfully!</div>');
                $(".list-of-quizes").before(successBanner);
                card.remove();
            },
            error: function(xhr, textStatus, error) {
                console.log('Error deleting set of questions:', error);
            }
        });
    });
}

function collectAndSendAnswers() {
  // Store the user's answers in an object
  var userAnswers = {};

  // When the "Finish" button is clicked
  $(".finish-button a").on("click", function (e) {
    e.preventDefault();

    // Loop through each question to collect answers
    $(".question").each(function (index) {
      var questionNumber = $(this).data('question-id');

      // Check if it's a radio button or checkbox question
      var inputType = $(this).find("input[type=radio], input[type=checkbox]").attr("type");

      // Collect the selected options for the question
      var selectedOptions = [];
      $(this).find("input:checked").each(function () {
        selectedOptions.push($(this).parent().text().trim());
      });

      // Store the selected options in the userAnswers object
      userAnswers[questionNumber] = selectedOptions;
    });
  const setOfQuestions = $('.quiz-name').data('quiz-id');
    // Convert the userAnswers object to a JSON string
      let answersJSON = JSON.stringify(userAnswers);
        window.location.href = "/test-results/" + setOfQuestions+"?answers=" + encodeURIComponent(answersJSON);
  });
}

function extractAnswersFromURL() {
  // Extract the answers from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const answersJSON = urlParams.get("answers");

  if (answersJSON) {
    const answers = JSON.parse(decodeURIComponent(answersJSON));

const userAnswers = {};

// Transform the provided answers into the expected format
for (const questionNumber in answers) {
  userAnswers[questionNumber] = answers[questionNumber];
}
    const testResult = {
      user_answers: userAnswers,
    };
    console.log(testResult);
    // Send the answers to the server
    $.ajax({
      type: "POST",
      url: "/submit-test/",
      data: JSON.stringify(testResult),
      contentType: "application/json",
      success: function (response) {
        // Display the score on the page
        const score = response.score;
        const numberOfQuestions = response.numberOfQuestions;
        $(".score-placeholder").text("Your Score: " + score + '/' + numberOfQuestions);
          $(".share-results").on("click", function (e) {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.href).then(() => {
                  console.log("Link copied succesfully!");
                  $(".alert.alert-success").remove();
                    let successBanner = $('<div class="alert alert-success" role="alert">Link copied succesfully!</div>');
                    $("#score").before(successBanner);
                    setTimeout(function() {
                      successBanner.remove();
                    }, 5000);
                }, () => {
                  console.log("Couldn't copy link");
                });
          });

        $.each(userAnswers, function (questionId, selectedAnswers) {
            let questionElement = $('[data-question-id="' + questionId + '"]');

            $.each(selectedAnswers, function (_, selectedAnswer) {
                let labelElement = questionElement.find('label:contains("' + selectedAnswer + '")');
                console.log(selectedAnswer);

                        var inputElement = labelElement.find(':input');
            inputElement.attr('checked', 'true');
            });
        });
      },
      error: function (xhr, textStatus, error) {
        console.log('Error when submitting quiz:', xhr.responseText);
      }
    });
  }
}

export {handleSetsOfQuestions, quizFlow, addNewQuiz, initializeCardDelete, editQuiz, collectAndSendAnswers, extractAnswersFromURL};