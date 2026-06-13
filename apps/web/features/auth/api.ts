import type { AuthResponse, LoginInput, SignupInput } from "./types"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function loginApi(data: LoginInput): Promise<AuthResponse> {
  await delay(1000)

  // Mocking successful login
  if (data.email === "error@stried.com") {
    throw new Error("Invalid email or password")
  }

  return {
    user: {
      id: "usr-1",
      name: "Demo User",
      email: data.email,
    },
    token: "mock-jwt-token-xyz",
  }
}

export async function signupApi(data: SignupInput): Promise<AuthResponse> {
  await delay(1000)

  // Mocking successful signup
  if (data.email === "exists@stried.com") {
    throw new Error("Email is already registered")
  }

  return {
    user: {
      id: "usr-2",
      name: data.name,
      email: data.email,
    },
    token: "mock-jwt-token-abc",
  }
}
