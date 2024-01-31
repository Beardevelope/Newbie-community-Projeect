import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(
        cors({
            origin: 'http://localhost:3000',
        }),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();
    await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
