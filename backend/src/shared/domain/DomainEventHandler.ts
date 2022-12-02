import { Injectable } from '@nestjs/common';
import { DomainEvent } from './DomainEvent';

@Injectable()
export abstract class DomainEventHandler<E extends DomainEvent = DomainEvent> {
  abstract $eventName?: string;
  abstract $eventVersion?: number;
  abstract $eventConstructor?: any;

  abstract handlerName(): string;

  abstract handle(message: E): Promise<void> | void;
}