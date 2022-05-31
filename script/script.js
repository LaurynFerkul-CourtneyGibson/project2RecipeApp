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
recipeApp.recipeResultsUl = document.querySelector(`#recipeResults`);
recipeApp.inputElement = document.querySelector('input');
recipeApp.errorMessage = document.querySelector('.errorMessage');
recipeApp.resultSection = document.querySelector('section');


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
            } else {
                throw new Error(res.statusText);
            }
        })
        .then(function (results) {
            // Check if any recipes are supplied
            if (results.results.length === 0) {
                recipeApp.errorMessage.innerText = `Sorry we don't have any recipes for you!`;

            }
            else {
                recipeApp.recipeResultsUl.innerHTML = '';
                recipeApp.displayRecipes(results);
            }
        }).catch(function (err) {
            recipeApp.errorMessage.innerText = `Sorry something went wrong on our end!`;
        })
}

// Connecting our event listener to our form
recipeApp.setUpEventListener = function () {
    // Add event listener to our form element 
    recipeApp.formElement.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputElement = document.getElementById('ingredientItem').value;

        if (inputElement === "" || !isNaN(inputElement)) {
            recipeApp.errorMessage.innerText = `Can't seem to find anything. Try again!`;

        } else {
            recipeApp.errorMessage.innerText = "";
            recipeApp.getRecipeInfo(inputElement);
        }
    })
}


recipeApp.displayRecipes = function (recipeData) {

    let recipeArray = recipeData.results;

    recipeArray.forEach(function (recipeObject) {
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

        // ********************************* MODAL **************************************
        recipeApp.displayModal(recipeListItem, recipeObject);
    })

}

recipeApp.displayModal = function (clickItem, recipe) {
    closeModal = function () {
        if (modalBackdrop) {
            modalBackdrop.remove();
        } if (modalContainer) {
            modalContainer.remove();
        }
    }

    clickItem.addEventListener('click', function () {
        modalBackdrop = document.createElement('div');
        modalBackdrop.classList.add('modalBackdrop')

        recipeApp.resultSection.appendChild(modalBackdrop);

        modalBackdrop.addEventListener('click', closeModal);

        modalContainer = document.createElement('div');
        modalContainer.classList.add('modalContainer');

        const modalImage = document.createElement('img');
        modalImage.src = recipe.image;
        modalImage.alt = recipe.title;

        const modalText = document.createElement('div');
        modalText.classList.add('modalText');

        const modalTitle = document.createElement('h2');
        modalTitle.innerText = recipe.title;


        const modalTime = document.createElement('p')
        modalTime.innerText = `Cook time: ${recipe.readyInMinutes} mins`;

        const summaryTittle = document.createElement('h3');
        summaryTittle.innerHTML = 'Summary';

        const modalSummary = document.createElement('p');
        modalSummary.innerHTML = recipe.summary;

        const ingredientTittle = document.createElement('h3');
        ingredientTittle.innerHTML = 'Ingredients';

        const modalUl = document.createElement('ul');
        modalUl.classList.add('ingredientList');


        recipe.extendedIngredients.forEach(function (ingredientObject) {
            const listItems = document.createElement('li');
            listItems.textContent = ingredientObject.original;
            modalUl.append(listItems);
        });

        modalText.appendChild(modalTitle);
        modalText.appendChild(modalTime);
        modalText.appendChild(summaryTittle);
        modalText.appendChild(modalSummary);
        modalText.appendChild(ingredientTittle);
        modalText.appendChild(modalUl)

        modalContainer.appendChild(modalImage);
        modalContainer.appendChild(modalText);

        const exitButton = document.createElement('button');
        exitButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        exitButton.classList.add('exitButton');
        exitButton.addEventListener('click', closeModal);
        modalContainer.appendChild(exitButton);

        modalBackdrop.appendChild(modalContainer);
    })
};


recipeApp.init();