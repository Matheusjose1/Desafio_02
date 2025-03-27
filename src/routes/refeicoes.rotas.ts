import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { verificarSessaoId } from '../middlewares/checar-id-existe'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function refeicoesRotas(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        nome: z.string(),
        descricao: z.string(),
        inclusoDieta: z.boolean(),
        date: z.coerce.date(),
      })

      const { nome, descricao, inclusoDieta, date } = createMealBodySchema.parse(request.body)

      await knex('Refeicoes').insert({
        id: randomUUID(),
        nome,
        descricao,
        incluso_dieta: inclusoDieta,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
      const meals = await knex('Refeicoes')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      return reply.send({ meals })
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })
      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('Refeicoes').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })
      const { mealId } = paramsSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        nome: z.string(),
        descricao: z.string(),
        inclusoDieta: z.boolean(),
        date: z.coerce.date(),
      })

      const { nome, descricao, inclusoDieta, date } = updateMealBodySchema.parse(request.body)

      const meal = await knex('Refeicoes').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('Refeicoes').where({ id: mealId }).update({
        nome,
        descricao,
        incluso_dieta: inclusoDieta,
        date: date.getTime(),
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })
      const { mealId } = paramsSchema.parse(request.params)

      const meal = await knex('Refeicoes').where({ id: mealId }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      await knex('Refeicoes').where({ id: mealId }).delete()

      return reply.status(204).send()
    },
  )

  app.get(
    '/metrics',
    { preHandler: [verificarSessaoId] },
    async (request, reply) => {
        const totalMealsOnDiet = Number(
          Object.values(
            await knex('Refeicoes')
              .where({ user_id: request.user?.id, incluso_dieta: true })
              .count('id as total')
              .first() || { total: 0 }
          )[0]
        );
        
        const totalMealsOffDiet = Number(
          Object.values(
            await knex('Refeicoes')
              .where({ user_id: request.user?.id, incluso_dieta: false })
              .count('id as total')
              .first() || { total: 0 }
          )[0]
        );
        

      const totalMeals = await knex('Refeicoes')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.incluso_dieta) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet,
        totalMealsOffDiet,
        bestOnDietSequence,
      })
    },
  )
}
