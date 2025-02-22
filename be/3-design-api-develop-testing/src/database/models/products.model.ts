import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ProductTransalation } from 'src/database/models/product-transactions.model';

export type ProductCreationAttributes = {
  id: string;
}

@Table({
  tableName: 'products',
})
export class Product extends Model<Product, ProductCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;

  @Column({ type: DataType.DATE })
  deleted_at: Date;

  @HasMany(() => ProductTransalation, { foreignKey: "product_id" })
  product_transactions: ProductTransalation[]
}
