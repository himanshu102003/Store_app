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
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stores_service_1 = require("./stores.service");
const create_store_dto_1 = require("./dto/create-store.dto");
const update_store_dto_1 = require("./dto/update-store.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const roles_guard_1 = require("../auth/guards/roles.guard");
let StoresController = class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    create(createStoreDto) {
        return this.storesService.create(createStoreDto);
    }
    async findAll(search, ownerId) {
        return this.storesService.findAll(search, ownerId);
    }
    async findMyStore(req) {
        const userId = req.user.userId;
        const result = await this.storesService.findAll(undefined, userId);
        if (result.data.length === 0) {
            throw new Error('No store found for this user');
        }
        return result.data[0];
    }
    async getStoresCount() {
        return this.storesService.getStoresCount();
    }
    findOne(id) {
        return this.storesService.findOne(id);
    }
    update(id, updateStoreDto, req) {
        if (req.user.role === user_entity_1.UserRole.STORE_OWNER) {
            return this.storesService.findOne(id).then((store) => {
                if (store.owner.id !== req.user.userId) {
                    throw new Error('You can only update your own store');
                }
                return this.storesService.update(id, updateStoreDto);
            });
        }
        return this.storesService.update(id, updateStoreDto);
    }
    remove(id) {
        return this.storesService.remove(id);
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new store (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Store created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_store_dto_1.CreateStoreDto]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all stores' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'ownerId', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all stores' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-store'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.STORE_OWNER),
    (0, swagger_1.ApiOperation)({ summary: "Get current user's store (Store Owner only)" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return store' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findMyStore", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get total number of stores (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return store count' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getStoresCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get store by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return store by ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.STORE_OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Update a store (Admin or Store Owner)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Store updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_store_dto_1.UpdateStoreDto, Object]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a store (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Store deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Store not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StoresController.prototype, "remove", null);
exports.StoresController = StoresController = __decorate([
    (0, swagger_1.ApiTags)('stores'),
    (0, common_1.Controller)('stores'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
//# sourceMappingURL=stores.controller.js.map