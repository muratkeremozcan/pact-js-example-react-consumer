// in the real world, this file which is from the server side
// would be published in a package and installed here

import {z} from 'zod'
import {extendZodWithOpenApi} from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const CreateMovieSchema = z
  .object({
    id: z.number().optional().openapi({example: 1, description: 'Movie ID'}),
    name: z
      .string()
      .min(1)
      .openapi({example: 'Inception', description: 'Movie name'}),
    year: z
      .number()
      .int()
      .min(1900)
      .max(2024)
      .openapi({example: 2010, description: 'Release year'}),
  })
  .openapi('CreateMovieRequest')

export const UpdateMovieSchema = z
  .object({
    id: z.number().optional().openapi({example: 1, description: 'Movie ID'}),
    name: z
      .string()
      .min(1)
      .optional()
      .openapi({example: 'Inception', description: 'Movie name'}),
    year: z
      .number()
      .int()
      .min(1900)
      .max(2024)
      .optional()
      .openapi({example: 2010, description: 'Release year'}),
  })
  .openapi('UpdateMovieRequest')
