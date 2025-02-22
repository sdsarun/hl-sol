import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op } from 'sequelize';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProductTransalation } from 'src/database/models/product-transactions.model';
import { Product } from 'src/database/models/products.model';
import { Logger } from 'src/logger/logger.service';
import { CreateProductDTO } from 'src/services/products/dto/create-product.dto';
import { GetProductsDTO } from 'src/services/products/dto/get-products.dto';
import { ServiceActionOptions } from 'src/shared/types/service-action';
import { validateDTO } from 'src/shared/utils/validation/dto.validation';

@Injectable()
export class ProductsService {
  constructor(
    private readonly logger: Logger,

    private readonly sqz: Sequelize,

    @InjectModel(Product)
    private readonly product: typeof Product,

    @InjectModel(ProductTransalation)
    private readonly productTransalation: typeof ProductTransalation,
  ) {}

  async createProduct(
    payload: CreateProductDTO,
    options?: ServiceActionOptions & { transaction?: Transaction },
  ) {
    if (options?.validateDTO) {
      await validateDTO(payload, options);
    }

    const transaction = options?.transaction ?? (await this.sqz.transaction());

    try {
      const productCreated = await this.product.create(undefined, {
        transaction,
      });

      const productTransalationCreated = await this.productTransalation.create(
        {
          product_id: productCreated.id,
          ...payload,
        },
        {
          transaction,
        },
      );

      if (!options?.transaction) {
        await transaction.commit();
      }

      return {
        product: productCreated.toJSON(),
        product_transaction: productTransalationCreated.toJSON(),
      };
    } catch (error) {
      this.logger.setContext(this.createProduct.name);
      this.logger.error(error);

      if (!options?.transaction) {
        await transaction.rollback();
      }

      throw error;
    }
  }

  async getProducts(
    payload: GetProductsDTO,
    options?: ServiceActionOptions & { transaction?: Transaction },
  ) {
    try {
      const offset: number = payload?.offset ?? 0;
      const limit: number = payload?.limit ?? 10;
      const language: string = payload?.language ?? "th";

      const filterd: FindOptions<ProductTransalation>['where'] = {
        [Op.or]: {
          name: {
            [Op.iLike]: `%${payload.name}%`,
          },
          // description: {
          //   [Op.iLike]: `%${payload.name}%`,
          // },
        },
        language,
      };

      const [data, total] = await Promise.all([
        this.productTransalation.findAll({
          where: filterd,
          order: [['name', 'asc']],
          offset,
          limit,
          transaction: options?.transaction,
          attributes: ['product_id', 'name', 'description', 'language'],
          raw: true,
        }),
        this.productTransalation.count({
          where: filterd,
          transaction: options?.transaction,
        }),
      ]);

      return { data, total, offset, limit };
    } catch (error) {
      this.logger.setContext(this.createProduct.name);
      this.logger.error(error);
      throw error;
    }
  }
}
