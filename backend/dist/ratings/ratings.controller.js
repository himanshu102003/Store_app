"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ratings_service_1 = require("./ratings.service");
const create_rating_dto_1 = require("./dto/create-rating.dto");
const update_rating_dto_1 = require("./dto/update-rating.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const roles_guard_1 = require("../auth/guards/roles.guard");
let RatingsController = class RatingsController {
    constructor(ratingsService) {
        this.ratingsService = ratingsService;
    }
    create(storeId, createRatingDto, req) {
        return this.ratingsService.create(req.user.userId, storeId, createRatingDto);
    }
    findAll(storeId, userId) {
        return this.ratingsService.findAll(storeId, userId);
    }
    findMyRatings(req) {
        return this.ratingsService.findAll(undefined, req.user.userId);
    }
    getAverageRating(storeId) {
        return this.ratingsService.getAverageRating(storeId);
    }
    getCount(storeId) {
        return this.ratingsService.getRatingsCount(storeId);
    }
    findOne(id) {
        return this.ratingsService.findOne(id);
    }
    update(id, updateRatingDto, req) {
        return this.ratingsService.update(id, req.user.userId, updateRatingDto);
    }
    remove(id, req) {
        return this.ratingsService.remove(id, req.user.userId, req.user.role);
    }
};
exports.RatingsController = RatingsController;
__decorate([
    (0, common_1.Post)(':storeId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: 'Rate a store (User only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Rating submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Param)('storeId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_rating_dto_1.CreateRatingDto, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all ratings' }),
    (0, swagger_1.ApiQuery)({ name: 'storeId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all ratings' }),
    __param(0, (0, common_1.Query)('storeId')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-ratings'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's ratings (User only)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return user ratings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findMyRatings", null);
__decorate([
    (0, common_1.Get)('store/:storeId/average'),
    (0, swagger_1.ApiOperation)({ summary: 'Get average rating for a store' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return average rating' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Param)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "getAverageRating", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total number of ratings' }),
    (0, swagger_1.ApiQuery)({ name: 'storeId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return rating count' }),
    __param(0, (0, common_1.Query)('storeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "getCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rating by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return rating by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a rating (Owner only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rating_dto_1.UpdateRatingDto, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.USER, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a rating (Owner or Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rating deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rating not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RatingsController.prototype, "remove", null);
exports.RatingsController = RatingsController = __decorate([
    (0, swagger_1.ApiTags)('ratings'),
    (0, common_1.Controller)('ratings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ratings_service_1.RatingsService])
], RatingsController);
//# sourceMappingURL=ratings.controller.js.map