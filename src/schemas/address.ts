import { z } from "zod";

export const AddressSchema = z.object({
    id: z.string(),
    streetAddress: z.string({ required_error: 'O nome é obrigatório'}),
    number: z.string({required_error: 'O número é obrigatório'}),
    complement: z.string().optional(),
    neighborhood: z.string({ required_error: 'O bairro é obrigatório'}),
    city: z.string({ required_error: 'A cidade é obrigatório'}),
    state: z.string({ required_error: 'O estado é obrigatório'}),
    zipCode: z.string({ required_error: 'O CEP é obrigatório'}),
    country: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    userId: z.string(), // ver depois
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})