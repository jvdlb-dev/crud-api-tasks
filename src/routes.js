import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler:  (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'Title and description are required' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res
        .writeHead(201)
        .end(JSON.stringify(task))
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.query

      const search = {}
      if (title) search.title = title
      if (description) search.description = description

      const tasks = database.select(
        'tasks',
        Object.keys(search).length ? search : null
      )

      return res
        .end(JSON.stringify(tasks))
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: 'Title and description are required' }))
      }

      const data = {updated_at: new Date()}
      if (title) data.title = title
      if (description) data.description = description

      const rowIndex = database.update('tasks', id, data)

      if (rowIndex === -1) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      return res
        .writeHead(204)
        .end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const rowIndex = database.delete('tasks', id)

      if (rowIndex === -1) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      return res
        .writeHead(204)
        .end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', null).filter((row) => row.id === id)

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: 'Task not found' }))
      }

      const isCompleted = !!task.completed_at
      const completed_at = isCompleted ? null : new Date()

      database.update('tasks', id, { completed_at, updated_at: new Date() })

      return res
        .writeHead(204)
        .end()
    }
  }
]