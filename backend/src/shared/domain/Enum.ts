// import { Writeable } from './interfaces/Writeable';
import { UnprocessableEntityException } from '@nestjs/common';
import * as util from 'util';
import { Equalable } from './IEqualable';

type SimpleEnumValue = string | number;

/**
 * Base class for Enums
 *
 *
 * @example
 * ```typescript
 *  // note: each class should be decorated by @Enum.decorate()
 *  // otherwise object comparison will be broken
 *  @Enum.decorate()
 *  class MyEnum extends Enum {
 *    public static readonly A = new MyEnum('A');
 *    public static readonly B = new MyEnum('B');
 *  }
 * ```
 */
export class Enum<T extends SimpleEnumValue = SimpleEnumValue> implements Equalable<any> {

  /**
   * @final
   * @param value
   */
  constructor(protected value: T) {
    if (this.hasAllowedValues()) {
      const obj = this.getAllowedMetaValue().get(value);

      if (!obj) {
        throw new UnprocessableEntityException(`Illegal value "${ value }" for enum ${ this.constructor.name }`);
      }

      return obj;
    }

    // this.initialize();
  }

  static decorate() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function classDecorator<C extends { new(...args: any[]): {} }>(constructor: C) {
      const allowedObjectsStorage = new Map<SimpleEnumValue, any>();

      for (const propertyKey in constructor) {
        // eslint-disable-next-line no-prototype-builtins
        if (constructor.hasOwnProperty(propertyKey) && constructor[propertyKey] instanceof constructor) {
          const strKey: string = (constructor[propertyKey] as any).value;

          if (allowedObjectsStorage.has(strKey)) {
            throw new Error(`Duplicate key "${ strKey }" in enum ${ constructor.name }`);
          }

          allowedObjectsStorage.set(strKey, constructor[propertyKey]);
        }
      }

      Reflect.defineMetadata('enum:values', allowedObjectsStorage, constructor.prototype);
    };
  }

  valueOf(): T {
    return this.value;
  }

  toString() {
    return `${ this.value }`;
  }

  /** @param other */
  public equals(other: any): boolean {
    if (!this.hasAllowedValues()) {
      throw new Error(util.format('Use @EnumOld.decorate() to decorate your enum "%s"', this.constructor.name));
    }
    return this === other;
  }

  /**
   * Override initialize if you want to add additional properties into your EnumOld
   */
  // protected initialize(this: Writeable<this>) {}
  // protected initialize(this: any) {}

  private hasAllowedValues(): boolean {
    return Reflect.hasMetadata('enum:values', this);
  }

  private getAllowedMetaValue(): Map<T, any> {
    return Reflect.getMetadata('enum:values', this);
  }
}
