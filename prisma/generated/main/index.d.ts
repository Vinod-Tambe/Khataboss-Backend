
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Owner
 * 
 */
export type Owner = $Result.DefaultSelection<Prisma.$OwnerPayload>
/**
 * Model Firm
 * 
 */
export type Firm = $Result.DefaultSelection<Prisma.$FirmPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OwnerStatus: {
  Active: 'Active',
  Inactive: 'Inactive'
};

export type OwnerStatus = (typeof OwnerStatus)[keyof typeof OwnerStatus]


export const FirmType: {
  Sole_Proprietorship: 'Sole_Proprietorship',
  Partnership: 'Partnership',
  LLP: 'LLP',
  Private_Ltd: 'Private_Ltd',
  Other: 'Other'
};

export type FirmType = (typeof FirmType)[keyof typeof FirmType]


export const FirmBalanceType: {
  DR: 'DR',
  CR: 'CR'
};

export type FirmBalanceType = (typeof FirmBalanceType)[keyof typeof FirmBalanceType]


export const AccountBalanceType: {
  CR: 'CR',
  DR: 'DR'
};

export type AccountBalanceType = (typeof AccountBalanceType)[keyof typeof AccountBalanceType]


export const UserGender: {
  Male: 'Male',
  Female: 'Female',
  Other: 'Other'
};

export type UserGender = (typeof UserGender)[keyof typeof UserGender]


export const UserMaritalStatus: {
  Single: 'Single',
  Married: 'Married',
  Divorced: 'Divorced',
  Widowed: 'Widowed',
  Other: 'Other'
};

export type UserMaritalStatus = (typeof UserMaritalStatus)[keyof typeof UserMaritalStatus]

}

export type OwnerStatus = $Enums.OwnerStatus

export const OwnerStatus: typeof $Enums.OwnerStatus

export type FirmType = $Enums.FirmType

export const FirmType: typeof $Enums.FirmType

export type FirmBalanceType = $Enums.FirmBalanceType

export const FirmBalanceType: typeof $Enums.FirmBalanceType

export type AccountBalanceType = $Enums.AccountBalanceType

export const AccountBalanceType: typeof $Enums.AccountBalanceType

export type UserGender = $Enums.UserGender

export const UserGender: typeof $Enums.UserGender

export type UserMaritalStatus = $Enums.UserMaritalStatus

