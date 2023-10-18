function getSetsOfQuestions(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function createSetCard(name, description, id) {
    // Create the card structure using jQuery
    const card = $('<div class="col-md-3 my-2">')
        .append($('<div class="card-sl">')
            .append($('<div class="card-image">')
                .append('<img src="https://altc.alt.ac.uk/blog/wp-content/uploads/sites/1112/2022/08/Blog-Cover-Guidlines-707x409.png">')
            )
            .append('<a class="card-action"><i class="fa fa-heart"></i></a>')
            .append($('<div class="card-heading set-title">').text(name))
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
            createSetCard(set.name, set.description, set.id);
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

    $finishButton.on('click', function () {
        // Handle finish/submit action here
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

          let successBanner = $('<div class="alert alert-success" role="alert">Quiz added successfully! You can now <a href="/new-question">Add some questions</a></div>');
          $("form").before(successBanner);
        })
        .catch((error) => {
          console.error(error);
        });
    });
}


export {handleSetsOfQuestions, quizFlow, addNewQuiz};