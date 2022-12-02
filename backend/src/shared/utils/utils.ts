import { PassThrough, Readable, Transform, TransformCallback, Writable } from 'stream';
// import util from 'util';

export namespace utils.stream {

  export async function fetchStreamOutput(readable: Readable): Promise<any[]> {
    return await new Promise((resolve, reject) => {
      const results: any[] = [];
      return readable
        .on('data', function(chunk) {
          results.push(chunk);
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }

  // export const pipeline = util.promisify(nodeStream.pipeline);

  export const passThrough = PassThrough;

  export class Profiler {
    private readonly _methodCalls: Map<string, number[]> = new Map<string, number[]>();

    constructor() {
    }

    wrapPromise<T>(promise: Promise<T>, methodUniKey: string): Promise<T> {
      const start = new Date();
      return promise.then(res => {
        this.registerCall(methodUniKey, start);
        return res;
      });
    }

    /**
     * note: method mutates input stream
     * @param stream
     * @param streamName
     */
    wrapStream<T extends Writable>(stream: T, streamName?: string): T {
      streamName = streamName || stream.constructor.name;

      if (stream instanceof Transform) {
        return this.wrapTransformStream(stream, streamName);
      }

      return this.wrapWritableStream(stream, streamName);
    }

    // getProfileResult(): Record<string, utils.stats.Stats> {
    //   const record: Record<string, utils.stats.Stats> = {};
    //
    //   for (const [uniqMethodName, callTimes] of this._methodCalls) {
    //     record[uniqMethodName] = utils.stats.calculate(callTimes);
    //   }
    //
    //   return record;
    // }

    public registerCall(
      methodUniKey: string,
      callStart: Date,
    ) {
      const calls = this._methodCalls.get(methodUniKey) || [];

      calls.push(Date.now() - callStart.getTime());

      if (!this._methodCalls.has(methodUniKey)) {
        this._methodCalls.set(methodUniKey, calls);
      }
    }

    private wrapTransformStream<T extends Transform>(
      stream: T,
      streamName: string,
    ): T {
      const self = this;
      const _transform = stream._transform;
      const _flush = stream._flush;

      stream._transform = function(chunk: any, encoding, callback) {
        const start = new Date();
        _transform.call(stream, chunk, encoding, function(this: any, error?: Error, data?: any) {
          self.registerCall(streamName.concat('._transform'), start);
          callback(error, data);
        });
      };

      if (_flush) {
        stream._flush = function(callback: TransformCallback) {
          const start = new Date();
          _flush.call(stream, function(error, data) {
            self.registerCall(streamName.concat('._flush'), start);
            callback(error, data);
          });
        };
      }

      return stream;
    }

    private wrapWritableStream<T extends Writable>(
      stream: T,
      streamName: string,
    ): T {
      const self = this;
      const _write = stream._write;
      const _final = stream._final;
      const _writev = stream._writev;

      stream._write = function(
        chunk: any,
        encoding: string,
        callback: (error?: Error | null) => void,
      ) {
        const start = new Date();
        _write.call(stream, chunk, encoding, function(error?: Error | null) {
          self.registerCall(streamName.concat('._write'), start);
          callback(error);
        });
      };

      if (_final) {
        stream._final = function(callback: (error?: Error | null) => void) {
          const start = new Date();
          _final.call(stream, function(error) {
            self.registerCall(streamName.concat('._final'), start);
            callback(error);
          });
        };
      }

      if (_writev) {
        stream._writev = function(
          chunks: Array<{ chunk: any, encoding: string }>,
          callback: (error?: Error | null) => void,
        ) {
          const start = new Date();
          _writev.call(stream, chunks, function(error) {
            self.registerCall(streamName.concat('._writev'), start);
            callback(error);
          });
        };
      }

      return stream;
    }
  }

  export class ReadStreamMock extends Readable {
    private _counter: number;
    private readonly _numberOfItems: number;
    private readonly createObject: (num: number) => any;

    constructor(
      numberOfItems: number,
      createObject?: (num: number) => any,
    ) {
      super({
        objectMode: true,
      });

      this._counter = 0;
      this._numberOfItems = numberOfItems;
      this.createObject = createObject ? createObject : function() {
        return {};
      };
    }

    static fromArray<T>(arr: T[]): ReadStreamMock {
      return new ReadStreamMock(
        arr.length,
        i => arr[i],
      );
    }

    static fromRange(start: number, end: number): ReadStreamMock {
      // assert(start <= end);
      // assert(Number.isInteger(start) && Number.isInteger(end), 'integer values required');

      return new ReadStreamMock(
        end - start,
        num => num + start,
      );
    }

    _read(size: number) {
      this.push(this._counter++ < this._numberOfItems ? this.createObject(this._counter - 1) : null);
    }
  }

  export class ChunkStream extends Transform {
    private records: any[] = [];

    constructor(
      private readonly chunkSize: number,
    ) {
      super({ objectMode: true });
      // assert(chunkSize > 0, 'chunk size expected to be gt 0');
    }

    _transform(chunk: any, encoding: string, callback: TransformCallback) {
      try {
        this.records.push(chunk);

        if (this.records.length >= this.chunkSize) {
          const records = this.records;
          this.records = [];
          this.push(records);
        }

        callback();
      } catch (error) {
        callback(error);
      }
    }

    _flush(callback: TransformCallback) {
      if (this.records.length > 0) {
        this.push(this.records);
      }

      this.records = [];
      callback();
    }
  }

  /**
   * [[a, b], [c, d]] -> [a,b,c,d]
   */
  export class FlattenStream extends Transform {
    constructor() {
      super({
        objectMode: true,
      });
    }

    public _transform(chunk: any[], encoding: string, callback: TransformCallback) {
      for (const record of chunk) {
        this.push(record);
      }
      callback();
    }
  }

  export function streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Array<Buffer> = [];

      stream.on('data', function(chunk) {
        chunks.push(chunk);
      });

      stream.on('end', function() {
        resolve(Buffer.concat(chunks));
      });

      stream.on('error', reject);
    });
  }

  export function createReadableFromBuffer(buffer: Buffer) {
    const readable = new Readable();
    readable._read = () => {
    };
    readable.push(buffer);
    readable.push(null);
    return readable;
  }

  /**
   * @stable
   */
  export const promisifyStream = (stream: Writable | Readable): Promise<void> => {
    return new Promise((resolve, reject) => {
      stream
        .on('finish', resolve)
        .on('error', reject);
    });
  };

}
