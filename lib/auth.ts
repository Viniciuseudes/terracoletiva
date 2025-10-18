"use client"

export type UserType = "produtor" | "vendedor" | "admin"

export interface User {
  id: string
  email: string
  name: string
  type: UserType
}

// Mock users database
const MOCK_USERS = {
  "produtor@terracoletiva.com.br": {
    id: "1",
    email: "produtor@terracoletiva.com.br",
    password: "produtor123",
    name: "João Silva",
    type: "produtor" as UserType,
  },
  "vendedor@terracoletiva.com.br": {
    id: "2",
    email: "vendedor@terracoletiva.com.br",
    password: "vendedor123",
    name: "Maria Santos",
    type: "vendedor" as UserType,
  },
  "admin@terracoletiva.com.br": {
    id: "3",
    email: "admin@terracoletiva.com.br",
    password: "admin123",
    name: "Administrador",
    type: "admin" as UserType,
  },
}

export function login(email: string, password: string): User | null {
  const user = MOCK_USERS[email as keyof typeof MOCK_USERS]

  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    }
    return userWithoutPassword
  }

  return null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}
