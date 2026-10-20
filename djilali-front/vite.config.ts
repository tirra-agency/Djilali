import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import subscribeHandler from './api/subscribe.ts';
import contactHandler from './api/contact.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if ((req.url === '/api/subscribe' || req.url === '/api/contact') && req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const currentEnv = loadEnv(mode, process.cwd(), '');
                  Object.assign(process.env, currentEnv);

                  const parsedBody = body ? JSON.parse(body) : {};
                  const mockRes = {
                    status(code: number) {
                      res.statusCode = code;
                      return this;
                    },
                    json(data: any) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                  };
                  
                  const targetHandler = req.url === '/api/contact' ? contactHandler : subscribeHandler;
                  await targetHandler(
                    {
                      method: req.method,
                      body: parsedBody,
                      headers: req.headers as any,
                    },
                    mockRes
                  );
                } catch (err: any) {
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
  };
});
