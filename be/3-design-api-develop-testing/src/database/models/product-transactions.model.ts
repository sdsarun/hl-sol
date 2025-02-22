import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Product } from 'src/database/models/products.model';

export type ProductTransalationCreationAttributes = {
  product_id: string;
  name: string;
  description?: string;
  language: string;
}

@Table({
  tableName: 'product_transalations',
})
export class ProductTransalation extends Model<ProductTransalation, ProductTransalationCreationAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  product_id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
  })
  language: string;

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

  @BelongsTo(() => Product, { foreignKey: 'id' })
  product: Product;
}
