import z from "zod"

const register = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(3)
})

const login = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export { login, register}