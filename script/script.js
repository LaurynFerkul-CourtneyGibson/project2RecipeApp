// RECIPE APP                                                      //Create a namespace
// create a init method to call the methods applied in the app and call it at the end of the document
// Landing page with form input to gather user input regarding ingredients they want to be included in the recipe suggested
// A button that submits the user's ingredient choice
// Query the DOM for the form with a click event attached to it
// Once the form is submitted store the user input in a variable
// After the form is submitted make an AJAX request to retrieve data from spoonacular, in particular, the recipe title and image
// Display the recipe results on the page by looping through each array and adding the HTML elements to the page, including the title and image

// NAMESPACING APP

const recipeApp = {};
recipeApp.apiKey = 'ad5247644ba34da28cffa606ab10aeea';
recipeApp.formElement = document.querySelector('form');
recipeApp.recipeResultsUl = document.querySelector(`#recipeResults`)

// init function ready to kick initalize the functions 
recipeApp.init = function () {
    recipeApp.setUpEventListener();
};

// Getting the recipe information from Spoonacular API
recipeApp.getRecipeInfo = function (ingredient) {

    // Building our endpoint for to the recipe id
    const idUrl = new URL(`https://api.spoonacular.com/recipes/complexSearch`);
    idUrl.search = new URLSearchParams({
        apiKey: recipeApp.apiKey,
        includeIngredients: ingredient,
        instructionsRequired: true,
        addRecipeInformation: true,
        fillIngredients: true
    });

    // Making our API call to get the recipe id
    fetch(idUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (results) {
            recipeApp.recipeResultsUl.innerHTML = '';
            recipeApp.displayRecipes(results);
        })
}

// Connecting our event listener to our form
recipeApp.setUpEventListener = function () {
    // Add event listener to our form element 
    recipeApp.formElement.addEventListener('submit', function (e) {
        e.preventDefault();
        // Grab the value of the select element
        const inputElement = document.getElementById('ingredientItem').value;

        recipeApp.getRecipeInfo(inputElement);

    })
}


recipeApp.displayRecipes = function (recipeData) {

    let recipeArray = recipeData.results;

    recipeArray.forEach(function (recipeObject){
            console.log(recipeObject);
        const image = document.createElement('img');
        image.src = recipeObject.image;
        image.alt = recipeObject.title;

        const recipeContent = document.createElement('div');
        recipeContent.classList.add('recipeContent'); 

        const title = document.createElement(`h2`);
        title.innerText = recipeObject.title;

        const cookTime = document.createElement(`p`);
        cookTime.innerText = `Cook time: ${recipeObject.readyInMinutes} mins`;
        
        recipeContent.appendChild(title);
        recipeContent.appendChild(cookTime);

        const recipeListItem = document.createElement('li');

        recipeListItem.appendChild(image);
        recipeListItem.appendChild(recipeContent);

        recipeApp.recipeResultsUl.appendChild(recipeListItem);
    })
}

recipeApp.init();