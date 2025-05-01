import 'fastify'

declare module 'fastify'{
    export interface FastifyRequest {
        user?: {
            id: string
            session_id: string
            nome: string
            email: string
            created_at: string
            updated_at: string
        }
    }
}