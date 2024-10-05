// in the real world, this file which is from the server side
// would be published in a package and installed here

import type {z} from 'zod'
import type {
  CreateMovieResponseSchema,
  CreateMovieSchema,
  GetMovieResponseUnionSchema,
  MovieNotFoundResponseSchema,
  DeleteMovieResponseSchema,
  ConflictMovieResponseSchema,
  UpdateMovieSchema,
  UpdateMovieResponseSchema,
} from './schema'
// import type { Movie } from '@prisma/client'

// Zod Key feature 2: link the schemas to the types

export type CreateMovieRequest = z.infer<typeof CreateMovieSchema>
// export type CreateMovieRequest = Omit<Movie, 'id'>

export type CreateMovieResponse = z.infer<typeof CreateMovieResponseSchema>
// export type CreateMovieResponse = {
//   status: number
//   error?: string
//   movie?: Movie
// }

export type ConflictMovieResponse = z.infer<typeof ConflictMovieResponseSchema>

export type GetMovieResponse = z.infer<typeof GetMovieResponseUnionSchema>
// export type GetMovieResponse = Movie | null

export type MovieNotFoundResponse = z.infer<typeof MovieNotFoundResponseSchema>

export type DeleteMovieResponse = z.infer<typeof DeleteMovieResponseSchema>

export type UpdateMovieRequest = z.infer<typeof UpdateMovieSchema>

export type UpdateMovieResponse = z.infer<typeof UpdateMovieResponseSchema>
