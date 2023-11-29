### Proposed NoSQL Structure:

#### Embedding vs. Normalization:
- **Embedding**:
  - **Steps** can be embedded within each recipe as they are likely unique to each recipe.
  - **Ingredients** could be embedded within recipes if they are only referenced as part of a recipe. If they include detailed data like nutritional info, a reference approach might be better.

- **Normalization**:
  - **Categories** can be normalized if they are simple and used across multiple recipes. This avoids duplication.
  - **Ingredients** can also be normalized if they contain more detailed information than just their name and quantity used in a recipe.

#### Sample Queries and Commands:
1. **Insert a Recipe**:
   ```javascript
   db.recipes.insertOne({
       name: "Chocolate Cake",
       categories: ["5e12345"],
       ingredients: [{ id: "5a12345", quantity: "2 cups" }],
       steps: ["Preheat oven", "Mix ingredients"]
   });
   ```

2. **Find Recipes by Category**:
   ```javascript
   db.recipes.find({ categories: "5e12345" });
   ```

3. **Update an Ingredient in a Recipe**:
   ```javascript
   db.recipes.updateOne(
       { _id: "RecipeID", "ingredients.id": "5a12345" },
       { $set: { "ingredients.$.quantity": "3 cups" } }
   );
   ```

4. **Add a Category to a Recipe**:
   ```javascript
   db.recipes.updateOne(
       { _id: "RecipeID" },
       { $push: { categories: "5e67890" } }
   );

## Decision to Embed Information
- **Steps**: Embedded within recipes due to their unique association with each recipe. This approach enhances read performance.
- **Ingredients**: 
  - Embedded if they are simple (name and quantity), facilitating easier access within recipes.
  - Normalized if they have detailed attributes like nutritional information, to manage updates efficiently and reduce redundancy.

## Choice Between MySQL and MongoDB for Recipe Database
- **MySQL**: 
  - Suitable for structured, relational data with complex relationships.
  - Ideal if transactional integrity and relational data modeling are key requirements.
  - Better for scenarios requiring frequent joins and complex queries.

- **MongoDB**: 
  - Preferable for data with evolving structures or large volumes.
  - Offers flexibility with its schema-less design, suitable for hierarchical data like recipes.
  - Provides better performance for document-based data models and is scalable.
  - More intuitive for nested data like recipes with embedded steps or ingredients.

**To sum up**: The choice depends on data complexity, scalability needs, and the potential for evolving data requirements. MongoDB is advantageous for a recipes database due to its flexibility and scalability, especially suitable for hierarchical data models.
   ```



[SQL](https://medium.com/@anshika2797/exploring-sql-concepts-top-20-interview-questions-and-answers-17ea9618deee)


