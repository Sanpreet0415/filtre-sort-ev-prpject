document.addEventListener('DOMContentLoaded', () => {
    const initialRecipes = [
        {
            id: 1,
            title: "Pancakes",
            ingredients: [
                "2 cups Flour",
                "2 Eggs",
                "1.5 cups Milk",
                "2 tbsp Sugar",
                "1 tbsp Baking powder",
                "1/2 tsp Salt"
            ],
            instructions: "In a large bowl, whisk together the flour, sugar, baking powder, and salt. In another bowl, beat the eggs and then whisk in the milk. Pour the wet mixture into the dry ingredients and mix until combined. Heat a griddle or large skillet over medium heat. Pour 1/4 cup batter for each pancake onto the griddle. Cook until bubbles form on the surface, then flip and cook until golden brown.",
            category: "Breakfast",
            tags: ["easy", "quick"],
            favorite: true
        },
        {
            id: 2,
            title: "Spaghetti Carbonara",
            ingredients: [
                "200g Spaghetti",
                "100g Pancetta",
                "2 large Eggs",
                "50g Pecorino cheese",
                "50g Parmesan cheese",
                "2 cloves Garlic",
                "Salt",
                "Black Pepper"
            ],
            instructions: "Cook the spaghetti in a large pot of salted boiling water until al dente. Meanwhile, heat the pancetta in a large skillet over medium heat until crispy. Add the garlic and cook for 1 minute. Beat the eggs in a bowl, then mix in the grated cheeses. Drain the spaghetti, reserving some of the cooking water. Add the pasta to the skillet with the pancetta and garlic, remove from heat, and quickly mix in the egg and cheese mixture, adding reserved pasta water as needed to create a creamy sauce. Season with salt and pepper to taste.",
            category: "Dinner",
            tags: ["Italian", "comfort food"],
            favorite: false
        },
        {
            id: 3,
            title: "Chicken Caesar Salad",
            ingredients: [
                "2 Chicken breasts",
                "1 Romaine lettuce",
                "1/2 cup Caesar dressing",
                "1/4 cup Parmesan cheese",
                "1 cup Croutons",
                "Salt",
                "Black Pepper",
                "Olive oil"
            ],
            instructions: "Season the chicken breasts with salt and pepper. Heat a skillet over medium heat with olive oil and cook the chicken until golden brown and cooked through. Let the chicken rest, then slice it into strips. Chop the romaine lettuce and place it in a large bowl. Add the Caesar dressing, Parmesan cheese, croutons, and chicken strips. Toss to combine and serve immediately.",
            category: "Lunch",
            tags: ["healthy", "quick"],
            favorite: true
        },
        {
            id: 4,
            title: "Chocolate Chip Cookies",
            ingredients: [
                "2 1/4 cups All-purpose flour",
                "1/2 tsp Baking soda",
                "1 cup Unsalted butter, melted",
                "1/2 cup White sugar",
                "1 cup Brown sugar",
                "1 tbsp Vanilla extract",
                "1/2 tsp Salt",
                "2 large Eggs",
                "2 cups Semisweet chocolate chips"
            ],
            instructions: "Preheat the oven to 350°F (175°C). In a medium bowl, whisk together the flour and baking soda. In a large bowl, mix the melted butter, white sugar, and brown sugar until smooth. Beat in the vanilla, salt, and eggs until well combined. Gradually add the flour mixture to the wet ingredients until just blended. Stir in the chocolate chips. Drop by rounded tablespoon onto ungreased baking sheets. Bake for 10-12 minutes, or until the edges are lightly browned. Cool on baking sheets for a few minutes, then transfer to wire racks to cool completely.",
            category: "Dessert",
            tags: ["sweet", "baking"],
            favorite: false
        },
        {
            id: 5,
            title: "Guacamole",
            ingredients: [
                "3 Avocados",
                "1 Lime, juiced",
                "1 tsp Salt",
                "1/2 cup Diced onion",
                "3 tbsp Chopped fresh cilantro",
                "2 Roma tomatoes, diced",
                "1 tsp Minced garlic",
                "1 pinch Ground cayenne pepper"
            ],
            instructions: "In a medium bowl, mash together the avocados, lime juice, and salt. Mix in the onion, cilantro, tomatoes, and garlic. Stir in cayenne pepper. Refrigerate 1 hour for best flavor, or serve immediately.",
            category: "Appetizer",
            tags: ["Mexican", "dip"],
            favorite: true
        }
    ];

    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipe-list');
    const categoryFilter = document.getElementById('category-filter');
    const tagFilter = document.getElementById('tag-filter');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.getElementById('search');

    const loadRecipesFromStorage = () => {
        const recipes = localStorage.getItem('recipes');
        return recipes ? JSON.parse(recipes) : initialRecipes;
    };

    const saveRecipesToStorage = (recipes) => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
    };

    const getRecipes = () => {
        return loadRecipesFromStorage();
    };

    const addRecipe = (recipe) => {
        const recipes = loadRecipesFromStorage();
        recipes.push(recipe);
        saveRecipesToStorage(recipes);
    };

    const updateRecipe = (updatedRecipe) => {
        let recipes = loadRecipesFromStorage();
        recipes = recipes.map(recipe => recipe.id === updatedRecipe.id ? updatedRecipe : recipe);
        saveRecipesToStorage(recipes);
    };

   function deleteRecipe(id) {
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");
    if (confirmDelete) {
        let recipes = JSON.parse(localStorage.getItem('recipes'));
        recipes = recipes.filter(recipe => recipe.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        renderRecipes();
    }
}

    const filterAndSortRecipes = (recipes) => {
        const category = categoryFilter.value;
        const tag = tagFilter.value;
        const searchQuery = searchInput.value.toLowerCase();
        const sortKey = sortBy.value;

        if (category) {
            recipes = recipes.filter(recipe => recipe.category === category);
        }

        if (tag) {
            recipes = recipes.filter(recipe => recipe.tags.includes(tag));
        }

        if (searchQuery) {
            recipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchQuery) ||
                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery))
            );
        }

        if (sortKey === 'title') {
            recipes.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortKey === 'category') {
            recipes.sort((a, b) => a.category.localeCompare(b.category));
        } else if (sortKey === 'favorite') {
            recipes.sort((a, b) => b.favorite - a.favorite);
        }

        return recipes;
    };

    const renderRecipes = () => {
        let recipes = getRecipes();
        recipes = filterAndSortRecipes(recipes);
        
        recipeList.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = `recipe-card ${recipe.favorite ? 'favorite' : ''}`;
            recipeCard.innerHTML = `
                <h3>${recipe.title}</h3>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                <p><strong>Tags:</strong> ${recipe.tags.join(', ')}</p>
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
            `;
            recipeList.appendChild(recipeCard);
        });
    };

    recipeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('recipe-id').value;
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const ingredients = document.getElementById('ingredients').value.split(',');
        const instructions = document.getElementById('instructions').value;
        const tags = document.getElementById('tags').value.split(',');
        const favorite = document.getElementById('favorite').checked;

        if (id) {
            const updatedRecipe = { id: Number(id), title, category, ingredients, instructions, tags, favorite };
            updateRecipe(updatedRecipe);
        } else {
            const newRecipe = {
                id: Date.now(),
                title,
                category,
                ingredients,
                instructions,
                tags,
                favorite
            };
            addRecipe(newRecipe);
        }

        recipeForm.reset();
        renderRecipes();
    });

    categoryFilter.addEventListener('change', renderRecipes);
    tagFilter.addEventListener('change', renderRecipes);
    sortBy.addEventListener('change', renderRecipes);
    searchInput.addEventListener('input', renderRecipes);

    renderRecipes();
});

function editRecipe(id) {
    const recipes = JSON.parse(localStorage.getItem('recipes'));
    const recipe = recipes.find(recipe => recipe.id === id);

    if (recipe) {
        document.getElementById('recipe-id').value = recipe.id;
        document.getElementById('title').value = recipe.title;
        document.getElementById('category').value = recipe.category;
        document.getElementById('ingredients').value = recipe.ingredients.join(',');
        document.getElementById('instructions').value = recipe.instructions;
        document.getElementById('tags').value = recipe.tags.join(',');
        document.getElementById('favorite').checked = recipe.favorite;
    }
}

function deleteRecipe(id) {
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");
    if (confirmDelete) {
        let recipes = JSON.parse(localStorage.getItem('recipes'));
        recipes = recipes.filter(recipe => recipe.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }
}
