import { Document } from 'mongoose';

export abstract class MongoDbTranslator<Entity, Snapshot> {
  public abstract toEntity(plainObject: Document): Entity;

  public abstract toSnapshot(entity: Entity): Snapshot;
}