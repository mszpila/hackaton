import { ObjectID } from 'bson';

export class Identifier {
  private readonly value: string;

  constructor(id?: string) {
    this.value = new ObjectID(id).toHexString();
  }

  toString(): string {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.toString();
  }

  toObjectID(): ObjectID {
    return new ObjectID(this.value);
  }
}
