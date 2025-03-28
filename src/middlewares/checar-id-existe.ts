import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function verificarSessaoId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  const user = await knex('usuarios').where({ session_id: sessionId }).first()

  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized' })
  }

  request.user = user
}