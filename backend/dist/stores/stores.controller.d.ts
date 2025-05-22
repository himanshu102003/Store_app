import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(createStoreDto: CreateStoreDto): Promise<import("./entities/store.entity").Store>;
    findAll(search?: string, ownerId?: string): Promise<{
        data: import("./entities/store.entity").Store[];
        count: number;
    }>;
    findMyStore(req: any): Promise<import("./entities/store.entity").Store>;
    getStoresCount(): Promise<number>;
    findOne(id: string): Promise<import("./entities/store.entity").Store>;
    update(id: string, updateStoreDto: UpdateStoreDto, req: any): Promise<import("./entities/store.entity").Store>;
    remove(id: string): Promise<void>;
}
