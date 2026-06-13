import type { z } from "zod"
import type { loginSchema, signupSchema } from "./schema"

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}