export const UserMaritalStatus: typeof $Enums.UserMaritalStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Owners
 * const owners = await prisma.owner.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Owners
   * const owners = await prisma.owner.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.owner`: Exposes CRUD operations for the **Owner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Owners
    * const owners = await prisma.owner.findMany()
    * ```
    */
  get owner(): Prisma.OwnerDelegate<ExtArgs>;

  /**
   * `prisma.firm`: Exposes CRUD operations for the **Firm** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Firms
    * const firms = await prisma.firm.findMany()
    * ```
    */
  get firm(): Prisma.FirmDelegate<ExtArgs>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Owner: 'Owner',
    Firm: 'Firm',
    Account: 'Account',
    User: 'User'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "owner" | "firm" | "account" | "user"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Owner: {
        payload: Prisma.$OwnerPayload<ExtArgs>
        fields: Prisma.OwnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OwnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OwnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          findFirst: {
            args: Prisma.OwnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OwnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          findMany: {
            args: Prisma.OwnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>[]
          }
          create: {
            args: Prisma.OwnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          createMany: {
            args: Prisma.OwnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OwnerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>[]
          }
          delete: {
            args: Prisma.OwnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          update: {
            args: Prisma.OwnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          deleteMany: {
            args: Prisma.OwnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OwnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OwnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPayload>
          }
          aggregate: {
            args: Prisma.OwnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOwner>
          }
          groupBy: {
            args: Prisma.OwnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<OwnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.OwnerCountArgs<ExtArgs>
            result: $Utils.Optional<OwnerCountAggregateOutputType> | number
          }
        }
      }
      Firm: {
        payload: Prisma.$FirmPayload<ExtArgs>
        fields: Prisma.FirmFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FirmFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FirmFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          findFirst: {
            args: Prisma.FirmFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FirmFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          findMany: {
            args: Prisma.FirmFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>[]
          }
          create: {
            args: Prisma.FirmCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          createMany: {
            args: Prisma.FirmCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FirmCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>[]
          }
          delete: {
            args: Prisma.FirmDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          update: {
            args: Prisma.FirmUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          deleteMany: {
            args: Prisma.FirmDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FirmUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FirmUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FirmPayload>
          }
          aggregate: {
            args: Prisma.FirmAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFirm>
          }
          groupBy: {
            args: Prisma.FirmGroupByArgs<ExtArgs>
            result: $Utils.Optional<FirmGroupByOutputType>[]
          }
          count: {
            args: Prisma.FirmCountArgs<ExtArgs>
            result: $Utils.Optional<FirmCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OwnerCountOutputType
   */

  export type OwnerCountOutputType = {
    users: number
    firms: number
    accounts: number
  }

  export type OwnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | OwnerCountOutputTypeCountUsersArgs
    firms?: boolean | OwnerCountOutputTypeCountFirmsArgs
    accounts?: boolean | OwnerCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * OwnerCountOutputType without action
   */
  export type OwnerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerCountOutputType
     */
    select?: OwnerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OwnerCountOutputType without action
   */
  export type OwnerCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OwnerCountOutputType without action
   */
  export type OwnerCountOutputTypeCountFirmsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FirmWhereInput
  }

  /**
   * OwnerCountOutputType without action
   */
  export type OwnerCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }


  /**
   * Count Type FirmCountOutputType
   */

  export type FirmCountOutputType = {
    users: number
    accounts: number
  }

  export type FirmCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | FirmCountOutputTypeCountUsersArgs
    accounts?: boolean | FirmCountOutputTypeCountAccountsArgs
  }

  // Custom InputTypes
  /**
   * FirmCountOutputType without action
   */
  export type FirmCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FirmCountOutputType
     */
    select?: FirmCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FirmCountOutputType without action
   */
  export type FirmCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * FirmCountOutputType without action
   */
  export type FirmCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Owner
   */

  export type AggregateOwner = {
    _count: OwnerCountAggregateOutputType | null
    _avg: OwnerAvgAggregateOutputType | null
    _sum: OwnerSumAggregateOutputType | null
    _min: OwnerMinAggregateOutputType | null
    _max: OwnerMaxAggregateOutputType | null
  }

  export type OwnerAvgAggregateOutputType = {
    own_id: number | null
    own_product_key: number | null
  }

  export type OwnerSumAggregateOutputType = {
    own_id: number | null
    own_product_key: number | null
  }

  export type OwnerMinAggregateOutputType = {
    own_id: number | null
    own_uuid: string | null
    own_product_key: number | null
    own_db: string | null
    own_add_date: Date | null
    own_first_name: string | null
    own_middle_name: string | null
    own_last_name: string | null
    own_phone_no: string | null
    own_mobile_no: string | null
    own_email: string | null
    own_login_id: string | null
    own_password: string | null
    own_status: $Enums.OwnerStatus | null
    own_refresh_token: string | null
    own_refresh_expiry: Date | null
    own_jwt_token: string | null
    own_jwt_expiry: Date | null
    own_login_status: boolean | null
    own_otp: string | null
    own_otp_expiry: Date | null
    own_address: string | null
    own_village: string | null
    own_city: string | null
    own_state: string | null
    own_pincode: string | null
    own_created_at: Date | null
    own_created_by: string | null
    own_updated_at: Date | null
    own_updated_by: string | null
    own_deleted_at: Date | null
    own_deleted_by: string | null
    own_is_deleted: boolean | null
  }

  export type OwnerMaxAggregateOutputType = {
    own_id: number | null
    own_uuid: string | null
    own_product_key: number | null
    own_db: string | null
    own_add_date: Date | null
    own_first_name: string | null
    own_middle_name: string | null
    own_last_name: string | null
    own_phone_no: string | null
    own_mobile_no: string | null
    own_email: string | null
    own_login_id: string | null
    own_password: string | null
    own_status: $Enums.OwnerStatus | null
    own_refresh_token: string | null
    own_refresh_expiry: Date | null
    own_jwt_token: string | null
    own_jwt_expiry: Date | null
    own_login_status: boolean | null
    own_otp: string | null
    own_otp_expiry: Date | null
    own_address: string | null
    own_village: string | null
    own_city: string | null
    own_state: string | null
    own_pincode: string | null
    own_created_at: Date | null
    own_created_by: string | null
    own_updated_at: Date | null
    own_updated_by: string | null
    own_deleted_at: Date | null
    own_deleted_by: string | null
    own_is_deleted: boolean | null
  }

  export type OwnerCountAggregateOutputType = {
    own_id: number
    own_uuid: number
    own_product_key: number
    own_db: number
    own_add_date: number
    own_first_name: number
    own_middle_name: number
    own_last_name: number
    own_phone_no: number
    own_mobile_no: number
    own_email: number
    own_login_id: number
    own_password: number
    own_status: number
    own_profile_img: number
    own_refresh_token: number
    own_refresh_expiry: number
    own_jwt_token: number
    own_jwt_expiry: number
    own_login_status: number
    own_last_login_system: number
    own_otp: number
    own_otp_expiry: number
    own_address: number
    own_village: number
    own_city: number
    own_state: number
    own_pincode: number
    own_created_at: number
    own_created_by: number
    own_updated_at: number
    own_updated_by: number
    own_deleted_at: number
    own_deleted_by: number
    own_is_deleted: number
    _all: number
  }


  export type OwnerAvgAggregateInputType = {
    own_id?: true
    own_product_key?: true
  }

  export type OwnerSumAggregateInputType = {
    own_id?: true
    own_product_key?: true
  }

  export type OwnerMinAggregateInputType = {
    own_id?: true
    own_uuid?: true
    own_product_key?: true
    own_db?: true
    own_add_date?: true
    own_first_name?: true
    own_middle_name?: true
    own_last_name?: true
    own_phone_no?: true
    own_mobile_no?: true
    own_email?: true
    own_login_id?: true
    own_password?: true
    own_status?: true
    own_refresh_token?: true
    own_refresh_expiry?: true
    own_jwt_token?: true
    own_jwt_expiry?: true
    own_login_status?: true
    own_otp?: true
    own_otp_expiry?: true
    own_address?: true
    own_village?: true
    own_city?: true
    own_state?: true
    own_pincode?: true
    own_created_at?: true
    own_created_by?: true
    own_updated_at?: true
    own_updated_by?: true
    own_deleted_at?: true
    own_deleted_by?: true
    own_is_deleted?: true
  }

  export type OwnerMaxAggregateInputType = {
    own_id?: true
    own_uuid?: true
    own_product_key?: true
    own_db?: true
    own_add_date?: true
    own_first_name?: true
    own_middle_name?: true
    own_last_name?: true
    own_phone_no?: true
    own_mobile_no?: true
    own_email?: true
    own_login_id?: true
    own_password?: true
    own_status?: true
    own_refresh_token?: true
    own_refresh_expiry?: true
    own_jwt_token?: true
    own_jwt_expiry?: true
    own_login_status?: true
    own_otp?: true
    own_otp_expiry?: true
    own_address?: true
    own_village?: true
    own_city?: true
    own_state?: true
    own_pincode?: true
    own_created_at?: true
    own_created_by?: true
    own_updated_at?: true
    own_updated_by?: true
    own_deleted_at?: true
    own_deleted_by?: true
    own_is_deleted?: true
  }

  export type OwnerCountAggregateInputType = {
    own_id?: true
    own_uuid?: true
    own_product_key?: true
    own_db?: true
    own_add_date?: true
    own_first_name?: true
    own_middle_name?: true
    own_last_name?: true
    own_phone_no?: true
    own_mobile_no?: true
    own_email?: true
    own_login_id?: true
    own_password?: true
    own_status?: true
    own_profile_img?: true
    own_refresh_token?: true
    own_refresh_expiry?: true
    own_jwt_token?: true
    own_jwt_expiry?: true
    own_login_status?: true
    own_last_login_system?: true
    own_otp?: true
    own_otp_expiry?: true
    own_address?: true
    own_village?: true
    own_city?: true
    own_state?: true
    own_pincode?: true
    own_created_at?: true
    own_created_by?: true
    own_updated_at?: true
    own_updated_by?: true
    own_deleted_at?: true
    own_deleted_by?: true
    own_is_deleted?: true
    _all?: true
  }

  export type OwnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Owner to aggregate.
     */
    where?: OwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Owners to fetch.
     */
    orderBy?: OwnerOrderByWithRelationInput | OwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Owners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Owners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Owners
    **/
    _count?: true | OwnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OwnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OwnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OwnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OwnerMaxAggregateInputType
  }

  export type GetOwnerAggregateType<T extends OwnerAggregateArgs> = {
        [P in keyof T & keyof AggregateOwner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOwner[P]>
      : GetScalarType<T[P], AggregateOwner[P]>
  }




  export type OwnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnerWhereInput
    orderBy?: OwnerOrderByWithAggregationInput | OwnerOrderByWithAggregationInput[]
    by: OwnerScalarFieldEnum[] | OwnerScalarFieldEnum
    having?: OwnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OwnerCountAggregateInputType | true
    _avg?: OwnerAvgAggregateInputType
    _sum?: OwnerSumAggregateInputType
    _min?: OwnerMinAggregateInputType
    _max?: OwnerMaxAggregateInputType
  }

  export type OwnerGroupByOutputType = {
    own_id: number
    own_uuid: string
    own_product_key: number
    own_db: string
    own_add_date: Date
    own_first_name: string
    own_middle_name: string | null
    own_last_name: string
    own_phone_no: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status: $Enums.OwnerStatus
    own_profile_img: JsonValue | null
    own_refresh_token: string | null
    own_refresh_expiry: Date | null
    own_jwt_token: string | null
    own_jwt_expiry: Date | null
    own_login_status: boolean
    own_last_login_system: JsonValue | null
    own_otp: string | null
    own_otp_expiry: Date | null
    own_address: string | null
    own_village: string | null
    own_city: string | null
    own_state: string | null
    own_pincode: string | null
    own_created_at: Date
    own_created_by: string | null
    own_updated_at: Date
    own_updated_by: string | null
    own_deleted_at: Date | null
    own_deleted_by: string | null
    own_is_deleted: boolean
    _count: OwnerCountAggregateOutputType | null
    _avg: OwnerAvgAggregateOutputType | null
    _sum: OwnerSumAggregateOutputType | null
    _min: OwnerMinAggregateOutputType | null
    _max: OwnerMaxAggregateOutputType | null
  }

  type GetOwnerGroupByPayload<T extends OwnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OwnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OwnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OwnerGroupByOutputType[P]>
            : GetScalarType<T[P], OwnerGroupByOutputType[P]>
        }
      >
    >


  export type OwnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    own_id?: boolean
    own_uuid?: boolean
    own_product_key?: boolean
    own_db?: boolean
    own_add_date?: boolean
    own_first_name?: boolean
    own_middle_name?: boolean
    own_last_name?: boolean
    own_phone_no?: boolean
    own_mobile_no?: boolean
    own_email?: boolean
    own_login_id?: boolean
    own_password?: boolean
    own_status?: boolean
    own_profile_img?: boolean
    own_refresh_token?: boolean
    own_refresh_expiry?: boolean
    own_jwt_token?: boolean
    own_jwt_expiry?: boolean
    own_login_status?: boolean
    own_last_login_system?: boolean
    own_otp?: boolean
    own_otp_expiry?: boolean
    own_address?: boolean
    own_village?: boolean
    own_city?: boolean
    own_state?: boolean
    own_pincode?: boolean
    own_created_at?: boolean
    own_created_by?: boolean
    own_updated_at?: boolean
    own_updated_by?: boolean
    own_deleted_at?: boolean
    own_deleted_by?: boolean
    own_is_deleted?: boolean
    users?: boolean | Owner$usersArgs<ExtArgs>
    firms?: boolean | Owner$firmsArgs<ExtArgs>
    accounts?: boolean | Owner$accountsArgs<ExtArgs>
    _count?: boolean | OwnerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["owner"]>

  export type OwnerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    own_id?: boolean
    own_uuid?: boolean
    own_product_key?: boolean
    own_db?: boolean
    own_add_date?: boolean
    own_first_name?: boolean
    own_middle_name?: boolean
    own_last_name?: boolean
    own_phone_no?: boolean
    own_mobile_no?: boolean
    own_email?: boolean
    own_login_id?: boolean
    own_password?: boolean
    own_status?: boolean
    own_profile_img?: boolean
    own_refresh_token?: boolean
    own_refresh_expiry?: boolean
    own_jwt_token?: boolean
    own_jwt_expiry?: boolean
    own_login_status?: boolean
    own_last_login_system?: boolean
    own_otp?: boolean
    own_otp_expiry?: boolean
    own_address?: boolean
    own_village?: boolean
    own_city?: boolean
    own_state?: boolean
    own_pincode?: boolean
    own_created_at?: boolean
    own_created_by?: boolean
    own_updated_at?: boolean
    own_updated_by?: boolean
    own_deleted_at?: boolean
    own_deleted_by?: boolean
    own_is_deleted?: boolean
  }, ExtArgs["result"]["owner"]>

  export type OwnerSelectScalar = {
    own_id?: boolean
    own_uuid?: boolean
    own_product_key?: boolean
    own_db?: boolean
    own_add_date?: boolean
    own_first_name?: boolean
    own_middle_name?: boolean
    own_last_name?: boolean
    own_phone_no?: boolean
    own_mobile_no?: boolean
    own_email?: boolean
    own_login_id?: boolean
    own_password?: boolean
    own_status?: boolean
    own_profile_img?: boolean
    own_refresh_token?: boolean
    own_refresh_expiry?: boolean
    own_jwt_token?: boolean
    own_jwt_expiry?: boolean
    own_login_status?: boolean
    own_last_login_system?: boolean
    own_otp?: boolean
    own_otp_expiry?: boolean
    own_address?: boolean
    own_village?: boolean
    own_city?: boolean
    own_state?: boolean
    own_pincode?: boolean
    own_created_at?: boolean
    own_created_by?: boolean
    own_updated_at?: boolean
    own_updated_by?: boolean
    own_deleted_at?: boolean
    own_deleted_by?: boolean
    own_is_deleted?: boolean
  }

  export type OwnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Owner$usersArgs<ExtArgs>
    firms?: boolean | Owner$firmsArgs<ExtArgs>
    accounts?: boolean | Owner$accountsArgs<ExtArgs>
    _count?: boolean | OwnerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OwnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OwnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Owner"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      firms: Prisma.$FirmPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      own_id: number
      own_uuid: string
      own_product_key: number
      own_db: string
      own_add_date: Date
      own_first_name: string
      own_middle_name: string | null
      own_last_name: string
      own_phone_no: string | null
      own_mobile_no: string
      own_email: string
      own_login_id: string
      own_password: string
      own_status: $Enums.OwnerStatus
      own_profile_img: Prisma.JsonValue | null
      own_refresh_token: string | null
      own_refresh_expiry: Date | null
      own_jwt_token: string | null
      own_jwt_expiry: Date | null
      own_login_status: boolean
      own_last_login_system: Prisma.JsonValue | null
      own_otp: string | null
      own_otp_expiry: Date | null
      own_address: string | null
      own_village: string | null
      own_city: string | null
      own_state: string | null
      own_pincode: string | null
      own_created_at: Date
      own_created_by: string | null
      own_updated_at: Date
      own_updated_by: string | null
      own_deleted_at: Date | null
      own_deleted_by: string | null
      own_is_deleted: boolean
    }, ExtArgs["result"]["owner"]>
    composites: {}
  }

  type OwnerGetPayload<S extends boolean | null | undefined | OwnerDefaultArgs> = $Result.GetResult<Prisma.$OwnerPayload, S>

  type OwnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OwnerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OwnerCountAggregateInputType | true
    }

  export interface OwnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Owner'], meta: { name: 'Owner' } }
    /**
     * Find zero or one Owner that matches the filter.
     * @param {OwnerFindUniqueArgs} args - Arguments to find a Owner
     * @example
     * // Get one Owner
     * const owner = await prisma.owner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OwnerFindUniqueArgs>(args: SelectSubset<T, OwnerFindUniqueArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Owner that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OwnerFindUniqueOrThrowArgs} args - Arguments to find a Owner
     * @example
     * // Get one Owner
     * const owner = await prisma.owner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OwnerFindUniqueOrThrowArgs>(args: SelectSubset<T, OwnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Owner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerFindFirstArgs} args - Arguments to find a Owner
     * @example
     * // Get one Owner
     * const owner = await prisma.owner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OwnerFindFirstArgs>(args?: SelectSubset<T, OwnerFindFirstArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Owner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerFindFirstOrThrowArgs} args - Arguments to find a Owner
     * @example
     * // Get one Owner
     * const owner = await prisma.owner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OwnerFindFirstOrThrowArgs>(args?: SelectSubset<T, OwnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Owners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Owners
     * const owners = await prisma.owner.findMany()
     * 
     * // Get first 10 Owners
     * const owners = await prisma.owner.findMany({ take: 10 })
     * 
     * // Only select the `own_id`
     * const ownerWithOwn_idOnly = await prisma.owner.findMany({ select: { own_id: true } })
     * 
     */
    findMany<T extends OwnerFindManyArgs>(args?: SelectSubset<T, OwnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Owner.
     * @param {OwnerCreateArgs} args - Arguments to create a Owner.
     * @example
     * // Create one Owner
     * const Owner = await prisma.owner.create({
     *   data: {
     *     // ... data to create a Owner
     *   }
     * })
     * 
     */
    create<T extends OwnerCreateArgs>(args: SelectSubset<T, OwnerCreateArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Owners.
     * @param {OwnerCreateManyArgs} args - Arguments to create many Owners.
     * @example
     * // Create many Owners
     * const owner = await prisma.owner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OwnerCreateManyArgs>(args?: SelectSubset<T, OwnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Owners and returns the data saved in the database.
     * @param {OwnerCreateManyAndReturnArgs} args - Arguments to create many Owners.
     * @example
     * // Create many Owners
     * const owner = await prisma.owner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Owners and only return the `own_id`
     * const ownerWithOwn_idOnly = await prisma.owner.createManyAndReturn({ 
     *   select: { own_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OwnerCreateManyAndReturnArgs>(args?: SelectSubset<T, OwnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Owner.
     * @param {OwnerDeleteArgs} args - Arguments to delete one Owner.
     * @example
     * // Delete one Owner
     * const Owner = await prisma.owner.delete({
     *   where: {
     *     // ... filter to delete one Owner
     *   }
     * })
     * 
     */
    delete<T extends OwnerDeleteArgs>(args: SelectSubset<T, OwnerDeleteArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Owner.
     * @param {OwnerUpdateArgs} args - Arguments to update one Owner.
     * @example
     * // Update one Owner
     * const owner = await prisma.owner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OwnerUpdateArgs>(args: SelectSubset<T, OwnerUpdateArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Owners.
     * @param {OwnerDeleteManyArgs} args - Arguments to filter Owners to delete.
     * @example
     * // Delete a few Owners
     * const { count } = await prisma.owner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OwnerDeleteManyArgs>(args?: SelectSubset<T, OwnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Owners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Owners
     * const owner = await prisma.owner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OwnerUpdateManyArgs>(args: SelectSubset<T, OwnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Owner.
     * @param {OwnerUpsertArgs} args - Arguments to update or create a Owner.
     * @example
     * // Update or create a Owner
     * const owner = await prisma.owner.upsert({
     *   create: {
     *     // ... data to create a Owner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Owner we want to update
     *   }
     * })
     */
    upsert<T extends OwnerUpsertArgs>(args: SelectSubset<T, OwnerUpsertArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Owners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerCountArgs} args - Arguments to filter Owners to count.
     * @example
     * // Count the number of Owners
     * const count = await prisma.owner.count({
     *   where: {
     *     // ... the filter for the Owners we want to count
     *   }
     * })
    **/
    count<T extends OwnerCountArgs>(
      args?: Subset<T, OwnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OwnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Owner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OwnerAggregateArgs>(args: Subset<T, OwnerAggregateArgs>): Prisma.PrismaPromise<GetOwnerAggregateType<T>>

    /**
     * Group by Owner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OwnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OwnerGroupByArgs['orderBy'] }
        : { orderBy?: OwnerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OwnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOwnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Owner model
   */
  readonly fields: OwnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Owner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OwnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Owner$usersArgs<ExtArgs> = {}>(args?: Subset<T, Owner$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    firms<T extends Owner$firmsArgs<ExtArgs> = {}>(args?: Subset<T, Owner$firmsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findMany"> | Null>
    accounts<T extends Owner$accountsArgs<ExtArgs> = {}>(args?: Subset<T, Owner$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Owner model
   */ 
  interface OwnerFieldRefs {
    readonly own_id: FieldRef<"Owner", 'Int'>
    readonly own_uuid: FieldRef<"Owner", 'String'>
    readonly own_product_key: FieldRef<"Owner", 'Int'>
    readonly own_db: FieldRef<"Owner", 'String'>
    readonly own_add_date: FieldRef<"Owner", 'DateTime'>
    readonly own_first_name: FieldRef<"Owner", 'String'>
    readonly own_middle_name: FieldRef<"Owner", 'String'>
    readonly own_last_name: FieldRef<"Owner", 'String'>
    readonly own_phone_no: FieldRef<"Owner", 'String'>
    readonly own_mobile_no: FieldRef<"Owner", 'String'>
    readonly own_email: FieldRef<"Owner", 'String'>
    readonly own_login_id: FieldRef<"Owner", 'String'>
    readonly own_password: FieldRef<"Owner", 'String'>
    readonly own_status: FieldRef<"Owner", 'OwnerStatus'>
    readonly own_profile_img: FieldRef<"Owner", 'Json'>
    readonly own_refresh_token: FieldRef<"Owner", 'String'>
    readonly own_refresh_expiry: FieldRef<"Owner", 'DateTime'>
    readonly own_jwt_token: FieldRef<"Owner", 'String'>
    readonly own_jwt_expiry: FieldRef<"Owner", 'DateTime'>
    readonly own_login_status: FieldRef<"Owner", 'Boolean'>
    readonly own_last_login_system: FieldRef<"Owner", 'Json'>
    readonly own_otp: FieldRef<"Owner", 'String'>
    readonly own_otp_expiry: FieldRef<"Owner", 'DateTime'>
    readonly own_address: FieldRef<"Owner", 'String'>
    readonly own_village: FieldRef<"Owner", 'String'>
    readonly own_city: FieldRef<"Owner", 'String'>
    readonly own_state: FieldRef<"Owner", 'String'>
    readonly own_pincode: FieldRef<"Owner", 'String'>
    readonly own_created_at: FieldRef<"Owner", 'DateTime'>
    readonly own_created_by: FieldRef<"Owner", 'String'>
    readonly own_updated_at: FieldRef<"Owner", 'DateTime'>
    readonly own_updated_by: FieldRef<"Owner", 'String'>
    readonly own_deleted_at: FieldRef<"Owner", 'DateTime'>
    readonly own_deleted_by: FieldRef<"Owner", 'String'>
    readonly own_is_deleted: FieldRef<"Owner", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Owner findUnique
   */
  export type OwnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter, which Owner to fetch.
     */
    where: OwnerWhereUniqueInput
  }

  /**
   * Owner findUniqueOrThrow
   */
  export type OwnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter, which Owner to fetch.
     */
    where: OwnerWhereUniqueInput
  }

  /**
   * Owner findFirst
   */
  export type OwnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter, which Owner to fetch.
     */
    where?: OwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Owners to fetch.
     */
    orderBy?: OwnerOrderByWithRelationInput | OwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Owners.
     */
    cursor?: OwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Owners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Owners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Owners.
     */
    distinct?: OwnerScalarFieldEnum | OwnerScalarFieldEnum[]
  }

  /**
   * Owner findFirstOrThrow
   */
  export type OwnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter, which Owner to fetch.
     */
    where?: OwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Owners to fetch.
     */
    orderBy?: OwnerOrderByWithRelationInput | OwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Owners.
     */
    cursor?: OwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Owners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Owners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Owners.
     */
    distinct?: OwnerScalarFieldEnum | OwnerScalarFieldEnum[]
  }

  /**
   * Owner findMany
   */
  export type OwnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter, which Owners to fetch.
     */
    where?: OwnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Owners to fetch.
     */
    orderBy?: OwnerOrderByWithRelationInput | OwnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Owners.
     */
    cursor?: OwnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Owners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Owners.
     */
    skip?: number
    distinct?: OwnerScalarFieldEnum | OwnerScalarFieldEnum[]
  }

  /**
   * Owner create
   */
  export type OwnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * The data needed to create a Owner.
     */
    data: XOR<OwnerCreateInput, OwnerUncheckedCreateInput>
  }

  /**
   * Owner createMany
   */
  export type OwnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Owners.
     */
    data: OwnerCreateManyInput | OwnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Owner createManyAndReturn
   */
  export type OwnerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Owners.
     */
    data: OwnerCreateManyInput | OwnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Owner update
   */
  export type OwnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * The data needed to update a Owner.
     */
    data: XOR<OwnerUpdateInput, OwnerUncheckedUpdateInput>
    /**
     * Choose, which Owner to update.
     */
    where: OwnerWhereUniqueInput
  }

  /**
   * Owner updateMany
   */
  export type OwnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Owners.
     */
    data: XOR<OwnerUpdateManyMutationInput, OwnerUncheckedUpdateManyInput>
    /**
     * Filter which Owners to update
     */
    where?: OwnerWhereInput
  }

  /**
   * Owner upsert
   */
  export type OwnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * The filter to search for the Owner to update in case it exists.
     */
    where: OwnerWhereUniqueInput
    /**
     * In case the Owner found by the `where` argument doesn't exist, create a new Owner with this data.
     */
    create: XOR<OwnerCreateInput, OwnerUncheckedCreateInput>
    /**
     * In case the Owner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OwnerUpdateInput, OwnerUncheckedUpdateInput>
  }

  /**
   * Owner delete
   */
  export type OwnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    /**
     * Filter which Owner to delete.
     */
    where: OwnerWhereUniqueInput
  }

  /**
   * Owner deleteMany
   */
  export type OwnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Owners to delete
     */
    where?: OwnerWhereInput
  }

  /**
   * Owner.users
   */
  export type Owner$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Owner.firms
   */
  export type Owner$firmsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    where?: FirmWhereInput
    orderBy?: FirmOrderByWithRelationInput | FirmOrderByWithRelationInput[]
    cursor?: FirmWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FirmScalarFieldEnum | FirmScalarFieldEnum[]
  }

  /**
   * Owner.accounts
   */
  export type Owner$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Owner without action
   */
  export type OwnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
  }


  /**
   * Model Firm
   */

  export type AggregateFirm = {
    _count: FirmCountAggregateOutputType | null
    _avg: FirmAvgAggregateOutputType | null
    _sum: FirmSumAggregateOutputType | null
    _min: FirmMinAggregateOutputType | null
    _max: FirmMaxAggregateOutputType | null
  }

  export type FirmAvgAggregateOutputType = {
    firm_id: number | null
    firm_own_id: number | null
  }

  export type FirmSumAggregateOutputType = {
    firm_id: number | null
    firm_own_id: number | null
  }

  export type FirmMinAggregateOutputType = {
    firm_id: number | null
    firm_uuid: string | null
    firm_add_date: Date | null
    firm_own_id: number | null
    firm_name: string | null
    firm_reg_no: string | null
    firm_shop_name: string | null
    firm_desc: string | null
    firm_address: string | null
    firm_city: string | null
    firm_pincode: string | null
    firm_phone_no: string | null
    firm_email_id: string | null
    firm_website_link: string | null
    firm_type: $Enums.FirmType | null
    firm_owner: string | null
    firm_other_info: string | null
    firm_geo_latitude: string | null
    firm_geo_longitude: string | null
    firm_whatsapp_link: string | null
    firm_facebook_link: string | null
    firm_insta_link: string | null
    firm_bank_name: string | null
    firm_bank_acc_no: string | null
    firm_bank_branch: string | null
    firm_bank_address: string | null
    firm_acc_holder: string | null
    firm_acc_type: string | null
    firm_ifsc_code: string | null
    firm_start_date: Date | null
    firm_balance: string | null
    firm_balance_type: $Enums.FirmBalanceType | null
    firm_gstin_no: string | null
    firm_pan_no: string | null
    firm_adhaar_no: string | null
    firm_form_header: string | null
    firm_form_footer: string | null
    firm_created_at: Date | null
    firm_created_by: string | null
    firm_updated_at: Date | null
    firm_updated_by: string | null
    firm_deleted_at: Date | null
    firm_deleted_by: string | null
    firm_is_deleted: boolean | null
  }

  export type FirmMaxAggregateOutputType = {
    firm_id: number | null
    firm_uuid: string | null
    firm_add_date: Date | null
    firm_own_id: number | null
    firm_name: string | null
    firm_reg_no: string | null
    firm_shop_name: string | null
    firm_desc: string | null
    firm_address: string | null
    firm_city: string | null
    firm_pincode: string | null
    firm_phone_no: string | null
    firm_email_id: string | null
    firm_website_link: string | null
    firm_type: $Enums.FirmType | null
    firm_owner: string | null
    firm_other_info: string | null
    firm_geo_latitude: string | null
    firm_geo_longitude: string | null
    firm_whatsapp_link: string | null
    firm_facebook_link: string | null
    firm_insta_link: string | null
    firm_bank_name: string | null
    firm_bank_acc_no: string | null
    firm_bank_branch: string | null
    firm_bank_address: string | null
    firm_acc_holder: string | null
    firm_acc_type: string | null
    firm_ifsc_code: string | null
    firm_start_date: Date | null
    firm_balance: string | null
    firm_balance_type: $Enums.FirmBalanceType | null
    firm_gstin_no: string | null
    firm_pan_no: string | null
    firm_adhaar_no: string | null
    firm_form_header: string | null
    firm_form_footer: string | null
    firm_created_at: Date | null
    firm_created_by: string | null
    firm_updated_at: Date | null
    firm_updated_by: string | null
    firm_deleted_at: Date | null
    firm_deleted_by: string | null
    firm_is_deleted: boolean | null
  }

  export type FirmCountAggregateOutputType = {
    firm_id: number
    firm_uuid: number
    firm_add_date: number
    firm_own_id: number
    firm_name: number
    firm_reg_no: number
    firm_shop_name: number
    firm_desc: number
    firm_address: number
    firm_city: number
    firm_pincode: number
    firm_phone_no: number
    firm_email_id: number
    firm_website_link: number
    firm_type: number
    firm_owner: number
    firm_other_info: number
    firm_geo_latitude: number
    firm_geo_longitude: number
    firm_whatsapp_link: number
    firm_facebook_link: number
    firm_insta_link: number
    firm_bank_name: number
    firm_bank_acc_no: number
    firm_bank_branch: number
    firm_bank_address: number
    firm_acc_holder: number
    firm_acc_type: number
    firm_ifsc_code: number
    firm_start_date: number
    firm_balance: number
    firm_balance_type: number
    firm_gstin_no: number
    firm_pan_no: number
    firm_adhaar_no: number
    firm_form_header: number
    firm_form_footer: number
    firm_own_sign_img: number
    firm_left_logo_img: number
    firm_right_logo_img: number
    firm_qr_code_img: number
    firm_pan_no_img: number
    firm_created_at: number
    firm_created_by: number
    firm_updated_at: number
    firm_updated_by: number
    firm_deleted_at: number
    firm_deleted_by: number
    firm_is_deleted: number
    _all: number
  }


  export type FirmAvgAggregateInputType = {
    firm_id?: true
    firm_own_id?: true
  }

  export type FirmSumAggregateInputType = {
    firm_id?: true
    firm_own_id?: true
  }

  export type FirmMinAggregateInputType = {
    firm_id?: true
    firm_uuid?: true
    firm_add_date?: true
    firm_own_id?: true
    firm_name?: true
    firm_reg_no?: true
    firm_shop_name?: true
    firm_desc?: true
    firm_address?: true
    firm_city?: true
    firm_pincode?: true
    firm_phone_no?: true
    firm_email_id?: true
    firm_website_link?: true
    firm_type?: true
    firm_owner?: true
    firm_other_info?: true
    firm_geo_latitude?: true
    firm_geo_longitude?: true
    firm_whatsapp_link?: true
    firm_facebook_link?: true
    firm_insta_link?: true
    firm_bank_name?: true
    firm_bank_acc_no?: true
    firm_bank_branch?: true
    firm_bank_address?: true
    firm_acc_holder?: true
    firm_acc_type?: true
    firm_ifsc_code?: true
    firm_start_date?: true
    firm_balance?: true
    firm_balance_type?: true
    firm_gstin_no?: true
    firm_pan_no?: true
    firm_adhaar_no?: true
    firm_form_header?: true
    firm_form_footer?: true
    firm_created_at?: true
    firm_created_by?: true
    firm_updated_at?: true
    firm_updated_by?: true
    firm_deleted_at?: true
    firm_deleted_by?: true
    firm_is_deleted?: true
  }

  export type FirmMaxAggregateInputType = {
    firm_id?: true
    firm_uuid?: true
    firm_add_date?: true
    firm_own_id?: true
    firm_name?: true
    firm_reg_no?: true
    firm_shop_name?: true
    firm_desc?: true
    firm_address?: true
    firm_city?: true
    firm_pincode?: true
    firm_phone_no?: true
    firm_email_id?: true
    firm_website_link?: true
    firm_type?: true
    firm_owner?: true
    firm_other_info?: true
    firm_geo_latitude?: true
    firm_geo_longitude?: true
    firm_whatsapp_link?: true
    firm_facebook_link?: true
    firm_insta_link?: true
    firm_bank_name?: true
    firm_bank_acc_no?: true
    firm_bank_branch?: true
    firm_bank_address?: true
    firm_acc_holder?: true
    firm_acc_type?: true
    firm_ifsc_code?: true
    firm_start_date?: true
    firm_balance?: true
    firm_balance_type?: true
    firm_gstin_no?: true
    firm_pan_no?: true
    firm_adhaar_no?: true
    firm_form_header?: true
    firm_form_footer?: true
    firm_created_at?: true
    firm_created_by?: true
    firm_updated_at?: true
    firm_updated_by?: true
    firm_deleted_at?: true
    firm_deleted_by?: true
    firm_is_deleted?: true
  }

  export type FirmCountAggregateInputType = {
    firm_id?: true
    firm_uuid?: true
    firm_add_date?: true
    firm_own_id?: true
    firm_name?: true
    firm_reg_no?: true
    firm_shop_name?: true
    firm_desc?: true
    firm_address?: true
    firm_city?: true
    firm_pincode?: true
    firm_phone_no?: true
    firm_email_id?: true
    firm_website_link?: true
    firm_type?: true
    firm_owner?: true
    firm_other_info?: true
    firm_geo_latitude?: true
    firm_geo_longitude?: true
    firm_whatsapp_link?: true
    firm_facebook_link?: true
    firm_insta_link?: true
    firm_bank_name?: true
    firm_bank_acc_no?: true
    firm_bank_branch?: true
    firm_bank_address?: true
    firm_acc_holder?: true
    firm_acc_type?: true
    firm_ifsc_code?: true
    firm_start_date?: true
    firm_balance?: true
    firm_balance_type?: true
    firm_gstin_no?: true
    firm_pan_no?: true
    firm_adhaar_no?: true
    firm_form_header?: true
    firm_form_footer?: true
    firm_own_sign_img?: true
    firm_left_logo_img?: true
    firm_right_logo_img?: true
    firm_qr_code_img?: true
    firm_pan_no_img?: true
    firm_created_at?: true
    firm_created_by?: true
    firm_updated_at?: true
    firm_updated_by?: true
    firm_deleted_at?: true
    firm_deleted_by?: true
    firm_is_deleted?: true
    _all?: true
  }

  export type FirmAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Firm to aggregate.
     */
    where?: FirmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Firms to fetch.
     */
    orderBy?: FirmOrderByWithRelationInput | FirmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FirmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Firms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Firms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Firms
    **/
    _count?: true | FirmCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FirmAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FirmSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FirmMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FirmMaxAggregateInputType
  }

  export type GetFirmAggregateType<T extends FirmAggregateArgs> = {
        [P in keyof T & keyof AggregateFirm]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFirm[P]>
      : GetScalarType<T[P], AggregateFirm[P]>
  }




  export type FirmGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FirmWhereInput
    orderBy?: FirmOrderByWithAggregationInput | FirmOrderByWithAggregationInput[]
    by: FirmScalarFieldEnum[] | FirmScalarFieldEnum
    having?: FirmScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FirmCountAggregateInputType | true
    _avg?: FirmAvgAggregateInputType
    _sum?: FirmSumAggregateInputType
    _min?: FirmMinAggregateInputType
    _max?: FirmMaxAggregateInputType
  }

  export type FirmGroupByOutputType = {
    firm_id: number
    firm_uuid: string
    firm_add_date: Date
    firm_own_id: number
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc: string | null
    firm_address: string | null
    firm_city: string | null
    firm_pincode: string | null
    firm_phone_no: string | null
    firm_email_id: string | null
    firm_website_link: string | null
    firm_type: $Enums.FirmType
    firm_owner: string | null
    firm_other_info: string | null
    firm_geo_latitude: string | null
    firm_geo_longitude: string | null
    firm_whatsapp_link: string | null
    firm_facebook_link: string | null
    firm_insta_link: string | null
    firm_bank_name: string | null
    firm_bank_acc_no: string | null
    firm_bank_branch: string | null
    firm_bank_address: string | null
    firm_acc_holder: string | null
    firm_acc_type: string | null
    firm_ifsc_code: string | null
    firm_start_date: Date | null
    firm_balance: string | null
    firm_balance_type: $Enums.FirmBalanceType
    firm_gstin_no: string | null
    firm_pan_no: string | null
    firm_adhaar_no: string | null
    firm_form_header: string | null
    firm_form_footer: string | null
    firm_own_sign_img: JsonValue | null
    firm_left_logo_img: JsonValue | null
    firm_right_logo_img: JsonValue | null
    firm_qr_code_img: JsonValue | null
    firm_pan_no_img: JsonValue | null
    firm_created_at: Date
    firm_created_by: string | null
    firm_updated_at: Date
    firm_updated_by: string | null
    firm_deleted_at: Date | null
    firm_deleted_by: string | null
    firm_is_deleted: boolean
    _count: FirmCountAggregateOutputType | null
    _avg: FirmAvgAggregateOutputType | null
    _sum: FirmSumAggregateOutputType | null
    _min: FirmMinAggregateOutputType | null
    _max: FirmMaxAggregateOutputType | null
  }

  type GetFirmGroupByPayload<T extends FirmGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FirmGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FirmGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FirmGroupByOutputType[P]>
            : GetScalarType<T[P], FirmGroupByOutputType[P]>
        }
      >
    >


  export type FirmSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    firm_id?: boolean
    firm_uuid?: boolean
    firm_add_date?: boolean
    firm_own_id?: boolean
    firm_name?: boolean
    firm_reg_no?: boolean
    firm_shop_name?: boolean
    firm_desc?: boolean
    firm_address?: boolean
    firm_city?: boolean
    firm_pincode?: boolean
    firm_phone_no?: boolean
    firm_email_id?: boolean
    firm_website_link?: boolean
    firm_type?: boolean
    firm_owner?: boolean
    firm_other_info?: boolean
    firm_geo_latitude?: boolean
    firm_geo_longitude?: boolean
    firm_whatsapp_link?: boolean
    firm_facebook_link?: boolean
    firm_insta_link?: boolean
    firm_bank_name?: boolean
    firm_bank_acc_no?: boolean
    firm_bank_branch?: boolean
    firm_bank_address?: boolean
    firm_acc_holder?: boolean
    firm_acc_type?: boolean
    firm_ifsc_code?: boolean
    firm_start_date?: boolean
    firm_balance?: boolean
    firm_balance_type?: boolean
    firm_gstin_no?: boolean
    firm_pan_no?: boolean
    firm_adhaar_no?: boolean
    firm_form_header?: boolean
    firm_form_footer?: boolean
    firm_own_sign_img?: boolean
    firm_left_logo_img?: boolean
    firm_right_logo_img?: boolean
    firm_qr_code_img?: boolean
    firm_pan_no_img?: boolean
    firm_created_at?: boolean
    firm_created_by?: boolean
    firm_updated_at?: boolean
    firm_updated_by?: boolean
    firm_deleted_at?: boolean
    firm_deleted_by?: boolean
    firm_is_deleted?: boolean
    users?: boolean | Firm$usersArgs<ExtArgs>
    accounts?: boolean | Firm$accountsArgs<ExtArgs>
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    _count?: boolean | FirmCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["firm"]>

  export type FirmSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    firm_id?: boolean
    firm_uuid?: boolean
    firm_add_date?: boolean
    firm_own_id?: boolean
    firm_name?: boolean
    firm_reg_no?: boolean
    firm_shop_name?: boolean
    firm_desc?: boolean
    firm_address?: boolean
    firm_city?: boolean
    firm_pincode?: boolean
    firm_phone_no?: boolean
    firm_email_id?: boolean
    firm_website_link?: boolean
    firm_type?: boolean
    firm_owner?: boolean
    firm_other_info?: boolean
    firm_geo_latitude?: boolean
    firm_geo_longitude?: boolean
    firm_whatsapp_link?: boolean
    firm_facebook_link?: boolean
    firm_insta_link?: boolean
    firm_bank_name?: boolean
    firm_bank_acc_no?: boolean
    firm_bank_branch?: boolean
    firm_bank_address?: boolean
    firm_acc_holder?: boolean
    firm_acc_type?: boolean
    firm_ifsc_code?: boolean
    firm_start_date?: boolean
    firm_balance?: boolean
    firm_balance_type?: boolean
    firm_gstin_no?: boolean
    firm_pan_no?: boolean
    firm_adhaar_no?: boolean
    firm_form_header?: boolean
    firm_form_footer?: boolean
    firm_own_sign_img?: boolean
    firm_left_logo_img?: boolean
    firm_right_logo_img?: boolean
    firm_qr_code_img?: boolean
    firm_pan_no_img?: boolean
    firm_created_at?: boolean
    firm_created_by?: boolean
    firm_updated_at?: boolean
    firm_updated_by?: boolean
    firm_deleted_at?: boolean
    firm_deleted_by?: boolean
    firm_is_deleted?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["firm"]>

  export type FirmSelectScalar = {
    firm_id?: boolean
    firm_uuid?: boolean
    firm_add_date?: boolean
    firm_own_id?: boolean
    firm_name?: boolean
    firm_reg_no?: boolean
    firm_shop_name?: boolean
    firm_desc?: boolean
    firm_address?: boolean
    firm_city?: boolean
    firm_pincode?: boolean
    firm_phone_no?: boolean
    firm_email_id?: boolean
    firm_website_link?: boolean
    firm_type?: boolean
    firm_owner?: boolean
    firm_other_info?: boolean
    firm_geo_latitude?: boolean
    firm_geo_longitude?: boolean
    firm_whatsapp_link?: boolean
    firm_facebook_link?: boolean
    firm_insta_link?: boolean
    firm_bank_name?: boolean
    firm_bank_acc_no?: boolean
    firm_bank_branch?: boolean
    firm_bank_address?: boolean
    firm_acc_holder?: boolean
    firm_acc_type?: boolean
    firm_ifsc_code?: boolean
    firm_start_date?: boolean
    firm_balance?: boolean
    firm_balance_type?: boolean
    firm_gstin_no?: boolean
    firm_pan_no?: boolean
    firm_adhaar_no?: boolean
    firm_form_header?: boolean
    firm_form_footer?: boolean
    firm_own_sign_img?: boolean
    firm_left_logo_img?: boolean
    firm_right_logo_img?: boolean
    firm_qr_code_img?: boolean
    firm_pan_no_img?: boolean
    firm_created_at?: boolean
    firm_created_by?: boolean
    firm_updated_at?: boolean
    firm_updated_by?: boolean
    firm_deleted_at?: boolean
    firm_deleted_by?: boolean
    firm_is_deleted?: boolean
  }

  export type FirmInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Firm$usersArgs<ExtArgs>
    accounts?: boolean | Firm$accountsArgs<ExtArgs>
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    _count?: boolean | FirmCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FirmIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }

  export type $FirmPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Firm"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      owner: Prisma.$OwnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      firm_id: number
      firm_uuid: string
      firm_add_date: Date
      firm_own_id: number
      firm_name: string
      firm_reg_no: string
      firm_shop_name: string
      firm_desc: string | null
      firm_address: string | null
      firm_city: string | null
      firm_pincode: string | null
      firm_phone_no: string | null
      firm_email_id: string | null
      firm_website_link: string | null
      firm_type: $Enums.FirmType
      firm_owner: string | null
      firm_other_info: string | null
      firm_geo_latitude: string | null
      firm_geo_longitude: string | null
      firm_whatsapp_link: string | null
      firm_facebook_link: string | null
      firm_insta_link: string | null
      firm_bank_name: string | null
      firm_bank_acc_no: string | null
      firm_bank_branch: string | null
      firm_bank_address: string | null
      firm_acc_holder: string | null
      firm_acc_type: string | null
      firm_ifsc_code: string | null
      firm_start_date: Date | null
      firm_balance: string | null
      firm_balance_type: $Enums.FirmBalanceType
      firm_gstin_no: string | null
      firm_pan_no: string | null
      firm_adhaar_no: string | null
      firm_form_header: string | null
      firm_form_footer: string | null
      firm_own_sign_img: Prisma.JsonValue | null
      firm_left_logo_img: Prisma.JsonValue | null
      firm_right_logo_img: Prisma.JsonValue | null
      firm_qr_code_img: Prisma.JsonValue | null
      firm_pan_no_img: Prisma.JsonValue | null
      firm_created_at: Date
      firm_created_by: string | null
      firm_updated_at: Date
      firm_updated_by: string | null
      firm_deleted_at: Date | null
      firm_deleted_by: string | null
      firm_is_deleted: boolean
    }, ExtArgs["result"]["firm"]>
    composites: {}
  }

  type FirmGetPayload<S extends boolean | null | undefined | FirmDefaultArgs> = $Result.GetResult<Prisma.$FirmPayload, S>

  type FirmCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FirmFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FirmCountAggregateInputType | true
    }

  export interface FirmDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Firm'], meta: { name: 'Firm' } }
    /**
     * Find zero or one Firm that matches the filter.
     * @param {FirmFindUniqueArgs} args - Arguments to find a Firm
     * @example
     * // Get one Firm
     * const firm = await prisma.firm.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FirmFindUniqueArgs>(args: SelectSubset<T, FirmFindUniqueArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Firm that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FirmFindUniqueOrThrowArgs} args - Arguments to find a Firm
     * @example
     * // Get one Firm
     * const firm = await prisma.firm.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FirmFindUniqueOrThrowArgs>(args: SelectSubset<T, FirmFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Firm that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmFindFirstArgs} args - Arguments to find a Firm
     * @example
     * // Get one Firm
     * const firm = await prisma.firm.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FirmFindFirstArgs>(args?: SelectSubset<T, FirmFindFirstArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Firm that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmFindFirstOrThrowArgs} args - Arguments to find a Firm
     * @example
     * // Get one Firm
     * const firm = await prisma.firm.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FirmFindFirstOrThrowArgs>(args?: SelectSubset<T, FirmFindFirstOrThrowArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Firms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Firms
     * const firms = await prisma.firm.findMany()
     * 
     * // Get first 10 Firms
     * const firms = await prisma.firm.findMany({ take: 10 })
     * 
     * // Only select the `firm_id`
     * const firmWithFirm_idOnly = await prisma.firm.findMany({ select: { firm_id: true } })
     * 
     */
    findMany<T extends FirmFindManyArgs>(args?: SelectSubset<T, FirmFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Firm.
     * @param {FirmCreateArgs} args - Arguments to create a Firm.
     * @example
     * // Create one Firm
     * const Firm = await prisma.firm.create({
     *   data: {
     *     // ... data to create a Firm
     *   }
     * })
     * 
     */
    create<T extends FirmCreateArgs>(args: SelectSubset<T, FirmCreateArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Firms.
     * @param {FirmCreateManyArgs} args - Arguments to create many Firms.
     * @example
     * // Create many Firms
     * const firm = await prisma.firm.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FirmCreateManyArgs>(args?: SelectSubset<T, FirmCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Firms and returns the data saved in the database.
     * @param {FirmCreateManyAndReturnArgs} args - Arguments to create many Firms.
     * @example
     * // Create many Firms
     * const firm = await prisma.firm.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Firms and only return the `firm_id`
     * const firmWithFirm_idOnly = await prisma.firm.createManyAndReturn({ 
     *   select: { firm_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FirmCreateManyAndReturnArgs>(args?: SelectSubset<T, FirmCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Firm.
     * @param {FirmDeleteArgs} args - Arguments to delete one Firm.
     * @example
     * // Delete one Firm
     * const Firm = await prisma.firm.delete({
     *   where: {
     *     // ... filter to delete one Firm
     *   }
     * })
     * 
     */
    delete<T extends FirmDeleteArgs>(args: SelectSubset<T, FirmDeleteArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Firm.
     * @param {FirmUpdateArgs} args - Arguments to update one Firm.
     * @example
     * // Update one Firm
     * const firm = await prisma.firm.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FirmUpdateArgs>(args: SelectSubset<T, FirmUpdateArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Firms.
     * @param {FirmDeleteManyArgs} args - Arguments to filter Firms to delete.
     * @example
     * // Delete a few Firms
     * const { count } = await prisma.firm.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FirmDeleteManyArgs>(args?: SelectSubset<T, FirmDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Firms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Firms
     * const firm = await prisma.firm.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FirmUpdateManyArgs>(args: SelectSubset<T, FirmUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Firm.
     * @param {FirmUpsertArgs} args - Arguments to update or create a Firm.
     * @example
     * // Update or create a Firm
     * const firm = await prisma.firm.upsert({
     *   create: {
     *     // ... data to create a Firm
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Firm we want to update
     *   }
     * })
     */
    upsert<T extends FirmUpsertArgs>(args: SelectSubset<T, FirmUpsertArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Firms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmCountArgs} args - Arguments to filter Firms to count.
     * @example
     * // Count the number of Firms
     * const count = await prisma.firm.count({
     *   where: {
     *     // ... the filter for the Firms we want to count
     *   }
     * })
    **/
    count<T extends FirmCountArgs>(
      args?: Subset<T, FirmCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FirmCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Firm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FirmAggregateArgs>(args: Subset<T, FirmAggregateArgs>): Prisma.PrismaPromise<GetFirmAggregateType<T>>

    /**
     * Group by Firm.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FirmGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FirmGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FirmGroupByArgs['orderBy'] }
        : { orderBy?: FirmGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FirmGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFirmGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Firm model
   */
  readonly fields: FirmFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Firm.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FirmClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Firm$usersArgs<ExtArgs> = {}>(args?: Subset<T, Firm$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    accounts<T extends Firm$accountsArgs<ExtArgs> = {}>(args?: Subset<T, Firm$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany"> | Null>
    owner<T extends OwnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OwnerDefaultArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Firm model
   */ 
  interface FirmFieldRefs {
    readonly firm_id: FieldRef<"Firm", 'Int'>
    readonly firm_uuid: FieldRef<"Firm", 'String'>
    readonly firm_add_date: FieldRef<"Firm", 'DateTime'>
    readonly firm_own_id: FieldRef<"Firm", 'Int'>
    readonly firm_name: FieldRef<"Firm", 'String'>
    readonly firm_reg_no: FieldRef<"Firm", 'String'>
    readonly firm_shop_name: FieldRef<"Firm", 'String'>
    readonly firm_desc: FieldRef<"Firm", 'String'>
    readonly firm_address: FieldRef<"Firm", 'String'>
    readonly firm_city: FieldRef<"Firm", 'String'>
    readonly firm_pincode: FieldRef<"Firm", 'String'>
    readonly firm_phone_no: FieldRef<"Firm", 'String'>
    readonly firm_email_id: FieldRef<"Firm", 'String'>
    readonly firm_website_link: FieldRef<"Firm", 'String'>
    readonly firm_type: FieldRef<"Firm", 'FirmType'>
    readonly firm_owner: FieldRef<"Firm", 'String'>
    readonly firm_other_info: FieldRef<"Firm", 'String'>
    readonly firm_geo_latitude: FieldRef<"Firm", 'String'>
    readonly firm_geo_longitude: FieldRef<"Firm", 'String'>
    readonly firm_whatsapp_link: FieldRef<"Firm", 'String'>
    readonly firm_facebook_link: FieldRef<"Firm", 'String'>
    readonly firm_insta_link: FieldRef<"Firm", 'String'>
    readonly firm_bank_name: FieldRef<"Firm", 'String'>
    readonly firm_bank_acc_no: FieldRef<"Firm", 'String'>
    readonly firm_bank_branch: FieldRef<"Firm", 'String'>
    readonly firm_bank_address: FieldRef<"Firm", 'String'>
    readonly firm_acc_holder: FieldRef<"Firm", 'String'>
    readonly firm_acc_type: FieldRef<"Firm", 'String'>
    readonly firm_ifsc_code: FieldRef<"Firm", 'String'>
    readonly firm_start_date: FieldRef<"Firm", 'DateTime'>
    readonly firm_balance: FieldRef<"Firm", 'String'>
    readonly firm_balance_type: FieldRef<"Firm", 'FirmBalanceType'>
    readonly firm_gstin_no: FieldRef<"Firm", 'String'>
    readonly firm_pan_no: FieldRef<"Firm", 'String'>
    readonly firm_adhaar_no: FieldRef<"Firm", 'String'>
    readonly firm_form_header: FieldRef<"Firm", 'String'>
    readonly firm_form_footer: FieldRef<"Firm", 'String'>
    readonly firm_own_sign_img: FieldRef<"Firm", 'Json'>
    readonly firm_left_logo_img: FieldRef<"Firm", 'Json'>
    readonly firm_right_logo_img: FieldRef<"Firm", 'Json'>
    readonly firm_qr_code_img: FieldRef<"Firm", 'Json'>
    readonly firm_pan_no_img: FieldRef<"Firm", 'Json'>
    readonly firm_created_at: FieldRef<"Firm", 'DateTime'>
    readonly firm_created_by: FieldRef<"Firm", 'String'>
    readonly firm_updated_at: FieldRef<"Firm", 'DateTime'>
    readonly firm_updated_by: FieldRef<"Firm", 'String'>
    readonly firm_deleted_at: FieldRef<"Firm", 'DateTime'>
    readonly firm_deleted_by: FieldRef<"Firm", 'String'>
    readonly firm_is_deleted: FieldRef<"Firm", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Firm findUnique
   */
  export type FirmFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter, which Firm to fetch.
     */
    where: FirmWhereUniqueInput
  }

  /**
   * Firm findUniqueOrThrow
   */
  export type FirmFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter, which Firm to fetch.
     */
    where: FirmWhereUniqueInput
  }

  /**
   * Firm findFirst
   */
  export type FirmFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter, which Firm to fetch.
     */
    where?: FirmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Firms to fetch.
     */
    orderBy?: FirmOrderByWithRelationInput | FirmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Firms.
     */
    cursor?: FirmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Firms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Firms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Firms.
     */
    distinct?: FirmScalarFieldEnum | FirmScalarFieldEnum[]
  }

  /**
   * Firm findFirstOrThrow
   */
  export type FirmFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter, which Firm to fetch.
     */
    where?: FirmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Firms to fetch.
     */
    orderBy?: FirmOrderByWithRelationInput | FirmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Firms.
     */
    cursor?: FirmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Firms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Firms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Firms.
     */
    distinct?: FirmScalarFieldEnum | FirmScalarFieldEnum[]
  }

  /**
   * Firm findMany
   */
  export type FirmFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter, which Firms to fetch.
     */
    where?: FirmWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Firms to fetch.
     */
    orderBy?: FirmOrderByWithRelationInput | FirmOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Firms.
     */
    cursor?: FirmWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Firms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Firms.
     */
    skip?: number
    distinct?: FirmScalarFieldEnum | FirmScalarFieldEnum[]
  }

  /**
   * Firm create
   */
  export type FirmCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * The data needed to create a Firm.
     */
    data: XOR<FirmCreateInput, FirmUncheckedCreateInput>
  }

  /**
   * Firm createMany
   */
  export type FirmCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Firms.
     */
    data: FirmCreateManyInput | FirmCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Firm createManyAndReturn
   */
  export type FirmCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Firms.
     */
    data: FirmCreateManyInput | FirmCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Firm update
   */
  export type FirmUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * The data needed to update a Firm.
     */
    data: XOR<FirmUpdateInput, FirmUncheckedUpdateInput>
    /**
     * Choose, which Firm to update.
     */
    where: FirmWhereUniqueInput
  }

  /**
   * Firm updateMany
   */
  export type FirmUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Firms.
     */
    data: XOR<FirmUpdateManyMutationInput, FirmUncheckedUpdateManyInput>
    /**
     * Filter which Firms to update
     */
    where?: FirmWhereInput
  }

  /**
   * Firm upsert
   */
  export type FirmUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * The filter to search for the Firm to update in case it exists.
     */
    where: FirmWhereUniqueInput
    /**
     * In case the Firm found by the `where` argument doesn't exist, create a new Firm with this data.
     */
    create: XOR<FirmCreateInput, FirmUncheckedCreateInput>
    /**
     * In case the Firm was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FirmUpdateInput, FirmUncheckedUpdateInput>
  }

  /**
   * Firm delete
   */
  export type FirmDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
    /**
     * Filter which Firm to delete.
     */
    where: FirmWhereUniqueInput
  }

  /**
   * Firm deleteMany
   */
  export type FirmDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Firms to delete
     */
    where?: FirmWhereInput
  }

  /**
   * Firm.users
   */
  export type Firm$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Firm.accounts
   */
  export type Firm$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Firm without action
   */
  export type FirmDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Firm
     */
    select?: FirmSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FirmInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    acc_id: number | null
    acc_own_id: number | null
    acc_firm_id: number | null
  }

  export type AccountSumAggregateOutputType = {
    acc_id: number | null
    acc_own_id: number | null
    acc_firm_id: number | null
  }

  export type AccountMinAggregateOutputType = {
    acc_id: number | null
    acc_uuid: string | null
    acc_add_date: Date | null
    acc_own_id: number | null
    acc_firm_id: number | null
    acc_pan_no: string | null
    acc_name: string | null
    acc_desc: string | null
    acc_pre_acc: string | null
    acc_bank_no: string | null
    acc_bsr_no: string | null
    acc_ifsc_code: string | null
    acc_branch_name: string | null
    acc_opening_date: Date | null
    acc_address: string | null
    acc_country: string | null
    acc_state: string | null
    acc_city: string | null
    acc_pincode: string | null
    acc_cash_balance: string | null
    acc_balance_type: $Enums.AccountBalanceType | null
    acc_other_info: string | null
    acc_created_at: Date | null
    acc_created_by: string | null
    acc_updated_by: string | null
    acc_deleted_at: Date | null
    acc_deleted_by: string | null
    acc_is_system: boolean | null
    acc_is_deleted: boolean | null
  }

  export type AccountMaxAggregateOutputType = {
    acc_id: number | null
    acc_uuid: string | null
    acc_add_date: Date | null
    acc_own_id: number | null
    acc_firm_id: number | null
    acc_pan_no: string | null
    acc_name: string | null
    acc_desc: string | null
    acc_pre_acc: string | null
    acc_bank_no: string | null
    acc_bsr_no: string | null
    acc_ifsc_code: string | null
    acc_branch_name: string | null
    acc_opening_date: Date | null
    acc_address: string | null
    acc_country: string | null
    acc_state: string | null
    acc_city: string | null
    acc_pincode: string | null
    acc_cash_balance: string | null
    acc_balance_type: $Enums.AccountBalanceType | null
    acc_other_info: string | null
    acc_created_at: Date | null
    acc_created_by: string | null
    acc_updated_by: string | null
    acc_deleted_at: Date | null
    acc_deleted_by: string | null
    acc_is_system: boolean | null
    acc_is_deleted: boolean | null
  }

  export type AccountCountAggregateOutputType = {
    acc_id: number
    acc_uuid: number
    acc_add_date: number
    acc_own_id: number
    acc_firm_id: number
    acc_pan_no: number
    acc_name: number
    acc_desc: number
    acc_pre_acc: number
    acc_bank_no: number
    acc_bsr_no: number
    acc_ifsc_code: number
    acc_branch_name: number
    acc_opening_date: number
    acc_address: number
    acc_country: number
    acc_state: number
    acc_city: number
    acc_pincode: number
    acc_cash_balance: number
    acc_balance_type: number
    acc_other_info: number
    acc_created_at: number
    acc_created_by: number
    acc_updated_by: number
    acc_deleted_at: number
    acc_deleted_by: number
    acc_is_system: number
    acc_is_deleted: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    acc_id?: true
    acc_own_id?: true
    acc_firm_id?: true
  }

  export type AccountSumAggregateInputType = {
    acc_id?: true
    acc_own_id?: true
    acc_firm_id?: true
  }

  export type AccountMinAggregateInputType = {
    acc_id?: true
    acc_uuid?: true
    acc_add_date?: true
    acc_own_id?: true
    acc_firm_id?: true
    acc_pan_no?: true
    acc_name?: true
    acc_desc?: true
    acc_pre_acc?: true
    acc_bank_no?: true
    acc_bsr_no?: true
    acc_ifsc_code?: true
    acc_branch_name?: true
    acc_opening_date?: true
    acc_address?: true
    acc_country?: true
    acc_state?: true
    acc_city?: true
    acc_pincode?: true
    acc_cash_balance?: true
    acc_balance_type?: true
    acc_other_info?: true
    acc_created_at?: true
    acc_created_by?: true
    acc_updated_by?: true
    acc_deleted_at?: true
    acc_deleted_by?: true
    acc_is_system?: true
    acc_is_deleted?: true
  }

  export type AccountMaxAggregateInputType = {
    acc_id?: true
    acc_uuid?: true
    acc_add_date?: true
    acc_own_id?: true
    acc_firm_id?: true
    acc_pan_no?: true
    acc_name?: true
    acc_desc?: true
    acc_pre_acc?: true
    acc_bank_no?: true
    acc_bsr_no?: true
    acc_ifsc_code?: true
    acc_branch_name?: true
    acc_opening_date?: true
    acc_address?: true
    acc_country?: true
    acc_state?: true
    acc_city?: true
    acc_pincode?: true
    acc_cash_balance?: true
    acc_balance_type?: true
    acc_other_info?: true
    acc_created_at?: true
    acc_created_by?: true
    acc_updated_by?: true
    acc_deleted_at?: true
    acc_deleted_by?: true
    acc_is_system?: true
    acc_is_deleted?: true
  }

  export type AccountCountAggregateInputType = {
    acc_id?: true
    acc_uuid?: true
    acc_add_date?: true
    acc_own_id?: true
    acc_firm_id?: true
    acc_pan_no?: true
    acc_name?: true
    acc_desc?: true
    acc_pre_acc?: true
    acc_bank_no?: true
    acc_bsr_no?: true
    acc_ifsc_code?: true
    acc_branch_name?: true
    acc_opening_date?: true
    acc_address?: true
    acc_country?: true
    acc_state?: true
    acc_city?: true
    acc_pincode?: true
    acc_cash_balance?: true
    acc_balance_type?: true
    acc_other_info?: true
    acc_created_at?: true
    acc_created_by?: true
    acc_updated_by?: true
    acc_deleted_at?: true
    acc_deleted_by?: true
    acc_is_system?: true
    acc_is_deleted?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    acc_id: number
    acc_uuid: string
    acc_add_date: Date
    acc_own_id: number
    acc_firm_id: number
    acc_pan_no: string | null
    acc_name: string
    acc_desc: string | null
    acc_pre_acc: string | null
    acc_bank_no: string | null
    acc_bsr_no: string | null
    acc_ifsc_code: string | null
    acc_branch_name: string | null
    acc_opening_date: Date
    acc_address: string | null
    acc_country: string | null
    acc_state: string | null
    acc_city: string | null
    acc_pincode: string | null
    acc_cash_balance: string | null
    acc_balance_type: $Enums.AccountBalanceType
    acc_other_info: string | null
    acc_created_at: Date
    acc_created_by: string | null
    acc_updated_by: string | null
    acc_deleted_at: Date | null
    acc_deleted_by: string | null
    acc_is_system: boolean
    acc_is_deleted: boolean
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    acc_id?: boolean
    acc_uuid?: boolean
    acc_add_date?: boolean
    acc_own_id?: boolean
    acc_firm_id?: boolean
    acc_pan_no?: boolean
    acc_name?: boolean
    acc_desc?: boolean
    acc_pre_acc?: boolean
    acc_bank_no?: boolean
    acc_bsr_no?: boolean
    acc_ifsc_code?: boolean
    acc_branch_name?: boolean
    acc_opening_date?: boolean
    acc_address?: boolean
    acc_country?: boolean
    acc_state?: boolean
    acc_city?: boolean
    acc_pincode?: boolean
    acc_cash_balance?: boolean
    acc_balance_type?: boolean
    acc_other_info?: boolean
    acc_created_at?: boolean
    acc_created_by?: boolean
    acc_updated_by?: boolean
    acc_deleted_at?: boolean
    acc_deleted_by?: boolean
    acc_is_system?: boolean
    acc_is_deleted?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    acc_id?: boolean
    acc_uuid?: boolean
    acc_add_date?: boolean
    acc_own_id?: boolean
    acc_firm_id?: boolean
    acc_pan_no?: boolean
    acc_name?: boolean
    acc_desc?: boolean
    acc_pre_acc?: boolean
    acc_bank_no?: boolean
    acc_bsr_no?: boolean
    acc_ifsc_code?: boolean
    acc_branch_name?: boolean
    acc_opening_date?: boolean
    acc_address?: boolean
    acc_country?: boolean
    acc_state?: boolean
    acc_city?: boolean
    acc_pincode?: boolean
    acc_cash_balance?: boolean
    acc_balance_type?: boolean
    acc_other_info?: boolean
    acc_created_at?: boolean
    acc_created_by?: boolean
    acc_updated_by?: boolean
    acc_deleted_at?: boolean
    acc_deleted_by?: boolean
    acc_is_system?: boolean
    acc_is_deleted?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    acc_id?: boolean
    acc_uuid?: boolean
    acc_add_date?: boolean
    acc_own_id?: boolean
    acc_firm_id?: boolean
    acc_pan_no?: boolean
    acc_name?: boolean
    acc_desc?: boolean
    acc_pre_acc?: boolean
    acc_bank_no?: boolean
    acc_bsr_no?: boolean
    acc_ifsc_code?: boolean
    acc_branch_name?: boolean
    acc_opening_date?: boolean
    acc_address?: boolean
    acc_country?: boolean
    acc_state?: boolean
    acc_city?: boolean
    acc_pincode?: boolean
    acc_cash_balance?: boolean
    acc_balance_type?: boolean
    acc_other_info?: boolean
    acc_created_at?: boolean
    acc_created_by?: boolean
    acc_updated_by?: boolean
    acc_deleted_at?: boolean
    acc_deleted_by?: boolean
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      owner: Prisma.$OwnerPayload<ExtArgs>
      firm: Prisma.$FirmPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      acc_id: number
      acc_uuid: string
      acc_add_date: Date
      acc_own_id: number
      acc_firm_id: number
      acc_pan_no: string | null
      acc_name: string
      acc_desc: string | null
      acc_pre_acc: string | null
      acc_bank_no: string | null
      acc_bsr_no: string | null
      acc_ifsc_code: string | null
      acc_branch_name: string | null
      acc_opening_date: Date
      acc_address: string | null
      acc_country: string | null
      acc_state: string | null
      acc_city: string | null
      acc_pincode: string | null
      acc_cash_balance: string | null
      acc_balance_type: $Enums.AccountBalanceType
      acc_other_info: string | null
      acc_created_at: Date
      acc_created_by: string | null
      acc_updated_by: string | null
      acc_deleted_at: Date | null
      acc_deleted_by: string | null
      acc_is_system: boolean
      acc_is_deleted: boolean
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `acc_id`
     * const accountWithAcc_idOnly = await prisma.account.findMany({ select: { acc_id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `acc_id`
     * const accountWithAcc_idOnly = await prisma.account.createManyAndReturn({ 
     *   select: { acc_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends OwnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OwnerDefaultArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    firm<T extends FirmDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FirmDefaultArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly acc_id: FieldRef<"Account", 'Int'>
    readonly acc_uuid: FieldRef<"Account", 'String'>
    readonly acc_add_date: FieldRef<"Account", 'DateTime'>
    readonly acc_own_id: FieldRef<"Account", 'Int'>
    readonly acc_firm_id: FieldRef<"Account", 'Int'>
    readonly acc_pan_no: FieldRef<"Account", 'String'>
    readonly acc_name: FieldRef<"Account", 'String'>
    readonly acc_desc: FieldRef<"Account", 'String'>
    readonly acc_pre_acc: FieldRef<"Account", 'String'>
    readonly acc_bank_no: FieldRef<"Account", 'String'>
    readonly acc_bsr_no: FieldRef<"Account", 'String'>
    readonly acc_ifsc_code: FieldRef<"Account", 'String'>
    readonly acc_branch_name: FieldRef<"Account", 'String'>
    readonly acc_opening_date: FieldRef<"Account", 'DateTime'>
    readonly acc_address: FieldRef<"Account", 'String'>
    readonly acc_country: FieldRef<"Account", 'String'>
    readonly acc_state: FieldRef<"Account", 'String'>
    readonly acc_city: FieldRef<"Account", 'String'>
    readonly acc_pincode: FieldRef<"Account", 'String'>
    readonly acc_cash_balance: FieldRef<"Account", 'String'>
    readonly acc_balance_type: FieldRef<"Account", 'AccountBalanceType'>
    readonly acc_other_info: FieldRef<"Account", 'String'>
    readonly acc_created_at: FieldRef<"Account", 'DateTime'>
    readonly acc_created_by: FieldRef<"Account", 'String'>
    readonly acc_updated_by: FieldRef<"Account", 'String'>
    readonly acc_deleted_at: FieldRef<"Account", 'DateTime'>
    readonly acc_deleted_by: FieldRef<"Account", 'String'>
    readonly acc_is_system: FieldRef<"Account", 'Boolean'>
    readonly acc_is_deleted: FieldRef<"Account", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    user_id: number | null
    user_own_id: number | null
    user_firm_id: number | null
  }

  export type UserSumAggregateOutputType = {
    user_id: number | null
    user_own_id: number | null
    user_firm_id: number | null
  }

  export type UserMinAggregateOutputType = {
    user_id: number | null
    user_uuid: string | null
    user_own_id: number | null
    user_firm_id: number | null
    user_add_date: Date | null
    user_first_name: string | null
    user_father_name: string | null
    user_last_name: string | null
    user_mother_name: string | null
    user_mobile_no: string | null
    user_phone_no: string | null
    user_email_id: string | null
    user_gender: $Enums.UserGender | null
    user_cast: string | null
    user_marital_status: $Enums.UserMaritalStatus | null
    user_occupation: string | null
    user_birth_date: Date | null
    user_gstin: string | null
    user_tax_no: string | null
    user_pan_no: string | null
    user_adhaar_no: string | null
    user_per_address: string | null
    user_curr_address: string | null
    user_village: string | null
    user_ward_no: string | null
    user_tehsil: string | null
    user_city: string | null
    user_state: string | null
    user_country: string | null
    user_pincode: string | null
    user_bank_name: string | null
    user_bank_acc_no: string | null
    user_ifsc_code: string | null
    user_other_info: string | null
    user_created_at: Date | null
    user_created_by: string | null
    user_updated_at: Date | null
    user_updated_by: string | null
    user_deleted_at: Date | null
    user_deleted_by: string | null
    user_is_deleted: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    user_id: number | null
    user_uuid: string | null
    user_own_id: number | null
    user_firm_id: number | null
    user_add_date: Date | null
    user_first_name: string | null
    user_father_name: string | null
    user_last_name: string | null
    user_mother_name: string | null
    user_mobile_no: string | null
    user_phone_no: string | null
    user_email_id: string | null
    user_gender: $Enums.UserGender | null
    user_cast: string | null
    user_marital_status: $Enums.UserMaritalStatus | null
    user_occupation: string | null
    user_birth_date: Date | null
    user_gstin: string | null
    user_tax_no: string | null
    user_pan_no: string | null
    user_adhaar_no: string | null
    user_per_address: string | null
    user_curr_address: string | null
    user_village: string | null
    user_ward_no: string | null
    user_tehsil: string | null
    user_city: string | null
    user_state: string | null
    user_country: string | null
    user_pincode: string | null
    user_bank_name: string | null
    user_bank_acc_no: string | null
    user_ifsc_code: string | null
    user_other_info: string | null
    user_created_at: Date | null
    user_created_by: string | null
    user_updated_at: Date | null
    user_updated_by: string | null
    user_deleted_at: Date | null
    user_deleted_by: string | null
    user_is_deleted: boolean | null
  }

  export type UserCountAggregateOutputType = {
    user_id: number
    user_uuid: number
    user_own_id: number
    user_firm_id: number
    user_add_date: number
    user_first_name: number
    user_father_name: number
    user_last_name: number
    user_mother_name: number
    user_mobile_no: number
    user_phone_no: number
    user_email_id: number
    user_gender: number
    user_cast: number
    user_marital_status: number
    user_occupation: number
    user_birth_date: number
    user_gstin: number
    user_tax_no: number
    user_pan_no: number
    user_adhaar_no: number
    user_profile_img: number
    user_adhaar_front_img: number
    user_adhaar_back_img: number
    user_pan_card_img: number
    user_per_address: number
    user_curr_address: number
    user_village: number
    user_ward_no: number
    user_tehsil: number
    user_city: number
    user_state: number
    user_country: number
    user_pincode: number
    user_bank_name: number
    user_bank_acc_no: number
    user_ifsc_code: number
    user_sign_img: number
    user_other_info: number
    user_created_at: number
    user_created_by: number
    user_updated_at: number
    user_updated_by: number
    user_deleted_at: number
    user_deleted_by: number
    user_is_deleted: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    user_id?: true
    user_own_id?: true
    user_firm_id?: true
  }

  export type UserSumAggregateInputType = {
    user_id?: true
    user_own_id?: true
    user_firm_id?: true
  }

  export type UserMinAggregateInputType = {
    user_id?: true
    user_uuid?: true
    user_own_id?: true
    user_firm_id?: true
    user_add_date?: true
    user_first_name?: true
    user_father_name?: true
    user_last_name?: true
    user_mother_name?: true
    user_mobile_no?: true
    user_phone_no?: true
    user_email_id?: true
    user_gender?: true
    user_cast?: true
    user_marital_status?: true
    user_occupation?: true
    user_birth_date?: true
    user_gstin?: true
    user_tax_no?: true
    user_pan_no?: true
    user_adhaar_no?: true
    user_per_address?: true
    user_curr_address?: true
    user_village?: true
    user_ward_no?: true
    user_tehsil?: true
    user_city?: true
    user_state?: true
    user_country?: true
    user_pincode?: true
    user_bank_name?: true
    user_bank_acc_no?: true
    user_ifsc_code?: true
    user_other_info?: true
    user_created_at?: true
    user_created_by?: true
    user_updated_at?: true
    user_updated_by?: true
    user_deleted_at?: true
    user_deleted_by?: true
    user_is_deleted?: true
  }

  export type UserMaxAggregateInputType = {
    user_id?: true
    user_uuid?: true
    user_own_id?: true
    user_firm_id?: true
    user_add_date?: true
    user_first_name?: true
    user_father_name?: true
    user_last_name?: true
    user_mother_name?: true
    user_mobile_no?: true
    user_phone_no?: true
    user_email_id?: true
    user_gender?: true
    user_cast?: true
    user_marital_status?: true
    user_occupation?: true
    user_birth_date?: true
    user_gstin?: true
    user_tax_no?: true
    user_pan_no?: true
    user_adhaar_no?: true
    user_per_address?: true
    user_curr_address?: true
    user_village?: true
    user_ward_no?: true
    user_tehsil?: true
    user_city?: true
    user_state?: true
    user_country?: true
    user_pincode?: true
    user_bank_name?: true
    user_bank_acc_no?: true
    user_ifsc_code?: true
    user_other_info?: true
    user_created_at?: true
    user_created_by?: true
    user_updated_at?: true
    user_updated_by?: true
    user_deleted_at?: true
    user_deleted_by?: true
    user_is_deleted?: true
  }

  export type UserCountAggregateInputType = {
    user_id?: true
    user_uuid?: true
    user_own_id?: true
    user_firm_id?: true
    user_add_date?: true
    user_first_name?: true
    user_father_name?: true
    user_last_name?: true
    user_mother_name?: true
    user_mobile_no?: true
    user_phone_no?: true
    user_email_id?: true
    user_gender?: true
    user_cast?: true
    user_marital_status?: true
    user_occupation?: true
    user_birth_date?: true
    user_gstin?: true
    user_tax_no?: true
    user_pan_no?: true
    user_adhaar_no?: true
    user_profile_img?: true
    user_adhaar_front_img?: true
    user_adhaar_back_img?: true
    user_pan_card_img?: true
    user_per_address?: true
    user_curr_address?: true
    user_village?: true
    user_ward_no?: true
    user_tehsil?: true
    user_city?: true
    user_state?: true
    user_country?: true
    user_pincode?: true
    user_bank_name?: true
    user_bank_acc_no?: true
    user_ifsc_code?: true
    user_sign_img?: true
    user_other_info?: true
    user_created_at?: true
    user_created_by?: true
    user_updated_at?: true
    user_updated_by?: true
    user_deleted_at?: true
    user_deleted_by?: true
    user_is_deleted?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    user_id: number
    user_uuid: string
    user_own_id: number
    user_firm_id: number
    user_add_date: Date
    user_first_name: string
    user_father_name: string | null
    user_last_name: string
    user_mother_name: string | null
    user_mobile_no: string
    user_phone_no: string | null
    user_email_id: string | null
    user_gender: $Enums.UserGender | null
    user_cast: string | null
    user_marital_status: $Enums.UserMaritalStatus | null
    user_occupation: string | null
    user_birth_date: Date | null
    user_gstin: string | null
    user_tax_no: string | null
    user_pan_no: string | null
    user_adhaar_no: string | null
    user_profile_img: JsonValue | null
    user_adhaar_front_img: JsonValue | null
    user_adhaar_back_img: JsonValue | null
    user_pan_card_img: JsonValue | null
    user_per_address: string | null
    user_curr_address: string | null
    user_village: string | null
    user_ward_no: string | null
    user_tehsil: string | null
    user_city: string | null
    user_state: string | null
    user_country: string | null
    user_pincode: string | null
    user_bank_name: string | null
    user_bank_acc_no: string | null
    user_ifsc_code: string | null
    user_sign_img: JsonValue | null
    user_other_info: string | null
    user_created_at: Date
    user_created_by: string | null
    user_updated_at: Date
    user_updated_by: string | null
    user_deleted_at: Date | null
    user_deleted_by: string | null
    user_is_deleted: boolean
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    user_uuid?: boolean
    user_own_id?: boolean
    user_firm_id?: boolean
    user_add_date?: boolean
    user_first_name?: boolean
    user_father_name?: boolean
    user_last_name?: boolean
    user_mother_name?: boolean
    user_mobile_no?: boolean
    user_phone_no?: boolean
    user_email_id?: boolean
    user_gender?: boolean
    user_cast?: boolean
    user_marital_status?: boolean
    user_occupation?: boolean
    user_birth_date?: boolean
    user_gstin?: boolean
    user_tax_no?: boolean
    user_pan_no?: boolean
    user_adhaar_no?: boolean
    user_profile_img?: boolean
    user_adhaar_front_img?: boolean
    user_adhaar_back_img?: boolean
    user_pan_card_img?: boolean
    user_per_address?: boolean
    user_curr_address?: boolean
    user_village?: boolean
    user_ward_no?: boolean
    user_tehsil?: boolean
    user_city?: boolean
    user_state?: boolean
    user_country?: boolean
    user_pincode?: boolean
    user_bank_name?: boolean
    user_bank_acc_no?: boolean
    user_ifsc_code?: boolean
    user_sign_img?: boolean
    user_other_info?: boolean
    user_created_at?: boolean
    user_created_by?: boolean
    user_updated_at?: boolean
    user_updated_by?: boolean
    user_deleted_at?: boolean
    user_deleted_by?: boolean
    user_is_deleted?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    user_uuid?: boolean
    user_own_id?: boolean
    user_firm_id?: boolean
    user_add_date?: boolean
    user_first_name?: boolean
    user_father_name?: boolean
    user_last_name?: boolean
    user_mother_name?: boolean
    user_mobile_no?: boolean
    user_phone_no?: boolean
    user_email_id?: boolean
    user_gender?: boolean
    user_cast?: boolean
    user_marital_status?: boolean
    user_occupation?: boolean
    user_birth_date?: boolean
    user_gstin?: boolean
    user_tax_no?: boolean
    user_pan_no?: boolean
    user_adhaar_no?: boolean
    user_profile_img?: boolean
    user_adhaar_front_img?: boolean
    user_adhaar_back_img?: boolean
    user_pan_card_img?: boolean
    user_per_address?: boolean
    user_curr_address?: boolean
    user_village?: boolean
    user_ward_no?: boolean
    user_tehsil?: boolean
    user_city?: boolean
    user_state?: boolean
    user_country?: boolean
    user_pincode?: boolean
    user_bank_name?: boolean
    user_bank_acc_no?: boolean
    user_ifsc_code?: boolean
    user_sign_img?: boolean
    user_other_info?: boolean
    user_created_at?: boolean
    user_created_by?: boolean
    user_updated_at?: boolean
    user_updated_by?: boolean
    user_deleted_at?: boolean
    user_deleted_by?: boolean
    user_is_deleted?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    user_id?: boolean
    user_uuid?: boolean
    user_own_id?: boolean
    user_firm_id?: boolean
    user_add_date?: boolean
    user_first_name?: boolean
    user_father_name?: boolean
    user_last_name?: boolean
    user_mother_name?: boolean
    user_mobile_no?: boolean
    user_phone_no?: boolean
    user_email_id?: boolean
    user_gender?: boolean
    user_cast?: boolean
    user_marital_status?: boolean
    user_occupation?: boolean
    user_birth_date?: boolean
    user_gstin?: boolean
    user_tax_no?: boolean
    user_pan_no?: boolean
    user_adhaar_no?: boolean
    user_profile_img?: boolean
    user_adhaar_front_img?: boolean
    user_adhaar_back_img?: boolean
    user_pan_card_img?: boolean
    user_per_address?: boolean
    user_curr_address?: boolean
    user_village?: boolean
    user_ward_no?: boolean
    user_tehsil?: boolean
    user_city?: boolean
    user_state?: boolean
    user_country?: boolean
    user_pincode?: boolean
    user_bank_name?: boolean
    user_bank_acc_no?: boolean
    user_ifsc_code?: boolean
    user_sign_img?: boolean
    user_other_info?: boolean
    user_created_at?: boolean
    user_created_by?: boolean
    user_updated_at?: boolean
    user_updated_by?: boolean
    user_deleted_at?: boolean
    user_deleted_by?: boolean
    user_is_deleted?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
    firm?: boolean | FirmDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      owner: Prisma.$OwnerPayload<ExtArgs>
      firm: Prisma.$FirmPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: number
      user_uuid: string
      user_own_id: number
      user_firm_id: number
      user_add_date: Date
      user_first_name: string
      user_father_name: string | null
      user_last_name: string
      user_mother_name: string | null
      user_mobile_no: string
      user_phone_no: string | null
      user_email_id: string | null
      user_gender: $Enums.UserGender | null
      user_cast: string | null
      user_marital_status: $Enums.UserMaritalStatus | null
      user_occupation: string | null
      user_birth_date: Date | null
      user_gstin: string | null
      user_tax_no: string | null
      user_pan_no: string | null
      user_adhaar_no: string | null
      user_profile_img: Prisma.JsonValue | null
      user_adhaar_front_img: Prisma.JsonValue | null
      user_adhaar_back_img: Prisma.JsonValue | null
      user_pan_card_img: Prisma.JsonValue | null
      user_per_address: string | null
      user_curr_address: string | null
      user_village: string | null
      user_ward_no: string | null
      user_tehsil: string | null
      user_city: string | null
      user_state: string | null
      user_country: string | null
      user_pincode: string | null
      user_bank_name: string | null
      user_bank_acc_no: string | null
      user_ifsc_code: string | null
      user_sign_img: Prisma.JsonValue | null
      user_other_info: string | null
      user_created_at: Date
      user_created_by: string | null
      user_updated_at: Date
      user_updated_by: string | null
      user_deleted_at: Date | null
      user_deleted_by: string | null
      user_is_deleted: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const userWithUser_idOnly = await prisma.user.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `user_id`
     * const userWithUser_idOnly = await prisma.user.createManyAndReturn({ 
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends OwnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OwnerDefaultArgs<ExtArgs>>): Prisma__OwnerClient<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    firm<T extends FirmDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FirmDefaultArgs<ExtArgs>>): Prisma__FirmClient<$Result.GetResult<Prisma.$FirmPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly user_id: FieldRef<"User", 'Int'>
    readonly user_uuid: FieldRef<"User", 'String'>
    readonly user_own_id: FieldRef<"User", 'Int'>
    readonly user_firm_id: FieldRef<"User", 'Int'>
    readonly user_add_date: FieldRef<"User", 'DateTime'>
    readonly user_first_name: FieldRef<"User", 'String'>
    readonly user_father_name: FieldRef<"User", 'String'>
    readonly user_last_name: FieldRef<"User", 'String'>
    readonly user_mother_name: FieldRef<"User", 'String'>
    readonly user_mobile_no: FieldRef<"User", 'String'>
    readonly user_phone_no: FieldRef<"User", 'String'>
    readonly user_email_id: FieldRef<"User", 'String'>
    readonly user_gender: FieldRef<"User", 'UserGender'>
    readonly user_cast: FieldRef<"User", 'String'>
    readonly user_marital_status: FieldRef<"User", 'UserMaritalStatus'>
    readonly user_occupation: FieldRef<"User", 'String'>
    readonly user_birth_date: FieldRef<"User", 'DateTime'>
    readonly user_gstin: FieldRef<"User", 'String'>
    readonly user_tax_no: FieldRef<"User", 'String'>
    readonly user_pan_no: FieldRef<"User", 'String'>
    readonly user_adhaar_no: FieldRef<"User", 'String'>
    readonly user_profile_img: FieldRef<"User", 'Json'>
    readonly user_adhaar_front_img: FieldRef<"User", 'Json'>
    readonly user_adhaar_back_img: FieldRef<"User", 'Json'>
    readonly user_pan_card_img: FieldRef<"User", 'Json'>
    readonly user_per_address: FieldRef<"User", 'String'>
    readonly user_curr_address: FieldRef<"User", 'String'>
    readonly user_village: FieldRef<"User", 'String'>
    readonly user_ward_no: FieldRef<"User", 'String'>
    readonly user_tehsil: FieldRef<"User", 'String'>
    readonly user_city: FieldRef<"User", 'String'>
    readonly user_state: FieldRef<"User", 'String'>
    readonly user_country: FieldRef<"User", 'String'>
    readonly user_pincode: FieldRef<"User", 'String'>
    readonly user_bank_name: FieldRef<"User", 'String'>
    readonly user_bank_acc_no: FieldRef<"User", 'String'>
    readonly user_ifsc_code: FieldRef<"User", 'String'>
    readonly user_sign_img: FieldRef<"User", 'Json'>
    readonly user_other_info: FieldRef<"User", 'String'>
    readonly user_created_at: FieldRef<"User", 'DateTime'>
    readonly user_created_by: FieldRef<"User", 'String'>
    readonly user_updated_at: FieldRef<"User", 'DateTime'>
    readonly user_updated_by: FieldRef<"User", 'String'>
    readonly user_deleted_at: FieldRef<"User", 'DateTime'>
    readonly user_deleted_by: FieldRef<"User", 'String'>
    readonly user_is_deleted: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OwnerScalarFieldEnum: {
    own_id: 'own_id',
    own_uuid: 'own_uuid',
    own_product_key: 'own_product_key',
    own_db: 'own_db',
    own_add_date: 'own_add_date',
    own_first_name: 'own_first_name',
    own_middle_name: 'own_middle_name',
    own_last_name: 'own_last_name',
    own_phone_no: 'own_phone_no',
    own_mobile_no: 'own_mobile_no',
    own_email: 'own_email',
    own_login_id: 'own_login_id',
    own_password: 'own_password',
    own_status: 'own_status',
    own_profile_img: 'own_profile_img',
    own_refresh_token: 'own_refresh_token',
    own_refresh_expiry: 'own_refresh_expiry',
    own_jwt_token: 'own_jwt_token',
    own_jwt_expiry: 'own_jwt_expiry',
    own_login_status: 'own_login_status',
    own_last_login_system: 'own_last_login_system',
    own_otp: 'own_otp',
    own_otp_expiry: 'own_otp_expiry',
    own_address: 'own_address',
    own_village: 'own_village',
    own_city: 'own_city',
    own_state: 'own_state',
    own_pincode: 'own_pincode',
    own_created_at: 'own_created_at',
    own_created_by: 'own_created_by',
    own_updated_at: 'own_updated_at',
    own_updated_by: 'own_updated_by',
    own_deleted_at: 'own_deleted_at',
    own_deleted_by: 'own_deleted_by',
    own_is_deleted: 'own_is_deleted'
  };

  export type OwnerScalarFieldEnum = (typeof OwnerScalarFieldEnum)[keyof typeof OwnerScalarFieldEnum]


  export const FirmScalarFieldEnum: {
    firm_id: 'firm_id',
    firm_uuid: 'firm_uuid',
    firm_add_date: 'firm_add_date',
    firm_own_id: 'firm_own_id',
    firm_name: 'firm_name',
    firm_reg_no: 'firm_reg_no',
    firm_shop_name: 'firm_shop_name',
    firm_desc: 'firm_desc',
    firm_address: 'firm_address',
    firm_city: 'firm_city',
    firm_pincode: 'firm_pincode',
    firm_phone_no: 'firm_phone_no',
    firm_email_id: 'firm_email_id',
    firm_website_link: 'firm_website_link',
    firm_type: 'firm_type',
    firm_owner: 'firm_owner',
    firm_other_info: 'firm_other_info',
    firm_geo_latitude: 'firm_geo_latitude',
    firm_geo_longitude: 'firm_geo_longitude',
    firm_whatsapp_link: 'firm_whatsapp_link',
    firm_facebook_link: 'firm_facebook_link',
    firm_insta_link: 'firm_insta_link',
    firm_bank_name: 'firm_bank_name',
    firm_bank_acc_no: 'firm_bank_acc_no',
    firm_bank_branch: 'firm_bank_branch',
    firm_bank_address: 'firm_bank_address',
    firm_acc_holder: 'firm_acc_holder',
    firm_acc_type: 'firm_acc_type',
    firm_ifsc_code: 'firm_ifsc_code',
    firm_start_date: 'firm_start_date',
    firm_balance: 'firm_balance',
    firm_balance_type: 'firm_balance_type',
    firm_gstin_no: 'firm_gstin_no',
    firm_pan_no: 'firm_pan_no',
    firm_adhaar_no: 'firm_adhaar_no',
    firm_form_header: 'firm_form_header',
    firm_form_footer: 'firm_form_footer',
    firm_own_sign_img: 'firm_own_sign_img',
    firm_left_logo_img: 'firm_left_logo_img',
    firm_right_logo_img: 'firm_right_logo_img',
    firm_qr_code_img: 'firm_qr_code_img',
    firm_pan_no_img: 'firm_pan_no_img',
    firm_created_at: 'firm_created_at',
    firm_created_by: 'firm_created_by',
    firm_updated_at: 'firm_updated_at',
    firm_updated_by: 'firm_updated_by',
    firm_deleted_at: 'firm_deleted_at',
    firm_deleted_by: 'firm_deleted_by',
    firm_is_deleted: 'firm_is_deleted'
  };

  export type FirmScalarFieldEnum = (typeof FirmScalarFieldEnum)[keyof typeof FirmScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    acc_id: 'acc_id',
    acc_uuid: 'acc_uuid',
    acc_add_date: 'acc_add_date',
    acc_own_id: 'acc_own_id',
    acc_firm_id: 'acc_firm_id',
    acc_pan_no: 'acc_pan_no',
    acc_name: 'acc_name',
    acc_desc: 'acc_desc',
    acc_pre_acc: 'acc_pre_acc',
    acc_bank_no: 'acc_bank_no',
    acc_bsr_no: 'acc_bsr_no',
    acc_ifsc_code: 'acc_ifsc_code',
    acc_branch_name: 'acc_branch_name',
    acc_opening_date: 'acc_opening_date',
    acc_address: 'acc_address',
    acc_country: 'acc_country',
    acc_state: 'acc_state',
    acc_city: 'acc_city',
    acc_pincode: 'acc_pincode',
    acc_cash_balance: 'acc_cash_balance',
    acc_balance_type: 'acc_balance_type',
    acc_other_info: 'acc_other_info',
    acc_created_at: 'acc_created_at',
    acc_created_by: 'acc_created_by',
    acc_updated_by: 'acc_updated_by',
    acc_deleted_at: 'acc_deleted_at',
    acc_deleted_by: 'acc_deleted_by',
    acc_is_system: 'acc_is_system',
    acc_is_deleted: 'acc_is_deleted'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const UserScalarFieldEnum: {
    user_id: 'user_id',
    user_uuid: 'user_uuid',
    user_own_id: 'user_own_id',
    user_firm_id: 'user_firm_id',
    user_add_date: 'user_add_date',
    user_first_name: 'user_first_name',
    user_father_name: 'user_father_name',
    user_last_name: 'user_last_name',
    user_mother_name: 'user_mother_name',
    user_mobile_no: 'user_mobile_no',
    user_phone_no: 'user_phone_no',
    user_email_id: 'user_email_id',
    user_gender: 'user_gender',
    user_cast: 'user_cast',
    user_marital_status: 'user_marital_status',
    user_occupation: 'user_occupation',
    user_birth_date: 'user_birth_date',
    user_gstin: 'user_gstin',
    user_tax_no: 'user_tax_no',
    user_pan_no: 'user_pan_no',
    user_adhaar_no: 'user_adhaar_no',
    user_profile_img: 'user_profile_img',
    user_adhaar_front_img: 'user_adhaar_front_img',
    user_adhaar_back_img: 'user_adhaar_back_img',
    user_pan_card_img: 'user_pan_card_img',
    user_per_address: 'user_per_address',
    user_curr_address: 'user_curr_address',
    user_village: 'user_village',
    user_ward_no: 'user_ward_no',
    user_tehsil: 'user_tehsil',
    user_city: 'user_city',
    user_state: 'user_state',
    user_country: 'user_country',
    user_pincode: 'user_pincode',
    user_bank_name: 'user_bank_name',
    user_bank_acc_no: 'user_bank_acc_no',
    user_ifsc_code: 'user_ifsc_code',
    user_sign_img: 'user_sign_img',
    user_other_info: 'user_other_info',
    user_created_at: 'user_created_at',
    user_created_by: 'user_created_by',
    user_updated_at: 'user_updated_at',
    user_updated_by: 'user_updated_by',
    user_deleted_at: 'user_deleted_at',
    user_deleted_by: 'user_deleted_by',
    user_is_deleted: 'user_is_deleted'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'OwnerStatus'
   */
  export type EnumOwnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OwnerStatus'>
    


  /**
   * Reference to a field of type 'OwnerStatus[]'
   */
  export type ListEnumOwnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OwnerStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'FirmType'
   */
  export type EnumFirmTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirmType'>
    


  /**
   * Reference to a field of type 'FirmType[]'
   */
  export type ListEnumFirmTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirmType[]'>
    


  /**
   * Reference to a field of type 'FirmBalanceType'
   */
  export type EnumFirmBalanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirmBalanceType'>
    


  /**
   * Reference to a field of type 'FirmBalanceType[]'
   */
  export type ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FirmBalanceType[]'>
    


  /**
   * Reference to a field of type 'AccountBalanceType'
   */
  export type EnumAccountBalanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountBalanceType'>
    


  /**
   * Reference to a field of type 'AccountBalanceType[]'
   */
  export type ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AccountBalanceType[]'>
    


  /**
   * Reference to a field of type 'UserGender'
   */
  export type EnumUserGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserGender'>
    


  /**
   * Reference to a field of type 'UserGender[]'
   */
  export type ListEnumUserGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserGender[]'>
    


  /**
   * Reference to a field of type 'UserMaritalStatus'
   */
  export type EnumUserMaritalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserMaritalStatus'>
    


  /**
   * Reference to a field of type 'UserMaritalStatus[]'
   */
  export type ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserMaritalStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type OwnerWhereInput = {
    AND?: OwnerWhereInput | OwnerWhereInput[]
    OR?: OwnerWhereInput[]
    NOT?: OwnerWhereInput | OwnerWhereInput[]
    own_id?: IntFilter<"Owner"> | number
    own_uuid?: StringFilter<"Owner"> | string
    own_product_key?: IntFilter<"Owner"> | number
    own_db?: StringFilter<"Owner"> | string
    own_add_date?: DateTimeFilter<"Owner"> | Date | string
    own_first_name?: StringFilter<"Owner"> | string
    own_middle_name?: StringNullableFilter<"Owner"> | string | null
    own_last_name?: StringFilter<"Owner"> | string
    own_phone_no?: StringNullableFilter<"Owner"> | string | null
    own_mobile_no?: StringFilter<"Owner"> | string
    own_email?: StringFilter<"Owner"> | string
    own_login_id?: StringFilter<"Owner"> | string
    own_password?: StringFilter<"Owner"> | string
    own_status?: EnumOwnerStatusFilter<"Owner"> | $Enums.OwnerStatus
    own_profile_img?: JsonNullableFilter<"Owner">
    own_refresh_token?: StringNullableFilter<"Owner"> | string | null
    own_refresh_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_jwt_token?: StringNullableFilter<"Owner"> | string | null
    own_jwt_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_login_status?: BoolFilter<"Owner"> | boolean
    own_last_login_system?: JsonNullableFilter<"Owner">
    own_otp?: StringNullableFilter<"Owner"> | string | null
    own_otp_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_address?: StringNullableFilter<"Owner"> | string | null
    own_village?: StringNullableFilter<"Owner"> | string | null
    own_city?: StringNullableFilter<"Owner"> | string | null
    own_state?: StringNullableFilter<"Owner"> | string | null
    own_pincode?: StringNullableFilter<"Owner"> | string | null
    own_created_at?: DateTimeFilter<"Owner"> | Date | string
    own_created_by?: StringNullableFilter<"Owner"> | string | null
    own_updated_at?: DateTimeFilter<"Owner"> | Date | string
    own_updated_by?: StringNullableFilter<"Owner"> | string | null
    own_deleted_at?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_deleted_by?: StringNullableFilter<"Owner"> | string | null
    own_is_deleted?: BoolFilter<"Owner"> | boolean
    users?: UserListRelationFilter
    firms?: FirmListRelationFilter
    accounts?: AccountListRelationFilter
  }

  export type OwnerOrderByWithRelationInput = {
    own_id?: SortOrder
    own_uuid?: SortOrder
    own_product_key?: SortOrder
    own_db?: SortOrder
    own_add_date?: SortOrder
    own_first_name?: SortOrder
    own_middle_name?: SortOrderInput | SortOrder
    own_last_name?: SortOrder
    own_phone_no?: SortOrderInput | SortOrder
    own_mobile_no?: SortOrder
    own_email?: SortOrder
    own_login_id?: SortOrder
    own_password?: SortOrder
    own_status?: SortOrder
    own_profile_img?: SortOrderInput | SortOrder
    own_refresh_token?: SortOrderInput | SortOrder
    own_refresh_expiry?: SortOrderInput | SortOrder
    own_jwt_token?: SortOrderInput | SortOrder
    own_jwt_expiry?: SortOrderInput | SortOrder
    own_login_status?: SortOrder
    own_last_login_system?: SortOrderInput | SortOrder
    own_otp?: SortOrderInput | SortOrder
    own_otp_expiry?: SortOrderInput | SortOrder
    own_address?: SortOrderInput | SortOrder
    own_village?: SortOrderInput | SortOrder
    own_city?: SortOrderInput | SortOrder
    own_state?: SortOrderInput | SortOrder
    own_pincode?: SortOrderInput | SortOrder
    own_created_at?: SortOrder
    own_created_by?: SortOrderInput | SortOrder
    own_updated_at?: SortOrder
    own_updated_by?: SortOrderInput | SortOrder
    own_deleted_at?: SortOrderInput | SortOrder
    own_deleted_by?: SortOrderInput | SortOrder
    own_is_deleted?: SortOrder
    users?: UserOrderByRelationAggregateInput
    firms?: FirmOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
  }

  export type OwnerWhereUniqueInput = Prisma.AtLeast<{
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db?: string
    own_mobile_no?: string
    own_email?: string
    own_login_id?: string
    AND?: OwnerWhereInput | OwnerWhereInput[]
    OR?: OwnerWhereInput[]
    NOT?: OwnerWhereInput | OwnerWhereInput[]
    own_add_date?: DateTimeFilter<"Owner"> | Date | string
    own_first_name?: StringFilter<"Owner"> | string
    own_middle_name?: StringNullableFilter<"Owner"> | string | null
    own_last_name?: StringFilter<"Owner"> | string
    own_phone_no?: StringNullableFilter<"Owner"> | string | null
    own_password?: StringFilter<"Owner"> | string
    own_status?: EnumOwnerStatusFilter<"Owner"> | $Enums.OwnerStatus
    own_profile_img?: JsonNullableFilter<"Owner">
    own_refresh_token?: StringNullableFilter<"Owner"> | string | null
    own_refresh_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_jwt_token?: StringNullableFilter<"Owner"> | string | null
    own_jwt_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_login_status?: BoolFilter<"Owner"> | boolean
    own_last_login_system?: JsonNullableFilter<"Owner">
    own_otp?: StringNullableFilter<"Owner"> | string | null
    own_otp_expiry?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_address?: StringNullableFilter<"Owner"> | string | null
    own_village?: StringNullableFilter<"Owner"> | string | null
    own_city?: StringNullableFilter<"Owner"> | string | null
    own_state?: StringNullableFilter<"Owner"> | string | null
    own_pincode?: StringNullableFilter<"Owner"> | string | null
    own_created_at?: DateTimeFilter<"Owner"> | Date | string
    own_created_by?: StringNullableFilter<"Owner"> | string | null
    own_updated_at?: DateTimeFilter<"Owner"> | Date | string
    own_updated_by?: StringNullableFilter<"Owner"> | string | null
    own_deleted_at?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_deleted_by?: StringNullableFilter<"Owner"> | string | null
    own_is_deleted?: BoolFilter<"Owner"> | boolean
    users?: UserListRelationFilter
    firms?: FirmListRelationFilter
    accounts?: AccountListRelationFilter
  }, "own_id" | "own_uuid" | "own_product_key" | "own_db" | "own_mobile_no" | "own_email" | "own_login_id">

  export type OwnerOrderByWithAggregationInput = {
    own_id?: SortOrder
    own_uuid?: SortOrder
    own_product_key?: SortOrder
    own_db?: SortOrder
    own_add_date?: SortOrder
    own_first_name?: SortOrder
    own_middle_name?: SortOrderInput | SortOrder
    own_last_name?: SortOrder
    own_phone_no?: SortOrderInput | SortOrder
    own_mobile_no?: SortOrder
    own_email?: SortOrder
    own_login_id?: SortOrder
    own_password?: SortOrder
    own_status?: SortOrder
    own_profile_img?: SortOrderInput | SortOrder
    own_refresh_token?: SortOrderInput | SortOrder
    own_refresh_expiry?: SortOrderInput | SortOrder
    own_jwt_token?: SortOrderInput | SortOrder
    own_jwt_expiry?: SortOrderInput | SortOrder
    own_login_status?: SortOrder
    own_last_login_system?: SortOrderInput | SortOrder
    own_otp?: SortOrderInput | SortOrder
    own_otp_expiry?: SortOrderInput | SortOrder
    own_address?: SortOrderInput | SortOrder
    own_village?: SortOrderInput | SortOrder
    own_city?: SortOrderInput | SortOrder
    own_state?: SortOrderInput | SortOrder
    own_pincode?: SortOrderInput | SortOrder
    own_created_at?: SortOrder
    own_created_by?: SortOrderInput | SortOrder
    own_updated_at?: SortOrder
    own_updated_by?: SortOrderInput | SortOrder
    own_deleted_at?: SortOrderInput | SortOrder
    own_deleted_by?: SortOrderInput | SortOrder
    own_is_deleted?: SortOrder
    _count?: OwnerCountOrderByAggregateInput
    _avg?: OwnerAvgOrderByAggregateInput
    _max?: OwnerMaxOrderByAggregateInput
    _min?: OwnerMinOrderByAggregateInput
    _sum?: OwnerSumOrderByAggregateInput
  }

  export type OwnerScalarWhereWithAggregatesInput = {
    AND?: OwnerScalarWhereWithAggregatesInput | OwnerScalarWhereWithAggregatesInput[]
    OR?: OwnerScalarWhereWithAggregatesInput[]
    NOT?: OwnerScalarWhereWithAggregatesInput | OwnerScalarWhereWithAggregatesInput[]
    own_id?: IntWithAggregatesFilter<"Owner"> | number
    own_uuid?: StringWithAggregatesFilter<"Owner"> | string
    own_product_key?: IntWithAggregatesFilter<"Owner"> | number
    own_db?: StringWithAggregatesFilter<"Owner"> | string
    own_add_date?: DateTimeWithAggregatesFilter<"Owner"> | Date | string
    own_first_name?: StringWithAggregatesFilter<"Owner"> | string
    own_middle_name?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_last_name?: StringWithAggregatesFilter<"Owner"> | string
    own_phone_no?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_mobile_no?: StringWithAggregatesFilter<"Owner"> | string
    own_email?: StringWithAggregatesFilter<"Owner"> | string
    own_login_id?: StringWithAggregatesFilter<"Owner"> | string
    own_password?: StringWithAggregatesFilter<"Owner"> | string
    own_status?: EnumOwnerStatusWithAggregatesFilter<"Owner"> | $Enums.OwnerStatus
    own_profile_img?: JsonNullableWithAggregatesFilter<"Owner">
    own_refresh_token?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_refresh_expiry?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
    own_jwt_token?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_jwt_expiry?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
    own_login_status?: BoolWithAggregatesFilter<"Owner"> | boolean
    own_last_login_system?: JsonNullableWithAggregatesFilter<"Owner">
    own_otp?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_otp_expiry?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
    own_address?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_village?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_city?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_state?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_pincode?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_created_at?: DateTimeWithAggregatesFilter<"Owner"> | Date | string
    own_created_by?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_updated_at?: DateTimeWithAggregatesFilter<"Owner"> | Date | string
    own_updated_by?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_deleted_at?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
    own_deleted_by?: StringNullableWithAggregatesFilter<"Owner"> | string | null
    own_is_deleted?: BoolWithAggregatesFilter<"Owner"> | boolean
  }

  export type FirmWhereInput = {
    AND?: FirmWhereInput | FirmWhereInput[]
    OR?: FirmWhereInput[]
    NOT?: FirmWhereInput | FirmWhereInput[]
    firm_id?: IntFilter<"Firm"> | number
    firm_uuid?: StringFilter<"Firm"> | string
    firm_add_date?: DateTimeFilter<"Firm"> | Date | string
    firm_own_id?: IntFilter<"Firm"> | number
    firm_name?: StringFilter<"Firm"> | string
    firm_reg_no?: StringFilter<"Firm"> | string
    firm_shop_name?: StringFilter<"Firm"> | string
    firm_desc?: StringNullableFilter<"Firm"> | string | null
    firm_address?: StringNullableFilter<"Firm"> | string | null
    firm_city?: StringNullableFilter<"Firm"> | string | null
    firm_pincode?: StringNullableFilter<"Firm"> | string | null
    firm_phone_no?: StringNullableFilter<"Firm"> | string | null
    firm_email_id?: StringNullableFilter<"Firm"> | string | null
    firm_website_link?: StringNullableFilter<"Firm"> | string | null
    firm_type?: EnumFirmTypeFilter<"Firm"> | $Enums.FirmType
    firm_owner?: StringNullableFilter<"Firm"> | string | null
    firm_other_info?: StringNullableFilter<"Firm"> | string | null
    firm_geo_latitude?: StringNullableFilter<"Firm"> | string | null
    firm_geo_longitude?: StringNullableFilter<"Firm"> | string | null
    firm_whatsapp_link?: StringNullableFilter<"Firm"> | string | null
    firm_facebook_link?: StringNullableFilter<"Firm"> | string | null
    firm_insta_link?: StringNullableFilter<"Firm"> | string | null
    firm_bank_name?: StringNullableFilter<"Firm"> | string | null
    firm_bank_acc_no?: StringNullableFilter<"Firm"> | string | null
    firm_bank_branch?: StringNullableFilter<"Firm"> | string | null
    firm_bank_address?: StringNullableFilter<"Firm"> | string | null
    firm_acc_holder?: StringNullableFilter<"Firm"> | string | null
    firm_acc_type?: StringNullableFilter<"Firm"> | string | null
    firm_ifsc_code?: StringNullableFilter<"Firm"> | string | null
    firm_start_date?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_balance?: StringNullableFilter<"Firm"> | string | null
    firm_balance_type?: EnumFirmBalanceTypeFilter<"Firm"> | $Enums.FirmBalanceType
    firm_gstin_no?: StringNullableFilter<"Firm"> | string | null
    firm_pan_no?: StringNullableFilter<"Firm"> | string | null
    firm_adhaar_no?: StringNullableFilter<"Firm"> | string | null
    firm_form_header?: StringNullableFilter<"Firm"> | string | null
    firm_form_footer?: StringNullableFilter<"Firm"> | string | null
    firm_own_sign_img?: JsonNullableFilter<"Firm">
    firm_left_logo_img?: JsonNullableFilter<"Firm">
    firm_right_logo_img?: JsonNullableFilter<"Firm">
    firm_qr_code_img?: JsonNullableFilter<"Firm">
    firm_pan_no_img?: JsonNullableFilter<"Firm">
    firm_created_at?: DateTimeFilter<"Firm"> | Date | string
    firm_created_by?: StringNullableFilter<"Firm"> | string | null
    firm_updated_at?: DateTimeFilter<"Firm"> | Date | string
    firm_updated_by?: StringNullableFilter<"Firm"> | string | null
    firm_deleted_at?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_deleted_by?: StringNullableFilter<"Firm"> | string | null
    firm_is_deleted?: BoolFilter<"Firm"> | boolean
    users?: UserListRelationFilter
    accounts?: AccountListRelationFilter
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
  }

  export type FirmOrderByWithRelationInput = {
    firm_id?: SortOrder
    firm_uuid?: SortOrder
    firm_add_date?: SortOrder
    firm_own_id?: SortOrder
    firm_name?: SortOrder
    firm_reg_no?: SortOrder
    firm_shop_name?: SortOrder
    firm_desc?: SortOrderInput | SortOrder
    firm_address?: SortOrderInput | SortOrder
    firm_city?: SortOrderInput | SortOrder
    firm_pincode?: SortOrderInput | SortOrder
    firm_phone_no?: SortOrderInput | SortOrder
    firm_email_id?: SortOrderInput | SortOrder
    firm_website_link?: SortOrderInput | SortOrder
    firm_type?: SortOrder
    firm_owner?: SortOrderInput | SortOrder
    firm_other_info?: SortOrderInput | SortOrder
    firm_geo_latitude?: SortOrderInput | SortOrder
    firm_geo_longitude?: SortOrderInput | SortOrder
    firm_whatsapp_link?: SortOrderInput | SortOrder
    firm_facebook_link?: SortOrderInput | SortOrder
    firm_insta_link?: SortOrderInput | SortOrder
    firm_bank_name?: SortOrderInput | SortOrder
    firm_bank_acc_no?: SortOrderInput | SortOrder
    firm_bank_branch?: SortOrderInput | SortOrder
    firm_bank_address?: SortOrderInput | SortOrder
    firm_acc_holder?: SortOrderInput | SortOrder
    firm_acc_type?: SortOrderInput | SortOrder
    firm_ifsc_code?: SortOrderInput | SortOrder
    firm_start_date?: SortOrderInput | SortOrder
    firm_balance?: SortOrderInput | SortOrder
    firm_balance_type?: SortOrder
    firm_gstin_no?: SortOrderInput | SortOrder
    firm_pan_no?: SortOrderInput | SortOrder
    firm_adhaar_no?: SortOrderInput | SortOrder
    firm_form_header?: SortOrderInput | SortOrder
    firm_form_footer?: SortOrderInput | SortOrder
    firm_own_sign_img?: SortOrderInput | SortOrder
    firm_left_logo_img?: SortOrderInput | SortOrder
    firm_right_logo_img?: SortOrderInput | SortOrder
    firm_qr_code_img?: SortOrderInput | SortOrder
    firm_pan_no_img?: SortOrderInput | SortOrder
    firm_created_at?: SortOrder
    firm_created_by?: SortOrderInput | SortOrder
    firm_updated_at?: SortOrder
    firm_updated_by?: SortOrderInput | SortOrder
    firm_deleted_at?: SortOrderInput | SortOrder
    firm_deleted_by?: SortOrderInput | SortOrder
    firm_is_deleted?: SortOrder
    users?: UserOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    owner?: OwnerOrderByWithRelationInput
  }

  export type FirmWhereUniqueInput = Prisma.AtLeast<{
    firm_id?: number
    firm_uuid?: string
    firm_name?: string
    firm_reg_no?: string
    AND?: FirmWhereInput | FirmWhereInput[]
    OR?: FirmWhereInput[]
    NOT?: FirmWhereInput | FirmWhereInput[]
    firm_add_date?: DateTimeFilter<"Firm"> | Date | string
    firm_own_id?: IntFilter<"Firm"> | number
    firm_shop_name?: StringFilter<"Firm"> | string
    firm_desc?: StringNullableFilter<"Firm"> | string | null
    firm_address?: StringNullableFilter<"Firm"> | string | null
    firm_city?: StringNullableFilter<"Firm"> | string | null
    firm_pincode?: StringNullableFilter<"Firm"> | string | null
    firm_phone_no?: StringNullableFilter<"Firm"> | string | null
    firm_email_id?: StringNullableFilter<"Firm"> | string | null
    firm_website_link?: StringNullableFilter<"Firm"> | string | null
    firm_type?: EnumFirmTypeFilter<"Firm"> | $Enums.FirmType
    firm_owner?: StringNullableFilter<"Firm"> | string | null
    firm_other_info?: StringNullableFilter<"Firm"> | string | null
    firm_geo_latitude?: StringNullableFilter<"Firm"> | string | null
    firm_geo_longitude?: StringNullableFilter<"Firm"> | string | null
    firm_whatsapp_link?: StringNullableFilter<"Firm"> | string | null
    firm_facebook_link?: StringNullableFilter<"Firm"> | string | null
    firm_insta_link?: StringNullableFilter<"Firm"> | string | null
    firm_bank_name?: StringNullableFilter<"Firm"> | string | null
    firm_bank_acc_no?: StringNullableFilter<"Firm"> | string | null
    firm_bank_branch?: StringNullableFilter<"Firm"> | string | null
    firm_bank_address?: StringNullableFilter<"Firm"> | string | null
    firm_acc_holder?: StringNullableFilter<"Firm"> | string | null
    firm_acc_type?: StringNullableFilter<"Firm"> | string | null
    firm_ifsc_code?: StringNullableFilter<"Firm"> | string | null
    firm_start_date?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_balance?: StringNullableFilter<"Firm"> | string | null
    firm_balance_type?: EnumFirmBalanceTypeFilter<"Firm"> | $Enums.FirmBalanceType
    firm_gstin_no?: StringNullableFilter<"Firm"> | string | null
    firm_pan_no?: StringNullableFilter<"Firm"> | string | null
    firm_adhaar_no?: StringNullableFilter<"Firm"> | string | null
    firm_form_header?: StringNullableFilter<"Firm"> | string | null
    firm_form_footer?: StringNullableFilter<"Firm"> | string | null
    firm_own_sign_img?: JsonNullableFilter<"Firm">
    firm_left_logo_img?: JsonNullableFilter<"Firm">
    firm_right_logo_img?: JsonNullableFilter<"Firm">
    firm_qr_code_img?: JsonNullableFilter<"Firm">
    firm_pan_no_img?: JsonNullableFilter<"Firm">
    firm_created_at?: DateTimeFilter<"Firm"> | Date | string
    firm_created_by?: StringNullableFilter<"Firm"> | string | null
    firm_updated_at?: DateTimeFilter<"Firm"> | Date | string
    firm_updated_by?: StringNullableFilter<"Firm"> | string | null
    firm_deleted_at?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_deleted_by?: StringNullableFilter<"Firm"> | string | null
    firm_is_deleted?: BoolFilter<"Firm"> | boolean
    users?: UserListRelationFilter
    accounts?: AccountListRelationFilter
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
  }, "firm_id" | "firm_uuid" | "firm_name" | "firm_reg_no">

  export type FirmOrderByWithAggregationInput = {
    firm_id?: SortOrder
    firm_uuid?: SortOrder
    firm_add_date?: SortOrder
    firm_own_id?: SortOrder
    firm_name?: SortOrder
    firm_reg_no?: SortOrder
    firm_shop_name?: SortOrder
    firm_desc?: SortOrderInput | SortOrder
    firm_address?: SortOrderInput | SortOrder
    firm_city?: SortOrderInput | SortOrder
    firm_pincode?: SortOrderInput | SortOrder
    firm_phone_no?: SortOrderInput | SortOrder
    firm_email_id?: SortOrderInput | SortOrder
    firm_website_link?: SortOrderInput | SortOrder
    firm_type?: SortOrder
    firm_owner?: SortOrderInput | SortOrder
    firm_other_info?: SortOrderInput | SortOrder
    firm_geo_latitude?: SortOrderInput | SortOrder
    firm_geo_longitude?: SortOrderInput | SortOrder
    firm_whatsapp_link?: SortOrderInput | SortOrder
    firm_facebook_link?: SortOrderInput | SortOrder
    firm_insta_link?: SortOrderInput | SortOrder
    firm_bank_name?: SortOrderInput | SortOrder
    firm_bank_acc_no?: SortOrderInput | SortOrder
    firm_bank_branch?: SortOrderInput | SortOrder
    firm_bank_address?: SortOrderInput | SortOrder
    firm_acc_holder?: SortOrderInput | SortOrder
    firm_acc_type?: SortOrderInput | SortOrder
    firm_ifsc_code?: SortOrderInput | SortOrder
    firm_start_date?: SortOrderInput | SortOrder
    firm_balance?: SortOrderInput | SortOrder
    firm_balance_type?: SortOrder
    firm_gstin_no?: SortOrderInput | SortOrder
    firm_pan_no?: SortOrderInput | SortOrder
    firm_adhaar_no?: SortOrderInput | SortOrder
    firm_form_header?: SortOrderInput | SortOrder
    firm_form_footer?: SortOrderInput | SortOrder
    firm_own_sign_img?: SortOrderInput | SortOrder
    firm_left_logo_img?: SortOrderInput | SortOrder
    firm_right_logo_img?: SortOrderInput | SortOrder
    firm_qr_code_img?: SortOrderInput | SortOrder
    firm_pan_no_img?: SortOrderInput | SortOrder
    firm_created_at?: SortOrder
    firm_created_by?: SortOrderInput | SortOrder
    firm_updated_at?: SortOrder
    firm_updated_by?: SortOrderInput | SortOrder
    firm_deleted_at?: SortOrderInput | SortOrder
    firm_deleted_by?: SortOrderInput | SortOrder
    firm_is_deleted?: SortOrder
    _count?: FirmCountOrderByAggregateInput
    _avg?: FirmAvgOrderByAggregateInput
    _max?: FirmMaxOrderByAggregateInput
    _min?: FirmMinOrderByAggregateInput
    _sum?: FirmSumOrderByAggregateInput
  }

  export type FirmScalarWhereWithAggregatesInput = {
    AND?: FirmScalarWhereWithAggregatesInput | FirmScalarWhereWithAggregatesInput[]
    OR?: FirmScalarWhereWithAggregatesInput[]
    NOT?: FirmScalarWhereWithAggregatesInput | FirmScalarWhereWithAggregatesInput[]
    firm_id?: IntWithAggregatesFilter<"Firm"> | number
    firm_uuid?: StringWithAggregatesFilter<"Firm"> | string
    firm_add_date?: DateTimeWithAggregatesFilter<"Firm"> | Date | string
    firm_own_id?: IntWithAggregatesFilter<"Firm"> | number
    firm_name?: StringWithAggregatesFilter<"Firm"> | string
    firm_reg_no?: StringWithAggregatesFilter<"Firm"> | string
    firm_shop_name?: StringWithAggregatesFilter<"Firm"> | string
    firm_desc?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_address?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_city?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_pincode?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_phone_no?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_email_id?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_website_link?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_type?: EnumFirmTypeWithAggregatesFilter<"Firm"> | $Enums.FirmType
    firm_owner?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_other_info?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_geo_latitude?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_geo_longitude?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_whatsapp_link?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_facebook_link?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_insta_link?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_bank_name?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_bank_acc_no?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_bank_branch?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_bank_address?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_acc_holder?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_acc_type?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_ifsc_code?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_start_date?: DateTimeNullableWithAggregatesFilter<"Firm"> | Date | string | null
    firm_balance?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_balance_type?: EnumFirmBalanceTypeWithAggregatesFilter<"Firm"> | $Enums.FirmBalanceType
    firm_gstin_no?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_pan_no?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_adhaar_no?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_form_header?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_form_footer?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_own_sign_img?: JsonNullableWithAggregatesFilter<"Firm">
    firm_left_logo_img?: JsonNullableWithAggregatesFilter<"Firm">
    firm_right_logo_img?: JsonNullableWithAggregatesFilter<"Firm">
    firm_qr_code_img?: JsonNullableWithAggregatesFilter<"Firm">
    firm_pan_no_img?: JsonNullableWithAggregatesFilter<"Firm">
    firm_created_at?: DateTimeWithAggregatesFilter<"Firm"> | Date | string
    firm_created_by?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_updated_at?: DateTimeWithAggregatesFilter<"Firm"> | Date | string
    firm_updated_by?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_deleted_at?: DateTimeNullableWithAggregatesFilter<"Firm"> | Date | string | null
    firm_deleted_by?: StringNullableWithAggregatesFilter<"Firm"> | string | null
    firm_is_deleted?: BoolWithAggregatesFilter<"Firm"> | boolean
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    acc_id?: IntFilter<"Account"> | number
    acc_uuid?: StringFilter<"Account"> | string
    acc_add_date?: DateTimeFilter<"Account"> | Date | string
    acc_own_id?: IntFilter<"Account"> | number
    acc_firm_id?: IntFilter<"Account"> | number
    acc_pan_no?: StringNullableFilter<"Account"> | string | null
    acc_name?: StringFilter<"Account"> | string
    acc_desc?: StringNullableFilter<"Account"> | string | null
    acc_pre_acc?: StringNullableFilter<"Account"> | string | null
    acc_bank_no?: StringNullableFilter<"Account"> | string | null
    acc_bsr_no?: StringNullableFilter<"Account"> | string | null
    acc_ifsc_code?: StringNullableFilter<"Account"> | string | null
    acc_branch_name?: StringNullableFilter<"Account"> | string | null
    acc_opening_date?: DateTimeFilter<"Account"> | Date | string
    acc_address?: StringNullableFilter<"Account"> | string | null
    acc_country?: StringNullableFilter<"Account"> | string | null
    acc_state?: StringNullableFilter<"Account"> | string | null
    acc_city?: StringNullableFilter<"Account"> | string | null
    acc_pincode?: StringNullableFilter<"Account"> | string | null
    acc_cash_balance?: StringNullableFilter<"Account"> | string | null
    acc_balance_type?: EnumAccountBalanceTypeFilter<"Account"> | $Enums.AccountBalanceType
    acc_other_info?: StringNullableFilter<"Account"> | string | null
    acc_created_at?: DateTimeFilter<"Account"> | Date | string
    acc_created_by?: StringNullableFilter<"Account"> | string | null
    acc_updated_by?: StringNullableFilter<"Account"> | string | null
    acc_deleted_at?: DateTimeNullableFilter<"Account"> | Date | string | null
    acc_deleted_by?: StringNullableFilter<"Account"> | string | null
    acc_is_system?: BoolFilter<"Account"> | boolean
    acc_is_deleted?: BoolFilter<"Account"> | boolean
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
    firm?: XOR<FirmRelationFilter, FirmWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    acc_id?: SortOrder
    acc_uuid?: SortOrder
    acc_add_date?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
    acc_pan_no?: SortOrderInput | SortOrder
    acc_name?: SortOrder
    acc_desc?: SortOrderInput | SortOrder
    acc_pre_acc?: SortOrderInput | SortOrder
    acc_bank_no?: SortOrderInput | SortOrder
    acc_bsr_no?: SortOrderInput | SortOrder
    acc_ifsc_code?: SortOrderInput | SortOrder
    acc_branch_name?: SortOrderInput | SortOrder
    acc_opening_date?: SortOrder
    acc_address?: SortOrderInput | SortOrder
    acc_country?: SortOrderInput | SortOrder
    acc_state?: SortOrderInput | SortOrder
    acc_city?: SortOrderInput | SortOrder
    acc_pincode?: SortOrderInput | SortOrder
    acc_cash_balance?: SortOrderInput | SortOrder
    acc_balance_type?: SortOrder
    acc_other_info?: SortOrderInput | SortOrder
    acc_created_at?: SortOrder
    acc_created_by?: SortOrderInput | SortOrder
    acc_updated_by?: SortOrderInput | SortOrder
    acc_deleted_at?: SortOrderInput | SortOrder
    acc_deleted_by?: SortOrderInput | SortOrder
    acc_is_system?: SortOrder
    acc_is_deleted?: SortOrder
    owner?: OwnerOrderByWithRelationInput
    firm?: FirmOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    acc_id?: number
    acc_uuid?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    acc_add_date?: DateTimeFilter<"Account"> | Date | string
    acc_own_id?: IntFilter<"Account"> | number
    acc_firm_id?: IntFilter<"Account"> | number
    acc_pan_no?: StringNullableFilter<"Account"> | string | null
    acc_name?: StringFilter<"Account"> | string
    acc_desc?: StringNullableFilter<"Account"> | string | null
    acc_pre_acc?: StringNullableFilter<"Account"> | string | null
    acc_bank_no?: StringNullableFilter<"Account"> | string | null
    acc_bsr_no?: StringNullableFilter<"Account"> | string | null
    acc_ifsc_code?: StringNullableFilter<"Account"> | string | null
    acc_branch_name?: StringNullableFilter<"Account"> | string | null
    acc_opening_date?: DateTimeFilter<"Account"> | Date | string
    acc_address?: StringNullableFilter<"Account"> | string | null
    acc_country?: StringNullableFilter<"Account"> | string | null
    acc_state?: StringNullableFilter<"Account"> | string | null
    acc_city?: StringNullableFilter<"Account"> | string | null
    acc_pincode?: StringNullableFilter<"Account"> | string | null
    acc_cash_balance?: StringNullableFilter<"Account"> | string | null
    acc_balance_type?: EnumAccountBalanceTypeFilter<"Account"> | $Enums.AccountBalanceType
    acc_other_info?: StringNullableFilter<"Account"> | string | null
    acc_created_at?: DateTimeFilter<"Account"> | Date | string
    acc_created_by?: StringNullableFilter<"Account"> | string | null
    acc_updated_by?: StringNullableFilter<"Account"> | string | null
    acc_deleted_at?: DateTimeNullableFilter<"Account"> | Date | string | null
    acc_deleted_by?: StringNullableFilter<"Account"> | string | null
    acc_is_system?: BoolFilter<"Account"> | boolean
    acc_is_deleted?: BoolFilter<"Account"> | boolean
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
    firm?: XOR<FirmRelationFilter, FirmWhereInput>
  }, "acc_id" | "acc_uuid">

  export type AccountOrderByWithAggregationInput = {
    acc_id?: SortOrder
    acc_uuid?: SortOrder
    acc_add_date?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
    acc_pan_no?: SortOrderInput | SortOrder
    acc_name?: SortOrder
    acc_desc?: SortOrderInput | SortOrder
    acc_pre_acc?: SortOrderInput | SortOrder
    acc_bank_no?: SortOrderInput | SortOrder
    acc_bsr_no?: SortOrderInput | SortOrder
    acc_ifsc_code?: SortOrderInput | SortOrder
    acc_branch_name?: SortOrderInput | SortOrder
    acc_opening_date?: SortOrder
    acc_address?: SortOrderInput | SortOrder
    acc_country?: SortOrderInput | SortOrder
    acc_state?: SortOrderInput | SortOrder
    acc_city?: SortOrderInput | SortOrder
    acc_pincode?: SortOrderInput | SortOrder
    acc_cash_balance?: SortOrderInput | SortOrder
    acc_balance_type?: SortOrder
    acc_other_info?: SortOrderInput | SortOrder
    acc_created_at?: SortOrder
    acc_created_by?: SortOrderInput | SortOrder
    acc_updated_by?: SortOrderInput | SortOrder
    acc_deleted_at?: SortOrderInput | SortOrder
    acc_deleted_by?: SortOrderInput | SortOrder
    acc_is_system?: SortOrder
    acc_is_deleted?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    acc_id?: IntWithAggregatesFilter<"Account"> | number
    acc_uuid?: StringWithAggregatesFilter<"Account"> | string
    acc_add_date?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    acc_own_id?: IntWithAggregatesFilter<"Account"> | number
    acc_firm_id?: IntWithAggregatesFilter<"Account"> | number
    acc_pan_no?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_name?: StringWithAggregatesFilter<"Account"> | string
    acc_desc?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_pre_acc?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_bank_no?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_bsr_no?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_ifsc_code?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_branch_name?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_opening_date?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    acc_address?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_country?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_city?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_pincode?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_cash_balance?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_balance_type?: EnumAccountBalanceTypeWithAggregatesFilter<"Account"> | $Enums.AccountBalanceType
    acc_other_info?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_created_at?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    acc_created_by?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_updated_by?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_deleted_at?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    acc_deleted_by?: StringNullableWithAggregatesFilter<"Account"> | string | null
    acc_is_system?: BoolWithAggregatesFilter<"Account"> | boolean
    acc_is_deleted?: BoolWithAggregatesFilter<"Account"> | boolean
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    user_id?: IntFilter<"User"> | number
    user_uuid?: StringFilter<"User"> | string
    user_own_id?: IntFilter<"User"> | number
    user_firm_id?: IntFilter<"User"> | number
    user_add_date?: DateTimeFilter<"User"> | Date | string
    user_first_name?: StringFilter<"User"> | string
    user_father_name?: StringNullableFilter<"User"> | string | null
    user_last_name?: StringFilter<"User"> | string
    user_mother_name?: StringNullableFilter<"User"> | string | null
    user_mobile_no?: StringFilter<"User"> | string
    user_phone_no?: StringNullableFilter<"User"> | string | null
    user_email_id?: StringNullableFilter<"User"> | string | null
    user_gender?: EnumUserGenderNullableFilter<"User"> | $Enums.UserGender | null
    user_cast?: StringNullableFilter<"User"> | string | null
    user_marital_status?: EnumUserMaritalStatusNullableFilter<"User"> | $Enums.UserMaritalStatus | null
    user_occupation?: StringNullableFilter<"User"> | string | null
    user_birth_date?: DateTimeNullableFilter<"User"> | Date | string | null
    user_gstin?: StringNullableFilter<"User"> | string | null
    user_tax_no?: StringNullableFilter<"User"> | string | null
    user_pan_no?: StringNullableFilter<"User"> | string | null
    user_adhaar_no?: StringNullableFilter<"User"> | string | null
    user_profile_img?: JsonNullableFilter<"User">
    user_adhaar_front_img?: JsonNullableFilter<"User">
    user_adhaar_back_img?: JsonNullableFilter<"User">
    user_pan_card_img?: JsonNullableFilter<"User">
    user_per_address?: StringNullableFilter<"User"> | string | null
    user_curr_address?: StringNullableFilter<"User"> | string | null
    user_village?: StringNullableFilter<"User"> | string | null
    user_ward_no?: StringNullableFilter<"User"> | string | null
    user_tehsil?: StringNullableFilter<"User"> | string | null
    user_city?: StringNullableFilter<"User"> | string | null
    user_state?: StringNullableFilter<"User"> | string | null
    user_country?: StringNullableFilter<"User"> | string | null
    user_pincode?: StringNullableFilter<"User"> | string | null
    user_bank_name?: StringNullableFilter<"User"> | string | null
    user_bank_acc_no?: StringNullableFilter<"User"> | string | null
    user_ifsc_code?: StringNullableFilter<"User"> | string | null
    user_sign_img?: JsonNullableFilter<"User">
    user_other_info?: StringNullableFilter<"User"> | string | null
    user_created_at?: DateTimeFilter<"User"> | Date | string
    user_created_by?: StringNullableFilter<"User"> | string | null
    user_updated_at?: DateTimeFilter<"User"> | Date | string
    user_updated_by?: StringNullableFilter<"User"> | string | null
    user_deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    user_deleted_by?: StringNullableFilter<"User"> | string | null
    user_is_deleted?: BoolFilter<"User"> | boolean
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
    firm?: XOR<FirmRelationFilter, FirmWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    user_id?: SortOrder
    user_uuid?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
    user_add_date?: SortOrder
    user_first_name?: SortOrder
    user_father_name?: SortOrderInput | SortOrder
    user_last_name?: SortOrder
    user_mother_name?: SortOrderInput | SortOrder
    user_mobile_no?: SortOrder
    user_phone_no?: SortOrderInput | SortOrder
    user_email_id?: SortOrderInput | SortOrder
    user_gender?: SortOrderInput | SortOrder
    user_cast?: SortOrderInput | SortOrder
    user_marital_status?: SortOrderInput | SortOrder
    user_occupation?: SortOrderInput | SortOrder
    user_birth_date?: SortOrderInput | SortOrder
    user_gstin?: SortOrderInput | SortOrder
    user_tax_no?: SortOrderInput | SortOrder
    user_pan_no?: SortOrderInput | SortOrder
    user_adhaar_no?: SortOrderInput | SortOrder
    user_profile_img?: SortOrderInput | SortOrder
    user_adhaar_front_img?: SortOrderInput | SortOrder
    user_adhaar_back_img?: SortOrderInput | SortOrder
    user_pan_card_img?: SortOrderInput | SortOrder
    user_per_address?: SortOrderInput | SortOrder
    user_curr_address?: SortOrderInput | SortOrder
    user_village?: SortOrderInput | SortOrder
    user_ward_no?: SortOrderInput | SortOrder
    user_tehsil?: SortOrderInput | SortOrder
    user_city?: SortOrderInput | SortOrder
    user_state?: SortOrderInput | SortOrder
    user_country?: SortOrderInput | SortOrder
    user_pincode?: SortOrderInput | SortOrder
    user_bank_name?: SortOrderInput | SortOrder
    user_bank_acc_no?: SortOrderInput | SortOrder
    user_ifsc_code?: SortOrderInput | SortOrder
    user_sign_img?: SortOrderInput | SortOrder
    user_other_info?: SortOrderInput | SortOrder
    user_created_at?: SortOrder
    user_created_by?: SortOrderInput | SortOrder
    user_updated_at?: SortOrder
    user_updated_by?: SortOrderInput | SortOrder
    user_deleted_at?: SortOrderInput | SortOrder
    user_deleted_by?: SortOrderInput | SortOrder
    user_is_deleted?: SortOrder
    owner?: OwnerOrderByWithRelationInput
    firm?: FirmOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    user_id?: number
    user_uuid?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    user_own_id?: IntFilter<"User"> | number
    user_firm_id?: IntFilter<"User"> | number
    user_add_date?: DateTimeFilter<"User"> | Date | string
    user_first_name?: StringFilter<"User"> | string
    user_father_name?: StringNullableFilter<"User"> | string | null
    user_last_name?: StringFilter<"User"> | string
    user_mother_name?: StringNullableFilter<"User"> | string | null
    user_mobile_no?: StringFilter<"User"> | string
    user_phone_no?: StringNullableFilter<"User"> | string | null
    user_email_id?: StringNullableFilter<"User"> | string | null
    user_gender?: EnumUserGenderNullableFilter<"User"> | $Enums.UserGender | null
    user_cast?: StringNullableFilter<"User"> | string | null
    user_marital_status?: EnumUserMaritalStatusNullableFilter<"User"> | $Enums.UserMaritalStatus | null
    user_occupation?: StringNullableFilter<"User"> | string | null
    user_birth_date?: DateTimeNullableFilter<"User"> | Date | string | null
    user_gstin?: StringNullableFilter<"User"> | string | null
    user_tax_no?: StringNullableFilter<"User"> | string | null
    user_pan_no?: StringNullableFilter<"User"> | string | null
    user_adhaar_no?: StringNullableFilter<"User"> | string | null
    user_profile_img?: JsonNullableFilter<"User">
    user_adhaar_front_img?: JsonNullableFilter<"User">
    user_adhaar_back_img?: JsonNullableFilter<"User">
    user_pan_card_img?: JsonNullableFilter<"User">
    user_per_address?: StringNullableFilter<"User"> | string | null
    user_curr_address?: StringNullableFilter<"User"> | string | null
    user_village?: StringNullableFilter<"User"> | string | null
    user_ward_no?: StringNullableFilter<"User"> | string | null
    user_tehsil?: StringNullableFilter<"User"> | string | null
    user_city?: StringNullableFilter<"User"> | string | null
    user_state?: StringNullableFilter<"User"> | string | null
    user_country?: StringNullableFilter<"User"> | string | null
    user_pincode?: StringNullableFilter<"User"> | string | null
    user_bank_name?: StringNullableFilter<"User"> | string | null
    user_bank_acc_no?: StringNullableFilter<"User"> | string | null
    user_ifsc_code?: StringNullableFilter<"User"> | string | null
    user_sign_img?: JsonNullableFilter<"User">
    user_other_info?: StringNullableFilter<"User"> | string | null
    user_created_at?: DateTimeFilter<"User"> | Date | string
    user_created_by?: StringNullableFilter<"User"> | string | null
    user_updated_at?: DateTimeFilter<"User"> | Date | string
    user_updated_by?: StringNullableFilter<"User"> | string | null
    user_deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    user_deleted_by?: StringNullableFilter<"User"> | string | null
    user_is_deleted?: BoolFilter<"User"> | boolean
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
    firm?: XOR<FirmRelationFilter, FirmWhereInput>
  }, "user_id" | "user_uuid">

  export type UserOrderByWithAggregationInput = {
    user_id?: SortOrder
    user_uuid?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
    user_add_date?: SortOrder
    user_first_name?: SortOrder
    user_father_name?: SortOrderInput | SortOrder
    user_last_name?: SortOrder
    user_mother_name?: SortOrderInput | SortOrder
    user_mobile_no?: SortOrder
    user_phone_no?: SortOrderInput | SortOrder
    user_email_id?: SortOrderInput | SortOrder
    user_gender?: SortOrderInput | SortOrder
    user_cast?: SortOrderInput | SortOrder
    user_marital_status?: SortOrderInput | SortOrder
    user_occupation?: SortOrderInput | SortOrder
    user_birth_date?: SortOrderInput | SortOrder
    user_gstin?: SortOrderInput | SortOrder
    user_tax_no?: SortOrderInput | SortOrder
    user_pan_no?: SortOrderInput | SortOrder
    user_adhaar_no?: SortOrderInput | SortOrder
    user_profile_img?: SortOrderInput | SortOrder
    user_adhaar_front_img?: SortOrderInput | SortOrder
    user_adhaar_back_img?: SortOrderInput | SortOrder
    user_pan_card_img?: SortOrderInput | SortOrder
    user_per_address?: SortOrderInput | SortOrder
    user_curr_address?: SortOrderInput | SortOrder
    user_village?: SortOrderInput | SortOrder
    user_ward_no?: SortOrderInput | SortOrder
    user_tehsil?: SortOrderInput | SortOrder
    user_city?: SortOrderInput | SortOrder
    user_state?: SortOrderInput | SortOrder
    user_country?: SortOrderInput | SortOrder
    user_pincode?: SortOrderInput | SortOrder
    user_bank_name?: SortOrderInput | SortOrder
    user_bank_acc_no?: SortOrderInput | SortOrder
    user_ifsc_code?: SortOrderInput | SortOrder
    user_sign_img?: SortOrderInput | SortOrder
    user_other_info?: SortOrderInput | SortOrder
    user_created_at?: SortOrder
    user_created_by?: SortOrderInput | SortOrder
    user_updated_at?: SortOrder
    user_updated_by?: SortOrderInput | SortOrder
    user_deleted_at?: SortOrderInput | SortOrder
    user_deleted_by?: SortOrderInput | SortOrder
    user_is_deleted?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    user_id?: IntWithAggregatesFilter<"User"> | number
    user_uuid?: StringWithAggregatesFilter<"User"> | string
    user_own_id?: IntWithAggregatesFilter<"User"> | number
    user_firm_id?: IntWithAggregatesFilter<"User"> | number
    user_add_date?: DateTimeWithAggregatesFilter<"User"> | Date | string
    user_first_name?: StringWithAggregatesFilter<"User"> | string
    user_father_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_last_name?: StringWithAggregatesFilter<"User"> | string
    user_mother_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_mobile_no?: StringWithAggregatesFilter<"User"> | string
    user_phone_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_email_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_gender?: EnumUserGenderNullableWithAggregatesFilter<"User"> | $Enums.UserGender | null
    user_cast?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_marital_status?: EnumUserMaritalStatusNullableWithAggregatesFilter<"User"> | $Enums.UserMaritalStatus | null
    user_occupation?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_birth_date?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    user_gstin?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_tax_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_pan_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_adhaar_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_profile_img?: JsonNullableWithAggregatesFilter<"User">
    user_adhaar_front_img?: JsonNullableWithAggregatesFilter<"User">
    user_adhaar_back_img?: JsonNullableWithAggregatesFilter<"User">
    user_pan_card_img?: JsonNullableWithAggregatesFilter<"User">
    user_per_address?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_curr_address?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_village?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_ward_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_tehsil?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_city?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_state?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_country?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_pincode?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_bank_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_bank_acc_no?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_ifsc_code?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_sign_img?: JsonNullableWithAggregatesFilter<"User">
    user_other_info?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    user_created_by?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    user_updated_by?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_deleted_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    user_deleted_by?: StringNullableWithAggregatesFilter<"User"> | string | null
    user_is_deleted?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type OwnerCreateInput = {
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutOwnerInput
    firms?: FirmCreateNestedManyWithoutOwnerInput
    accounts?: AccountCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUncheckedCreateInput = {
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutOwnerInput
    firms?: FirmUncheckedCreateNestedManyWithoutOwnerInput
    accounts?: AccountUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUpdateInput = {
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutOwnerNestedInput
    firms?: FirmUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateInput = {
    own_id?: IntFieldUpdateOperationsInput | number
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_product_key?: IntFieldUpdateOperationsInput | number
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutOwnerNestedInput
    firms?: FirmUncheckedUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerCreateManyInput = {
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
  }

  export type OwnerUpdateManyMutationInput = {
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OwnerUncheckedUpdateManyInput = {
    own_id?: IntFieldUpdateOperationsInput | number
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_product_key?: IntFieldUpdateOperationsInput | number
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FirmCreateInput = {
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutFirmInput
    accounts?: AccountCreateNestedManyWithoutFirmInput
    owner?: OwnerCreateNestedOneWithoutFirmsInput
  }

  export type FirmUncheckedCreateInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_own_id?: number
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutFirmInput
    accounts?: AccountUncheckedCreateNestedManyWithoutFirmInput
  }

  export type FirmUpdateInput = {
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutFirmNestedInput
    accounts?: AccountUpdateManyWithoutFirmNestedInput
    owner?: OwnerUpdateOneRequiredWithoutFirmsNestedInput
  }

  export type FirmUncheckedUpdateInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_own_id?: IntFieldUpdateOperationsInput | number
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutFirmNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutFirmNestedInput
  }

  export type FirmCreateManyInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_own_id?: number
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
  }

  export type FirmUpdateManyMutationInput = {
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FirmUncheckedUpdateManyInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_own_id?: IntFieldUpdateOperationsInput | number
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountCreateInput = {
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
    owner?: OwnerCreateNestedOneWithoutAccountsInput
    firm?: FirmCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_own_id?: number
    acc_firm_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type AccountUpdateInput = {
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owner?: OwnerUpdateOneRequiredWithoutAccountsNestedInput
    firm?: FirmUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_own_id?: IntFieldUpdateOperationsInput | number
    acc_firm_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountCreateManyInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_own_id?: number
    acc_firm_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type AccountUpdateManyMutationInput = {
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUncheckedUpdateManyInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_own_id?: IntFieldUpdateOperationsInput | number
    acc_firm_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateInput = {
    user_uuid?: string
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
    owner: OwnerCreateNestedOneWithoutUsersInput
    firm: FirmCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    user_id?: number
    user_uuid?: string
    user_own_id: number
    user_firm_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type UserUpdateInput = {
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owner?: OwnerUpdateOneRequiredWithoutUsersNestedInput
    firm?: FirmUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_own_id?: IntFieldUpdateOperationsInput | number
    user_firm_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateManyInput = {
    user_id?: number
    user_uuid?: string
    user_own_id: number
    user_firm_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type UserUpdateManyMutationInput = {
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_own_id?: IntFieldUpdateOperationsInput | number
    user_firm_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumOwnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusFilter<$PrismaModel> | $Enums.OwnerStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type FirmListRelationFilter = {
    every?: FirmWhereInput
    some?: FirmWhereInput
    none?: FirmWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FirmOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OwnerCountOrderByAggregateInput = {
    own_id?: SortOrder
    own_uuid?: SortOrder
    own_product_key?: SortOrder
    own_db?: SortOrder
    own_add_date?: SortOrder
    own_first_name?: SortOrder
    own_middle_name?: SortOrder
    own_last_name?: SortOrder
    own_phone_no?: SortOrder
    own_mobile_no?: SortOrder
    own_email?: SortOrder
    own_login_id?: SortOrder
    own_password?: SortOrder
    own_status?: SortOrder
    own_profile_img?: SortOrder
    own_refresh_token?: SortOrder
    own_refresh_expiry?: SortOrder
    own_jwt_token?: SortOrder
    own_jwt_expiry?: SortOrder
    own_login_status?: SortOrder
    own_last_login_system?: SortOrder
    own_otp?: SortOrder
    own_otp_expiry?: SortOrder
    own_address?: SortOrder
    own_village?: SortOrder
    own_city?: SortOrder
    own_state?: SortOrder
    own_pincode?: SortOrder
    own_created_at?: SortOrder
    own_created_by?: SortOrder
    own_updated_at?: SortOrder
    own_updated_by?: SortOrder
    own_deleted_at?: SortOrder
    own_deleted_by?: SortOrder
    own_is_deleted?: SortOrder
  }

  export type OwnerAvgOrderByAggregateInput = {
    own_id?: SortOrder
    own_product_key?: SortOrder
  }

  export type OwnerMaxOrderByAggregateInput = {
    own_id?: SortOrder
    own_uuid?: SortOrder
    own_product_key?: SortOrder
    own_db?: SortOrder
    own_add_date?: SortOrder
    own_first_name?: SortOrder
    own_middle_name?: SortOrder
    own_last_name?: SortOrder
    own_phone_no?: SortOrder
    own_mobile_no?: SortOrder
    own_email?: SortOrder
    own_login_id?: SortOrder
    own_password?: SortOrder
    own_status?: SortOrder
    own_refresh_token?: SortOrder
    own_refresh_expiry?: SortOrder
    own_jwt_token?: SortOrder
    own_jwt_expiry?: SortOrder
    own_login_status?: SortOrder
    own_otp?: SortOrder
    own_otp_expiry?: SortOrder
    own_address?: SortOrder
    own_village?: SortOrder
    own_city?: SortOrder
    own_state?: SortOrder
    own_pincode?: SortOrder
    own_created_at?: SortOrder
    own_created_by?: SortOrder
    own_updated_at?: SortOrder
    own_updated_by?: SortOrder
    own_deleted_at?: SortOrder
    own_deleted_by?: SortOrder
    own_is_deleted?: SortOrder
  }

  export type OwnerMinOrderByAggregateInput = {
    own_id?: SortOrder
    own_uuid?: SortOrder
    own_product_key?: SortOrder
    own_db?: SortOrder
    own_add_date?: SortOrder
    own_first_name?: SortOrder
    own_middle_name?: SortOrder
    own_last_name?: SortOrder
    own_phone_no?: SortOrder
    own_mobile_no?: SortOrder
    own_email?: SortOrder
    own_login_id?: SortOrder
    own_password?: SortOrder
    own_status?: SortOrder
    own_refresh_token?: SortOrder
    own_refresh_expiry?: SortOrder
    own_jwt_token?: SortOrder
    own_jwt_expiry?: SortOrder
    own_login_status?: SortOrder
    own_otp?: SortOrder
    own_otp_expiry?: SortOrder
    own_address?: SortOrder
    own_village?: SortOrder
    own_city?: SortOrder
    own_state?: SortOrder
    own_pincode?: SortOrder
    own_created_at?: SortOrder
    own_created_by?: SortOrder
    own_updated_at?: SortOrder
    own_updated_by?: SortOrder
    own_deleted_at?: SortOrder
    own_deleted_by?: SortOrder
    own_is_deleted?: SortOrder
  }

  export type OwnerSumOrderByAggregateInput = {
    own_id?: SortOrder
    own_product_key?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumOwnerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusWithAggregatesFilter<$PrismaModel> | $Enums.OwnerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOwnerStatusFilter<$PrismaModel>
    _max?: NestedEnumOwnerStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumFirmTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmType | EnumFirmTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmTypeFilter<$PrismaModel> | $Enums.FirmType
  }

  export type EnumFirmBalanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmBalanceType | EnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmBalanceTypeFilter<$PrismaModel> | $Enums.FirmBalanceType
  }

  export type OwnerRelationFilter = {
    is?: OwnerWhereInput
    isNot?: OwnerWhereInput
  }

  export type FirmCountOrderByAggregateInput = {
    firm_id?: SortOrder
    firm_uuid?: SortOrder
    firm_add_date?: SortOrder
    firm_own_id?: SortOrder
    firm_name?: SortOrder
    firm_reg_no?: SortOrder
    firm_shop_name?: SortOrder
    firm_desc?: SortOrder
    firm_address?: SortOrder
    firm_city?: SortOrder
    firm_pincode?: SortOrder
    firm_phone_no?: SortOrder
    firm_email_id?: SortOrder
    firm_website_link?: SortOrder
    firm_type?: SortOrder
    firm_owner?: SortOrder
    firm_other_info?: SortOrder
    firm_geo_latitude?: SortOrder
    firm_geo_longitude?: SortOrder
    firm_whatsapp_link?: SortOrder
    firm_facebook_link?: SortOrder
    firm_insta_link?: SortOrder
    firm_bank_name?: SortOrder
    firm_bank_acc_no?: SortOrder
    firm_bank_branch?: SortOrder
    firm_bank_address?: SortOrder
    firm_acc_holder?: SortOrder
    firm_acc_type?: SortOrder
    firm_ifsc_code?: SortOrder
    firm_start_date?: SortOrder
    firm_balance?: SortOrder
    firm_balance_type?: SortOrder
    firm_gstin_no?: SortOrder
    firm_pan_no?: SortOrder
    firm_adhaar_no?: SortOrder
    firm_form_header?: SortOrder
    firm_form_footer?: SortOrder
    firm_own_sign_img?: SortOrder
    firm_left_logo_img?: SortOrder
    firm_right_logo_img?: SortOrder
    firm_qr_code_img?: SortOrder
    firm_pan_no_img?: SortOrder
    firm_created_at?: SortOrder
    firm_created_by?: SortOrder
    firm_updated_at?: SortOrder
    firm_updated_by?: SortOrder
    firm_deleted_at?: SortOrder
    firm_deleted_by?: SortOrder
    firm_is_deleted?: SortOrder
  }

  export type FirmAvgOrderByAggregateInput = {
    firm_id?: SortOrder
    firm_own_id?: SortOrder
  }

  export type FirmMaxOrderByAggregateInput = {
    firm_id?: SortOrder
    firm_uuid?: SortOrder
    firm_add_date?: SortOrder
    firm_own_id?: SortOrder
    firm_name?: SortOrder
    firm_reg_no?: SortOrder
    firm_shop_name?: SortOrder
    firm_desc?: SortOrder
    firm_address?: SortOrder
    firm_city?: SortOrder
    firm_pincode?: SortOrder
    firm_phone_no?: SortOrder
    firm_email_id?: SortOrder
    firm_website_link?: SortOrder
    firm_type?: SortOrder
    firm_owner?: SortOrder
    firm_other_info?: SortOrder
    firm_geo_latitude?: SortOrder
    firm_geo_longitude?: SortOrder
    firm_whatsapp_link?: SortOrder
    firm_facebook_link?: SortOrder
    firm_insta_link?: SortOrder
    firm_bank_name?: SortOrder
    firm_bank_acc_no?: SortOrder
    firm_bank_branch?: SortOrder
    firm_bank_address?: SortOrder
    firm_acc_holder?: SortOrder
    firm_acc_type?: SortOrder
    firm_ifsc_code?: SortOrder
    firm_start_date?: SortOrder
    firm_balance?: SortOrder
    firm_balance_type?: SortOrder
    firm_gstin_no?: SortOrder
    firm_pan_no?: SortOrder
    firm_adhaar_no?: SortOrder
    firm_form_header?: SortOrder
    firm_form_footer?: SortOrder
    firm_created_at?: SortOrder
    firm_created_by?: SortOrder
    firm_updated_at?: SortOrder
    firm_updated_by?: SortOrder
    firm_deleted_at?: SortOrder
    firm_deleted_by?: SortOrder
    firm_is_deleted?: SortOrder
  }

  export type FirmMinOrderByAggregateInput = {
    firm_id?: SortOrder
    firm_uuid?: SortOrder
    firm_add_date?: SortOrder
    firm_own_id?: SortOrder
    firm_name?: SortOrder
    firm_reg_no?: SortOrder
    firm_shop_name?: SortOrder
    firm_desc?: SortOrder
    firm_address?: SortOrder
    firm_city?: SortOrder
    firm_pincode?: SortOrder
    firm_phone_no?: SortOrder
    firm_email_id?: SortOrder
    firm_website_link?: SortOrder
    firm_type?: SortOrder
    firm_owner?: SortOrder
    firm_other_info?: SortOrder
    firm_geo_latitude?: SortOrder
    firm_geo_longitude?: SortOrder
    firm_whatsapp_link?: SortOrder
    firm_facebook_link?: SortOrder
    firm_insta_link?: SortOrder
    firm_bank_name?: SortOrder
    firm_bank_acc_no?: SortOrder
    firm_bank_branch?: SortOrder
    firm_bank_address?: SortOrder
    firm_acc_holder?: SortOrder
    firm_acc_type?: SortOrder
    firm_ifsc_code?: SortOrder
    firm_start_date?: SortOrder
    firm_balance?: SortOrder
    firm_balance_type?: SortOrder
    firm_gstin_no?: SortOrder
    firm_pan_no?: SortOrder
    firm_adhaar_no?: SortOrder
    firm_form_header?: SortOrder
    firm_form_footer?: SortOrder
    firm_created_at?: SortOrder
    firm_created_by?: SortOrder
    firm_updated_at?: SortOrder
    firm_updated_by?: SortOrder
    firm_deleted_at?: SortOrder
    firm_deleted_by?: SortOrder
    firm_is_deleted?: SortOrder
  }

  export type FirmSumOrderByAggregateInput = {
    firm_id?: SortOrder
    firm_own_id?: SortOrder
  }

  export type EnumFirmTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmType | EnumFirmTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmTypeWithAggregatesFilter<$PrismaModel> | $Enums.FirmType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFirmTypeFilter<$PrismaModel>
    _max?: NestedEnumFirmTypeFilter<$PrismaModel>
  }

  export type EnumFirmBalanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmBalanceType | EnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmBalanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.FirmBalanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFirmBalanceTypeFilter<$PrismaModel>
    _max?: NestedEnumFirmBalanceTypeFilter<$PrismaModel>
  }

  export type EnumAccountBalanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountBalanceType | EnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountBalanceTypeFilter<$PrismaModel> | $Enums.AccountBalanceType
  }

  export type FirmRelationFilter = {
    is?: FirmWhereInput
    isNot?: FirmWhereInput
  }

  export type AccountCountOrderByAggregateInput = {
    acc_id?: SortOrder
    acc_uuid?: SortOrder
    acc_add_date?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
    acc_pan_no?: SortOrder
    acc_name?: SortOrder
    acc_desc?: SortOrder
    acc_pre_acc?: SortOrder
    acc_bank_no?: SortOrder
    acc_bsr_no?: SortOrder
    acc_ifsc_code?: SortOrder
    acc_branch_name?: SortOrder
    acc_opening_date?: SortOrder
    acc_address?: SortOrder
    acc_country?: SortOrder
    acc_state?: SortOrder
    acc_city?: SortOrder
    acc_pincode?: SortOrder
    acc_cash_balance?: SortOrder
    acc_balance_type?: SortOrder
    acc_other_info?: SortOrder
    acc_created_at?: SortOrder
    acc_created_by?: SortOrder
    acc_updated_by?: SortOrder
    acc_deleted_at?: SortOrder
    acc_deleted_by?: SortOrder
    acc_is_system?: SortOrder
    acc_is_deleted?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    acc_id?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    acc_id?: SortOrder
    acc_uuid?: SortOrder
    acc_add_date?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
    acc_pan_no?: SortOrder
    acc_name?: SortOrder
    acc_desc?: SortOrder
    acc_pre_acc?: SortOrder
    acc_bank_no?: SortOrder
    acc_bsr_no?: SortOrder
    acc_ifsc_code?: SortOrder
    acc_branch_name?: SortOrder
    acc_opening_date?: SortOrder
    acc_address?: SortOrder
    acc_country?: SortOrder
    acc_state?: SortOrder
    acc_city?: SortOrder
    acc_pincode?: SortOrder
    acc_cash_balance?: SortOrder
    acc_balance_type?: SortOrder
    acc_other_info?: SortOrder
    acc_created_at?: SortOrder
    acc_created_by?: SortOrder
    acc_updated_by?: SortOrder
    acc_deleted_at?: SortOrder
    acc_deleted_by?: SortOrder
    acc_is_system?: SortOrder
    acc_is_deleted?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    acc_id?: SortOrder
    acc_uuid?: SortOrder
    acc_add_date?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
    acc_pan_no?: SortOrder
    acc_name?: SortOrder
    acc_desc?: SortOrder
    acc_pre_acc?: SortOrder
    acc_bank_no?: SortOrder
    acc_bsr_no?: SortOrder
    acc_ifsc_code?: SortOrder
    acc_branch_name?: SortOrder
    acc_opening_date?: SortOrder
    acc_address?: SortOrder
    acc_country?: SortOrder
    acc_state?: SortOrder
    acc_city?: SortOrder
    acc_pincode?: SortOrder
    acc_cash_balance?: SortOrder
    acc_balance_type?: SortOrder
    acc_other_info?: SortOrder
    acc_created_at?: SortOrder
    acc_created_by?: SortOrder
    acc_updated_by?: SortOrder
    acc_deleted_at?: SortOrder
    acc_deleted_by?: SortOrder
    acc_is_system?: SortOrder
    acc_is_deleted?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    acc_id?: SortOrder
    acc_own_id?: SortOrder
    acc_firm_id?: SortOrder
  }

  export type EnumAccountBalanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountBalanceType | EnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountBalanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountBalanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountBalanceTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountBalanceTypeFilter<$PrismaModel>
  }

  export type EnumUserGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserGenderNullableFilter<$PrismaModel> | $Enums.UserGender | null
  }

  export type EnumUserMaritalStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserMaritalStatus | EnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel> | $Enums.UserMaritalStatus | null
  }

  export type UserCountOrderByAggregateInput = {
    user_id?: SortOrder
    user_uuid?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
    user_add_date?: SortOrder
    user_first_name?: SortOrder
    user_father_name?: SortOrder
    user_last_name?: SortOrder
    user_mother_name?: SortOrder
    user_mobile_no?: SortOrder
    user_phone_no?: SortOrder
    user_email_id?: SortOrder
    user_gender?: SortOrder
    user_cast?: SortOrder
    user_marital_status?: SortOrder
    user_occupation?: SortOrder
    user_birth_date?: SortOrder
    user_gstin?: SortOrder
    user_tax_no?: SortOrder
    user_pan_no?: SortOrder
    user_adhaar_no?: SortOrder
    user_profile_img?: SortOrder
    user_adhaar_front_img?: SortOrder
    user_adhaar_back_img?: SortOrder
    user_pan_card_img?: SortOrder
    user_per_address?: SortOrder
    user_curr_address?: SortOrder
    user_village?: SortOrder
    user_ward_no?: SortOrder
    user_tehsil?: SortOrder
    user_city?: SortOrder
    user_state?: SortOrder
    user_country?: SortOrder
    user_pincode?: SortOrder
    user_bank_name?: SortOrder
    user_bank_acc_no?: SortOrder
    user_ifsc_code?: SortOrder
    user_sign_img?: SortOrder
    user_other_info?: SortOrder
    user_created_at?: SortOrder
    user_created_by?: SortOrder
    user_updated_at?: SortOrder
    user_updated_by?: SortOrder
    user_deleted_at?: SortOrder
    user_deleted_by?: SortOrder
    user_is_deleted?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    user_id?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    user_id?: SortOrder
    user_uuid?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
    user_add_date?: SortOrder
    user_first_name?: SortOrder
    user_father_name?: SortOrder
    user_last_name?: SortOrder
    user_mother_name?: SortOrder
    user_mobile_no?: SortOrder
    user_phone_no?: SortOrder
    user_email_id?: SortOrder
    user_gender?: SortOrder
    user_cast?: SortOrder
    user_marital_status?: SortOrder
    user_occupation?: SortOrder
    user_birth_date?: SortOrder
    user_gstin?: SortOrder
    user_tax_no?: SortOrder
    user_pan_no?: SortOrder
    user_adhaar_no?: SortOrder
    user_per_address?: SortOrder
    user_curr_address?: SortOrder
    user_village?: SortOrder
    user_ward_no?: SortOrder
    user_tehsil?: SortOrder
    user_city?: SortOrder
    user_state?: SortOrder
    user_country?: SortOrder
    user_pincode?: SortOrder
    user_bank_name?: SortOrder
    user_bank_acc_no?: SortOrder
    user_ifsc_code?: SortOrder
    user_other_info?: SortOrder
    user_created_at?: SortOrder
    user_created_by?: SortOrder
    user_updated_at?: SortOrder
    user_updated_by?: SortOrder
    user_deleted_at?: SortOrder
    user_deleted_by?: SortOrder
    user_is_deleted?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    user_id?: SortOrder
    user_uuid?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
    user_add_date?: SortOrder
    user_first_name?: SortOrder
    user_father_name?: SortOrder
    user_last_name?: SortOrder
    user_mother_name?: SortOrder
    user_mobile_no?: SortOrder
    user_phone_no?: SortOrder
    user_email_id?: SortOrder
    user_gender?: SortOrder
    user_cast?: SortOrder
    user_marital_status?: SortOrder
    user_occupation?: SortOrder
    user_birth_date?: SortOrder
    user_gstin?: SortOrder
    user_tax_no?: SortOrder
    user_pan_no?: SortOrder
    user_adhaar_no?: SortOrder
    user_per_address?: SortOrder
    user_curr_address?: SortOrder
    user_village?: SortOrder
    user_ward_no?: SortOrder
    user_tehsil?: SortOrder
    user_city?: SortOrder
    user_state?: SortOrder
    user_country?: SortOrder
    user_pincode?: SortOrder
    user_bank_name?: SortOrder
    user_bank_acc_no?: SortOrder
    user_ifsc_code?: SortOrder
    user_other_info?: SortOrder
    user_created_at?: SortOrder
    user_created_by?: SortOrder
    user_updated_at?: SortOrder
    user_updated_by?: SortOrder
    user_deleted_at?: SortOrder
    user_deleted_by?: SortOrder
    user_is_deleted?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    user_id?: SortOrder
    user_own_id?: SortOrder
    user_firm_id?: SortOrder
  }

  export type EnumUserGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserGender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumUserGenderNullableFilter<$PrismaModel>
  }

  export type EnumUserMaritalStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserMaritalStatus | EnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserMaritalStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserMaritalStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel>
  }

  export type UserCreateNestedManyWithoutOwnerInput = {
    create?: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput> | UserCreateWithoutOwnerInput[] | UserUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOwnerInput | UserCreateOrConnectWithoutOwnerInput[]
    createMany?: UserCreateManyOwnerInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type FirmCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput> | FirmCreateWithoutOwnerInput[] | FirmUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FirmCreateOrConnectWithoutOwnerInput | FirmCreateOrConnectWithoutOwnerInput[]
    createMany?: FirmCreateManyOwnerInputEnvelope
    connect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutOwnerInput = {
    create?: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput> | AccountCreateWithoutOwnerInput[] | AccountUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutOwnerInput | AccountCreateOrConnectWithoutOwnerInput[]
    createMany?: AccountCreateManyOwnerInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput> | UserCreateWithoutOwnerInput[] | UserUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOwnerInput | UserCreateOrConnectWithoutOwnerInput[]
    createMany?: UserCreateManyOwnerInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type FirmUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput> | FirmCreateWithoutOwnerInput[] | FirmUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FirmCreateOrConnectWithoutOwnerInput | FirmCreateOrConnectWithoutOwnerInput[]
    createMany?: FirmCreateManyOwnerInputEnvelope
    connect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput> | AccountCreateWithoutOwnerInput[] | AccountUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutOwnerInput | AccountCreateOrConnectWithoutOwnerInput[]
    createMany?: AccountCreateManyOwnerInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumOwnerStatusFieldUpdateOperationsInput = {
    set?: $Enums.OwnerStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput> | UserCreateWithoutOwnerInput[] | UserUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOwnerInput | UserCreateOrConnectWithoutOwnerInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOwnerInput | UserUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: UserCreateManyOwnerInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOwnerInput | UserUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOwnerInput | UserUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type FirmUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput> | FirmCreateWithoutOwnerInput[] | FirmUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FirmCreateOrConnectWithoutOwnerInput | FirmCreateOrConnectWithoutOwnerInput[]
    upsert?: FirmUpsertWithWhereUniqueWithoutOwnerInput | FirmUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FirmCreateManyOwnerInputEnvelope
    set?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    disconnect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    delete?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    connect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    update?: FirmUpdateWithWhereUniqueWithoutOwnerInput | FirmUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FirmUpdateManyWithWhereWithoutOwnerInput | FirmUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FirmScalarWhereInput | FirmScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput> | AccountCreateWithoutOwnerInput[] | AccountUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutOwnerInput | AccountCreateOrConnectWithoutOwnerInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutOwnerInput | AccountUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: AccountCreateManyOwnerInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutOwnerInput | AccountUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutOwnerInput | AccountUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput> | UserCreateWithoutOwnerInput[] | UserUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOwnerInput | UserCreateOrConnectWithoutOwnerInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOwnerInput | UserUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: UserCreateManyOwnerInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOwnerInput | UserUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOwnerInput | UserUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type FirmUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput> | FirmCreateWithoutOwnerInput[] | FirmUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: FirmCreateOrConnectWithoutOwnerInput | FirmCreateOrConnectWithoutOwnerInput[]
    upsert?: FirmUpsertWithWhereUniqueWithoutOwnerInput | FirmUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: FirmCreateManyOwnerInputEnvelope
    set?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    disconnect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    delete?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    connect?: FirmWhereUniqueInput | FirmWhereUniqueInput[]
    update?: FirmUpdateWithWhereUniqueWithoutOwnerInput | FirmUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: FirmUpdateManyWithWhereWithoutOwnerInput | FirmUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: FirmScalarWhereInput | FirmScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput> | AccountCreateWithoutOwnerInput[] | AccountUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutOwnerInput | AccountCreateOrConnectWithoutOwnerInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutOwnerInput | AccountUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: AccountCreateManyOwnerInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutOwnerInput | AccountUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutOwnerInput | AccountUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutFirmInput = {
    create?: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput> | UserCreateWithoutFirmInput[] | UserUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFirmInput | UserCreateOrConnectWithoutFirmInput[]
    createMany?: UserCreateManyFirmInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutFirmInput = {
    create?: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput> | AccountCreateWithoutFirmInput[] | AccountUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutFirmInput | AccountCreateOrConnectWithoutFirmInput[]
    createMany?: AccountCreateManyFirmInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type OwnerCreateNestedOneWithoutFirmsInput = {
    create?: XOR<OwnerCreateWithoutFirmsInput, OwnerUncheckedCreateWithoutFirmsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutFirmsInput
    connect?: OwnerWhereUniqueInput
  }

  export type UserUncheckedCreateNestedManyWithoutFirmInput = {
    create?: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput> | UserCreateWithoutFirmInput[] | UserUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFirmInput | UserCreateOrConnectWithoutFirmInput[]
    createMany?: UserCreateManyFirmInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutFirmInput = {
    create?: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput> | AccountCreateWithoutFirmInput[] | AccountUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutFirmInput | AccountCreateOrConnectWithoutFirmInput[]
    createMany?: AccountCreateManyFirmInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type EnumFirmTypeFieldUpdateOperationsInput = {
    set?: $Enums.FirmType
  }

  export type EnumFirmBalanceTypeFieldUpdateOperationsInput = {
    set?: $Enums.FirmBalanceType
  }

  export type UserUpdateManyWithoutFirmNestedInput = {
    create?: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput> | UserCreateWithoutFirmInput[] | UserUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFirmInput | UserCreateOrConnectWithoutFirmInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFirmInput | UserUpsertWithWhereUniqueWithoutFirmInput[]
    createMany?: UserCreateManyFirmInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFirmInput | UserUpdateWithWhereUniqueWithoutFirmInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFirmInput | UserUpdateManyWithWhereWithoutFirmInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutFirmNestedInput = {
    create?: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput> | AccountCreateWithoutFirmInput[] | AccountUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutFirmInput | AccountCreateOrConnectWithoutFirmInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutFirmInput | AccountUpsertWithWhereUniqueWithoutFirmInput[]
    createMany?: AccountCreateManyFirmInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutFirmInput | AccountUpdateWithWhereUniqueWithoutFirmInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutFirmInput | AccountUpdateManyWithWhereWithoutFirmInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type OwnerUpdateOneRequiredWithoutFirmsNestedInput = {
    create?: XOR<OwnerCreateWithoutFirmsInput, OwnerUncheckedCreateWithoutFirmsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutFirmsInput
    upsert?: OwnerUpsertWithoutFirmsInput
    connect?: OwnerWhereUniqueInput
    update?: XOR<XOR<OwnerUpdateToOneWithWhereWithoutFirmsInput, OwnerUpdateWithoutFirmsInput>, OwnerUncheckedUpdateWithoutFirmsInput>
  }

  export type UserUncheckedUpdateManyWithoutFirmNestedInput = {
    create?: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput> | UserCreateWithoutFirmInput[] | UserUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: UserCreateOrConnectWithoutFirmInput | UserCreateOrConnectWithoutFirmInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutFirmInput | UserUpsertWithWhereUniqueWithoutFirmInput[]
    createMany?: UserCreateManyFirmInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutFirmInput | UserUpdateWithWhereUniqueWithoutFirmInput[]
    updateMany?: UserUpdateManyWithWhereWithoutFirmInput | UserUpdateManyWithWhereWithoutFirmInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutFirmNestedInput = {
    create?: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput> | AccountCreateWithoutFirmInput[] | AccountUncheckedCreateWithoutFirmInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutFirmInput | AccountCreateOrConnectWithoutFirmInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutFirmInput | AccountUpsertWithWhereUniqueWithoutFirmInput[]
    createMany?: AccountCreateManyFirmInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutFirmInput | AccountUpdateWithWhereUniqueWithoutFirmInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutFirmInput | AccountUpdateManyWithWhereWithoutFirmInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type OwnerCreateNestedOneWithoutAccountsInput = {
    create?: XOR<OwnerCreateWithoutAccountsInput, OwnerUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutAccountsInput
    connect?: OwnerWhereUniqueInput
  }

  export type FirmCreateNestedOneWithoutAccountsInput = {
    create?: XOR<FirmCreateWithoutAccountsInput, FirmUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: FirmCreateOrConnectWithoutAccountsInput
    connect?: FirmWhereUniqueInput
  }

  export type EnumAccountBalanceTypeFieldUpdateOperationsInput = {
    set?: $Enums.AccountBalanceType
  }

  export type OwnerUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<OwnerCreateWithoutAccountsInput, OwnerUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutAccountsInput
    upsert?: OwnerUpsertWithoutAccountsInput
    connect?: OwnerWhereUniqueInput
    update?: XOR<XOR<OwnerUpdateToOneWithWhereWithoutAccountsInput, OwnerUpdateWithoutAccountsInput>, OwnerUncheckedUpdateWithoutAccountsInput>
  }

  export type FirmUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<FirmCreateWithoutAccountsInput, FirmUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: FirmCreateOrConnectWithoutAccountsInput
    upsert?: FirmUpsertWithoutAccountsInput
    connect?: FirmWhereUniqueInput
    update?: XOR<XOR<FirmUpdateToOneWithWhereWithoutAccountsInput, FirmUpdateWithoutAccountsInput>, FirmUncheckedUpdateWithoutAccountsInput>
  }

  export type OwnerCreateNestedOneWithoutUsersInput = {
    create?: XOR<OwnerCreateWithoutUsersInput, OwnerUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutUsersInput
    connect?: OwnerWhereUniqueInput
  }

  export type FirmCreateNestedOneWithoutUsersInput = {
    create?: XOR<FirmCreateWithoutUsersInput, FirmUncheckedCreateWithoutUsersInput>
    connectOrCreate?: FirmCreateOrConnectWithoutUsersInput
    connect?: FirmWhereUniqueInput
  }

  export type NullableEnumUserGenderFieldUpdateOperationsInput = {
    set?: $Enums.UserGender | null
  }

  export type NullableEnumUserMaritalStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserMaritalStatus | null
  }

  export type OwnerUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<OwnerCreateWithoutUsersInput, OwnerUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutUsersInput
    upsert?: OwnerUpsertWithoutUsersInput
    connect?: OwnerWhereUniqueInput
    update?: XOR<XOR<OwnerUpdateToOneWithWhereWithoutUsersInput, OwnerUpdateWithoutUsersInput>, OwnerUncheckedUpdateWithoutUsersInput>
  }

  export type FirmUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<FirmCreateWithoutUsersInput, FirmUncheckedCreateWithoutUsersInput>
    connectOrCreate?: FirmCreateOrConnectWithoutUsersInput
    upsert?: FirmUpsertWithoutUsersInput
    connect?: FirmWhereUniqueInput
    update?: XOR<XOR<FirmUpdateToOneWithWhereWithoutUsersInput, FirmUpdateWithoutUsersInput>, FirmUncheckedUpdateWithoutUsersInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumOwnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusFilter<$PrismaModel> | $Enums.OwnerStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumOwnerStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusWithAggregatesFilter<$PrismaModel> | $Enums.OwnerStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOwnerStatusFilter<$PrismaModel>
    _max?: NestedEnumOwnerStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumFirmTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmType | EnumFirmTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmTypeFilter<$PrismaModel> | $Enums.FirmType
  }

  export type NestedEnumFirmBalanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmBalanceType | EnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmBalanceTypeFilter<$PrismaModel> | $Enums.FirmBalanceType
  }

  export type NestedEnumFirmTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmType | EnumFirmTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmType[] | ListEnumFirmTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmTypeWithAggregatesFilter<$PrismaModel> | $Enums.FirmType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFirmTypeFilter<$PrismaModel>
    _max?: NestedEnumFirmTypeFilter<$PrismaModel>
  }

  export type NestedEnumFirmBalanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FirmBalanceType | EnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.FirmBalanceType[] | ListEnumFirmBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumFirmBalanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.FirmBalanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFirmBalanceTypeFilter<$PrismaModel>
    _max?: NestedEnumFirmBalanceTypeFilter<$PrismaModel>
  }

  export type NestedEnumAccountBalanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountBalanceType | EnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountBalanceTypeFilter<$PrismaModel> | $Enums.AccountBalanceType
  }

  export type NestedEnumAccountBalanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AccountBalanceType | EnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AccountBalanceType[] | ListEnumAccountBalanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAccountBalanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.AccountBalanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAccountBalanceTypeFilter<$PrismaModel>
    _max?: NestedEnumAccountBalanceTypeFilter<$PrismaModel>
  }

  export type NestedEnumUserGenderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserGenderNullableFilter<$PrismaModel> | $Enums.UserGender | null
  }

  export type NestedEnumUserMaritalStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserMaritalStatus | EnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel> | $Enums.UserMaritalStatus | null
  }

  export type NestedEnumUserGenderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserGenderNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserGender | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserGenderNullableFilter<$PrismaModel>
    _max?: NestedEnumUserGenderNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserMaritalStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserMaritalStatus | EnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserMaritalStatus[] | ListEnumUserMaritalStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserMaritalStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserMaritalStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumUserMaritalStatusNullableFilter<$PrismaModel>
  }

  export type UserCreateWithoutOwnerInput = {
    user_uuid?: string
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
    firm: FirmCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutOwnerInput = {
    user_id?: number
    user_uuid?: string
    user_firm_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type UserCreateOrConnectWithoutOwnerInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput>
  }

  export type UserCreateManyOwnerInputEnvelope = {
    data: UserCreateManyOwnerInput | UserCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type FirmCreateWithoutOwnerInput = {
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutFirmInput
    accounts?: AccountCreateNestedManyWithoutFirmInput
  }

  export type FirmUncheckedCreateWithoutOwnerInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutFirmInput
    accounts?: AccountUncheckedCreateNestedManyWithoutFirmInput
  }

  export type FirmCreateOrConnectWithoutOwnerInput = {
    where: FirmWhereUniqueInput
    create: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput>
  }

  export type FirmCreateManyOwnerInputEnvelope = {
    data: FirmCreateManyOwnerInput | FirmCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutOwnerInput = {
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
    firm?: FirmCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateWithoutOwnerInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_firm_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type AccountCreateOrConnectWithoutOwnerInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput>
  }

  export type AccountCreateManyOwnerInputEnvelope = {
    data: AccountCreateManyOwnerInput | AccountCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutOwnerInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOwnerInput, UserUncheckedUpdateWithoutOwnerInput>
    create: XOR<UserCreateWithoutOwnerInput, UserUncheckedCreateWithoutOwnerInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOwnerInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOwnerInput, UserUncheckedUpdateWithoutOwnerInput>
  }

  export type UserUpdateManyWithWhereWithoutOwnerInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOwnerInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    user_id?: IntFilter<"User"> | number
    user_uuid?: StringFilter<"User"> | string
    user_own_id?: IntFilter<"User"> | number
    user_firm_id?: IntFilter<"User"> | number
    user_add_date?: DateTimeFilter<"User"> | Date | string
    user_first_name?: StringFilter<"User"> | string
    user_father_name?: StringNullableFilter<"User"> | string | null
    user_last_name?: StringFilter<"User"> | string
    user_mother_name?: StringNullableFilter<"User"> | string | null
    user_mobile_no?: StringFilter<"User"> | string
    user_phone_no?: StringNullableFilter<"User"> | string | null
    user_email_id?: StringNullableFilter<"User"> | string | null
    user_gender?: EnumUserGenderNullableFilter<"User"> | $Enums.UserGender | null
    user_cast?: StringNullableFilter<"User"> | string | null
    user_marital_status?: EnumUserMaritalStatusNullableFilter<"User"> | $Enums.UserMaritalStatus | null
    user_occupation?: StringNullableFilter<"User"> | string | null
    user_birth_date?: DateTimeNullableFilter<"User"> | Date | string | null
    user_gstin?: StringNullableFilter<"User"> | string | null
    user_tax_no?: StringNullableFilter<"User"> | string | null
    user_pan_no?: StringNullableFilter<"User"> | string | null
    user_adhaar_no?: StringNullableFilter<"User"> | string | null
    user_profile_img?: JsonNullableFilter<"User">
    user_adhaar_front_img?: JsonNullableFilter<"User">
    user_adhaar_back_img?: JsonNullableFilter<"User">
    user_pan_card_img?: JsonNullableFilter<"User">
    user_per_address?: StringNullableFilter<"User"> | string | null
    user_curr_address?: StringNullableFilter<"User"> | string | null
    user_village?: StringNullableFilter<"User"> | string | null
    user_ward_no?: StringNullableFilter<"User"> | string | null
    user_tehsil?: StringNullableFilter<"User"> | string | null
    user_city?: StringNullableFilter<"User"> | string | null
    user_state?: StringNullableFilter<"User"> | string | null
    user_country?: StringNullableFilter<"User"> | string | null
    user_pincode?: StringNullableFilter<"User"> | string | null
    user_bank_name?: StringNullableFilter<"User"> | string | null
    user_bank_acc_no?: StringNullableFilter<"User"> | string | null
    user_ifsc_code?: StringNullableFilter<"User"> | string | null
    user_sign_img?: JsonNullableFilter<"User">
    user_other_info?: StringNullableFilter<"User"> | string | null
    user_created_at?: DateTimeFilter<"User"> | Date | string
    user_created_by?: StringNullableFilter<"User"> | string | null
    user_updated_at?: DateTimeFilter<"User"> | Date | string
    user_updated_by?: StringNullableFilter<"User"> | string | null
    user_deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    user_deleted_by?: StringNullableFilter<"User"> | string | null
    user_is_deleted?: BoolFilter<"User"> | boolean
  }

  export type FirmUpsertWithWhereUniqueWithoutOwnerInput = {
    where: FirmWhereUniqueInput
    update: XOR<FirmUpdateWithoutOwnerInput, FirmUncheckedUpdateWithoutOwnerInput>
    create: XOR<FirmCreateWithoutOwnerInput, FirmUncheckedCreateWithoutOwnerInput>
  }

  export type FirmUpdateWithWhereUniqueWithoutOwnerInput = {
    where: FirmWhereUniqueInput
    data: XOR<FirmUpdateWithoutOwnerInput, FirmUncheckedUpdateWithoutOwnerInput>
  }

  export type FirmUpdateManyWithWhereWithoutOwnerInput = {
    where: FirmScalarWhereInput
    data: XOR<FirmUpdateManyMutationInput, FirmUncheckedUpdateManyWithoutOwnerInput>
  }

  export type FirmScalarWhereInput = {
    AND?: FirmScalarWhereInput | FirmScalarWhereInput[]
    OR?: FirmScalarWhereInput[]
    NOT?: FirmScalarWhereInput | FirmScalarWhereInput[]
    firm_id?: IntFilter<"Firm"> | number
    firm_uuid?: StringFilter<"Firm"> | string
    firm_add_date?: DateTimeFilter<"Firm"> | Date | string
    firm_own_id?: IntFilter<"Firm"> | number
    firm_name?: StringFilter<"Firm"> | string
    firm_reg_no?: StringFilter<"Firm"> | string
    firm_shop_name?: StringFilter<"Firm"> | string
    firm_desc?: StringNullableFilter<"Firm"> | string | null
    firm_address?: StringNullableFilter<"Firm"> | string | null
    firm_city?: StringNullableFilter<"Firm"> | string | null
    firm_pincode?: StringNullableFilter<"Firm"> | string | null
    firm_phone_no?: StringNullableFilter<"Firm"> | string | null
    firm_email_id?: StringNullableFilter<"Firm"> | string | null
    firm_website_link?: StringNullableFilter<"Firm"> | string | null
    firm_type?: EnumFirmTypeFilter<"Firm"> | $Enums.FirmType
    firm_owner?: StringNullableFilter<"Firm"> | string | null
    firm_other_info?: StringNullableFilter<"Firm"> | string | null
    firm_geo_latitude?: StringNullableFilter<"Firm"> | string | null
    firm_geo_longitude?: StringNullableFilter<"Firm"> | string | null
    firm_whatsapp_link?: StringNullableFilter<"Firm"> | string | null
    firm_facebook_link?: StringNullableFilter<"Firm"> | string | null
    firm_insta_link?: StringNullableFilter<"Firm"> | string | null
    firm_bank_name?: StringNullableFilter<"Firm"> | string | null
    firm_bank_acc_no?: StringNullableFilter<"Firm"> | string | null
    firm_bank_branch?: StringNullableFilter<"Firm"> | string | null
    firm_bank_address?: StringNullableFilter<"Firm"> | string | null
    firm_acc_holder?: StringNullableFilter<"Firm"> | string | null
    firm_acc_type?: StringNullableFilter<"Firm"> | string | null
    firm_ifsc_code?: StringNullableFilter<"Firm"> | string | null
    firm_start_date?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_balance?: StringNullableFilter<"Firm"> | string | null
    firm_balance_type?: EnumFirmBalanceTypeFilter<"Firm"> | $Enums.FirmBalanceType
    firm_gstin_no?: StringNullableFilter<"Firm"> | string | null
    firm_pan_no?: StringNullableFilter<"Firm"> | string | null
    firm_adhaar_no?: StringNullableFilter<"Firm"> | string | null
    firm_form_header?: StringNullableFilter<"Firm"> | string | null
    firm_form_footer?: StringNullableFilter<"Firm"> | string | null
    firm_own_sign_img?: JsonNullableFilter<"Firm">
    firm_left_logo_img?: JsonNullableFilter<"Firm">
    firm_right_logo_img?: JsonNullableFilter<"Firm">
    firm_qr_code_img?: JsonNullableFilter<"Firm">
    firm_pan_no_img?: JsonNullableFilter<"Firm">
    firm_created_at?: DateTimeFilter<"Firm"> | Date | string
    firm_created_by?: StringNullableFilter<"Firm"> | string | null
    firm_updated_at?: DateTimeFilter<"Firm"> | Date | string
    firm_updated_by?: StringNullableFilter<"Firm"> | string | null
    firm_deleted_at?: DateTimeNullableFilter<"Firm"> | Date | string | null
    firm_deleted_by?: StringNullableFilter<"Firm"> | string | null
    firm_is_deleted?: BoolFilter<"Firm"> | boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutOwnerInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutOwnerInput, AccountUncheckedUpdateWithoutOwnerInput>
    create: XOR<AccountCreateWithoutOwnerInput, AccountUncheckedCreateWithoutOwnerInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutOwnerInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutOwnerInput, AccountUncheckedUpdateWithoutOwnerInput>
  }

  export type AccountUpdateManyWithWhereWithoutOwnerInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutOwnerInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    acc_id?: IntFilter<"Account"> | number
    acc_uuid?: StringFilter<"Account"> | string
    acc_add_date?: DateTimeFilter<"Account"> | Date | string
    acc_own_id?: IntFilter<"Account"> | number
    acc_firm_id?: IntFilter<"Account"> | number
    acc_pan_no?: StringNullableFilter<"Account"> | string | null
    acc_name?: StringFilter<"Account"> | string
    acc_desc?: StringNullableFilter<"Account"> | string | null
    acc_pre_acc?: StringNullableFilter<"Account"> | string | null
    acc_bank_no?: StringNullableFilter<"Account"> | string | null
    acc_bsr_no?: StringNullableFilter<"Account"> | string | null
    acc_ifsc_code?: StringNullableFilter<"Account"> | string | null
    acc_branch_name?: StringNullableFilter<"Account"> | string | null
    acc_opening_date?: DateTimeFilter<"Account"> | Date | string
    acc_address?: StringNullableFilter<"Account"> | string | null
    acc_country?: StringNullableFilter<"Account"> | string | null
    acc_state?: StringNullableFilter<"Account"> | string | null
    acc_city?: StringNullableFilter<"Account"> | string | null
    acc_pincode?: StringNullableFilter<"Account"> | string | null
    acc_cash_balance?: StringNullableFilter<"Account"> | string | null
    acc_balance_type?: EnumAccountBalanceTypeFilter<"Account"> | $Enums.AccountBalanceType
    acc_other_info?: StringNullableFilter<"Account"> | string | null
    acc_created_at?: DateTimeFilter<"Account"> | Date | string
    acc_created_by?: StringNullableFilter<"Account"> | string | null
    acc_updated_by?: StringNullableFilter<"Account"> | string | null
    acc_deleted_at?: DateTimeNullableFilter<"Account"> | Date | string | null
    acc_deleted_by?: StringNullableFilter<"Account"> | string | null
    acc_is_system?: BoolFilter<"Account"> | boolean
    acc_is_deleted?: BoolFilter<"Account"> | boolean
  }

  export type UserCreateWithoutFirmInput = {
    user_uuid?: string
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
    owner: OwnerCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutFirmInput = {
    user_id?: number
    user_uuid?: string
    user_own_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type UserCreateOrConnectWithoutFirmInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput>
  }

  export type UserCreateManyFirmInputEnvelope = {
    data: UserCreateManyFirmInput | UserCreateManyFirmInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutFirmInput = {
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
    owner?: OwnerCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateWithoutFirmInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_own_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type AccountCreateOrConnectWithoutFirmInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput>
  }

  export type AccountCreateManyFirmInputEnvelope = {
    data: AccountCreateManyFirmInput | AccountCreateManyFirmInput[]
    skipDuplicates?: boolean
  }

  export type OwnerCreateWithoutFirmsInput = {
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutOwnerInput
    accounts?: AccountCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUncheckedCreateWithoutFirmsInput = {
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutOwnerInput
    accounts?: AccountUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type OwnerCreateOrConnectWithoutFirmsInput = {
    where: OwnerWhereUniqueInput
    create: XOR<OwnerCreateWithoutFirmsInput, OwnerUncheckedCreateWithoutFirmsInput>
  }

  export type UserUpsertWithWhereUniqueWithoutFirmInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutFirmInput, UserUncheckedUpdateWithoutFirmInput>
    create: XOR<UserCreateWithoutFirmInput, UserUncheckedCreateWithoutFirmInput>
  }

  export type UserUpdateWithWhereUniqueWithoutFirmInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutFirmInput, UserUncheckedUpdateWithoutFirmInput>
  }

  export type UserUpdateManyWithWhereWithoutFirmInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutFirmInput>
  }

  export type AccountUpsertWithWhereUniqueWithoutFirmInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutFirmInput, AccountUncheckedUpdateWithoutFirmInput>
    create: XOR<AccountCreateWithoutFirmInput, AccountUncheckedCreateWithoutFirmInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutFirmInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutFirmInput, AccountUncheckedUpdateWithoutFirmInput>
  }

  export type AccountUpdateManyWithWhereWithoutFirmInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutFirmInput>
  }

  export type OwnerUpsertWithoutFirmsInput = {
    update: XOR<OwnerUpdateWithoutFirmsInput, OwnerUncheckedUpdateWithoutFirmsInput>
    create: XOR<OwnerCreateWithoutFirmsInput, OwnerUncheckedCreateWithoutFirmsInput>
    where?: OwnerWhereInput
  }

  export type OwnerUpdateToOneWithWhereWithoutFirmsInput = {
    where?: OwnerWhereInput
    data: XOR<OwnerUpdateWithoutFirmsInput, OwnerUncheckedUpdateWithoutFirmsInput>
  }

  export type OwnerUpdateWithoutFirmsInput = {
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateWithoutFirmsInput = {
    own_id?: IntFieldUpdateOperationsInput | number
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_product_key?: IntFieldUpdateOperationsInput | number
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerCreateWithoutAccountsInput = {
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutOwnerInput
    firms?: FirmCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUncheckedCreateWithoutAccountsInput = {
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutOwnerInput
    firms?: FirmUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type OwnerCreateOrConnectWithoutAccountsInput = {
    where: OwnerWhereUniqueInput
    create: XOR<OwnerCreateWithoutAccountsInput, OwnerUncheckedCreateWithoutAccountsInput>
  }

  export type FirmCreateWithoutAccountsInput = {
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserCreateNestedManyWithoutFirmInput
    owner?: OwnerCreateNestedOneWithoutFirmsInput
  }

  export type FirmUncheckedCreateWithoutAccountsInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_own_id?: number
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    users?: UserUncheckedCreateNestedManyWithoutFirmInput
  }

  export type FirmCreateOrConnectWithoutAccountsInput = {
    where: FirmWhereUniqueInput
    create: XOR<FirmCreateWithoutAccountsInput, FirmUncheckedCreateWithoutAccountsInput>
  }

  export type OwnerUpsertWithoutAccountsInput = {
    update: XOR<OwnerUpdateWithoutAccountsInput, OwnerUncheckedUpdateWithoutAccountsInput>
    create: XOR<OwnerCreateWithoutAccountsInput, OwnerUncheckedCreateWithoutAccountsInput>
    where?: OwnerWhereInput
  }

  export type OwnerUpdateToOneWithWhereWithoutAccountsInput = {
    where?: OwnerWhereInput
    data: XOR<OwnerUpdateWithoutAccountsInput, OwnerUncheckedUpdateWithoutAccountsInput>
  }

  export type OwnerUpdateWithoutAccountsInput = {
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutOwnerNestedInput
    firms?: FirmUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateWithoutAccountsInput = {
    own_id?: IntFieldUpdateOperationsInput | number
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_product_key?: IntFieldUpdateOperationsInput | number
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutOwnerNestedInput
    firms?: FirmUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type FirmUpsertWithoutAccountsInput = {
    update: XOR<FirmUpdateWithoutAccountsInput, FirmUncheckedUpdateWithoutAccountsInput>
    create: XOR<FirmCreateWithoutAccountsInput, FirmUncheckedCreateWithoutAccountsInput>
    where?: FirmWhereInput
  }

  export type FirmUpdateToOneWithWhereWithoutAccountsInput = {
    where?: FirmWhereInput
    data: XOR<FirmUpdateWithoutAccountsInput, FirmUncheckedUpdateWithoutAccountsInput>
  }

  export type FirmUpdateWithoutAccountsInput = {
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutFirmNestedInput
    owner?: OwnerUpdateOneRequiredWithoutFirmsNestedInput
  }

  export type FirmUncheckedUpdateWithoutAccountsInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_own_id?: IntFieldUpdateOperationsInput | number
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutFirmNestedInput
  }

  export type OwnerCreateWithoutUsersInput = {
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    firms?: FirmCreateNestedManyWithoutOwnerInput
    accounts?: AccountCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUncheckedCreateWithoutUsersInput = {
    own_id?: number
    own_uuid?: string
    own_product_key?: number
    own_db: string
    own_add_date?: Date | string
    own_first_name: string
    own_middle_name?: string | null
    own_last_name: string
    own_phone_no?: string | null
    own_mobile_no: string
    own_email: string
    own_login_id: string
    own_password: string
    own_status?: $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: string | null
    own_refresh_expiry?: Date | string | null
    own_jwt_token?: string | null
    own_jwt_expiry?: Date | string | null
    own_login_status?: boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: string | null
    own_otp_expiry?: Date | string | null
    own_address?: string | null
    own_village?: string | null
    own_city?: string | null
    own_state?: string | null
    own_pincode?: string | null
    own_created_at?: Date | string
    own_created_by?: string | null
    own_updated_at?: Date | string
    own_updated_by?: string | null
    own_deleted_at?: Date | string | null
    own_deleted_by?: string | null
    own_is_deleted?: boolean
    firms?: FirmUncheckedCreateNestedManyWithoutOwnerInput
    accounts?: AccountUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type OwnerCreateOrConnectWithoutUsersInput = {
    where: OwnerWhereUniqueInput
    create: XOR<OwnerCreateWithoutUsersInput, OwnerUncheckedCreateWithoutUsersInput>
  }

  export type FirmCreateWithoutUsersInput = {
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    accounts?: AccountCreateNestedManyWithoutFirmInput
    owner?: OwnerCreateNestedOneWithoutFirmsInput
  }

  export type FirmUncheckedCreateWithoutUsersInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_own_id?: number
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
    accounts?: AccountUncheckedCreateNestedManyWithoutFirmInput
  }

  export type FirmCreateOrConnectWithoutUsersInput = {
    where: FirmWhereUniqueInput
    create: XOR<FirmCreateWithoutUsersInput, FirmUncheckedCreateWithoutUsersInput>
  }

  export type OwnerUpsertWithoutUsersInput = {
    update: XOR<OwnerUpdateWithoutUsersInput, OwnerUncheckedUpdateWithoutUsersInput>
    create: XOR<OwnerCreateWithoutUsersInput, OwnerUncheckedCreateWithoutUsersInput>
    where?: OwnerWhereInput
  }

  export type OwnerUpdateToOneWithWhereWithoutUsersInput = {
    where?: OwnerWhereInput
    data: XOR<OwnerUpdateWithoutUsersInput, OwnerUncheckedUpdateWithoutUsersInput>
  }

  export type OwnerUpdateWithoutUsersInput = {
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    firms?: FirmUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateWithoutUsersInput = {
    own_id?: IntFieldUpdateOperationsInput | number
    own_uuid?: StringFieldUpdateOperationsInput | string
    own_product_key?: IntFieldUpdateOperationsInput | number
    own_db?: StringFieldUpdateOperationsInput | string
    own_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    own_first_name?: StringFieldUpdateOperationsInput | string
    own_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    own_last_name?: StringFieldUpdateOperationsInput | string
    own_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    own_mobile_no?: StringFieldUpdateOperationsInput | string
    own_email?: StringFieldUpdateOperationsInput | string
    own_login_id?: StringFieldUpdateOperationsInput | string
    own_password?: StringFieldUpdateOperationsInput | string
    own_status?: EnumOwnerStatusFieldUpdateOperationsInput | $Enums.OwnerStatus
    own_profile_img?: NullableJsonNullValueInput | InputJsonValue
    own_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    own_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_login_status?: BoolFieldUpdateOperationsInput | boolean
    own_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    own_otp?: NullableStringFieldUpdateOperationsInput | string | null
    own_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_address?: NullableStringFieldUpdateOperationsInput | string | null
    own_village?: NullableStringFieldUpdateOperationsInput | string | null
    own_city?: NullableStringFieldUpdateOperationsInput | string | null
    own_state?: NullableStringFieldUpdateOperationsInput | string | null
    own_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    own_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    own_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    own_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    firms?: FirmUncheckedUpdateManyWithoutOwnerNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type FirmUpsertWithoutUsersInput = {
    update: XOR<FirmUpdateWithoutUsersInput, FirmUncheckedUpdateWithoutUsersInput>
    create: XOR<FirmCreateWithoutUsersInput, FirmUncheckedCreateWithoutUsersInput>
    where?: FirmWhereInput
  }

  export type FirmUpdateToOneWithWhereWithoutUsersInput = {
    where?: FirmWhereInput
    data: XOR<FirmUpdateWithoutUsersInput, FirmUncheckedUpdateWithoutUsersInput>
  }

  export type FirmUpdateWithoutUsersInput = {
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    accounts?: AccountUpdateManyWithoutFirmNestedInput
    owner?: OwnerUpdateOneRequiredWithoutFirmsNestedInput
  }

  export type FirmUncheckedUpdateWithoutUsersInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_own_id?: IntFieldUpdateOperationsInput | number
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    accounts?: AccountUncheckedUpdateManyWithoutFirmNestedInput
  }

  export type UserCreateManyOwnerInput = {
    user_id?: number
    user_uuid?: string
    user_firm_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type FirmCreateManyOwnerInput = {
    firm_id?: number
    firm_uuid?: string
    firm_add_date?: Date | string
    firm_name: string
    firm_reg_no: string
    firm_shop_name: string
    firm_desc?: string | null
    firm_address?: string | null
    firm_city?: string | null
    firm_pincode?: string | null
    firm_phone_no?: string | null
    firm_email_id?: string | null
    firm_website_link?: string | null
    firm_type?: $Enums.FirmType
    firm_owner?: string | null
    firm_other_info?: string | null
    firm_geo_latitude?: string | null
    firm_geo_longitude?: string | null
    firm_whatsapp_link?: string | null
    firm_facebook_link?: string | null
    firm_insta_link?: string | null
    firm_bank_name?: string | null
    firm_bank_acc_no?: string | null
    firm_bank_branch?: string | null
    firm_bank_address?: string | null
    firm_acc_holder?: string | null
    firm_acc_type?: string | null
    firm_ifsc_code?: string | null
    firm_start_date?: Date | string | null
    firm_balance?: string | null
    firm_balance_type?: $Enums.FirmBalanceType
    firm_gstin_no?: string | null
    firm_pan_no?: string | null
    firm_adhaar_no?: string | null
    firm_form_header?: string | null
    firm_form_footer?: string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: Date | string
    firm_created_by?: string | null
    firm_updated_at?: Date | string
    firm_updated_by?: string | null
    firm_deleted_at?: Date | string | null
    firm_deleted_by?: string | null
    firm_is_deleted?: boolean
  }

  export type AccountCreateManyOwnerInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_firm_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type UserUpdateWithoutOwnerInput = {
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    firm?: FirmUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnerInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_firm_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyWithoutOwnerInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_firm_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FirmUpdateWithoutOwnerInput = {
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutFirmNestedInput
    accounts?: AccountUpdateManyWithoutFirmNestedInput
  }

  export type FirmUncheckedUpdateWithoutOwnerInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutFirmNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutFirmNestedInput
  }

  export type FirmUncheckedUpdateManyWithoutOwnerInput = {
    firm_id?: IntFieldUpdateOperationsInput | number
    firm_uuid?: StringFieldUpdateOperationsInput | string
    firm_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_name?: StringFieldUpdateOperationsInput | string
    firm_reg_no?: StringFieldUpdateOperationsInput | string
    firm_shop_name?: StringFieldUpdateOperationsInput | string
    firm_desc?: NullableStringFieldUpdateOperationsInput | string | null
    firm_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_city?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    firm_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    firm_website_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_type?: EnumFirmTypeFieldUpdateOperationsInput | $Enums.FirmType
    firm_owner?: NullableStringFieldUpdateOperationsInput | string | null
    firm_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_latitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_geo_longitude?: NullableStringFieldUpdateOperationsInput | string | null
    firm_whatsapp_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_facebook_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_insta_link?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_branch?: NullableStringFieldUpdateOperationsInput | string | null
    firm_bank_address?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_holder?: NullableStringFieldUpdateOperationsInput | string | null
    firm_acc_type?: NullableStringFieldUpdateOperationsInput | string | null
    firm_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    firm_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_balance?: NullableStringFieldUpdateOperationsInput | string | null
    firm_balance_type?: EnumFirmBalanceTypeFieldUpdateOperationsInput | $Enums.FirmBalanceType
    firm_gstin_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_header?: NullableStringFieldUpdateOperationsInput | string | null
    firm_form_footer?: NullableStringFieldUpdateOperationsInput | string | null
    firm_own_sign_img?: NullableJsonNullValueInput | InputJsonValue
    firm_left_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_right_logo_img?: NullableJsonNullValueInput | InputJsonValue
    firm_qr_code_img?: NullableJsonNullValueInput | InputJsonValue
    firm_pan_no_img?: NullableJsonNullValueInput | InputJsonValue
    firm_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    firm_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    firm_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    firm_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUpdateWithoutOwnerInput = {
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    firm?: FirmUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateWithoutOwnerInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_firm_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUncheckedUpdateManyWithoutOwnerInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_firm_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateManyFirmInput = {
    user_id?: number
    user_uuid?: string
    user_own_id: number
    user_add_date?: Date | string
    user_first_name: string
    user_father_name?: string | null
    user_last_name: string
    user_mother_name?: string | null
    user_mobile_no: string
    user_phone_no?: string | null
    user_email_id?: string | null
    user_gender?: $Enums.UserGender | null
    user_cast?: string | null
    user_marital_status?: $Enums.UserMaritalStatus | null
    user_occupation?: string | null
    user_birth_date?: Date | string | null
    user_gstin?: string | null
    user_tax_no?: string | null
    user_pan_no?: string | null
    user_adhaar_no?: string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: string | null
    user_curr_address?: string | null
    user_village?: string | null
    user_ward_no?: string | null
    user_tehsil?: string | null
    user_city?: string | null
    user_state?: string | null
    user_country?: string | null
    user_pincode?: string | null
    user_bank_name?: string | null
    user_bank_acc_no?: string | null
    user_ifsc_code?: string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: string | null
    user_created_at?: Date | string
    user_created_by?: string | null
    user_updated_at?: Date | string
    user_updated_by?: string | null
    user_deleted_at?: Date | string | null
    user_deleted_by?: string | null
    user_is_deleted?: boolean
  }

  export type AccountCreateManyFirmInput = {
    acc_id?: number
    acc_uuid?: string
    acc_add_date?: Date | string
    acc_own_id?: number
    acc_pan_no?: string | null
    acc_name: string
    acc_desc?: string | null
    acc_pre_acc?: string | null
    acc_bank_no?: string | null
    acc_bsr_no?: string | null
    acc_ifsc_code?: string | null
    acc_branch_name?: string | null
    acc_opening_date: Date | string
    acc_address?: string | null
    acc_country?: string | null
    acc_state?: string | null
    acc_city?: string | null
    acc_pincode?: string | null
    acc_cash_balance?: string | null
    acc_balance_type?: $Enums.AccountBalanceType
    acc_other_info?: string | null
    acc_created_at?: Date | string
    acc_created_by?: string | null
    acc_updated_by?: string | null
    acc_deleted_at?: Date | string | null
    acc_deleted_by?: string | null
    acc_is_system?: boolean
    acc_is_deleted?: boolean
  }

  export type UserUpdateWithoutFirmInput = {
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owner?: OwnerUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutFirmInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_own_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyWithoutFirmInput = {
    user_id?: IntFieldUpdateOperationsInput | number
    user_uuid?: StringFieldUpdateOperationsInput | string
    user_own_id?: IntFieldUpdateOperationsInput | number
    user_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    user_first_name?: StringFieldUpdateOperationsInput | string
    user_father_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_last_name?: StringFieldUpdateOperationsInput | string
    user_mother_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_mobile_no?: StringFieldUpdateOperationsInput | string
    user_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_email_id?: NullableStringFieldUpdateOperationsInput | string | null
    user_gender?: NullableEnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender | null
    user_cast?: NullableStringFieldUpdateOperationsInput | string | null
    user_marital_status?: NullableEnumUserMaritalStatusFieldUpdateOperationsInput | $Enums.UserMaritalStatus | null
    user_occupation?: NullableStringFieldUpdateOperationsInput | string | null
    user_birth_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_gstin?: NullableStringFieldUpdateOperationsInput | string | null
    user_tax_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_adhaar_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_profile_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_front_img?: NullableJsonNullValueInput | InputJsonValue
    user_adhaar_back_img?: NullableJsonNullValueInput | InputJsonValue
    user_pan_card_img?: NullableJsonNullValueInput | InputJsonValue
    user_per_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_curr_address?: NullableStringFieldUpdateOperationsInput | string | null
    user_village?: NullableStringFieldUpdateOperationsInput | string | null
    user_ward_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_tehsil?: NullableStringFieldUpdateOperationsInput | string | null
    user_city?: NullableStringFieldUpdateOperationsInput | string | null
    user_state?: NullableStringFieldUpdateOperationsInput | string | null
    user_country?: NullableStringFieldUpdateOperationsInput | string | null
    user_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_name?: NullableStringFieldUpdateOperationsInput | string | null
    user_bank_acc_no?: NullableStringFieldUpdateOperationsInput | string | null
    user_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    user_sign_img?: NullableJsonNullValueInput | InputJsonValue
    user_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    user_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    user_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUpdateWithoutFirmInput = {
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owner?: OwnerUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateWithoutFirmInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_own_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountUncheckedUpdateManyWithoutFirmInput = {
    acc_id?: IntFieldUpdateOperationsInput | number
    acc_uuid?: StringFieldUpdateOperationsInput | string
    acc_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_own_id?: IntFieldUpdateOperationsInput | number
    acc_pan_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_name?: StringFieldUpdateOperationsInput | string
    acc_desc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pre_acc?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bank_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_bsr_no?: NullableStringFieldUpdateOperationsInput | string | null
    acc_ifsc_code?: NullableStringFieldUpdateOperationsInput | string | null
    acc_branch_name?: NullableStringFieldUpdateOperationsInput | string | null
    acc_opening_date?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_address?: NullableStringFieldUpdateOperationsInput | string | null
    acc_country?: NullableStringFieldUpdateOperationsInput | string | null
    acc_state?: NullableStringFieldUpdateOperationsInput | string | null
    acc_city?: NullableStringFieldUpdateOperationsInput | string | null
    acc_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    acc_cash_balance?: NullableStringFieldUpdateOperationsInput | string | null
    acc_balance_type?: EnumAccountBalanceTypeFieldUpdateOperationsInput | $Enums.AccountBalanceType
    acc_other_info?: NullableStringFieldUpdateOperationsInput | string | null
    acc_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    acc_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    acc_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    acc_is_system?: BoolFieldUpdateOperationsInput | boolean
    acc_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use OwnerCountOutputTypeDefaultArgs instead
     */
    export type OwnerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FirmCountOutputTypeDefaultArgs instead
     */
    export type FirmCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FirmCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OwnerDefaultArgs instead
     */
    export type OwnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FirmDefaultArgs instead
     */
    export type FirmArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FirmDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountDefaultArgs instead
     */
    export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}