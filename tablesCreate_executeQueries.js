const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "com8",
  password: "Kumait",
  database: "com8DB",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");

  //  create SQL tables
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

  //SQL queries
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

  //  clear MySQL database, drop all the tables have been created
  const dropCommands = [
    "DROP TABLE IF EXISTS RecipeIngredients;",
    "DROP TABLE IF EXISTS RecipeCategories;",
    "DROP TABLE IF EXISTS RecipeSteps;",
    "DROP TABLE IF EXISTS Steps;",
    "DROP TABLE IF EXISTS Ingredients;",
    "DROP TABLE IF EXISTS Categories;",
    "DROP TABLE IF EXISTS Recipes;",
  ];

  dropCommands.forEach((command) => {
    connection.query(command, (err, result) => {
      if (err) throw err;
      console.log("Table dropped successfully");
    });
  });

  // //* **  The issue is the order of your operations.
  //   createCommands.forEach((command, index) => {
  //     connection.query(command, (err, result) => {
  //       if (err) throw err;
  //       console.log(`Table creation command ${index + 1} executed successfully`);
  //     });
  //   });

  //   queries.forEach((query, index) => {
  //     connection.query(query, (err, result) => {
  //       if (err) throw err;
  //       console.log(`Result for query ${index + 1}:`, result);
  //     });
  //   });

  //   insertCommands.forEach((insertCommand, index) => {
  //     connection.query(insertCommand, (err, result) => {
  //       if (err) throw err;
  //       console.log(`Insert-Command ${index + 1} executed successfully`);
  //     });
  //   });

  //   connection.end();
  // });

  // * output
  // kumait@KUMAITs-MBP Prep3-DB % node tablesCreate_executeQueries.js
  // Connected to MySQL Server!
  // Table creation command 1 executed successfully
  // Table creation command 2 executed successfully
  // Table creation command 3 executed successfully
  // Table creation command 4 executed successfully
  // Table creation command 5 executed successfully
  // Table creation command 6 executed successfully
  // Table creation command 7 executed successfully
  // Result for query 1: []
  // Result for query 2: []
  // Result for query 3: []
  // Insert-Command 1 executed successfully
  // Insert-Command 2 executed successfully
  // Insert-Command 3 executed successfully
  // Insert-Command 4 executed successfully
  // Insert-Command 5 executed successfully
  // Insert-Command 6 executed success

  // //* **  The issue is the order of your operations.
  //  execute the queries before having the data inserted into the tables.

  // Re-order of operations:
  // Create the tables.
  // Insert data into the tables.
  // Execute the queries.

  // Create tables
  createCommands.forEach((command, index) => {
    connection.query(command, (err, result) => {
      if (err) throw err;
      console.log(`Table creation command ${index + 1} executed successfully`);
    });
  });

  // Insert data into tables
  insertCommands.forEach((insertCommand, index) => {
    connection.query(insertCommand, (err, result) => {
      if (err) throw err;
      console.log(`Insert-Command ${index + 1} executed successfully`);
    });
  });

  // Execute queries
  queries.forEach((query, index) => {
    connection.query(query, (err, result) => {
      if (err) throw err;
      console.log(`Result for query ${index + 1}:`, result);
    });
  });

  connection.end();
});

/// * output
/**
kumait@KUMAITs-MBP Prep3-DB % node tablesCreate_executeQueries.js
Connected to MySQL Server!
Table dropped successfully
Table dropped successfully
Table dropped successfully
Table dropped successfully
Table dropped successfully
Table dropped successfully
Table dropped successfully
Table creation command 1 executed successfully
Table creation command 2 executed successfully
Table creation command 3 executed successfully
Table creation command 4 executed successfully
Table creation command 5 executed successfully
Table creation command 6 executed successfully
Table creation command 7 executed successfully
Insert-Command 1 executed successfully
Insert-Command 2 executed successfully
Insert-Command 3 executed successfully
Insert-Command 4 executed successfully
Insert-Command 5 executed successfully
Insert-Command 6 executed successfully
Result for query 1: []
Result for query 2: [ RowDataPacket { RecipeName: 'No-Bake Cheesecake' } ]
Result for query 3: []
kumait@KUMAITs-MBP Prep3-DB % 
 */
