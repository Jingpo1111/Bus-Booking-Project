const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type UserRole = 'PASSENGER' | 'ADMIN'

interface AuthResponse {
  access_token: string
  user: {
    id: string
    name: string
    email: string
    role: UserRole
  }
}

interface RegisterData {
  name: string
  email: string
  password: string
}

async function request<T>(path: string, body: object): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Server unreachable, please retry')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data.message
    throw new Error(
      Array.isArray(message)
        ? message.join(', ')
        : typeof message === 'string'
          ? message
          : 'Request failed',
    )
  }

  return data as T
}

export function login(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    email,
    password,
  })
}

export function register(data: RegisterData) {
  return request<unknown>('/auth/register', data)
}
