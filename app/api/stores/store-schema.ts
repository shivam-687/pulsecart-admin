import { z } from "zod";

export const CreateStoreSchema = z.object({
    name: z.string().min(1),
    slug: z.string()
})

export type CreateStoreInput = z.TypeOf<typeof CreateStoreSchema>;

export const UpdateStoreSchema = z.object({
    id: z.string()
}).merge(CreateStoreSchema);

export type UpdateStoreInput = z.TypeOf<typeof UpdateStoreSchema>;

