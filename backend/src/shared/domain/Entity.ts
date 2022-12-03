import { Identifier } from './Identifier';

export abstract class Entity<ID extends Identifier, Snapshot> {
  protected constructor(private readonly _id: ID) {
  }

  get id() {
    return this._id;
  }

  public abstract toSnapshot(): Snapshot;
}
