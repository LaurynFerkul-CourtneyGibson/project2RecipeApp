// Created namespacing
const recipeApp = {};

// Properties stored in namespace
recipeApp.apiKey = 'ad5247644ba34da28cffa606ab10aeea';

// Queried DOM for elements in HTML
recipeApp.formElement = document.querySelector('form');
recipeApp.recipeResultsUl = document.querySelector(`#recipeResults`);
recipeApp.inputElement = document.querySelector('input');
recipeApp.errorMessage = document.querySelector('.errorMessage');
recipeApp.resultSection = document.querySelector('section');


// Kicks off all the functions 
recipeApp.init = function () {
    recipeApp.setUpEventListener();
};

// Getting the recipe information from Spoonacular API
recipeApp.getRecipeInfo = function (ingredient) {

    // Building our endpoint to access recipe information
    const idUrl = new URL(`https://api.spoonacular.com/recipes/complexSearch`);

    // Added parameters to get access to certain recipe information
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
            // If no errors carry on but if not throw functions 
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(res.statusText);
            }
        })
        .then(function (res) {
            // Check if any recipes are supplied and if not throw a error message
            if (res.results.length === 0) {
                recipeApp.errorMessage.innerText = `Sorry we don't have any recipes for you!`;
            } else {
                recipeApp.recipeResultsUl.innerHTML = '';
                recipeApp.displayRecipes(res);
            }
        }).catch(function (err) {
            // catches any errors the api may encounter
            recipeApp.errorMessage.innerText = `Sorry something went wrong on our end!`;
        })
}

// Method that listens for form input
recipeApp.setUpEventListener = function () {
    // Add event listener to our form element 
    recipeApp.formElement.addEventListener('submit', function (e) {
        e.preventDefault();

        const inputElement = document.getElementById('ingredientItem').value;

        // Checks if the input is valid before executing the fetch request
        if (inputElement === "" || !isNaN(inputElement)) {
            recipeApp.errorMessage.innerText = `Can't seem to find anything. Try again!`;
        } else {
            recipeApp.errorMessage.innerText = "";
            recipeApp.getRecipeInfo(inputElement);
        }
    })
}

// Method that uses the user input and API key to display certain information to the page
recipeApp.displayRecipes = function (recipeData) {

    let recipeArray = recipeData.results;

    // Loops through the array of recipes 
    recipeArray.forEach(function (recipeObject) {

        // Create and call each element wanted displayed to the page and appended it to the appropriate elements
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

        // Calls the displayModal method to display pop up of each recipe
        recipeApp.displayModal(recipeListItem, recipeObject);
    })
}

// Displays pop up with more recipe information 
recipeApp.displayModal = function (clickItem, recipe) {

    // function that removes the modal from the screen
    closeModal = function () {
        if (modalBackdrop) {
            modalBackdrop.remove();
        } if (modalContainer) {
            modalContainer.remove();
        }
    }

    // Waits for a click on the recipe item and displays more information
    clickItem.addEventListener('click', function () {

        // Create and call each element wanted displayed to the page and appended it to the appropriate elements
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

// Calls the init method 
recipeApp.init();