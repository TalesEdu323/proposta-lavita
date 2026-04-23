import http from 'http';
import dotenv from 'dotenv';
import { createApp, attachViteOrStatic } from './src/server/app.js';

dotenv.config();

async function listenWithPortFallback(
  server: http.Server,
  preferredPort: number,
  host: string,
  maxExtraAttempts: number,
): Promise<number> {
  let lastErr: unknown;
  for (let offset = 0; offset <= maxExtraAttempts; offset++) {
    const port = preferredPort + offset;
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (err: NodeJS.ErrnoException) => {
          server.removeListener('error', onError);
          reject(err);
        };
        server.once('error', onError);
        server.listen(port, host, () => {
          server.removeListener('error', onError);
          resolve();
        });
      });
      return port;
    } catch (err) {
      lastErr = err;
      if (
        maxExtraAttempts > 0 &&
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as NodeJS.ErrnoException).code === 'EADDRINUSE'
      ) {
        console.warn(
          `[dev] Porta ${port} em uso — tentando ${port + 1}… (${offset + 1}/${maxExtraAttempts + 1})`,
        );
        continue;
      }
      throw err;
    }
  }
  console.error(`Falha ao abrir porta após ${maxExtraAttempts + 1} tentativas (início ${preferredPort}).`);
  throw lastErr;
}

async function startServer() {
  const { app, config } = await createApp();
  const httpServer = http.createServer(app);
  await attachViteOrStatic(app, config.nodeEnv, httpServer);

  const isProd = config.nodeEnv === 'production';
  const boundPort = await listenWithPortFallback(
    httpServer,
    config.port,
    '0.0.0.0',
    isProd ? 0 : 9,
  );

  if (!isProd && boundPort !== config.port) {
    console.warn(
      `[dev] Servidor em http://localhost:${boundPort} (PORT no .env é ${config.port}). Ajuste PORT=${boundPort} se precisar de URL fixa.`,
    );
  } else {
    console.log(`Server running on http://localhost:${boundPort}`);
  }
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exitCode = 1;
});
