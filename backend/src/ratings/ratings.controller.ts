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

import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post(':storeId')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Rate a store (User only)' })
  @ApiResponse({ status: 201, description: 'Rating submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  create(
    @Param('storeId') storeId: string,
    @Body() createRatingDto: CreateRatingDto,
    @Request() req,
  ) {
    return this.ratingsService.create(
      req.user.userId,
      storeId,
      createRatingDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiResponse({ status: 200, description: 'Return all ratings' })
  findAll(
    @Query('storeId') storeId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.ratingsService.findAll(storeId, userId);
  }

  @Get('my-ratings')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: "Get current user's ratings (User only)" })
  @ApiResponse({ status: 200, description: 'Return user ratings' })
  findMyRatings(@Request() req) {
    return this.ratingsService.findAll(undefined, req.user.userId);
  }

  @Get('store/:storeId/average')
  @ApiOperation({ summary: 'Get average rating for a store' })
  @ApiResponse({ status: 200, description: 'Return average rating' })
  @ApiResponse({ status: 404, description: 'Store not found' })
  getAverageRating(@Param('storeId') storeId: string) {
    return this.ratingsService.getAverageRating(storeId);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total number of ratings' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiResponse({ status: 200, description: 'Return rating count' })
  getCount(@Query('storeId') storeId?: string) {
    return this.ratingsService.getRatingsCount(storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rating by ID' })
  @ApiResponse({ status: 200, description: 'Return rating by ID' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update a rating (Owner only)' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  update(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateRatingDto,
    @Request() req,
  ) {
    return this.ratingsService.update(id, req.user.userId, updateRatingDto);
  }

  @Delete(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a rating (Owner or Admin)' })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.ratingsService.remove(id, req.user.userId, req.user.role);
  }
}
