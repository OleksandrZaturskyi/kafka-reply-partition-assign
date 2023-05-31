import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ConsumerGroupJoinEvent } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'HERO_SERVICE',
        useFactory: async () => ({
          customClass: class CustomClientKafka extends ClientKafka {
            protected setConsumerAssignments(data: ConsumerGroupJoinEvent) {
              const consumerAssignments: { [key: string]: number } = {};

              Object.keys(data.payload.memberAssignment).forEach((topic) => {
                const memberPartitions = data.payload.memberAssignment[topic];

                // add memberPartitions.length guard
                if (memberPartitions.length) {
                  const minimumPartition = Math.min(...memberPartitions);
                  consumerAssignments[topic] = minimumPartition;
                }
              });

              this.consumerAssignments = consumerAssignments;
            }
          },

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
