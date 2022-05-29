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

recipeApp.apiKey = '327eab5543c046318cc5c224fd42d620';

recipeApp.formElement = document.querySelector('form');

// init function ready to kick initalize the functions 
recipeApp.init = function () {
    recipeApp.setUpEventListener();
};

recipeApp.getRecipeInfo = function (ingredient) {

    // Building our endpoint for to the recipe id
    const idUrl = new URL(`https://api.spoonacular.com/recipes/complexSearch`);
    idUrl.search = new URLSearchParams({
        apiKey: recipeApp.apiKey,
        includeIngredients: ingredient
    });
    

    // Making our first API call to get the recipe id
    fetch(idUrl)
        .then(function (response) {
            if (response.ok){
                return response.json();
            } else {
                throw new Error(response);
            }
            console.log(response);
        })
        .then(function (jsonData) {
            return jsonData.results;
        })
        .then(function (recipeArray) {
            const idArray = recipeArray.map(function (recipe) {
                return recipe.id;
            })
            return idArray
        })
        .then(function (idArray) {
            idArray.map(function (id) {

                const recipeInfoUrl = new URL(`https://api.spoonacular.com/recipes/${id}/information`);
                recipeInfoUrl.search = new URLSearchParams({
                    apiKey: recipeApp.apiKey
                });

                fetch(recipeInfoUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonData) {
                        recipeApp.recipeResults.innerHTML = '';
                    recipeApp.displayRecipes(jsonData); 

                    })
            })
        })
}



recipeApp.setUpEventListener = function () {
    // Add event listener to our form element 
    recipeApp.formElement.addEventListener('submit', function (e) {
        e.preventDefault();
        // Grab the value of the select element
        const inputElement = document.getElementById('ingredientItem').value;
        console.log(inputElement);
        recipeApp.getRecipeInfo(inputElement);

    })
}


recipeApp.init();

// recipeApp.displayRecipes = function (recipeData){
//     let recipeArray = recipeData.recipeObjects;

//     recipeArray.forEach(function (recipeObject) {
        
//     })
// }