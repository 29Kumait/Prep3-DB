const mysql = require("mysql");
const util = require("util");

// MySQL's createConnection method
const connection = mysql.createConnection({
  host: "localhost",
  user: "com8",
  password: "Kumait",
  database: "com8DB",
});

// *  Promisify the query and connect methods
// Promisify the query method
connection.query = util.promisify(connection.query);
// Promisify the connect method
connection.connect = util.promisify(connection.connect);

// Asynchronous main function
async function main() {
  try {
    // Connect to the MySQL server
    await connection.connect();
    console.log("Connected to MySQL Server!");

    //* Arrays of SQL commands:
    // CREATE TABLE commands
    const createCommands = [
      `
    -- Categories Table
    CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INT AUTO_INCREMENT PRIMARY KEY,
        CategoryName VARCHAR(255) NOT NULL
    );`,
      `
    -- Ingredients Table
    CREATE TABLE IF NOT EXISTS Ingredients (
        IngredientID INT AUTO_INCREMENT PRIMARY KEY,
        IngredientName VARCHAR(255) NOT NULL
    );`,
      `
    -- Steps Table
    CREATE TABLE IF NOT EXISTS Steps (
        StepID INT AUTO_INCREMENT PRIMARY KEY,
        StepDescription TEXT NOT NULL
    );`,
      `
    -- Recipes Table
    CREATE TABLE IF NOT EXISTS Recipes (
        RecipeID INT AUTO_INCREMENT PRIMARY KEY,
        RecipeName VARCHAR(255) NOT NULL
    );`,
      `
    -- Recipe-Categories Junction Table
    CREATE TABLE IF NOT EXISTS RecipeCategories (
        RecipeID INT,
        CategoryID INT,
        PRIMARY KEY (RecipeID, CategoryID),
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID),
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
    );`,
      `
    -- Recipe-Ingredients Junction Table
    CREATE TABLE IF NOT EXISTS RecipeIngredients (
        RecipeID INT,
        IngredientID INT,
        Quantity VARCHAR(255),
        PRIMARY KEY (RecipeID, IngredientID),
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID),
        FOREIGN KEY (IngredientID) REFERENCES Ingredients(IngredientID)
    );`,
      `
    -- Recipe-Steps Junction Table
    CREATE TABLE IF NOT EXISTS RecipeSteps (
        RecipeID INT,
        StepID INT,
        StepOrder INT,
        PRIMARY KEY (RecipeID, StepID),
        FOREIGN KEY (RecipeID) REFERENCES Recipes(RecipeID),
        FOREIGN KEY (StepID) REFERENCES Steps(StepID)
    );`,
    ];

    // INSERT INTO commands
    const insertCommands = [
      `
        -- Insert Recipe Details:
        INSERT INTO Recipes (RecipeID, RecipeName)
        VALUES (1, 'No-Bake Cheesecake');
        `,
      `
        -- Insert Categories, Ingredients, and Steps:
        INSERT INTO Categories (CategoryID, CategoryName)
        VALUES (1, 'Cake'), (2, 'No-Bake'), (3, 'Vegetarian');
        `,
      `
        INSERT INTO Ingredients (IngredientID, IngredientName)
        VALUES (1, 'Condensed milk'), (2, 'Cream Cheese'), (3, 'Lemon Juice'), (4, 'Pie Crust'), (5, 'Cherry Jam');
        `,
      `
        INSERT INTO Steps (StepID, StepDescription)
        VALUES (1, 'Beat Cream Cheese'), (2, 'Add condensed Milk and blend'), (3, 'Add Lemon Juice and blend'), (4, 'Add the mix to the pie crust'), (5, 'Spread the Cherry Jam'), (6, 'Place in refrigerator for 3h');
        `,
      `
        -- Link Recipe with Categories, Ingredients, and Steps:
        INSERT INTO RecipeCategories (RecipeID, CategoryID)
        VALUES (1, 1), (1, 2), (1, 3);
        `,
      `
        -- Quantities need to be specified based on the actual recipe
        INSERT INTO RecipeIngredients (RecipeID, IngredientID, Quantity)
        VALUES (1, 1, '1 can'), (1, 2, '200g'), (1, 3, '2 tbsp'), (1, 4, '1'), (1, 5, '100g');
        `,
    ];

    // SQL queries (SELECT queries)
    const queries = [
      `
  -- All the vegetarian recipes with potatoes
  SELECT recipes.RecipeName
  FROM Recipes recipes
      JOIN RecipeCategories recipeCategories ON recipes.RecipeID = recipeCategories.RecipeID
      JOIN Categories categories ON recipeCategories.CategoryID = categories.CategoryID
      JOIN RecipeIngredients recipeIngredients ON recipes.RecipeID = recipeIngredients.RecipeID
      JOIN Ingredients ingredients ON recipeIngredients.IngredientID = ingredients.IngredientID
  WHERE
      categories.CategoryName = 'Vegetarian'
      AND ingredients.IngredientName = 'Potatoes';
  `,
      `
  -- All the cakes that do not need baking
  SELECT recipes.RecipeName
  FROM Recipes recipes
      JOIN RecipeCategories recipeCategories ON recipes.RecipeID = recipeCategories.RecipeID
      JOIN Categories categories ON recipeCategories.CategoryID = categories.CategoryID
      LEFT JOIN RecipeSteps recipeSteps ON recipes.RecipeID = recipeSteps.RecipeID
      LEFT JOIN Steps steps ON recipeSteps.StepID = steps.StepID AND steps.StepDescription LIKE '%bake%'
  WHERE
      categories.CategoryName = 'Cake'
      AND steps.StepID IS NULL;
  `,
      `   
    -- All the vegan and Japanese recipes
    
    SELECT Recipes.RecipeName
    FROM Recipes
    JOIN RecipeCategories ON Recipes.RecipeID = RecipeCategories.RecipeID
    JOIN Categories ON RecipeCategories.CategoryID = Categories.CategoryID
    WHERE Categories.CategoryName IN ('Vegan', 'Japanese')
    GROUP BY Recipes.RecipeName
    HAVING COUNT(DISTINCT Categories.CategoryName) = 2;
    
 `,
    ];

    // DROP TABLE commands  (clear MySQL database, drop all the tables have been created)
    const dropCommands = [
      "DROP TABLE IF EXISTS RecipeIngredients;",
      "DROP TABLE IF EXISTS RecipeCategories;",
      "DROP TABLE IF EXISTS RecipeSteps;",
      "DROP TABLE IF EXISTS Steps;",
      "DROP TABLE IF EXISTS Ingredients;",
      "DROP TABLE IF EXISTS Categories;",
      "DROP TABLE IF EXISTS Recipes;",
    ];

    // Dropping tables
    for (const command of dropCommands) {
      await connection.query(command);
      console.log("Table dropped successfully");
    }

    // Creating tables
    for (const command of createCommands) {
      await connection.query(command);
      console.log("Table created successfully");
    }

    // Inserting data
    for (const command of insertCommands) {
      await connection.query(command);
      console.log("Data inserted successfully");
    }

    // Executing queries
    for (const queryCommand of queries) {
      const result = await connection.query(queryCommand);
      console.log("Query result:", result);
    }
  } catch (error) {
    // Error handling
    console.error("An error occurred:", error);
  } finally {
    // Close the connection, regardless of success or error
    connection.end();
    console.log("Connection closed");
  }
}

// Run the main function
main();
