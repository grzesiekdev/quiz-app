function createNewAnswer() {
    $(".add-answer").click(function () {
      var answerField = `
        <div class="input-group mb-3 answer-field">
          <div class="input-group-append mx-2">
            <div class="input-group-text">
              <input type="checkbox" class="correct-answer-checkbox" title="Mark as correct">
            </div>
          </div>
          <div class="col-lg-6">
            <input type="text" class="form-control answer-input" placeholder="Enter answer text">
          </div>
          <div class="mx-2">
            <button class="btn btn-outline-secondary remove-answer" type="button">Remove</button>
          </div>
        </div>
      `;
      $("#answers-container .row").append(answerField);
    });
}


function populateSelect() {
  let selectElement = $(".quiz-set-select");

  // Clear the existing options
  selectElement.empty();

  // Fetch question sets from the server
  fetch("/sets-of-questions/")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch question sets");
      }
    })
    .then((data) => {
      data.forEach(function (set, index) {
        // Create an <option> element
        let option = $("<option>")
          .val(set.id)
          .text(`${set.id}. ${set.name}`);
        selectElement.append(option);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}


function handleAddEditQuestions() {
    createNewAnswer();
    populateSelect();

    $(document).on("click", ".remove-answer", function () {
        $(this).closest(".input-group").remove();
    });

    $(".new-question-form").submit(function (event) {
        event.preventDefault();

        let isEdit = $("#isEdit").val() === "true";
        let question = $("#questionName").val();
        let answers = [];
        let correctAnswers = [];
        let selectedQuiz = $("#quiz").val();
        let form = $('form');
        let questionId = form.data('questionId');

        // Get answers and check if they are correct
        $(".answer-input").each(function () {
            let answerText = $(this).val();
            let isCorrect = $(this).closest(".input-group").find(".correct-answer-checkbox").prop("checked");
            answers.push(answerText);
            if (isCorrect) {
                correctAnswers.push(answerText);
            }
        });
        answers = answers.join(',');
        correctAnswers = correctAnswers.join(',');

        // Prepare data to send
        let data = {
            'question_text': question,
            'answers': answers,
            'correct_answers': correctAnswers,
            'set_id': selectedQuiz
        };


        let jsonPayload = JSON.stringify(data);

        let endpoint = isEdit ? `/questions/${questionId}` : '/questions/';

        let requestMethod = isEdit ? 'PUT' : 'POST';

        fetch(endpoint, {
            method: requestMethod,
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonPayload,
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((errorResponse) => {
                    throw new Error(errorResponse.detail);
                });
            }
        })
        .then((responseJson) => {
            $(".alert.alert-success").remove();
            let successBanner = $('<div class="alert alert-success" role="alert">Question ' + (isEdit ? 'edited' : 'added') + ' successfully!</div>');
            $("form").before(successBanner);
        })
        .catch((error) => {
            $(".alert.alert-success").remove();
            let errorBanner = $('<div class="alert alert-danger" role="alert">' + error.message + ' </div>');
            $("form").before(errorBanner);
            console.error(error.message);
        });

        // Clear form after submission
        if (!isEdit) {
            $("#questionName").val("");
            $(".answer-input").val("");
            $(".correct-answer-checkbox").prop("checked", false);
        }
    });
}

function handleDeleteQuestion() {
    // Attach a click event handler to the "Delete question" button
    $(document).on("click", ".new-question-form .btn-danger", function (event) {
        event.preventDefault();

        // Get the question ID from the data attribute of the form
        const form = $(this).closest(".new-question-form");
        const questionId = form.data("question-id");
        const questionSetId = form.data("question-set-id");

        // Make an AJAX request to delete the question
        $.ajax({
            url: `/questions/${questionId}`,
            type: 'DELETE',
            success: function (data) {
                window.location.href = `/set-of-questions/${questionSetId}`;
            },
            error: function (xhr, textStatus, error) {
                console.log('Error deleting question:', error);
            }
        });
    });
}

export {handleAddEditQuestions, handleDeleteQuestion};