import { ZodError } from 'zod'
import fastify from 'fastify'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validations error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.log(error)
} else {
      console.log(error)
  }
  return reply.status(500).send({ message: 'Internal Server Error' })
})
