import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RedisService } from '../../shared/redis/redis.service';
import { Product, ProductCategory, Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
    if (existing) throw new ConflictException('Product with this SKU already exists');

    const slugExists = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
    if (slugExists) throw new ConflictException('Product with this slug already exists');

    const product = await this.prisma.product.create({
      data: {
        sku: dto.sku,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        shortDesc: dto.shortDesc,
        category: dto.category,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        stockQuantity: dto.stockQuantity || 0,
        lowStockThreshold: dto.lowStockThreshold || 10,
        trackInventory: dto.trackInventory ?? true,
        allowBackorder: dto.allowBackorder ?? false,
        weight: dto.weight,
        dimensions: dto.dimensions,
        images: dto.images || [],
        videoUrl: dto.videoUrl,
      },
    });

    await this.redis.del('products:list:cache');
    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const cached = await this.redis.get<Product>(`product:${id}`);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        services: true,
        reviews: { where: { status: 'PUBLISHED' }, take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { cartItems: true, orderItems: true, reviews: true } },
      },
    });

    if (product) await this.redis.set(`product:${id}`, product, 300);
    return product;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { slug } });
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.prisma.product.findUnique({ where: { sku: dto.sku } });
      if (existing) throw new ConflictException('SKU already in use');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already in use');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    await this.redis.del(`product:${id}`);
    await this.redis.del('products:list:cache');
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
    await this.redis.del(`product:${id}`);
    await this.redis.del('products:list:cache');
  }

  async search(dto: ProductSearchDto) {
    const { page = 1, limit = 10, category, search, minPrice, maxPrice, inStock, sortBy = 'name', sortOrder = 'asc' } = dto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (inStock) where.stockQuantity = { gt: 0 };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.product.count({ where }),
    ]);

    return { data: products, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCategories() {
    return Object.values(ProductCategory);
  }

  async getFeatured(limit = 8) {
    return this.prisma.product.findMany({
      take: limit,
      orderBy: { orderItems: { _count: 'desc' } },
    });
  }

  async getLowStock() {
    return this.prisma.product.findMany({
      where: { trackInventory: true, stockQuantity: { lte: this.prisma.product.fields.lowStockThreshold } },
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { stockQuantity: { increment: quantity } },
    });
  }
}