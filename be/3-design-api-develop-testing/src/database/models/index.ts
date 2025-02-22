import { ModelCtor } from "sequelize-typescript";
import { ProductTransalation } from "src/database/models/product-transactions.model";
import { Product } from "src/database/models/products.model";

const DATABASE_MODELS: string[] | ModelCtor[] = [
  Product,
  ProductTransalation,
]

export default DATABASE_MODELS;