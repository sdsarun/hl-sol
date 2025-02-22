/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ProductTransalation } from 'src/database/models/product-transactions.model';
import { Product } from 'src/database/models/products.model';
import { LoggerModule } from 'src/logger/logger.module';
import { CreateProductDTO } from 'src/services/products/dto/create-product.dto';
import { GetProductsDTO } from 'src/services/products/dto/get-products.dto';
import { ProductsService } from 'src/services/products/products.service';

describe('ProductService', () => {
  let productService: ProductsService;
  let sequelize: Sequelize;
  let product: typeof Product;
  let productTransalation: typeof ProductTransalation;

  const mockProduct = {
    create: jest.fn(),
    findAll: jest.fn(),
    toJSON: jest.fn(),
  };

  const mockProductTransalation = {
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
  };

  const mockTransactionCommit = jest.fn();
  const mockTransactionRollback = jest.fn();
  const mockSequelize = {
    transaction: jest.fn().mockResolvedValue({
      commit: mockTransactionCommit,
      rollback: mockTransactionRollback,
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        ProductsService,
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProduct,
        },
        {
          provide: getModelToken(ProductTransalation),
          useValue: mockProductTransalation,
        },
      ],
    }).compile();

    productService = module.get(ProductsService);
    sequelize = module.get(Sequelize);
    product = module.get(getModelToken(Product));
    productTransalation = module.get(getModelToken(ProductTransalation));
  });

  afterEach(() => jest.clearAllMocks());

  it('should defined', () => {
    expect(productService).toBeDefined();
    expect(sequelize).toBeDefined();
    expect(product).toBeDefined();
    expect(productTransalation).toBeDefined();
  });

  describe('getProducts', () => {
    it('should throw error once required payload name is missing', () => {
      const dto = plainToInstance(GetProductsDTO, {});
      expect(
        productService.getProducts(dto, { validateDTO: true }),
      ).rejects.toThrow();
    });

    it('should not throw error once required payload name is provided', () => {
      const dto = plainToInstance(GetProductsDTO, { name: '' });
      expect(
        productService.getProducts(dto, { validateDTO: true }),
      ).resolves.not.toThrow();
    });

    it("should default query with language 'th' once not provided", async () => {
      const dto = plainToInstance(GetProductsDTO, { name: '' });
      await productService.getProducts(dto, { validateDTO: true });

      expect(mockProductTransalation.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            language: 'th',
          }),
        }),
      );
    });

    it('should return limit to 10 and offset to 0 once not provided', async () => {
      const dto = plainToInstance(GetProductsDTO, { name: '' });
      const productsResult = await productService.getProducts(dto, {
        validateDTO: true,
      });
      expect(productsResult.offset).toEqual(0);
      expect(productsResult.limit).toEqual(10);
    });

    it('should return match limit and offset when provided', async () => {
      const dto = plainToInstance(GetProductsDTO, {
        name: '',
        offset: 10,
        limit: 20,
      });
      const productsResult = await productService.getProducts(dto, {
        validateDTO: true,
      });
      expect(productsResult.offset).toEqual(dto.offset);
      expect(productsResult.limit).toEqual(dto.limit);
    });

    it('should return data and total when matched', async () => {
      const mockData = [
        {
          id: '2790132e-dd43-4ad7-b395-924933367d86',
          product_id: '56268a56-75f8-4c0b-928e-d3617732ed19',
          name: 'english name',
          description: 'description in english',
          language: 'en',
        },
        {
          id: 'aec6ad0f-4955-43fa-a2e1-3453506dabcb',
          product_id: '4cace1ac-79ff-491d-bee6-05bc68087465',
          name: 'english name 2',
          description: 'description in english 2',
          language: 'en',
        },
      ];

      mockProductTransalation.findAll.mockResolvedValue(mockData);
      mockProductTransalation.count.mockResolvedValue(mockData.length);

      const dto = plainToInstance(GetProductsDTO, { name: 'th' });
      const productsResult = await productService.getProducts(dto, {
        validateDTO: true,
      });

      expect(mockProductTransalation.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: expect.objectContaining({
              name: expect.objectContaining({
                [Op.iLike]: expect.any(String),
              }),
            }),
            language: 'th',
          }),
        }),
      );

      expect(productsResult.data).toEqual([
        {
          id: '2790132e-dd43-4ad7-b395-924933367d86',
          product_id: '56268a56-75f8-4c0b-928e-d3617732ed19',
          name: 'english name',
          description: 'description in english',
          language: 'en',
        },
        {
          id: 'aec6ad0f-4955-43fa-a2e1-3453506dabcb',
          product_id: '4cace1ac-79ff-491d-bee6-05bc68087465',
          name: 'english name 2',
          description: 'description in english 2',
          language: 'en',
        },
      ]);

      expect(productsResult.total).toEqual(2);
    });
  });

  describe('createProduct', () => {
    it('should throw error once required name is missing', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        description: 'A great product',
        language: 'en',
      });
      await expect(
        productService.createProduct(dto, { validateDTO: true }),
      ).rejects.toThrow();
    });

    it('should throw error once required description is missing', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        name: 'Smartphone',
        language: 'en',
      });

      await expect(
        productService.createProduct(dto, { validateDTO: true }),
      ).rejects.toThrow();
    });

    it('should throw error once required language is missing', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        name: 'Smartphone',
        description: 'A high-quality smartphone',
      });

      await expect(
        productService.createProduct(dto, { validateDTO: true }),
      ).rejects.toThrow();
    });

    it('should throw error once any required field is missing', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        name: '',
        description: '',
        language: '',
      });

      await expect(
        productService.createProduct(dto, { validateDTO: true }),
      ).rejects.toThrow();
    });

    it('should successfully create product when all required fields are provided', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        name: 'Smartphone',
        description: 'A high-quality smartphone with advanced features',
        language: 'en',
      });

      mockProduct.create.mockResolvedValue({
        id: 'product-id',
        toJSON: jest.fn().mockReturnValue({
          id: 'product-id',
        }),
      });

      mockProductTransalation.create.mockResolvedValue({
        id: 'product-translation-id',
        product_id: 'product-id',
        name: 'Smartphone',
        description: 'A high-quality smartphone with advanced features',
        language: 'en',
        toJSON: jest.fn().mockReturnValue({
          id: 'product-translation-id',
          product_id: 'product-id',
          name: 'Smartphone',
          description: 'A high-quality smartphone with advanced features',
          language: 'en',
        }),
      });

      const result = await productService.createProduct(dto, {
        validateDTO: true,
      });

      expect(mockTransactionCommit).toHaveBeenCalled();

      expect(result.product).toEqual({
        id: 'product-id',
      });

      expect(result.product_transaction).toEqual({
        id: 'product-translation-id',
        product_id: 'product-id',
        name: 'Smartphone',
        description: 'A high-quality smartphone with advanced features',
        language: 'en',
      });

      expect(mockProduct.create).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          transaction: expect.anything(),
        }),
      );

      expect(mockProductTransalation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          product_id: 'product-id',
          name: 'Smartphone',
          description: 'A high-quality smartphone with advanced features',
          language: 'en',
        }),
        expect.objectContaining({
          transaction: expect.anything(),
        }),
      );
    });

    it('should rollback transaction and throw error if product creation fails', async () => {
      const dto = plainToInstance(CreateProductDTO, {
        name: 'Smartphone',
        description: 'A high-quality smartphone',
        language: 'en',
      });

      mockProduct.create.mockRejectedValue(new Error('Product creation failed'));

      await expect(
        productService.createProduct(dto, { validateDTO: true }),
      ).rejects.toThrow();

      expect(mockTransactionRollback).toHaveBeenCalled();
    });
  });
});
