import { z } from "zod";

export const AddressSchema = z.object({
    id: z.string(),
    streetAddress: z.string({ required_error: 'O nome é obrigatório'}).min(1, 'Capo obrigatório'),
    number: z.string({required_error: 'O número é obrigatório'}).min(1, 'Capo obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string({ required_error: 'O bairro é obrigatório'}).min(1, 'Capo obrigatório'),
    city: z.string({ required_error: 'A cidade é obrigatório'}).min(1, 'Capo obrigatório'),
    state: z.string({ required_error: 'O estado é obrigatório'}).min(1, 'Capo obrigatório'),
    zipCode: z.string({ required_error: 'O CEP é obrigatório'}).min(1, 'Capo obrigatório'),
    country: z.string().min(1, 'Capo obrigatório'),
    latitude: z.string().min(1, 'Capo obrigatório'),
    longitude: z.string().min(1, 'Capo obrigatório'),
    userId: z.string(), // ver depois
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})