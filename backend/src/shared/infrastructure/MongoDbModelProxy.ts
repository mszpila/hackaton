import { BadRequestException } from '@nestjs/common';
import { ObjectID } from 'bson';
import mongoose from 'mongoose';
import { Entity } from '../domain/Entity';
import { Identifier } from '../domain/Identifier';
import { MongoDbTranslator } from './MongoDbTranslator';

export class MongoDbModelProxy<Model extends mongoose.Document, Snapshot extends Object, ID extends Identifier, Ent extends Entity<ID, Snapshot>> {
  constructor(
    private readonly model: mongoose.Model<Model>,
    private readonly translator: MongoDbTranslator<Ent, Snapshot>,
  ) {
  }

  public getRawModel(): mongoose.Model<Model> {
    return this.model;
  }

  public async save(entity: Ent): Promise<void> {
    let fetchedDocument = await this.model.findById(entity.id.toObjectID());

    if (fetchedDocument) {
      return this.update(entity, fetchedDocument);
    }

    const document = { ...entity.toSnapshot(), version: entity.version };
    await this.model.create(document);
  }

  public async list(query: mongoose.FilterQuery<Model>, offset: number, limit: number, sort?: string): Promise<Ent[]> {
    const documents = await this.model.find(query, null, { sort: `${ sort || '-_id' }`, skip: offset, limit });

    return documents.map(document => {
      return this.extendEntityWithVersion(document);
    });
  }

  public async count(args: mongoose.FilterQuery<Model>): Promise<number> {
    return this.model.countDocuments(args);
  }

  public async find(args: mongoose.FilterQuery<Model>, projection?: any | null, options?: any | null): Promise<Ent[]> {
    const documents = await this.model.find(args, projection, options);

    return documents.map((document) => {
      return this.extendEntityWithVersion(document);
    });
  }

  public async findOne(args: mongoose.FilterQuery<Model>, projection?: Record<string, any>): Promise<Ent | null> {
    const document = await this.model.findOne(args, projection);

    if (!document) {
      return null;
    }

    return this.extendEntityWithVersion(document);
  }

  public async findById(id: ObjectID): Promise<Ent | null> {
    const document = await this.model.findById(id);

    if (!document) {
      return null;
    }

    return this.extendEntityWithVersion(document);
  }

  private async update(entity: Ent, document: mongoose.Document): Promise<void> {
    const filterQuery = {
      _id: entity.id.toObjectID(),
      version: entity.version,
    };

    const updateQuery = {
      $set: {
        ...entity.toSnapshot(),
      },
      $inc: {
        version: 1,
      },
    };

    const { modifiedCount } = await this.model.updateOne(
      filterQuery as any,
      updateQuery as any,
    );

    if (modifiedCount === 0) {
      throw new BadRequestException({
        collection: this.model.collection.name,
        oldVersion: entity.version,
        documentId: entity.id.toString(),
        db: 'MongoDB',
      });
    }
    entity.incrementVersion();
  }

  private extendEntityWithVersion(document: mongoose.Document): Ent {
    const entity = this.translator.toEntity(document);
    entity.setVersion(document['version'] || 0);

    return entity;
  }
}