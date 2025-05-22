import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new store (Admin only)' })
  @ApiResponse({ status: 201, description: 'Store created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stores' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'ownerId', required: false })
  @ApiResponse({ status: 200, description: 'Return all stores' })
  async findAll(
    @Query('search') search?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    return this.storesService.findAll(search, ownerId);
  }

  @Get('my-store')
  @Roles(UserRole.STORE_OWNER)
  @ApiOperation({ summary: "Get current user's store (Store Owner only)" })
  @ApiResponse({ status: 200, description: 'Return store' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findMyStore(@Request() req) {
    const userId = req.user.userId;
    const result = await this.storesService.findAll(undefined, userId);
    if (result.data.length === 0) {
      throw new Error('No store found for this user');
    }
    return result.data[0];
  }

  @Get('count')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get total number of stores (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return store count' })
  async getStoresCount() {
    return this.storesService.getStoresCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get store by ID' })
  @ApiResponse({ status: 200, description: 'Return store by ID' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.STORE_OWNER)
  @ApiOperation({ summary: 'Update a store (Admin or Store Owner)' })
  @ApiResponse({ status: 200, description: 'Store updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @Request() req,
  ) {
    // If user is a store owner, they can only update their own store
    if (req.user.role === UserRole.STORE_OWNER) {
      // Verify the store belongs to the user
      return this.storesService.findOne(id).then((store) => {
        if (store.owner.id !== req.user.userId) {
          throw new Error('You can only update your own store');
        }
        return this.storesService.update(id, updateStoreDto);
      });
    }
    // Admin can update any store
    return this.storesService.update(id, updateStoreDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a store (Admin only)' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
