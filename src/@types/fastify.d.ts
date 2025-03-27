import 'fastify'

declare module 'fastify'{
    export interface FastifyRequest {
        user?: {
            id: string
            session_id: string
            nome: string
            email: string
            criado_em: string
            atualizado_em: string
        }
    }
}