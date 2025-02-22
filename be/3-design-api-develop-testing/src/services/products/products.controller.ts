import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProductDTO } from "src/services/products/dto/create-product.dto";
import { GetProductsDTO } from "src/services/products/dto/get-products.dto";
import { ProductsService } from "src/services/products/products.service";

@ApiTags("Product")
@Controller("products")
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @ApiResponse({ status: HttpStatus.CREATED, description: "Product created success." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid request or some payload in mismatch requirement." })
  @Post()
  async createProduct(
    @Body() body: CreateProductDTO,
  ) {
    return this.productsService.createProduct(body);
  }

  @ApiResponse({ status: HttpStatus.OK, description: "Get product success." })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: "Invalid request or some payload in mismatch requirement." })
  @Get()
  async getProducts(
    @Query() query: GetProductsDTO
  ) {
    return this.productsService.getProducts(query);
  }
}