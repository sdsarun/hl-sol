# Design and develop two APIs using NestJS and Postgres with the following specifications

## Database Design

I use two tables:
- `products` - for store product information like price, quantity etc.
- `product_tranlations` - for store only fields for products table that required any langueges.

### Why store in two tables?
If i store language data in the product table with one column per language (e.g., for Thai and English), I would need separate columns for each language field. 

While this might work initially, if the application later requires support for another language, such as Japanese, I would have to alter the table structure and update the source code to add new columns. 

If i use two tables: one for the core product information that doesn't depend on language, and another for translations. With this approach, adding a new language only requires inserting new rows in the translations table, without modifying the table structure or the source code.

#### Table: **products**
| column_name   | data_type     | primary key | not_null | foreign_key | remark |
|---------------|---------------|-------------|----------|-------------|--------|
| **id**        | uuid          | ✔️          | ✔️       |             |        |
| **created_at**| timestamp     |             | ✔️       |             |        |
| **updated_at**| timestamp     |             | ✔️       |             |        |
| **deleted_at**| timestamp     |             |          |             |        |



#### Table: **product_transalations**
| column_name   | data_type     | primary key | foreign_key          | not_null | remark |
|---------------|---------------|-------------|----------------------|----------|--------|
| **id**        | uuid          | ✔️          |                      | ✔️       |        |
| **product_id**| uuid          |             | `products.id`         | ✔️       |        |
| **name**      | varchar(255)  |             |                      | ✔️       |        |
| **description**      | text |             |                      | ️       |        |
| **language**  | varchar(2)  |             |                      | ✔️       |Use [`ISO 639-1`](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) Example: `en`, `fr`, etc.        |
| **created_at**| timestamp     |             |                      | ✔️       |        |
| **updated_at**| timestamp     |             |                      | ✔️       |        |
| **deleted_at**| timestamp     |             |                      |          |        |

## Validation
I just use the validation libraries `class-validator` and `class-transformer` that NestJS suggests in the documentation.

This ensures that data from the DTO is validated and transformed through pipes before the controller function is executed.

Look at points `4` and `5` in the image below.

![NestJS Pipeline](https://images.velog.io/images/youngkiu/post/a22a621e-d9d0-4483-835e-8b93aa2af5dd/image.png)


## Testing Strategy

### Unit Tests

**Tools:**  
- Jest (default testing framework in NestJS)  

**Example:**  
- Test if the function correctly retrieves a product by ID.  
- Test if the function returns an error when an invalid ID is provided.  

### Integration Tests

**Tools:**  
- Jest + Supertest (for HTTP request testing)  

**Example:**  
- Test if creating a product correctly inserts data into the database.  
- Test if retrieving a product returns the correct translated name and description.  

### End-to-End (E2E)

**Tools:**  
- Jest + Supertest + a test database (e.g., PostgreSQL running in Docker)  

**Example:**  
- Test if a user can create a product with multiple translations and then retrieve it in a different language.  
- Test if the search API returns correct paginated results.  
