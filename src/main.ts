import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import { urlencoded, json } from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));

    app.use(cors({}));
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    await app.listen(parseInt(process.env.PORT) || 3000);
}

bootstrap();
