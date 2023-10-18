function getSetsOfQuestions(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function createSetCard(name, description) {
    // Create the card structure using jQuery
    const card = $('<div class="col-md-3 my-2">')
        .append($('<div class="card-sl">')
            .append($('<div class="card-image">')
                .append('<img src="https://altc.alt.ac.uk/blog/wp-content/uploads/sites/1112/2022/08/Blog-Cover-Guidlines-707x409.png">')
            )
            .append('<a class="card-action" href="#"><i class="fa fa-heart"></i></a>')
            .append($('<div class="card-heading set-title">').text(name))
            .append($('<div class="card-text set-description">').text(description))
            .append('<div class="card-text set-date"><!-- TODO: Date will be here... --></div>')
            .append('<a href="#" class="card-button">Take the quiz</a>')
        );

    // Append the card to the parent container
    $('.list-of-quizes').append(card);
}

function handleSetsOfQuestions(){
getSetsOfQuestions('/sets-of-questions/')
    .then(data => {
        data.forEach(set => {
            createSetCard(set.name, set.description);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


export {handleSetsOfQuestions};