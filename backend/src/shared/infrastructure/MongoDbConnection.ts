import { ConnectOptions, createConnection } from 'mongoose';

export const establishMongoDbConnection = async (options?: ConnectOptions) => {
  return createConnection(process.env.MONGO_URI!, options);
};

export const MongoDbConnection = Symbol.for('MongoDbConnection');