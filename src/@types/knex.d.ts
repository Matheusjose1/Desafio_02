import 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        usuarios: {
            id: string
            session_id: string
            nome: string
            email: string
            criado_em: string
            atualizado_em: string
        }

        Refeicoes: {
            id: string
            user_id: string
            nome: string
             descricao: string
            incluso_dieta: boolean
            date: number
            criado_em: string
            atualizado_em: string
        }
    }
}