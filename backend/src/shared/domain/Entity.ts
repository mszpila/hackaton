import { BadRequestException } from '@nestjs/common';
import { DomainEvent } from './DomainEvent';
import { Identifier } from './Identifier';
import { Equalable } from './IEqualable';
import { Versionable } from './IVersionable';

export abstract class Entity<ID extends Identifier, Snapshot> implements Equalable<Entity<ID, Snapshot>>, Versionable {
  protected constructor(private readonly _id: ID, private _version = 0, private _events: DomainEvent[] = []) {
  }

  get id() {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  public get events(): DomainEvent[] {
    return [...this._events];
  }

  public equals(other: this) {
    return this.id.equals(other.id);
  }

  public setVersion(version: number) {
    if (version < 0) {
      throw new BadRequestException('Version error can be less then zero.');
    }
    this._version = version;
  }

  public incrementVersion() {
    this._version++;
  }

  public abstract toSnapshot(): Snapshot;

  public registerEvent<Event extends DomainEvent>(event: Event): void {
    this._events.push(event);
  }

  public resetEvents(): void {
    this._events = [];
  }
}
