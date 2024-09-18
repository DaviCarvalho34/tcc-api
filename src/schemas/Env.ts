// config/envSchema.js
import { z } from 'zod';

const envSchema = z.object({
  DB_USER: z.string().min(1, { message: 'DB_USER é uma variável obrigatória.' }),
  DB_HOST: z.string().min(1, { message: 'DB_HOST é uma variável obrigatória.' }),
  DB_NAME: z.string().min(1, { message: 'DB_NAME é uma variável obrigatória.' }),
  DB_PASSWORD: z.string().min(1, { message: 'DB_PASSWORD é uma variável obrigatória.' }),
  DB_PORT: z
    .string()
    .min(1, { message: 'DB_PORT é uma variável obrigatória.' })
    .transform((port) => parseInt(port, 10))
    .refine((port) => !isNaN(port) && port > 0 && port < 65536, {
      message: 'DB_PORT deve ser um número válido entre 1 e 65535.',
    }),
});


export default envSchema;