import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'HERO_SERVICE',
        useFactory: async () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'hero',
              brokers: ['localhost:9092'],
            },
            consumer: {
              groupId: 'hero-consumer',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
