import {FastifyInstance} from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function usersRoutes (app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const criarUsuario = z.object({
            nome: z.string(),
            email: z.string().email(),
        })

        let sessionId = request.cookies.sessionId

        if(!sessionId){
            sessionId = randomUUID()

            reply.setCookie('sessionId', sessionId, {path: '/', maxAge: 1000 * 60 * 24 * 7,

            })
        }

        const { nome, email } = criarUsuario.parse(request.body)

        const userByEmail = await knex('usuarios').where({email}).first()

        if(userByEmail) {
            return reply.status(400).send({message: 'Usuário já existe'})
        }

        await knex ('usuarios').insert({
            id: randomUUID(),
            nome,
            email,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}