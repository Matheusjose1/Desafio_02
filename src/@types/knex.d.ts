import 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        usuarios: {
            id: string
            session_id: string
            nome: string
            email: string
            created_at: string
            updated_at: string
        }

        Refeicoes: {
            id: string
            user_id: string
            nome: string
            descricao: string
            incluso_dieta: boolean
            date: number
            created_at: string
            updated_at: string
        }
    }
}