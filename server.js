import http from 'node:http'
import { json } from './src/middlewares/json.js'
import { routes } from './src/routes.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url)
  })

  if (!route){
    return res
      .writeHead(404)
      .end(JSON.stringify({ message: 'Route not found' }))
  }

  const routeParams = req.url.match(route.path)
  const { query, ...params } = routeParams.groups

  req.params = routeParams.groups

  req.query = query ? Object.fromEntries(new URLSearchParams(query)) : {}

  return route.handler(req, res)
})

server.listen(3333, () => {
  console.log('Server is running on http://localhost:3333')
})