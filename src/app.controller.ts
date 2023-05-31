import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject('HERO_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('hero.kill.dragon');
    await this.kafkaClient.connect();
  }

  @MessagePattern('hero.kill.dragon')
  handle(@Payload() { message }: any) {
    this.logger.debug(message);
    return { message: 'world' };
  }

  @Get()
  async sendMessage() {
    const { message } = await lastValueFrom(
      this.kafkaClient.send('hero.kill.dragon', {
        message: 'hello',
      }),
    );
    this.logger.debug(message);
  }
}
