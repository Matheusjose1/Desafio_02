import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users.routes'
import { refeicoesRotas } from './routes/refeicoes.rotas'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {prefix: 'users'})
app.register(refeicoesRotas, {prefix: 'meals'})

