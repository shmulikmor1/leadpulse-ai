import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Serves the Vercel functions under api/ during `npm run dev`,
// so local development needs no Vercel CLI.
function devApi() {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()
        const name = req.url.split('?')[0].slice('/api/'.length)
        if (!/^[\w-]+$/.test(name)) {
          res.statusCode = 404
          return res.end()
        }
        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(data))
        }
        try {
          req.body = await readJsonBody(req)
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, res)
        } catch (err) {
          console.error(err)
          if (!res.writableEnded) res.status(500).json({ error: 'Internal error' })
        }
      })
    },
  }
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

export default defineConfig(({ mode }) => {
  // Expose .env to the API code in dev, the way Vercel does in production.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return { plugins: [react(), tailwindcss(), devApi()] }
})
