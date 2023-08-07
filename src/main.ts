import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { join } from 'path';
import secureSession from '@fastify/secure-session';
import * as crypto from 'crypto'
import { AppDataSource } from './services/mysql.service';
import { GlobalExceptionFilter } from './middleware/notfound.middleware';


async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  AppDataSource.initialize().then(() => console.log('Database connect success')).catch((err) => console.log('Database connect not success'))

  app.enableCors()
  app.useStaticAssets({
    root: join(__dirname, '..', 'src/assets/static/'),
    prefix: '/static/',
  });
  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'src/assets/views'),
    layout: 'layouts/main'
  });

  const key = crypto.randomBytes(32)
  
  await app.register(secureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',
    key: key,
    cookieName: 'session',
    cookie: {
      secure: true,
      expires: new Date(Date.now() + 3600000),
      path: '/'
    }
  });
  //app.useGlobalFilters(new GlobalExceptionFilter())
  await app.listen(process.env.PORT ?? 3000, process.env.HOST || '0.0.0.0');
}
bootstrap();