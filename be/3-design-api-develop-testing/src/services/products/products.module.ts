import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductTransalation } from 'src/database/models/product-transactions.model';
import { Product } from 'src/database/models/products.model';
import { ProductsController } from 'src/services/products/products.controller';
import { ProductsService } from 'src/services/products/products.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product,
      ProductTransalation,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, SequelizeModule]
})
export class ProductsModule {}
