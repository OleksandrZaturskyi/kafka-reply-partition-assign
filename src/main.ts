import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'nest-kafka',
        brokers: ['localhost:9092'],
      },
      producerOnlyMode: true,
      consumer: {
        groupId: 'nest-kafka-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  await app.listen(process.env.PORT);
}

bootstrap();
