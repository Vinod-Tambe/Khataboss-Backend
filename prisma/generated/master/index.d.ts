
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
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model DbSeries
 * 
 */
export type DbSeries = $Result.DefaultSelection<Prisma.$DbSeriesPayload>
/**
 * Model Owner
 * 
 */
export type Owner = $Result.DefaultSelection<Prisma.$OwnerPayload>
/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model Announcement
 * 
 */
export type Announcement = $Result.DefaultSelection<Prisma.$AnnouncementPayload>
/**
 * Model OwnerPermission
 * 
 */
export type OwnerPermission = $Result.DefaultSelection<Prisma.$OwnerPermissionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const OwnerStatus: {
  Active: 'Active',
  Inactive: 'Inactive'
};

export type OwnerStatus = (typeof OwnerStatus)[keyof typeof OwnerStatus]


export const PlanBillingCycle: {
  Monthly: 'Monthly',
  Quarterly: 'Quarterly',
  Yearly: 'Yearly',
  Lifetime: 'Lifetime'
};

export type PlanBillingCycle = (typeof PlanBillingCycle)[keyof typeof PlanBillingCycle]


export const PlanStatus: {
  Active: 'Active',
  Inactive: 'Inactive'
};

export type PlanStatus = (typeof PlanStatus)[keyof typeof PlanStatus]


export const AnnouncementType: {
  Notice: 'Notice',
  Alert: 'Alert',
  Warning: 'Warning',
  Celebration: 'Celebration',
  Congratulation: 'Congratulation'
};

export type AnnouncementType = (typeof AnnouncementType)[keyof typeof AnnouncementType]


export const AnnouncementStatus: {
  Active: 'Active',
  Inactive: 'Inactive'
};

export type AnnouncementStatus = (typeof AnnouncementStatus)[keyof typeof AnnouncementStatus]

}

export type OwnerStatus = $Enums.OwnerStatus

export const OwnerStatus: typeof $Enums.OwnerStatus

export type PlanBillingCycle = $Enums.PlanBillingCycle

export const PlanBillingCycle: typeof $Enums.PlanBillingCycle

export type PlanStatus = $Enums.PlanStatus

export const PlanStatus: typeof $Enums.PlanStatus

export type AnnouncementType = $Enums.AnnouncementType

export const AnnouncementType: typeof $Enums.AnnouncementType

export type AnnouncementStatus = $Enums.AnnouncementStatus

export const AnnouncementStatus: typeof $Enums.AnnouncementStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
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
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
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
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs>;

  /**
   * `prisma.dbSeries`: Exposes CRUD operations for the **DbSeries** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DbSeries
    * const dbSeries = await prisma.dbSeries.findMany()
    * ```
    */
  get dbSeries(): Prisma.DbSeriesDelegate<ExtArgs>;

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
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs>;

  /**
   * `prisma.announcement`: Exposes CRUD operations for the **Announcement** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Announcements
    * const announcements = await prisma.announcement.findMany()
    * ```
    */
  get announcement(): Prisma.AnnouncementDelegate<ExtArgs>;

  /**
   * `prisma.ownerPermission`: Exposes CRUD operations for the **OwnerPermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OwnerPermissions
    * const ownerPermissions = await prisma.ownerPermission.findMany()
    * ```
    */
  get ownerPermission(): Prisma.OwnerPermissionDelegate<ExtArgs>;
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
    Admin: 'Admin',
    DbSeries: 'DbSeries',
    Owner: 'Owner',
    Plan: 'Plan',
    Announcement: 'Announcement',
    OwnerPermission: 'OwnerPermission'
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
      modelProps: "admin" | "dbSeries" | "owner" | "plan" | "announcement" | "ownerPermission"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      DbSeries: {
        payload: Prisma.$DbSeriesPayload<ExtArgs>
        fields: Prisma.DbSeriesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DbSeriesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DbSeriesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          findFirst: {
            args: Prisma.DbSeriesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DbSeriesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          findMany: {
            args: Prisma.DbSeriesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>[]
          }
          create: {
            args: Prisma.DbSeriesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          createMany: {
            args: Prisma.DbSeriesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DbSeriesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>[]
          }
          delete: {
            args: Prisma.DbSeriesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          update: {
            args: Prisma.DbSeriesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          deleteMany: {
            args: Prisma.DbSeriesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DbSeriesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DbSeriesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DbSeriesPayload>
          }
          aggregate: {
            args: Prisma.DbSeriesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDbSeries>
          }
          groupBy: {
            args: Prisma.DbSeriesGroupByArgs<ExtArgs>
            result: $Utils.Optional<DbSeriesGroupByOutputType>[]
          }
          count: {
            args: Prisma.DbSeriesCountArgs<ExtArgs>
            result: $Utils.Optional<DbSeriesCountAggregateOutputType> | number
          }
        }
      }
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
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      Announcement: {
        payload: Prisma.$AnnouncementPayload<ExtArgs>
        fields: Prisma.AnnouncementFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AnnouncementFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AnnouncementFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findFirst: {
            args: Prisma.AnnouncementFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AnnouncementFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          findMany: {
            args: Prisma.AnnouncementFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          create: {
            args: Prisma.AnnouncementCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          createMany: {
            args: Prisma.AnnouncementCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AnnouncementCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>[]
          }
          delete: {
            args: Prisma.AnnouncementDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          update: {
            args: Prisma.AnnouncementUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          deleteMany: {
            args: Prisma.AnnouncementDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AnnouncementUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AnnouncementUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AnnouncementPayload>
          }
          aggregate: {
            args: Prisma.AnnouncementAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAnnouncement>
          }
          groupBy: {
            args: Prisma.AnnouncementGroupByArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementGroupByOutputType>[]
          }
          count: {
            args: Prisma.AnnouncementCountArgs<ExtArgs>
            result: $Utils.Optional<AnnouncementCountAggregateOutputType> | number
          }
        }
      }
      OwnerPermission: {
        payload: Prisma.$OwnerPermissionPayload<ExtArgs>
        fields: Prisma.OwnerPermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OwnerPermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OwnerPermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          findFirst: {
            args: Prisma.OwnerPermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OwnerPermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          findMany: {
            args: Prisma.OwnerPermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>[]
          }
          create: {
            args: Prisma.OwnerPermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          createMany: {
            args: Prisma.OwnerPermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OwnerPermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>[]
          }
          delete: {
            args: Prisma.OwnerPermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          update: {
            args: Prisma.OwnerPermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          deleteMany: {
            args: Prisma.OwnerPermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OwnerPermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OwnerPermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OwnerPermissionPayload>
          }
          aggregate: {
            args: Prisma.OwnerPermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOwnerPermission>
          }
          groupBy: {
            args: Prisma.OwnerPermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OwnerPermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OwnerPermissionCountArgs<ExtArgs>
            result: $Utils.Optional<OwnerPermissionCountAggregateOutputType> | number
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
    ownerPermissions: number
  }

  export type OwnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    ownerPermissions?: boolean | OwnerCountOutputTypeCountOwnerPermissionsArgs
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
  export type OwnerCountOutputTypeCountOwnerPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnerPermissionWhereInput
  }


  /**
   * Count Type PlanCountOutputType
   */

  export type PlanCountOutputType = {
    owners: number
  }

  export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owners?: boolean | PlanCountOutputTypeCountOwnersArgs
  }

  // Custom InputTypes
  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     */
    select?: PlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountOwnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminAvgAggregateOutputType = {
    admin_id: number | null
  }

  export type AdminSumAggregateOutputType = {
    admin_id: number | null
  }

  export type AdminMinAggregateOutputType = {
    admin_id: number | null
    admin_uuid: string | null
    admin_add_date: Date | null
    admin_first_name: string | null
    admin_middle_name: string | null
    admin_last_name: string | null
    admin_phone_no: string | null
    admin_mobile_no: string | null
    admin_email: string | null
    admin_login_id: string | null
    admin_password: string | null
    admin_company_name: string | null
    admin_refresh_token: string | null
    admin_refresh_expiry: Date | null
    admin_jwt_token: string | null
    admin_jwt_expiry: Date | null
    admin_login_status: boolean | null
    admin_otp: string | null
    admin_otp_expiry: Date | null
    admin_address: string | null
    admin_village: string | null
    admin_city: string | null
    admin_state: string | null
    admin_pincode: string | null
    admin_created_at: Date | null
    admin_created_by: string | null
    admin_updated_at: Date | null
    admin_updated_by: string | null
    admin_deleted_at: Date | null
    admin_deleted_by: string | null
    admin_is_deleted: boolean | null
  }

  export type AdminMaxAggregateOutputType = {
    admin_id: number | null
    admin_uuid: string | null
    admin_add_date: Date | null
    admin_first_name: string | null
    admin_middle_name: string | null
    admin_last_name: string | null
    admin_phone_no: string | null
    admin_mobile_no: string | null
    admin_email: string | null
    admin_login_id: string | null
    admin_password: string | null
    admin_company_name: string | null
    admin_refresh_token: string | null
    admin_refresh_expiry: Date | null
    admin_jwt_token: string | null
    admin_jwt_expiry: Date | null
    admin_login_status: boolean | null
    admin_otp: string | null
    admin_otp_expiry: Date | null
    admin_address: string | null
    admin_village: string | null
    admin_city: string | null
    admin_state: string | null
    admin_pincode: string | null
    admin_created_at: Date | null
    admin_created_by: string | null
    admin_updated_at: Date | null
    admin_updated_by: string | null
    admin_deleted_at: Date | null
    admin_deleted_by: string | null
    admin_is_deleted: boolean | null
  }

  export type AdminCountAggregateOutputType = {
    admin_id: number
    admin_uuid: number
    admin_add_date: number
    admin_first_name: number
    admin_middle_name: number
    admin_last_name: number
    admin_phone_no: number
    admin_mobile_no: number
    admin_email: number
    admin_login_id: number
    admin_password: number
    admin_company_name: number
    admin_refresh_token: number
    admin_refresh_expiry: number
    admin_jwt_token: number
    admin_jwt_expiry: number
    admin_login_status: number
    admin_last_login_system: number
    admin_otp: number
    admin_otp_expiry: number
    admin_address: number
    admin_village: number
    admin_city: number
    admin_state: number
    admin_pincode: number
    admin_created_at: number
    admin_created_by: number
    admin_updated_at: number
    admin_updated_by: number
    admin_deleted_at: number
    admin_deleted_by: number
    admin_is_deleted: number
    _all: number
  }


  export type AdminAvgAggregateInputType = {
    admin_id?: true
  }

  export type AdminSumAggregateInputType = {
    admin_id?: true
  }

  export type AdminMinAggregateInputType = {
    admin_id?: true
    admin_uuid?: true
    admin_add_date?: true
    admin_first_name?: true
    admin_middle_name?: true
    admin_last_name?: true
    admin_phone_no?: true
    admin_mobile_no?: true
    admin_email?: true
    admin_login_id?: true
    admin_password?: true
    admin_company_name?: true
    admin_refresh_token?: true
    admin_refresh_expiry?: true
    admin_jwt_token?: true
    admin_jwt_expiry?: true
    admin_login_status?: true
    admin_otp?: true
    admin_otp_expiry?: true
    admin_address?: true
    admin_village?: true
    admin_city?: true
    admin_state?: true
    admin_pincode?: true
    admin_created_at?: true
    admin_created_by?: true
    admin_updated_at?: true
    admin_updated_by?: true
    admin_deleted_at?: true
    admin_deleted_by?: true
    admin_is_deleted?: true
  }

  export type AdminMaxAggregateInputType = {
    admin_id?: true
    admin_uuid?: true
    admin_add_date?: true
    admin_first_name?: true
    admin_middle_name?: true
    admin_last_name?: true
    admin_phone_no?: true
    admin_mobile_no?: true
    admin_email?: true
    admin_login_id?: true
    admin_password?: true
    admin_company_name?: true
    admin_refresh_token?: true
    admin_refresh_expiry?: true
    admin_jwt_token?: true
    admin_jwt_expiry?: true
    admin_login_status?: true
    admin_otp?: true
    admin_otp_expiry?: true
    admin_address?: true
    admin_village?: true
    admin_city?: true
    admin_state?: true
    admin_pincode?: true
    admin_created_at?: true
    admin_created_by?: true
    admin_updated_at?: true
    admin_updated_by?: true
    admin_deleted_at?: true
    admin_deleted_by?: true
    admin_is_deleted?: true
  }

  export type AdminCountAggregateInputType = {
    admin_id?: true
    admin_uuid?: true
    admin_add_date?: true
    admin_first_name?: true
    admin_middle_name?: true
    admin_last_name?: true
    admin_phone_no?: true
    admin_mobile_no?: true
    admin_email?: true
    admin_login_id?: true
    admin_password?: true
    admin_company_name?: true
    admin_refresh_token?: true
    admin_refresh_expiry?: true
    admin_jwt_token?: true
    admin_jwt_expiry?: true
    admin_login_status?: true
    admin_last_login_system?: true
    admin_otp?: true
    admin_otp_expiry?: true
    admin_address?: true
    admin_village?: true
    admin_city?: true
    admin_state?: true
    admin_pincode?: true
    admin_created_at?: true
    admin_created_by?: true
    admin_updated_at?: true
    admin_updated_by?: true
    admin_deleted_at?: true
    admin_deleted_by?: true
    admin_is_deleted?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _avg?: AdminAvgAggregateInputType
    _sum?: AdminSumAggregateInputType
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    admin_id: number
    admin_uuid: string
    admin_add_date: Date
    admin_first_name: string
    admin_middle_name: string | null
    admin_last_name: string
    admin_phone_no: string | null
    admin_mobile_no: string | null
    admin_email: string
    admin_login_id: string
    admin_password: string
    admin_company_name: string | null
    admin_refresh_token: string | null
    admin_refresh_expiry: Date | null
    admin_jwt_token: string | null
    admin_jwt_expiry: Date | null
    admin_login_status: boolean
    admin_last_login_system: JsonValue | null
    admin_otp: string | null
    admin_otp_expiry: Date | null
    admin_address: string | null
    admin_village: string | null
    admin_city: string | null
    admin_state: string | null
    admin_pincode: string | null
    admin_created_at: Date
    admin_created_by: string | null
    admin_updated_at: Date
    admin_updated_by: string | null
    admin_deleted_at: Date | null
    admin_deleted_by: string | null
    admin_is_deleted: boolean
    _count: AdminCountAggregateOutputType | null
    _avg: AdminAvgAggregateOutputType | null
    _sum: AdminSumAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    admin_id?: boolean
    admin_uuid?: boolean
    admin_add_date?: boolean
    admin_first_name?: boolean
    admin_middle_name?: boolean
    admin_last_name?: boolean
    admin_phone_no?: boolean
    admin_mobile_no?: boolean
    admin_email?: boolean
    admin_login_id?: boolean
    admin_password?: boolean
    admin_company_name?: boolean
    admin_refresh_token?: boolean
    admin_refresh_expiry?: boolean
    admin_jwt_token?: boolean
    admin_jwt_expiry?: boolean
    admin_login_status?: boolean
    admin_last_login_system?: boolean
    admin_otp?: boolean
    admin_otp_expiry?: boolean
    admin_address?: boolean
    admin_village?: boolean
    admin_city?: boolean
    admin_state?: boolean
    admin_pincode?: boolean
    admin_created_at?: boolean
    admin_created_by?: boolean
    admin_updated_at?: boolean
    admin_updated_by?: boolean
    admin_deleted_at?: boolean
    admin_deleted_by?: boolean
    admin_is_deleted?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    admin_id?: boolean
    admin_uuid?: boolean
    admin_add_date?: boolean
    admin_first_name?: boolean
    admin_middle_name?: boolean
    admin_last_name?: boolean
    admin_phone_no?: boolean
    admin_mobile_no?: boolean
    admin_email?: boolean
    admin_login_id?: boolean
    admin_password?: boolean
    admin_company_name?: boolean
    admin_refresh_token?: boolean
    admin_refresh_expiry?: boolean
    admin_jwt_token?: boolean
    admin_jwt_expiry?: boolean
    admin_login_status?: boolean
    admin_last_login_system?: boolean
    admin_otp?: boolean
    admin_otp_expiry?: boolean
    admin_address?: boolean
    admin_village?: boolean
    admin_city?: boolean
    admin_state?: boolean
    admin_pincode?: boolean
    admin_created_at?: boolean
    admin_created_by?: boolean
    admin_updated_at?: boolean
    admin_updated_by?: boolean
    admin_deleted_at?: boolean
    admin_deleted_by?: boolean
    admin_is_deleted?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    admin_id?: boolean
    admin_uuid?: boolean
    admin_add_date?: boolean
    admin_first_name?: boolean
    admin_middle_name?: boolean
    admin_last_name?: boolean
    admin_phone_no?: boolean
    admin_mobile_no?: boolean
    admin_email?: boolean
    admin_login_id?: boolean
    admin_password?: boolean
    admin_company_name?: boolean
    admin_refresh_token?: boolean
    admin_refresh_expiry?: boolean
    admin_jwt_token?: boolean
    admin_jwt_expiry?: boolean
    admin_login_status?: boolean
    admin_last_login_system?: boolean
    admin_otp?: boolean
    admin_otp_expiry?: boolean
    admin_address?: boolean
    admin_village?: boolean
    admin_city?: boolean
    admin_state?: boolean
    admin_pincode?: boolean
    admin_created_at?: boolean
    admin_created_by?: boolean
    admin_updated_at?: boolean
    admin_updated_by?: boolean
    admin_deleted_at?: boolean
    admin_deleted_by?: boolean
    admin_is_deleted?: boolean
  }


  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      admin_id: number
      admin_uuid: string
      admin_add_date: Date
      admin_first_name: string
      admin_middle_name: string | null
      admin_last_name: string
      admin_phone_no: string | null
      admin_mobile_no: string | null
      admin_email: string
      admin_login_id: string
      admin_password: string
      admin_company_name: string | null
      admin_refresh_token: string | null
      admin_refresh_expiry: Date | null
      admin_jwt_token: string | null
      admin_jwt_expiry: Date | null
      admin_login_status: boolean
      admin_last_login_system: Prisma.JsonValue | null
      admin_otp: string | null
      admin_otp_expiry: Date | null
      admin_address: string | null
      admin_village: string | null
      admin_city: string | null
      admin_state: string | null
      admin_pincode: string | null
      admin_created_at: Date
      admin_created_by: string | null
      admin_updated_at: Date
      admin_updated_by: string | null
      admin_deleted_at: Date | null
      admin_deleted_by: string | null
      admin_is_deleted: boolean
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `admin_id`
     * const adminWithAdmin_idOnly = await prisma.admin.findMany({ select: { admin_id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `admin_id`
     * const adminWithAdmin_idOnly = await prisma.admin.createManyAndReturn({ 
     *   select: { admin_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
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
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Admin model
   */ 
  interface AdminFieldRefs {
    readonly admin_id: FieldRef<"Admin", 'Int'>
    readonly admin_uuid: FieldRef<"Admin", 'String'>
    readonly admin_add_date: FieldRef<"Admin", 'DateTime'>
    readonly admin_first_name: FieldRef<"Admin", 'String'>
    readonly admin_middle_name: FieldRef<"Admin", 'String'>
    readonly admin_last_name: FieldRef<"Admin", 'String'>
    readonly admin_phone_no: FieldRef<"Admin", 'String'>
    readonly admin_mobile_no: FieldRef<"Admin", 'String'>
    readonly admin_email: FieldRef<"Admin", 'String'>
    readonly admin_login_id: FieldRef<"Admin", 'String'>
    readonly admin_password: FieldRef<"Admin", 'String'>
    readonly admin_company_name: FieldRef<"Admin", 'String'>
    readonly admin_refresh_token: FieldRef<"Admin", 'String'>
    readonly admin_refresh_expiry: FieldRef<"Admin", 'DateTime'>
    readonly admin_jwt_token: FieldRef<"Admin", 'String'>
    readonly admin_jwt_expiry: FieldRef<"Admin", 'DateTime'>
    readonly admin_login_status: FieldRef<"Admin", 'Boolean'>
    readonly admin_last_login_system: FieldRef<"Admin", 'Json'>
    readonly admin_otp: FieldRef<"Admin", 'String'>
    readonly admin_otp_expiry: FieldRef<"Admin", 'DateTime'>
    readonly admin_address: FieldRef<"Admin", 'String'>
    readonly admin_village: FieldRef<"Admin", 'String'>
    readonly admin_city: FieldRef<"Admin", 'String'>
    readonly admin_state: FieldRef<"Admin", 'String'>
    readonly admin_pincode: FieldRef<"Admin", 'String'>
    readonly admin_created_at: FieldRef<"Admin", 'DateTime'>
    readonly admin_created_by: FieldRef<"Admin", 'String'>
    readonly admin_updated_at: FieldRef<"Admin", 'DateTime'>
    readonly admin_updated_by: FieldRef<"Admin", 'String'>
    readonly admin_deleted_at: FieldRef<"Admin", 'DateTime'>
    readonly admin_deleted_by: FieldRef<"Admin", 'String'>
    readonly admin_is_deleted: FieldRef<"Admin", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
  }


  /**
   * Model DbSeries
   */

  export type AggregateDbSeries = {
    _count: DbSeriesCountAggregateOutputType | null
    _avg: DbSeriesAvgAggregateOutputType | null
    _sum: DbSeriesSumAggregateOutputType | null
    _min: DbSeriesMinAggregateOutputType | null
    _max: DbSeriesMaxAggregateOutputType | null
  }

  export type DbSeriesAvgAggregateOutputType = {
    id: number | null
    last_number: number | null
  }

  export type DbSeriesSumAggregateOutputType = {
    id: number | null
    last_number: number | null
  }

  export type DbSeriesMinAggregateOutputType = {
    id: number | null
    series_name: string | null
    last_number: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DbSeriesMaxAggregateOutputType = {
    id: number | null
    series_name: string | null
    last_number: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type DbSeriesCountAggregateOutputType = {
    id: number
    series_name: number
    last_number: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type DbSeriesAvgAggregateInputType = {
    id?: true
    last_number?: true
  }

  export type DbSeriesSumAggregateInputType = {
    id?: true
    last_number?: true
  }

  export type DbSeriesMinAggregateInputType = {
    id?: true
    series_name?: true
    last_number?: true
    created_at?: true
    updated_at?: true
  }

  export type DbSeriesMaxAggregateInputType = {
    id?: true
    series_name?: true
    last_number?: true
    created_at?: true
    updated_at?: true
  }

  export type DbSeriesCountAggregateInputType = {
    id?: true
    series_name?: true
    last_number?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type DbSeriesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DbSeries to aggregate.
     */
    where?: DbSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbSeries to fetch.
     */
    orderBy?: DbSeriesOrderByWithRelationInput | DbSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DbSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DbSeries
    **/
    _count?: true | DbSeriesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DbSeriesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DbSeriesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DbSeriesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DbSeriesMaxAggregateInputType
  }

  export type GetDbSeriesAggregateType<T extends DbSeriesAggregateArgs> = {
        [P in keyof T & keyof AggregateDbSeries]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDbSeries[P]>
      : GetScalarType<T[P], AggregateDbSeries[P]>
  }




  export type DbSeriesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DbSeriesWhereInput
    orderBy?: DbSeriesOrderByWithAggregationInput | DbSeriesOrderByWithAggregationInput[]
    by: DbSeriesScalarFieldEnum[] | DbSeriesScalarFieldEnum
    having?: DbSeriesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DbSeriesCountAggregateInputType | true
    _avg?: DbSeriesAvgAggregateInputType
    _sum?: DbSeriesSumAggregateInputType
    _min?: DbSeriesMinAggregateInputType
    _max?: DbSeriesMaxAggregateInputType
  }

  export type DbSeriesGroupByOutputType = {
    id: number
    series_name: string
    last_number: number
    created_at: Date
    updated_at: Date
    _count: DbSeriesCountAggregateOutputType | null
    _avg: DbSeriesAvgAggregateOutputType | null
    _sum: DbSeriesSumAggregateOutputType | null
    _min: DbSeriesMinAggregateOutputType | null
    _max: DbSeriesMaxAggregateOutputType | null
  }

  type GetDbSeriesGroupByPayload<T extends DbSeriesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DbSeriesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DbSeriesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DbSeriesGroupByOutputType[P]>
            : GetScalarType<T[P], DbSeriesGroupByOutputType[P]>
        }
      >
    >


  export type DbSeriesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    series_name?: boolean
    last_number?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["dbSeries"]>

  export type DbSeriesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    series_name?: boolean
    last_number?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["dbSeries"]>

  export type DbSeriesSelectScalar = {
    id?: boolean
    series_name?: boolean
    last_number?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $DbSeriesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DbSeries"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      series_name: string
      last_number: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["dbSeries"]>
    composites: {}
  }

  type DbSeriesGetPayload<S extends boolean | null | undefined | DbSeriesDefaultArgs> = $Result.GetResult<Prisma.$DbSeriesPayload, S>

  type DbSeriesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DbSeriesFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DbSeriesCountAggregateInputType | true
    }

  export interface DbSeriesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DbSeries'], meta: { name: 'DbSeries' } }
    /**
     * Find zero or one DbSeries that matches the filter.
     * @param {DbSeriesFindUniqueArgs} args - Arguments to find a DbSeries
     * @example
     * // Get one DbSeries
     * const dbSeries = await prisma.dbSeries.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DbSeriesFindUniqueArgs>(args: SelectSubset<T, DbSeriesFindUniqueArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DbSeries that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DbSeriesFindUniqueOrThrowArgs} args - Arguments to find a DbSeries
     * @example
     * // Get one DbSeries
     * const dbSeries = await prisma.dbSeries.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DbSeriesFindUniqueOrThrowArgs>(args: SelectSubset<T, DbSeriesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DbSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesFindFirstArgs} args - Arguments to find a DbSeries
     * @example
     * // Get one DbSeries
     * const dbSeries = await prisma.dbSeries.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DbSeriesFindFirstArgs>(args?: SelectSubset<T, DbSeriesFindFirstArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DbSeries that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesFindFirstOrThrowArgs} args - Arguments to find a DbSeries
     * @example
     * // Get one DbSeries
     * const dbSeries = await prisma.dbSeries.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DbSeriesFindFirstOrThrowArgs>(args?: SelectSubset<T, DbSeriesFindFirstOrThrowArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DbSeries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DbSeries
     * const dbSeries = await prisma.dbSeries.findMany()
     * 
     * // Get first 10 DbSeries
     * const dbSeries = await prisma.dbSeries.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dbSeriesWithIdOnly = await prisma.dbSeries.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DbSeriesFindManyArgs>(args?: SelectSubset<T, DbSeriesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DbSeries.
     * @param {DbSeriesCreateArgs} args - Arguments to create a DbSeries.
     * @example
     * // Create one DbSeries
     * const DbSeries = await prisma.dbSeries.create({
     *   data: {
     *     // ... data to create a DbSeries
     *   }
     * })
     * 
     */
    create<T extends DbSeriesCreateArgs>(args: SelectSubset<T, DbSeriesCreateArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DbSeries.
     * @param {DbSeriesCreateManyArgs} args - Arguments to create many DbSeries.
     * @example
     * // Create many DbSeries
     * const dbSeries = await prisma.dbSeries.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DbSeriesCreateManyArgs>(args?: SelectSubset<T, DbSeriesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DbSeries and returns the data saved in the database.
     * @param {DbSeriesCreateManyAndReturnArgs} args - Arguments to create many DbSeries.
     * @example
     * // Create many DbSeries
     * const dbSeries = await prisma.dbSeries.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DbSeries and only return the `id`
     * const dbSeriesWithIdOnly = await prisma.dbSeries.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DbSeriesCreateManyAndReturnArgs>(args?: SelectSubset<T, DbSeriesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DbSeries.
     * @param {DbSeriesDeleteArgs} args - Arguments to delete one DbSeries.
     * @example
     * // Delete one DbSeries
     * const DbSeries = await prisma.dbSeries.delete({
     *   where: {
     *     // ... filter to delete one DbSeries
     *   }
     * })
     * 
     */
    delete<T extends DbSeriesDeleteArgs>(args: SelectSubset<T, DbSeriesDeleteArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DbSeries.
     * @param {DbSeriesUpdateArgs} args - Arguments to update one DbSeries.
     * @example
     * // Update one DbSeries
     * const dbSeries = await prisma.dbSeries.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DbSeriesUpdateArgs>(args: SelectSubset<T, DbSeriesUpdateArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DbSeries.
     * @param {DbSeriesDeleteManyArgs} args - Arguments to filter DbSeries to delete.
     * @example
     * // Delete a few DbSeries
     * const { count } = await prisma.dbSeries.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DbSeriesDeleteManyArgs>(args?: SelectSubset<T, DbSeriesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DbSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DbSeries
     * const dbSeries = await prisma.dbSeries.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DbSeriesUpdateManyArgs>(args: SelectSubset<T, DbSeriesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DbSeries.
     * @param {DbSeriesUpsertArgs} args - Arguments to update or create a DbSeries.
     * @example
     * // Update or create a DbSeries
     * const dbSeries = await prisma.dbSeries.upsert({
     *   create: {
     *     // ... data to create a DbSeries
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DbSeries we want to update
     *   }
     * })
     */
    upsert<T extends DbSeriesUpsertArgs>(args: SelectSubset<T, DbSeriesUpsertArgs<ExtArgs>>): Prisma__DbSeriesClient<$Result.GetResult<Prisma.$DbSeriesPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DbSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesCountArgs} args - Arguments to filter DbSeries to count.
     * @example
     * // Count the number of DbSeries
     * const count = await prisma.dbSeries.count({
     *   where: {
     *     // ... the filter for the DbSeries we want to count
     *   }
     * })
    **/
    count<T extends DbSeriesCountArgs>(
      args?: Subset<T, DbSeriesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DbSeriesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DbSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DbSeriesAggregateArgs>(args: Subset<T, DbSeriesAggregateArgs>): Prisma.PrismaPromise<GetDbSeriesAggregateType<T>>

    /**
     * Group by DbSeries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DbSeriesGroupByArgs} args - Group by arguments.
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
      T extends DbSeriesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DbSeriesGroupByArgs['orderBy'] }
        : { orderBy?: DbSeriesGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DbSeriesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDbSeriesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DbSeries model
   */
  readonly fields: DbSeriesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DbSeries.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DbSeriesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the DbSeries model
   */ 
  interface DbSeriesFieldRefs {
    readonly id: FieldRef<"DbSeries", 'Int'>
    readonly series_name: FieldRef<"DbSeries", 'String'>
    readonly last_number: FieldRef<"DbSeries", 'Int'>
    readonly created_at: FieldRef<"DbSeries", 'DateTime'>
    readonly updated_at: FieldRef<"DbSeries", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DbSeries findUnique
   */
  export type DbSeriesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter, which DbSeries to fetch.
     */
    where: DbSeriesWhereUniqueInput
  }

  /**
   * DbSeries findUniqueOrThrow
   */
  export type DbSeriesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter, which DbSeries to fetch.
     */
    where: DbSeriesWhereUniqueInput
  }

  /**
   * DbSeries findFirst
   */
  export type DbSeriesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter, which DbSeries to fetch.
     */
    where?: DbSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbSeries to fetch.
     */
    orderBy?: DbSeriesOrderByWithRelationInput | DbSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DbSeries.
     */
    cursor?: DbSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DbSeries.
     */
    distinct?: DbSeriesScalarFieldEnum | DbSeriesScalarFieldEnum[]
  }

  /**
   * DbSeries findFirstOrThrow
   */
  export type DbSeriesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter, which DbSeries to fetch.
     */
    where?: DbSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbSeries to fetch.
     */
    orderBy?: DbSeriesOrderByWithRelationInput | DbSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DbSeries.
     */
    cursor?: DbSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbSeries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DbSeries.
     */
    distinct?: DbSeriesScalarFieldEnum | DbSeriesScalarFieldEnum[]
  }

  /**
   * DbSeries findMany
   */
  export type DbSeriesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter, which DbSeries to fetch.
     */
    where?: DbSeriesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DbSeries to fetch.
     */
    orderBy?: DbSeriesOrderByWithRelationInput | DbSeriesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DbSeries.
     */
    cursor?: DbSeriesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DbSeries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DbSeries.
     */
    skip?: number
    distinct?: DbSeriesScalarFieldEnum | DbSeriesScalarFieldEnum[]
  }

  /**
   * DbSeries create
   */
  export type DbSeriesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * The data needed to create a DbSeries.
     */
    data: XOR<DbSeriesCreateInput, DbSeriesUncheckedCreateInput>
  }

  /**
   * DbSeries createMany
   */
  export type DbSeriesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DbSeries.
     */
    data: DbSeriesCreateManyInput | DbSeriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DbSeries createManyAndReturn
   */
  export type DbSeriesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DbSeries.
     */
    data: DbSeriesCreateManyInput | DbSeriesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DbSeries update
   */
  export type DbSeriesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * The data needed to update a DbSeries.
     */
    data: XOR<DbSeriesUpdateInput, DbSeriesUncheckedUpdateInput>
    /**
     * Choose, which DbSeries to update.
     */
    where: DbSeriesWhereUniqueInput
  }

  /**
   * DbSeries updateMany
   */
  export type DbSeriesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DbSeries.
     */
    data: XOR<DbSeriesUpdateManyMutationInput, DbSeriesUncheckedUpdateManyInput>
    /**
     * Filter which DbSeries to update
     */
    where?: DbSeriesWhereInput
  }

  /**
   * DbSeries upsert
   */
  export type DbSeriesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * The filter to search for the DbSeries to update in case it exists.
     */
    where: DbSeriesWhereUniqueInput
    /**
     * In case the DbSeries found by the `where` argument doesn't exist, create a new DbSeries with this data.
     */
    create: XOR<DbSeriesCreateInput, DbSeriesUncheckedCreateInput>
    /**
     * In case the DbSeries was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DbSeriesUpdateInput, DbSeriesUncheckedUpdateInput>
  }

  /**
   * DbSeries delete
   */
  export type DbSeriesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
    /**
     * Filter which DbSeries to delete.
     */
    where: DbSeriesWhereUniqueInput
  }

  /**
   * DbSeries deleteMany
   */
  export type DbSeriesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DbSeries to delete
     */
    where?: DbSeriesWhereInput
  }

  /**
   * DbSeries without action
   */
  export type DbSeriesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DbSeries
     */
    select?: DbSeriesSelect<ExtArgs> | null
  }


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
    own_plan_id: number | null
    own_max_firms: number | null
    own_max_staff: number | null
  }

  export type OwnerSumAggregateOutputType = {
    own_id: number | null
    own_product_key: number | null
    own_plan_id: number | null
    own_max_firms: number | null
    own_max_staff: number | null
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
    own_plan_id: number | null
    own_max_firms: number | null
    own_max_staff: number | null
    own_start_date: Date | null
    own_expiry_date: Date | null
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
    own_plan_id: number | null
    own_max_firms: number | null
    own_max_staff: number | null
    own_start_date: Date | null
    own_expiry_date: Date | null
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
    own_plan_id: number
    own_max_firms: number
    own_max_staff: number
    own_start_date: number
    own_expiry_date: number
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
    own_plan_id?: true
    own_max_firms?: true
    own_max_staff?: true
  }

  export type OwnerSumAggregateInputType = {
    own_id?: true
    own_product_key?: true
    own_plan_id?: true
    own_max_firms?: true
    own_max_staff?: true
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
    own_plan_id?: true
    own_max_firms?: true
    own_max_staff?: true
    own_start_date?: true
    own_expiry_date?: true
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
    own_plan_id?: true
    own_max_firms?: true
    own_max_staff?: true
    own_start_date?: true
    own_expiry_date?: true
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
    own_plan_id?: true
    own_max_firms?: true
    own_max_staff?: true
    own_start_date?: true
    own_expiry_date?: true
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
    own_plan_id: number | null
    own_max_firms: number | null
    own_max_staff: number | null
    own_start_date: Date | null
    own_expiry_date: Date | null
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
    own_plan_id?: boolean
    own_max_firms?: boolean
    own_max_staff?: boolean
    own_start_date?: boolean
    own_expiry_date?: boolean
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
    plan?: boolean | Owner$planArgs<ExtArgs>
    ownerPermissions?: boolean | Owner$ownerPermissionsArgs<ExtArgs>
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
    own_plan_id?: boolean
    own_max_firms?: boolean
    own_max_staff?: boolean
    own_start_date?: boolean
    own_expiry_date?: boolean
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
    plan?: boolean | Owner$planArgs<ExtArgs>
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
    own_plan_id?: boolean
    own_max_firms?: boolean
    own_max_staff?: boolean
    own_start_date?: boolean
    own_expiry_date?: boolean
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
    plan?: boolean | Owner$planArgs<ExtArgs>
    ownerPermissions?: boolean | Owner$ownerPermissionsArgs<ExtArgs>
    _count?: boolean | OwnerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OwnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    plan?: boolean | Owner$planArgs<ExtArgs>
  }

  export type $OwnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Owner"
    objects: {
      plan: Prisma.$PlanPayload<ExtArgs> | null
      ownerPermissions: Prisma.$OwnerPermissionPayload<ExtArgs>[]
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
      own_plan_id: number | null
      own_max_firms: number | null
      own_max_staff: number | null
      own_start_date: Date | null
      own_expiry_date: Date | null
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
    plan<T extends Owner$planArgs<ExtArgs> = {}>(args?: Subset<T, Owner$planArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    ownerPermissions<T extends Owner$ownerPermissionsArgs<ExtArgs> = {}>(args?: Subset<T, Owner$ownerPermissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findMany"> | Null>
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
    readonly own_plan_id: FieldRef<"Owner", 'Int'>
    readonly own_max_firms: FieldRef<"Owner", 'Int'>
    readonly own_max_staff: FieldRef<"Owner", 'Int'>
    readonly own_start_date: FieldRef<"Owner", 'DateTime'>
    readonly own_expiry_date: FieldRef<"Owner", 'DateTime'>
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerIncludeCreateManyAndReturn<ExtArgs> | null
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
   * Owner.plan
   */
  export type Owner$planArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    where?: PlanWhereInput
  }

  /**
   * Owner.ownerPermissions
   */
  export type Owner$ownerPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    where?: OwnerPermissionWhereInput
    orderBy?: OwnerPermissionOrderByWithRelationInput | OwnerPermissionOrderByWithRelationInput[]
    cursor?: OwnerPermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OwnerPermissionScalarFieldEnum | OwnerPermissionScalarFieldEnum[]
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
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    plan_id: number | null
    plan_price: Decimal | null
    plan_offer_price: Decimal | null
    plan_duration_days: number | null
    plan_max_firms: number | null
    plan_max_staff: number | null
    plan_sort_order: number | null
  }

  export type PlanSumAggregateOutputType = {
    plan_id: number | null
    plan_price: Decimal | null
    plan_offer_price: Decimal | null
    plan_duration_days: number | null
    plan_max_firms: number | null
    plan_max_staff: number | null
    plan_sort_order: number | null
  }

  export type PlanMinAggregateOutputType = {
    plan_id: number | null
    plan_uuid: string | null
    plan_name: string | null
    plan_code: string | null
    plan_description: string | null
    plan_price: Decimal | null
    plan_offer_price: Decimal | null
    plan_currency: string | null
    plan_billing_cycle: $Enums.PlanBillingCycle | null
    plan_duration_days: number | null
    plan_max_firms: number | null
    plan_max_staff: number | null
    plan_is_popular: boolean | null
    plan_sort_order: number | null
    plan_status: $Enums.PlanStatus | null
    plan_created_at: Date | null
    plan_created_by: string | null
    plan_updated_at: Date | null
    plan_updated_by: string | null
    plan_deleted_at: Date | null
    plan_deleted_by: string | null
    plan_is_deleted: boolean | null
  }

  export type PlanMaxAggregateOutputType = {
    plan_id: number | null
    plan_uuid: string | null
    plan_name: string | null
    plan_code: string | null
    plan_description: string | null
    plan_price: Decimal | null
    plan_offer_price: Decimal | null
    plan_currency: string | null
    plan_billing_cycle: $Enums.PlanBillingCycle | null
    plan_duration_days: number | null
    plan_max_firms: number | null
    plan_max_staff: number | null
    plan_is_popular: boolean | null
    plan_sort_order: number | null
    plan_status: $Enums.PlanStatus | null
    plan_created_at: Date | null
    plan_created_by: string | null
    plan_updated_at: Date | null
    plan_updated_by: string | null
    plan_deleted_at: Date | null
    plan_deleted_by: string | null
    plan_is_deleted: boolean | null
  }

  export type PlanCountAggregateOutputType = {
    plan_id: number
    plan_uuid: number
    plan_name: number
    plan_code: number
    plan_description: number
    plan_price: number
    plan_offer_price: number
    plan_currency: number
    plan_billing_cycle: number
    plan_duration_days: number
    plan_max_firms: number
    plan_max_staff: number
    plan_modules: number
    plan_features: number
    plan_image: number
    plan_is_popular: number
    plan_sort_order: number
    plan_status: number
    plan_created_at: number
    plan_created_by: number
    plan_updated_at: number
    plan_updated_by: number
    plan_deleted_at: number
    plan_deleted_by: number
    plan_is_deleted: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    plan_id?: true
    plan_price?: true
    plan_offer_price?: true
    plan_duration_days?: true
    plan_max_firms?: true
    plan_max_staff?: true
    plan_sort_order?: true
  }

  export type PlanSumAggregateInputType = {
    plan_id?: true
    plan_price?: true
    plan_offer_price?: true
    plan_duration_days?: true
    plan_max_firms?: true
    plan_max_staff?: true
    plan_sort_order?: true
  }

  export type PlanMinAggregateInputType = {
    plan_id?: true
    plan_uuid?: true
    plan_name?: true
    plan_code?: true
    plan_description?: true
    plan_price?: true
    plan_offer_price?: true
    plan_currency?: true
    plan_billing_cycle?: true
    plan_duration_days?: true
    plan_max_firms?: true
    plan_max_staff?: true
    plan_is_popular?: true
    plan_sort_order?: true
    plan_status?: true
    plan_created_at?: true
    plan_created_by?: true
    plan_updated_at?: true
    plan_updated_by?: true
    plan_deleted_at?: true
    plan_deleted_by?: true
    plan_is_deleted?: true
  }

  export type PlanMaxAggregateInputType = {
    plan_id?: true
    plan_uuid?: true
    plan_name?: true
    plan_code?: true
    plan_description?: true
    plan_price?: true
    plan_offer_price?: true
    plan_currency?: true
    plan_billing_cycle?: true
    plan_duration_days?: true
    plan_max_firms?: true
    plan_max_staff?: true
    plan_is_popular?: true
    plan_sort_order?: true
    plan_status?: true
    plan_created_at?: true
    plan_created_by?: true
    plan_updated_at?: true
    plan_updated_by?: true
    plan_deleted_at?: true
    plan_deleted_by?: true
    plan_is_deleted?: true
  }

  export type PlanCountAggregateInputType = {
    plan_id?: true
    plan_uuid?: true
    plan_name?: true
    plan_code?: true
    plan_description?: true
    plan_price?: true
    plan_offer_price?: true
    plan_currency?: true
    plan_billing_cycle?: true
    plan_duration_days?: true
    plan_max_firms?: true
    plan_max_staff?: true
    plan_modules?: true
    plan_features?: true
    plan_image?: true
    plan_is_popular?: true
    plan_sort_order?: true
    plan_status?: true
    plan_created_at?: true
    plan_created_by?: true
    plan_updated_at?: true
    plan_updated_by?: true
    plan_deleted_at?: true
    plan_deleted_by?: true
    plan_is_deleted?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    plan_id: number
    plan_uuid: string
    plan_name: string
    plan_code: string
    plan_description: string | null
    plan_price: Decimal
    plan_offer_price: Decimal | null
    plan_currency: string
    plan_billing_cycle: $Enums.PlanBillingCycle
    plan_duration_days: number | null
    plan_max_firms: number
    plan_max_staff: number
    plan_modules: JsonValue
    plan_features: JsonValue | null
    plan_image: JsonValue | null
    plan_is_popular: boolean
    plan_sort_order: number
    plan_status: $Enums.PlanStatus
    plan_created_at: Date
    plan_created_by: string | null
    plan_updated_at: Date
    plan_updated_by: string | null
    plan_deleted_at: Date | null
    plan_deleted_by: string | null
    plan_is_deleted: boolean
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plan_id?: boolean
    plan_uuid?: boolean
    plan_name?: boolean
    plan_code?: boolean
    plan_description?: boolean
    plan_price?: boolean
    plan_offer_price?: boolean
    plan_currency?: boolean
    plan_billing_cycle?: boolean
    plan_duration_days?: boolean
    plan_max_firms?: boolean
    plan_max_staff?: boolean
    plan_modules?: boolean
    plan_features?: boolean
    plan_image?: boolean
    plan_is_popular?: boolean
    plan_sort_order?: boolean
    plan_status?: boolean
    plan_created_at?: boolean
    plan_created_by?: boolean
    plan_updated_at?: boolean
    plan_updated_by?: boolean
    plan_deleted_at?: boolean
    plan_deleted_by?: boolean
    plan_is_deleted?: boolean
    owners?: boolean | Plan$ownersArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    plan_id?: boolean
    plan_uuid?: boolean
    plan_name?: boolean
    plan_code?: boolean
    plan_description?: boolean
    plan_price?: boolean
    plan_offer_price?: boolean
    plan_currency?: boolean
    plan_billing_cycle?: boolean
    plan_duration_days?: boolean
    plan_max_firms?: boolean
    plan_max_staff?: boolean
    plan_modules?: boolean
    plan_features?: boolean
    plan_image?: boolean
    plan_is_popular?: boolean
    plan_sort_order?: boolean
    plan_status?: boolean
    plan_created_at?: boolean
    plan_created_by?: boolean
    plan_updated_at?: boolean
    plan_updated_by?: boolean
    plan_deleted_at?: boolean
    plan_deleted_by?: boolean
    plan_is_deleted?: boolean
  }, ExtArgs["result"]["plan"]>

  export type PlanSelectScalar = {
    plan_id?: boolean
    plan_uuid?: boolean
    plan_name?: boolean
    plan_code?: boolean
    plan_description?: boolean
    plan_price?: boolean
    plan_offer_price?: boolean
    plan_currency?: boolean
    plan_billing_cycle?: boolean
    plan_duration_days?: boolean
    plan_max_firms?: boolean
    plan_max_staff?: boolean
    plan_modules?: boolean
    plan_features?: boolean
    plan_image?: boolean
    plan_is_popular?: boolean
    plan_sort_order?: boolean
    plan_status?: boolean
    plan_created_at?: boolean
    plan_created_by?: boolean
    plan_updated_at?: boolean
    plan_updated_by?: boolean
    plan_deleted_at?: boolean
    plan_deleted_by?: boolean
    plan_is_deleted?: boolean
  }

  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owners?: boolean | Plan$ownersArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      owners: Prisma.$OwnerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      plan_id: number
      plan_uuid: string
      plan_name: string
      plan_code: string
      plan_description: string | null
      plan_price: Prisma.Decimal
      plan_offer_price: Prisma.Decimal | null
      plan_currency: string
      plan_billing_cycle: $Enums.PlanBillingCycle
      plan_duration_days: number | null
      plan_max_firms: number
      plan_max_staff: number
      plan_modules: Prisma.JsonValue
      plan_features: Prisma.JsonValue | null
      plan_image: Prisma.JsonValue | null
      plan_is_popular: boolean
      plan_sort_order: number
      plan_status: $Enums.PlanStatus
      plan_created_at: Date
      plan_created_by: string | null
      plan_updated_at: Date
      plan_updated_by: string | null
      plan_deleted_at: Date | null
      plan_deleted_by: string | null
      plan_is_deleted: boolean
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `plan_id`
     * const planWithPlan_idOnly = await prisma.plan.findMany({ select: { plan_id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Plans and returns the data saved in the database.
     * @param {PlanCreateManyAndReturnArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Plans and only return the `plan_id`
     * const planWithPlan_idOnly = await prisma.plan.createManyAndReturn({ 
     *   select: { plan_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlanCreateManyAndReturnArgs>(args?: SelectSubset<T, PlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
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
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owners<T extends Plan$ownersArgs<ExtArgs> = {}>(args?: Subset<T, Plan$ownersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPayload<ExtArgs>, T, "findMany"> | Null>
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
   * Fields of the Plan model
   */ 
  interface PlanFieldRefs {
    readonly plan_id: FieldRef<"Plan", 'Int'>
    readonly plan_uuid: FieldRef<"Plan", 'String'>
    readonly plan_name: FieldRef<"Plan", 'String'>
    readonly plan_code: FieldRef<"Plan", 'String'>
    readonly plan_description: FieldRef<"Plan", 'String'>
    readonly plan_price: FieldRef<"Plan", 'Decimal'>
    readonly plan_offer_price: FieldRef<"Plan", 'Decimal'>
    readonly plan_currency: FieldRef<"Plan", 'String'>
    readonly plan_billing_cycle: FieldRef<"Plan", 'PlanBillingCycle'>
    readonly plan_duration_days: FieldRef<"Plan", 'Int'>
    readonly plan_max_firms: FieldRef<"Plan", 'Int'>
    readonly plan_max_staff: FieldRef<"Plan", 'Int'>
    readonly plan_modules: FieldRef<"Plan", 'Json'>
    readonly plan_features: FieldRef<"Plan", 'Json'>
    readonly plan_image: FieldRef<"Plan", 'Json'>
    readonly plan_is_popular: FieldRef<"Plan", 'Boolean'>
    readonly plan_sort_order: FieldRef<"Plan", 'Int'>
    readonly plan_status: FieldRef<"Plan", 'PlanStatus'>
    readonly plan_created_at: FieldRef<"Plan", 'DateTime'>
    readonly plan_created_by: FieldRef<"Plan", 'String'>
    readonly plan_updated_at: FieldRef<"Plan", 'DateTime'>
    readonly plan_updated_by: FieldRef<"Plan", 'String'>
    readonly plan_deleted_at: FieldRef<"Plan", 'DateTime'>
    readonly plan_deleted_by: FieldRef<"Plan", 'String'>
    readonly plan_is_deleted: FieldRef<"Plan", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan createManyAndReturn
   */
  export type PlanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
  }

  /**
   * Plan.owners
   */
  export type Plan$ownersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Owner
     */
    select?: OwnerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerInclude<ExtArgs> | null
    where?: OwnerWhereInput
    orderBy?: OwnerOrderByWithRelationInput | OwnerOrderByWithRelationInput[]
    cursor?: OwnerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OwnerScalarFieldEnum | OwnerScalarFieldEnum[]
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model Announcement
   */

  export type AggregateAnnouncement = {
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  export type AnnouncementAvgAggregateOutputType = {
    ann_id: number | null
    ann_sort_order: number | null
  }

  export type AnnouncementSumAggregateOutputType = {
    ann_id: number | null
    ann_sort_order: number | null
  }

  export type AnnouncementMinAggregateOutputType = {
    ann_id: number | null
    ann_uuid: string | null
    ann_title: string | null
    ann_body: string | null
    ann_type: $Enums.AnnouncementType | null
    ann_status: $Enums.AnnouncementStatus | null
    ann_is_pinned: boolean | null
    ann_sort_order: number | null
    ann_publish_at: Date | null
    ann_expires_at: Date | null
    ann_created_at: Date | null
    ann_created_by: string | null
    ann_updated_at: Date | null
    ann_updated_by: string | null
    ann_deleted_at: Date | null
    ann_deleted_by: string | null
    ann_is_deleted: boolean | null
  }

  export type AnnouncementMaxAggregateOutputType = {
    ann_id: number | null
    ann_uuid: string | null
    ann_title: string | null
    ann_body: string | null
    ann_type: $Enums.AnnouncementType | null
    ann_status: $Enums.AnnouncementStatus | null
    ann_is_pinned: boolean | null
    ann_sort_order: number | null
    ann_publish_at: Date | null
    ann_expires_at: Date | null
    ann_created_at: Date | null
    ann_created_by: string | null
    ann_updated_at: Date | null
    ann_updated_by: string | null
    ann_deleted_at: Date | null
    ann_deleted_by: string | null
    ann_is_deleted: boolean | null
  }

  export type AnnouncementCountAggregateOutputType = {
    ann_id: number
    ann_uuid: number
    ann_title: number
    ann_body: number
    ann_type: number
    ann_status: number
    ann_is_pinned: number
    ann_sort_order: number
    ann_publish_at: number
    ann_expires_at: number
    ann_created_at: number
    ann_created_by: number
    ann_updated_at: number
    ann_updated_by: number
    ann_deleted_at: number
    ann_deleted_by: number
    ann_is_deleted: number
    _all: number
  }


  export type AnnouncementAvgAggregateInputType = {
    ann_id?: true
    ann_sort_order?: true
  }

  export type AnnouncementSumAggregateInputType = {
    ann_id?: true
    ann_sort_order?: true
  }

  export type AnnouncementMinAggregateInputType = {
    ann_id?: true
    ann_uuid?: true
    ann_title?: true
    ann_body?: true
    ann_type?: true
    ann_status?: true
    ann_is_pinned?: true
    ann_sort_order?: true
    ann_publish_at?: true
    ann_expires_at?: true
    ann_created_at?: true
    ann_created_by?: true
    ann_updated_at?: true
    ann_updated_by?: true
    ann_deleted_at?: true
    ann_deleted_by?: true
    ann_is_deleted?: true
  }

  export type AnnouncementMaxAggregateInputType = {
    ann_id?: true
    ann_uuid?: true
    ann_title?: true
    ann_body?: true
    ann_type?: true
    ann_status?: true
    ann_is_pinned?: true
    ann_sort_order?: true
    ann_publish_at?: true
    ann_expires_at?: true
    ann_created_at?: true
    ann_created_by?: true
    ann_updated_at?: true
    ann_updated_by?: true
    ann_deleted_at?: true
    ann_deleted_by?: true
    ann_is_deleted?: true
  }

  export type AnnouncementCountAggregateInputType = {
    ann_id?: true
    ann_uuid?: true
    ann_title?: true
    ann_body?: true
    ann_type?: true
    ann_status?: true
    ann_is_pinned?: true
    ann_sort_order?: true
    ann_publish_at?: true
    ann_expires_at?: true
    ann_created_at?: true
    ann_created_by?: true
    ann_updated_at?: true
    ann_updated_by?: true
    ann_deleted_at?: true
    ann_deleted_by?: true
    ann_is_deleted?: true
    _all?: true
  }

  export type AnnouncementAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcement to aggregate.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Announcements
    **/
    _count?: true | AnnouncementCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AnnouncementAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AnnouncementSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AnnouncementMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AnnouncementMaxAggregateInputType
  }

  export type GetAnnouncementAggregateType<T extends AnnouncementAggregateArgs> = {
        [P in keyof T & keyof AggregateAnnouncement]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAnnouncement[P]>
      : GetScalarType<T[P], AggregateAnnouncement[P]>
  }




  export type AnnouncementGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AnnouncementWhereInput
    orderBy?: AnnouncementOrderByWithAggregationInput | AnnouncementOrderByWithAggregationInput[]
    by: AnnouncementScalarFieldEnum[] | AnnouncementScalarFieldEnum
    having?: AnnouncementScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AnnouncementCountAggregateInputType | true
    _avg?: AnnouncementAvgAggregateInputType
    _sum?: AnnouncementSumAggregateInputType
    _min?: AnnouncementMinAggregateInputType
    _max?: AnnouncementMaxAggregateInputType
  }

  export type AnnouncementGroupByOutputType = {
    ann_id: number
    ann_uuid: string
    ann_title: string
    ann_body: string
    ann_type: $Enums.AnnouncementType
    ann_status: $Enums.AnnouncementStatus
    ann_is_pinned: boolean
    ann_sort_order: number
    ann_publish_at: Date
    ann_expires_at: Date | null
    ann_created_at: Date
    ann_created_by: string | null
    ann_updated_at: Date
    ann_updated_by: string | null
    ann_deleted_at: Date | null
    ann_deleted_by: string | null
    ann_is_deleted: boolean
    _count: AnnouncementCountAggregateOutputType | null
    _avg: AnnouncementAvgAggregateOutputType | null
    _sum: AnnouncementSumAggregateOutputType | null
    _min: AnnouncementMinAggregateOutputType | null
    _max: AnnouncementMaxAggregateOutputType | null
  }

  type GetAnnouncementGroupByPayload<T extends AnnouncementGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AnnouncementGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AnnouncementGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
            : GetScalarType<T[P], AnnouncementGroupByOutputType[P]>
        }
      >
    >


  export type AnnouncementSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ann_id?: boolean
    ann_uuid?: boolean
    ann_title?: boolean
    ann_body?: boolean
    ann_type?: boolean
    ann_status?: boolean
    ann_is_pinned?: boolean
    ann_sort_order?: boolean
    ann_publish_at?: boolean
    ann_expires_at?: boolean
    ann_created_at?: boolean
    ann_created_by?: boolean
    ann_updated_at?: boolean
    ann_updated_by?: boolean
    ann_deleted_at?: boolean
    ann_deleted_by?: boolean
    ann_is_deleted?: boolean
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    ann_id?: boolean
    ann_uuid?: boolean
    ann_title?: boolean
    ann_body?: boolean
    ann_type?: boolean
    ann_status?: boolean
    ann_is_pinned?: boolean
    ann_sort_order?: boolean
    ann_publish_at?: boolean
    ann_expires_at?: boolean
    ann_created_at?: boolean
    ann_created_by?: boolean
    ann_updated_at?: boolean
    ann_updated_by?: boolean
    ann_deleted_at?: boolean
    ann_deleted_by?: boolean
    ann_is_deleted?: boolean
  }, ExtArgs["result"]["announcement"]>

  export type AnnouncementSelectScalar = {
    ann_id?: boolean
    ann_uuid?: boolean
    ann_title?: boolean
    ann_body?: boolean
    ann_type?: boolean
    ann_status?: boolean
    ann_is_pinned?: boolean
    ann_sort_order?: boolean
    ann_publish_at?: boolean
    ann_expires_at?: boolean
    ann_created_at?: boolean
    ann_created_by?: boolean
    ann_updated_at?: boolean
    ann_updated_by?: boolean
    ann_deleted_at?: boolean
    ann_deleted_by?: boolean
    ann_is_deleted?: boolean
  }


  export type $AnnouncementPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Announcement"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      ann_id: number
      ann_uuid: string
      ann_title: string
      ann_body: string
      ann_type: $Enums.AnnouncementType
      ann_status: $Enums.AnnouncementStatus
      ann_is_pinned: boolean
      ann_sort_order: number
      ann_publish_at: Date
      ann_expires_at: Date | null
      ann_created_at: Date
      ann_created_by: string | null
      ann_updated_at: Date
      ann_updated_by: string | null
      ann_deleted_at: Date | null
      ann_deleted_by: string | null
      ann_is_deleted: boolean
    }, ExtArgs["result"]["announcement"]>
    composites: {}
  }

  type AnnouncementGetPayload<S extends boolean | null | undefined | AnnouncementDefaultArgs> = $Result.GetResult<Prisma.$AnnouncementPayload, S>

  type AnnouncementCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AnnouncementFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AnnouncementCountAggregateInputType | true
    }

  export interface AnnouncementDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Announcement'], meta: { name: 'Announcement' } }
    /**
     * Find zero or one Announcement that matches the filter.
     * @param {AnnouncementFindUniqueArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AnnouncementFindUniqueArgs>(args: SelectSubset<T, AnnouncementFindUniqueArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Announcement that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AnnouncementFindUniqueOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AnnouncementFindUniqueOrThrowArgs>(args: SelectSubset<T, AnnouncementFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Announcement that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AnnouncementFindFirstArgs>(args?: SelectSubset<T, AnnouncementFindFirstArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Announcement that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindFirstOrThrowArgs} args - Arguments to find a Announcement
     * @example
     * // Get one Announcement
     * const announcement = await prisma.announcement.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AnnouncementFindFirstOrThrowArgs>(args?: SelectSubset<T, AnnouncementFindFirstOrThrowArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Announcements that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Announcements
     * const announcements = await prisma.announcement.findMany()
     * 
     * // Get first 10 Announcements
     * const announcements = await prisma.announcement.findMany({ take: 10 })
     * 
     * // Only select the `ann_id`
     * const announcementWithAnn_idOnly = await prisma.announcement.findMany({ select: { ann_id: true } })
     * 
     */
    findMany<T extends AnnouncementFindManyArgs>(args?: SelectSubset<T, AnnouncementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Announcement.
     * @param {AnnouncementCreateArgs} args - Arguments to create a Announcement.
     * @example
     * // Create one Announcement
     * const Announcement = await prisma.announcement.create({
     *   data: {
     *     // ... data to create a Announcement
     *   }
     * })
     * 
     */
    create<T extends AnnouncementCreateArgs>(args: SelectSubset<T, AnnouncementCreateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Announcements.
     * @param {AnnouncementCreateManyArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AnnouncementCreateManyArgs>(args?: SelectSubset<T, AnnouncementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Announcements and returns the data saved in the database.
     * @param {AnnouncementCreateManyAndReturnArgs} args - Arguments to create many Announcements.
     * @example
     * // Create many Announcements
     * const announcement = await prisma.announcement.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Announcements and only return the `ann_id`
     * const announcementWithAnn_idOnly = await prisma.announcement.createManyAndReturn({ 
     *   select: { ann_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AnnouncementCreateManyAndReturnArgs>(args?: SelectSubset<T, AnnouncementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Announcement.
     * @param {AnnouncementDeleteArgs} args - Arguments to delete one Announcement.
     * @example
     * // Delete one Announcement
     * const Announcement = await prisma.announcement.delete({
     *   where: {
     *     // ... filter to delete one Announcement
     *   }
     * })
     * 
     */
    delete<T extends AnnouncementDeleteArgs>(args: SelectSubset<T, AnnouncementDeleteArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Announcement.
     * @param {AnnouncementUpdateArgs} args - Arguments to update one Announcement.
     * @example
     * // Update one Announcement
     * const announcement = await prisma.announcement.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AnnouncementUpdateArgs>(args: SelectSubset<T, AnnouncementUpdateArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Announcements.
     * @param {AnnouncementDeleteManyArgs} args - Arguments to filter Announcements to delete.
     * @example
     * // Delete a few Announcements
     * const { count } = await prisma.announcement.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AnnouncementDeleteManyArgs>(args?: SelectSubset<T, AnnouncementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Announcements
     * const announcement = await prisma.announcement.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AnnouncementUpdateManyArgs>(args: SelectSubset<T, AnnouncementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Announcement.
     * @param {AnnouncementUpsertArgs} args - Arguments to update or create a Announcement.
     * @example
     * // Update or create a Announcement
     * const announcement = await prisma.announcement.upsert({
     *   create: {
     *     // ... data to create a Announcement
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Announcement we want to update
     *   }
     * })
     */
    upsert<T extends AnnouncementUpsertArgs>(args: SelectSubset<T, AnnouncementUpsertArgs<ExtArgs>>): Prisma__AnnouncementClient<$Result.GetResult<Prisma.$AnnouncementPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Announcements.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementCountArgs} args - Arguments to filter Announcements to count.
     * @example
     * // Count the number of Announcements
     * const count = await prisma.announcement.count({
     *   where: {
     *     // ... the filter for the Announcements we want to count
     *   }
     * })
    **/
    count<T extends AnnouncementCountArgs>(
      args?: Subset<T, AnnouncementCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AnnouncementCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AnnouncementAggregateArgs>(args: Subset<T, AnnouncementAggregateArgs>): Prisma.PrismaPromise<GetAnnouncementAggregateType<T>>

    /**
     * Group by Announcement.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AnnouncementGroupByArgs} args - Group by arguments.
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
      T extends AnnouncementGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AnnouncementGroupByArgs['orderBy'] }
        : { orderBy?: AnnouncementGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AnnouncementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnouncementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Announcement model
   */
  readonly fields: AnnouncementFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Announcement.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AnnouncementClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Announcement model
   */ 
  interface AnnouncementFieldRefs {
    readonly ann_id: FieldRef<"Announcement", 'Int'>
    readonly ann_uuid: FieldRef<"Announcement", 'String'>
    readonly ann_title: FieldRef<"Announcement", 'String'>
    readonly ann_body: FieldRef<"Announcement", 'String'>
    readonly ann_type: FieldRef<"Announcement", 'AnnouncementType'>
    readonly ann_status: FieldRef<"Announcement", 'AnnouncementStatus'>
    readonly ann_is_pinned: FieldRef<"Announcement", 'Boolean'>
    readonly ann_sort_order: FieldRef<"Announcement", 'Int'>
    readonly ann_publish_at: FieldRef<"Announcement", 'DateTime'>
    readonly ann_expires_at: FieldRef<"Announcement", 'DateTime'>
    readonly ann_created_at: FieldRef<"Announcement", 'DateTime'>
    readonly ann_created_by: FieldRef<"Announcement", 'String'>
    readonly ann_updated_at: FieldRef<"Announcement", 'DateTime'>
    readonly ann_updated_by: FieldRef<"Announcement", 'String'>
    readonly ann_deleted_at: FieldRef<"Announcement", 'DateTime'>
    readonly ann_deleted_by: FieldRef<"Announcement", 'String'>
    readonly ann_is_deleted: FieldRef<"Announcement", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Announcement findUnique
   */
  export type AnnouncementFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findUniqueOrThrow
   */
  export type AnnouncementFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement findFirst
   */
  export type AnnouncementFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findFirstOrThrow
   */
  export type AnnouncementFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcement to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Announcements.
     */
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement findMany
   */
  export type AnnouncementFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter, which Announcements to fetch.
     */
    where?: AnnouncementWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Announcements to fetch.
     */
    orderBy?: AnnouncementOrderByWithRelationInput | AnnouncementOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Announcements.
     */
    cursor?: AnnouncementWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Announcements from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Announcements.
     */
    skip?: number
    distinct?: AnnouncementScalarFieldEnum | AnnouncementScalarFieldEnum[]
  }

  /**
   * Announcement create
   */
  export type AnnouncementCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The data needed to create a Announcement.
     */
    data: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
  }

  /**
   * Announcement createMany
   */
  export type AnnouncementCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Announcement createManyAndReturn
   */
  export type AnnouncementCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Announcements.
     */
    data: AnnouncementCreateManyInput | AnnouncementCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Announcement update
   */
  export type AnnouncementUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The data needed to update a Announcement.
     */
    data: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
    /**
     * Choose, which Announcement to update.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement updateMany
   */
  export type AnnouncementUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Announcements.
     */
    data: XOR<AnnouncementUpdateManyMutationInput, AnnouncementUncheckedUpdateManyInput>
    /**
     * Filter which Announcements to update
     */
    where?: AnnouncementWhereInput
  }

  /**
   * Announcement upsert
   */
  export type AnnouncementUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * The filter to search for the Announcement to update in case it exists.
     */
    where: AnnouncementWhereUniqueInput
    /**
     * In case the Announcement found by the `where` argument doesn't exist, create a new Announcement with this data.
     */
    create: XOR<AnnouncementCreateInput, AnnouncementUncheckedCreateInput>
    /**
     * In case the Announcement was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AnnouncementUpdateInput, AnnouncementUncheckedUpdateInput>
  }

  /**
   * Announcement delete
   */
  export type AnnouncementDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
    /**
     * Filter which Announcement to delete.
     */
    where: AnnouncementWhereUniqueInput
  }

  /**
   * Announcement deleteMany
   */
  export type AnnouncementDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Announcements to delete
     */
    where?: AnnouncementWhereInput
  }

  /**
   * Announcement without action
   */
  export type AnnouncementDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Announcement
     */
    select?: AnnouncementSelect<ExtArgs> | null
  }


  /**
   * Model OwnerPermission
   */

  export type AggregateOwnerPermission = {
    _count: OwnerPermissionCountAggregateOutputType | null
    _avg: OwnerPermissionAvgAggregateOutputType | null
    _sum: OwnerPermissionSumAggregateOutputType | null
    _min: OwnerPermissionMinAggregateOutputType | null
    _max: OwnerPermissionMaxAggregateOutputType | null
  }

  export type OwnerPermissionAvgAggregateOutputType = {
    op_id: number | null
    op_own_id: number | null
  }

  export type OwnerPermissionSumAggregateOutputType = {
    op_id: number | null
    op_own_id: number | null
  }

  export type OwnerPermissionMinAggregateOutputType = {
    op_id: number | null
    op_own_id: number | null
    op_perm_key: string | null
    op_granted: boolean | null
    op_created_at: Date | null
    op_updated_at: Date | null
  }

  export type OwnerPermissionMaxAggregateOutputType = {
    op_id: number | null
    op_own_id: number | null
    op_perm_key: string | null
    op_granted: boolean | null
    op_created_at: Date | null
    op_updated_at: Date | null
  }

  export type OwnerPermissionCountAggregateOutputType = {
    op_id: number
    op_own_id: number
    op_perm_key: number
    op_granted: number
    op_created_at: number
    op_updated_at: number
    _all: number
  }


  export type OwnerPermissionAvgAggregateInputType = {
    op_id?: true
    op_own_id?: true
  }

  export type OwnerPermissionSumAggregateInputType = {
    op_id?: true
    op_own_id?: true
  }

  export type OwnerPermissionMinAggregateInputType = {
    op_id?: true
    op_own_id?: true
    op_perm_key?: true
    op_granted?: true
    op_created_at?: true
    op_updated_at?: true
  }

  export type OwnerPermissionMaxAggregateInputType = {
    op_id?: true
    op_own_id?: true
    op_perm_key?: true
    op_granted?: true
    op_created_at?: true
    op_updated_at?: true
  }

  export type OwnerPermissionCountAggregateInputType = {
    op_id?: true
    op_own_id?: true
    op_perm_key?: true
    op_granted?: true
    op_created_at?: true
    op_updated_at?: true
    _all?: true
  }

  export type OwnerPermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OwnerPermission to aggregate.
     */
    where?: OwnerPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnerPermissions to fetch.
     */
    orderBy?: OwnerPermissionOrderByWithRelationInput | OwnerPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OwnerPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnerPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnerPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OwnerPermissions
    **/
    _count?: true | OwnerPermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OwnerPermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OwnerPermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OwnerPermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OwnerPermissionMaxAggregateInputType
  }

  export type GetOwnerPermissionAggregateType<T extends OwnerPermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateOwnerPermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOwnerPermission[P]>
      : GetScalarType<T[P], AggregateOwnerPermission[P]>
  }




  export type OwnerPermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OwnerPermissionWhereInput
    orderBy?: OwnerPermissionOrderByWithAggregationInput | OwnerPermissionOrderByWithAggregationInput[]
    by: OwnerPermissionScalarFieldEnum[] | OwnerPermissionScalarFieldEnum
    having?: OwnerPermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OwnerPermissionCountAggregateInputType | true
    _avg?: OwnerPermissionAvgAggregateInputType
    _sum?: OwnerPermissionSumAggregateInputType
    _min?: OwnerPermissionMinAggregateInputType
    _max?: OwnerPermissionMaxAggregateInputType
  }

  export type OwnerPermissionGroupByOutputType = {
    op_id: number
    op_own_id: number
    op_perm_key: string
    op_granted: boolean
    op_created_at: Date
    op_updated_at: Date
    _count: OwnerPermissionCountAggregateOutputType | null
    _avg: OwnerPermissionAvgAggregateOutputType | null
    _sum: OwnerPermissionSumAggregateOutputType | null
    _min: OwnerPermissionMinAggregateOutputType | null
    _max: OwnerPermissionMaxAggregateOutputType | null
  }

  type GetOwnerPermissionGroupByPayload<T extends OwnerPermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OwnerPermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OwnerPermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OwnerPermissionGroupByOutputType[P]>
            : GetScalarType<T[P], OwnerPermissionGroupByOutputType[P]>
        }
      >
    >


  export type OwnerPermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    op_id?: boolean
    op_own_id?: boolean
    op_perm_key?: boolean
    op_granted?: boolean
    op_created_at?: boolean
    op_updated_at?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ownerPermission"]>

  export type OwnerPermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    op_id?: boolean
    op_own_id?: boolean
    op_perm_key?: boolean
    op_granted?: boolean
    op_created_at?: boolean
    op_updated_at?: boolean
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ownerPermission"]>

  export type OwnerPermissionSelectScalar = {
    op_id?: boolean
    op_own_id?: boolean
    op_perm_key?: boolean
    op_granted?: boolean
    op_created_at?: boolean
    op_updated_at?: boolean
  }

  export type OwnerPermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }
  export type OwnerPermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | OwnerDefaultArgs<ExtArgs>
  }

  export type $OwnerPermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OwnerPermission"
    objects: {
      owner: Prisma.$OwnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      op_id: number
      op_own_id: number
      op_perm_key: string
      op_granted: boolean
      op_created_at: Date
      op_updated_at: Date
    }, ExtArgs["result"]["ownerPermission"]>
    composites: {}
  }

  type OwnerPermissionGetPayload<S extends boolean | null | undefined | OwnerPermissionDefaultArgs> = $Result.GetResult<Prisma.$OwnerPermissionPayload, S>

  type OwnerPermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OwnerPermissionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OwnerPermissionCountAggregateInputType | true
    }

  export interface OwnerPermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OwnerPermission'], meta: { name: 'OwnerPermission' } }
    /**
     * Find zero or one OwnerPermission that matches the filter.
     * @param {OwnerPermissionFindUniqueArgs} args - Arguments to find a OwnerPermission
     * @example
     * // Get one OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OwnerPermissionFindUniqueArgs>(args: SelectSubset<T, OwnerPermissionFindUniqueArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one OwnerPermission that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OwnerPermissionFindUniqueOrThrowArgs} args - Arguments to find a OwnerPermission
     * @example
     * // Get one OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OwnerPermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, OwnerPermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first OwnerPermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionFindFirstArgs} args - Arguments to find a OwnerPermission
     * @example
     * // Get one OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OwnerPermissionFindFirstArgs>(args?: SelectSubset<T, OwnerPermissionFindFirstArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first OwnerPermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionFindFirstOrThrowArgs} args - Arguments to find a OwnerPermission
     * @example
     * // Get one OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OwnerPermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, OwnerPermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more OwnerPermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OwnerPermissions
     * const ownerPermissions = await prisma.ownerPermission.findMany()
     * 
     * // Get first 10 OwnerPermissions
     * const ownerPermissions = await prisma.ownerPermission.findMany({ take: 10 })
     * 
     * // Only select the `op_id`
     * const ownerPermissionWithOp_idOnly = await prisma.ownerPermission.findMany({ select: { op_id: true } })
     * 
     */
    findMany<T extends OwnerPermissionFindManyArgs>(args?: SelectSubset<T, OwnerPermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a OwnerPermission.
     * @param {OwnerPermissionCreateArgs} args - Arguments to create a OwnerPermission.
     * @example
     * // Create one OwnerPermission
     * const OwnerPermission = await prisma.ownerPermission.create({
     *   data: {
     *     // ... data to create a OwnerPermission
     *   }
     * })
     * 
     */
    create<T extends OwnerPermissionCreateArgs>(args: SelectSubset<T, OwnerPermissionCreateArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many OwnerPermissions.
     * @param {OwnerPermissionCreateManyArgs} args - Arguments to create many OwnerPermissions.
     * @example
     * // Create many OwnerPermissions
     * const ownerPermission = await prisma.ownerPermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OwnerPermissionCreateManyArgs>(args?: SelectSubset<T, OwnerPermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OwnerPermissions and returns the data saved in the database.
     * @param {OwnerPermissionCreateManyAndReturnArgs} args - Arguments to create many OwnerPermissions.
     * @example
     * // Create many OwnerPermissions
     * const ownerPermission = await prisma.ownerPermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OwnerPermissions and only return the `op_id`
     * const ownerPermissionWithOp_idOnly = await prisma.ownerPermission.createManyAndReturn({ 
     *   select: { op_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OwnerPermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, OwnerPermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a OwnerPermission.
     * @param {OwnerPermissionDeleteArgs} args - Arguments to delete one OwnerPermission.
     * @example
     * // Delete one OwnerPermission
     * const OwnerPermission = await prisma.ownerPermission.delete({
     *   where: {
     *     // ... filter to delete one OwnerPermission
     *   }
     * })
     * 
     */
    delete<T extends OwnerPermissionDeleteArgs>(args: SelectSubset<T, OwnerPermissionDeleteArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one OwnerPermission.
     * @param {OwnerPermissionUpdateArgs} args - Arguments to update one OwnerPermission.
     * @example
     * // Update one OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OwnerPermissionUpdateArgs>(args: SelectSubset<T, OwnerPermissionUpdateArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more OwnerPermissions.
     * @param {OwnerPermissionDeleteManyArgs} args - Arguments to filter OwnerPermissions to delete.
     * @example
     * // Delete a few OwnerPermissions
     * const { count } = await prisma.ownerPermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OwnerPermissionDeleteManyArgs>(args?: SelectSubset<T, OwnerPermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OwnerPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OwnerPermissions
     * const ownerPermission = await prisma.ownerPermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OwnerPermissionUpdateManyArgs>(args: SelectSubset<T, OwnerPermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OwnerPermission.
     * @param {OwnerPermissionUpsertArgs} args - Arguments to update or create a OwnerPermission.
     * @example
     * // Update or create a OwnerPermission
     * const ownerPermission = await prisma.ownerPermission.upsert({
     *   create: {
     *     // ... data to create a OwnerPermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OwnerPermission we want to update
     *   }
     * })
     */
    upsert<T extends OwnerPermissionUpsertArgs>(args: SelectSubset<T, OwnerPermissionUpsertArgs<ExtArgs>>): Prisma__OwnerPermissionClient<$Result.GetResult<Prisma.$OwnerPermissionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of OwnerPermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionCountArgs} args - Arguments to filter OwnerPermissions to count.
     * @example
     * // Count the number of OwnerPermissions
     * const count = await prisma.ownerPermission.count({
     *   where: {
     *     // ... the filter for the OwnerPermissions we want to count
     *   }
     * })
    **/
    count<T extends OwnerPermissionCountArgs>(
      args?: Subset<T, OwnerPermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OwnerPermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OwnerPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OwnerPermissionAggregateArgs>(args: Subset<T, OwnerPermissionAggregateArgs>): Prisma.PrismaPromise<GetOwnerPermissionAggregateType<T>>

    /**
     * Group by OwnerPermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OwnerPermissionGroupByArgs} args - Group by arguments.
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
      T extends OwnerPermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OwnerPermissionGroupByArgs['orderBy'] }
        : { orderBy?: OwnerPermissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OwnerPermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOwnerPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OwnerPermission model
   */
  readonly fields: OwnerPermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OwnerPermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OwnerPermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the OwnerPermission model
   */ 
  interface OwnerPermissionFieldRefs {
    readonly op_id: FieldRef<"OwnerPermission", 'Int'>
    readonly op_own_id: FieldRef<"OwnerPermission", 'Int'>
    readonly op_perm_key: FieldRef<"OwnerPermission", 'String'>
    readonly op_granted: FieldRef<"OwnerPermission", 'Boolean'>
    readonly op_created_at: FieldRef<"OwnerPermission", 'DateTime'>
    readonly op_updated_at: FieldRef<"OwnerPermission", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OwnerPermission findUnique
   */
  export type OwnerPermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter, which OwnerPermission to fetch.
     */
    where: OwnerPermissionWhereUniqueInput
  }

  /**
   * OwnerPermission findUniqueOrThrow
   */
  export type OwnerPermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter, which OwnerPermission to fetch.
     */
    where: OwnerPermissionWhereUniqueInput
  }

  /**
   * OwnerPermission findFirst
   */
  export type OwnerPermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter, which OwnerPermission to fetch.
     */
    where?: OwnerPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnerPermissions to fetch.
     */
    orderBy?: OwnerPermissionOrderByWithRelationInput | OwnerPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OwnerPermissions.
     */
    cursor?: OwnerPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnerPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnerPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OwnerPermissions.
     */
    distinct?: OwnerPermissionScalarFieldEnum | OwnerPermissionScalarFieldEnum[]
  }

  /**
   * OwnerPermission findFirstOrThrow
   */
  export type OwnerPermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter, which OwnerPermission to fetch.
     */
    where?: OwnerPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnerPermissions to fetch.
     */
    orderBy?: OwnerPermissionOrderByWithRelationInput | OwnerPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OwnerPermissions.
     */
    cursor?: OwnerPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnerPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnerPermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OwnerPermissions.
     */
    distinct?: OwnerPermissionScalarFieldEnum | OwnerPermissionScalarFieldEnum[]
  }

  /**
   * OwnerPermission findMany
   */
  export type OwnerPermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter, which OwnerPermissions to fetch.
     */
    where?: OwnerPermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OwnerPermissions to fetch.
     */
    orderBy?: OwnerPermissionOrderByWithRelationInput | OwnerPermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OwnerPermissions.
     */
    cursor?: OwnerPermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OwnerPermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OwnerPermissions.
     */
    skip?: number
    distinct?: OwnerPermissionScalarFieldEnum | OwnerPermissionScalarFieldEnum[]
  }

  /**
   * OwnerPermission create
   */
  export type OwnerPermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a OwnerPermission.
     */
    data: XOR<OwnerPermissionCreateInput, OwnerPermissionUncheckedCreateInput>
  }

  /**
   * OwnerPermission createMany
   */
  export type OwnerPermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OwnerPermissions.
     */
    data: OwnerPermissionCreateManyInput | OwnerPermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OwnerPermission createManyAndReturn
   */
  export type OwnerPermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many OwnerPermissions.
     */
    data: OwnerPermissionCreateManyInput | OwnerPermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OwnerPermission update
   */
  export type OwnerPermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a OwnerPermission.
     */
    data: XOR<OwnerPermissionUpdateInput, OwnerPermissionUncheckedUpdateInput>
    /**
     * Choose, which OwnerPermission to update.
     */
    where: OwnerPermissionWhereUniqueInput
  }

  /**
   * OwnerPermission updateMany
   */
  export type OwnerPermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OwnerPermissions.
     */
    data: XOR<OwnerPermissionUpdateManyMutationInput, OwnerPermissionUncheckedUpdateManyInput>
    /**
     * Filter which OwnerPermissions to update
     */
    where?: OwnerPermissionWhereInput
  }

  /**
   * OwnerPermission upsert
   */
  export type OwnerPermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the OwnerPermission to update in case it exists.
     */
    where: OwnerPermissionWhereUniqueInput
    /**
     * In case the OwnerPermission found by the `where` argument doesn't exist, create a new OwnerPermission with this data.
     */
    create: XOR<OwnerPermissionCreateInput, OwnerPermissionUncheckedCreateInput>
    /**
     * In case the OwnerPermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OwnerPermissionUpdateInput, OwnerPermissionUncheckedUpdateInput>
  }

  /**
   * OwnerPermission delete
   */
  export type OwnerPermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
    /**
     * Filter which OwnerPermission to delete.
     */
    where: OwnerPermissionWhereUniqueInput
  }

  /**
   * OwnerPermission deleteMany
   */
  export type OwnerPermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OwnerPermissions to delete
     */
    where?: OwnerPermissionWhereInput
  }

  /**
   * OwnerPermission without action
   */
  export type OwnerPermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OwnerPermission
     */
    select?: OwnerPermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OwnerPermissionInclude<ExtArgs> | null
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


  export const AdminScalarFieldEnum: {
    admin_id: 'admin_id',
    admin_uuid: 'admin_uuid',
    admin_add_date: 'admin_add_date',
    admin_first_name: 'admin_first_name',
    admin_middle_name: 'admin_middle_name',
    admin_last_name: 'admin_last_name',
    admin_phone_no: 'admin_phone_no',
    admin_mobile_no: 'admin_mobile_no',
    admin_email: 'admin_email',
    admin_login_id: 'admin_login_id',
    admin_password: 'admin_password',
    admin_company_name: 'admin_company_name',
    admin_refresh_token: 'admin_refresh_token',
    admin_refresh_expiry: 'admin_refresh_expiry',
    admin_jwt_token: 'admin_jwt_token',
    admin_jwt_expiry: 'admin_jwt_expiry',
    admin_login_status: 'admin_login_status',
    admin_last_login_system: 'admin_last_login_system',
    admin_otp: 'admin_otp',
    admin_otp_expiry: 'admin_otp_expiry',
    admin_address: 'admin_address',
    admin_village: 'admin_village',
    admin_city: 'admin_city',
    admin_state: 'admin_state',
    admin_pincode: 'admin_pincode',
    admin_created_at: 'admin_created_at',
    admin_created_by: 'admin_created_by',
    admin_updated_at: 'admin_updated_at',
    admin_updated_by: 'admin_updated_by',
    admin_deleted_at: 'admin_deleted_at',
    admin_deleted_by: 'admin_deleted_by',
    admin_is_deleted: 'admin_is_deleted'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const DbSeriesScalarFieldEnum: {
    id: 'id',
    series_name: 'series_name',
    last_number: 'last_number',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type DbSeriesScalarFieldEnum = (typeof DbSeriesScalarFieldEnum)[keyof typeof DbSeriesScalarFieldEnum]


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
    own_plan_id: 'own_plan_id',
    own_max_firms: 'own_max_firms',
    own_max_staff: 'own_max_staff',
    own_start_date: 'own_start_date',
    own_expiry_date: 'own_expiry_date',
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


  export const PlanScalarFieldEnum: {
    plan_id: 'plan_id',
    plan_uuid: 'plan_uuid',
    plan_name: 'plan_name',
    plan_code: 'plan_code',
    plan_description: 'plan_description',
    plan_price: 'plan_price',
    plan_offer_price: 'plan_offer_price',
    plan_currency: 'plan_currency',
    plan_billing_cycle: 'plan_billing_cycle',
    plan_duration_days: 'plan_duration_days',
    plan_max_firms: 'plan_max_firms',
    plan_max_staff: 'plan_max_staff',
    plan_modules: 'plan_modules',
    plan_features: 'plan_features',
    plan_image: 'plan_image',
    plan_is_popular: 'plan_is_popular',
    plan_sort_order: 'plan_sort_order',
    plan_status: 'plan_status',
    plan_created_at: 'plan_created_at',
    plan_created_by: 'plan_created_by',
    plan_updated_at: 'plan_updated_at',
    plan_updated_by: 'plan_updated_by',
    plan_deleted_at: 'plan_deleted_at',
    plan_deleted_by: 'plan_deleted_by',
    plan_is_deleted: 'plan_is_deleted'
  };

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const AnnouncementScalarFieldEnum: {
    ann_id: 'ann_id',
    ann_uuid: 'ann_uuid',
    ann_title: 'ann_title',
    ann_body: 'ann_body',
    ann_type: 'ann_type',
    ann_status: 'ann_status',
    ann_is_pinned: 'ann_is_pinned',
    ann_sort_order: 'ann_sort_order',
    ann_publish_at: 'ann_publish_at',
    ann_expires_at: 'ann_expires_at',
    ann_created_at: 'ann_created_at',
    ann_created_by: 'ann_created_by',
    ann_updated_at: 'ann_updated_at',
    ann_updated_by: 'ann_updated_by',
    ann_deleted_at: 'ann_deleted_at',
    ann_deleted_by: 'ann_deleted_by',
    ann_is_deleted: 'ann_is_deleted'
  };

  export type AnnouncementScalarFieldEnum = (typeof AnnouncementScalarFieldEnum)[keyof typeof AnnouncementScalarFieldEnum]


  export const OwnerPermissionScalarFieldEnum: {
    op_id: 'op_id',
    op_own_id: 'op_own_id',
    op_perm_key: 'op_perm_key',
    op_granted: 'op_granted',
    op_created_at: 'op_created_at',
    op_updated_at: 'op_updated_at'
  };

  export type OwnerPermissionScalarFieldEnum = (typeof OwnerPermissionScalarFieldEnum)[keyof typeof OwnerPermissionScalarFieldEnum]


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


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'OwnerStatus'
   */
  export type EnumOwnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OwnerStatus'>
    


  /**
   * Reference to a field of type 'OwnerStatus[]'
   */
  export type ListEnumOwnerStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OwnerStatus[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'PlanBillingCycle'
   */
  export type EnumPlanBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanBillingCycle'>
    


  /**
   * Reference to a field of type 'PlanBillingCycle[]'
   */
  export type ListEnumPlanBillingCycleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanBillingCycle[]'>
    


  /**
   * Reference to a field of type 'PlanStatus'
   */
  export type EnumPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanStatus'>
    


  /**
   * Reference to a field of type 'PlanStatus[]'
   */
  export type ListEnumPlanStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanStatus[]'>
    


  /**
   * Reference to a field of type 'AnnouncementType'
   */
  export type EnumAnnouncementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementType'>
    


  /**
   * Reference to a field of type 'AnnouncementType[]'
   */
  export type ListEnumAnnouncementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementType[]'>
    


  /**
   * Reference to a field of type 'AnnouncementStatus'
   */
  export type EnumAnnouncementStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementStatus'>
    


  /**
   * Reference to a field of type 'AnnouncementStatus[]'
   */
  export type ListEnumAnnouncementStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AnnouncementStatus[]'>
    


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


  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    admin_id?: IntFilter<"Admin"> | number
    admin_uuid?: StringFilter<"Admin"> | string
    admin_add_date?: DateTimeFilter<"Admin"> | Date | string
    admin_first_name?: StringFilter<"Admin"> | string
    admin_middle_name?: StringNullableFilter<"Admin"> | string | null
    admin_last_name?: StringFilter<"Admin"> | string
    admin_phone_no?: StringNullableFilter<"Admin"> | string | null
    admin_mobile_no?: StringNullableFilter<"Admin"> | string | null
    admin_email?: StringFilter<"Admin"> | string
    admin_login_id?: StringFilter<"Admin"> | string
    admin_password?: StringFilter<"Admin"> | string
    admin_company_name?: StringNullableFilter<"Admin"> | string | null
    admin_refresh_token?: StringNullableFilter<"Admin"> | string | null
    admin_refresh_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_jwt_token?: StringNullableFilter<"Admin"> | string | null
    admin_jwt_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_login_status?: BoolFilter<"Admin"> | boolean
    admin_last_login_system?: JsonNullableFilter<"Admin">
    admin_otp?: StringNullableFilter<"Admin"> | string | null
    admin_otp_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_address?: StringNullableFilter<"Admin"> | string | null
    admin_village?: StringNullableFilter<"Admin"> | string | null
    admin_city?: StringNullableFilter<"Admin"> | string | null
    admin_state?: StringNullableFilter<"Admin"> | string | null
    admin_pincode?: StringNullableFilter<"Admin"> | string | null
    admin_created_at?: DateTimeFilter<"Admin"> | Date | string
    admin_created_by?: StringNullableFilter<"Admin"> | string | null
    admin_updated_at?: DateTimeFilter<"Admin"> | Date | string
    admin_updated_by?: StringNullableFilter<"Admin"> | string | null
    admin_deleted_at?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_deleted_by?: StringNullableFilter<"Admin"> | string | null
    admin_is_deleted?: BoolFilter<"Admin"> | boolean
  }

  export type AdminOrderByWithRelationInput = {
    admin_id?: SortOrder
    admin_uuid?: SortOrder
    admin_add_date?: SortOrder
    admin_first_name?: SortOrder
    admin_middle_name?: SortOrderInput | SortOrder
    admin_last_name?: SortOrder
    admin_phone_no?: SortOrderInput | SortOrder
    admin_mobile_no?: SortOrderInput | SortOrder
    admin_email?: SortOrder
    admin_login_id?: SortOrder
    admin_password?: SortOrder
    admin_company_name?: SortOrderInput | SortOrder
    admin_refresh_token?: SortOrderInput | SortOrder
    admin_refresh_expiry?: SortOrderInput | SortOrder
    admin_jwt_token?: SortOrderInput | SortOrder
    admin_jwt_expiry?: SortOrderInput | SortOrder
    admin_login_status?: SortOrder
    admin_last_login_system?: SortOrderInput | SortOrder
    admin_otp?: SortOrderInput | SortOrder
    admin_otp_expiry?: SortOrderInput | SortOrder
    admin_address?: SortOrderInput | SortOrder
    admin_village?: SortOrderInput | SortOrder
    admin_city?: SortOrderInput | SortOrder
    admin_state?: SortOrderInput | SortOrder
    admin_pincode?: SortOrderInput | SortOrder
    admin_created_at?: SortOrder
    admin_created_by?: SortOrderInput | SortOrder
    admin_updated_at?: SortOrder
    admin_updated_by?: SortOrderInput | SortOrder
    admin_deleted_at?: SortOrderInput | SortOrder
    admin_deleted_by?: SortOrderInput | SortOrder
    admin_is_deleted?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    admin_id?: number
    admin_uuid?: string
    admin_email?: string
    admin_login_id?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    admin_add_date?: DateTimeFilter<"Admin"> | Date | string
    admin_first_name?: StringFilter<"Admin"> | string
    admin_middle_name?: StringNullableFilter<"Admin"> | string | null
    admin_last_name?: StringFilter<"Admin"> | string
    admin_phone_no?: StringNullableFilter<"Admin"> | string | null
    admin_mobile_no?: StringNullableFilter<"Admin"> | string | null
    admin_password?: StringFilter<"Admin"> | string
    admin_company_name?: StringNullableFilter<"Admin"> | string | null
    admin_refresh_token?: StringNullableFilter<"Admin"> | string | null
    admin_refresh_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_jwt_token?: StringNullableFilter<"Admin"> | string | null
    admin_jwt_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_login_status?: BoolFilter<"Admin"> | boolean
    admin_last_login_system?: JsonNullableFilter<"Admin">
    admin_otp?: StringNullableFilter<"Admin"> | string | null
    admin_otp_expiry?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_address?: StringNullableFilter<"Admin"> | string | null
    admin_village?: StringNullableFilter<"Admin"> | string | null
    admin_city?: StringNullableFilter<"Admin"> | string | null
    admin_state?: StringNullableFilter<"Admin"> | string | null
    admin_pincode?: StringNullableFilter<"Admin"> | string | null
    admin_created_at?: DateTimeFilter<"Admin"> | Date | string
    admin_created_by?: StringNullableFilter<"Admin"> | string | null
    admin_updated_at?: DateTimeFilter<"Admin"> | Date | string
    admin_updated_by?: StringNullableFilter<"Admin"> | string | null
    admin_deleted_at?: DateTimeNullableFilter<"Admin"> | Date | string | null
    admin_deleted_by?: StringNullableFilter<"Admin"> | string | null
    admin_is_deleted?: BoolFilter<"Admin"> | boolean
  }, "admin_id" | "admin_uuid" | "admin_email" | "admin_login_id">

  export type AdminOrderByWithAggregationInput = {
    admin_id?: SortOrder
    admin_uuid?: SortOrder
    admin_add_date?: SortOrder
    admin_first_name?: SortOrder
    admin_middle_name?: SortOrderInput | SortOrder
    admin_last_name?: SortOrder
    admin_phone_no?: SortOrderInput | SortOrder
    admin_mobile_no?: SortOrderInput | SortOrder
    admin_email?: SortOrder
    admin_login_id?: SortOrder
    admin_password?: SortOrder
    admin_company_name?: SortOrderInput | SortOrder
    admin_refresh_token?: SortOrderInput | SortOrder
    admin_refresh_expiry?: SortOrderInput | SortOrder
    admin_jwt_token?: SortOrderInput | SortOrder
    admin_jwt_expiry?: SortOrderInput | SortOrder
    admin_login_status?: SortOrder
    admin_last_login_system?: SortOrderInput | SortOrder
    admin_otp?: SortOrderInput | SortOrder
    admin_otp_expiry?: SortOrderInput | SortOrder
    admin_address?: SortOrderInput | SortOrder
    admin_village?: SortOrderInput | SortOrder
    admin_city?: SortOrderInput | SortOrder
    admin_state?: SortOrderInput | SortOrder
    admin_pincode?: SortOrderInput | SortOrder
    admin_created_at?: SortOrder
    admin_created_by?: SortOrderInput | SortOrder
    admin_updated_at?: SortOrder
    admin_updated_by?: SortOrderInput | SortOrder
    admin_deleted_at?: SortOrderInput | SortOrder
    admin_deleted_by?: SortOrderInput | SortOrder
    admin_is_deleted?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _avg?: AdminAvgOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
    _sum?: AdminSumOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    admin_id?: IntWithAggregatesFilter<"Admin"> | number
    admin_uuid?: StringWithAggregatesFilter<"Admin"> | string
    admin_add_date?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    admin_first_name?: StringWithAggregatesFilter<"Admin"> | string
    admin_middle_name?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_last_name?: StringWithAggregatesFilter<"Admin"> | string
    admin_phone_no?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_mobile_no?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_email?: StringWithAggregatesFilter<"Admin"> | string
    admin_login_id?: StringWithAggregatesFilter<"Admin"> | string
    admin_password?: StringWithAggregatesFilter<"Admin"> | string
    admin_company_name?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_refresh_token?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_refresh_expiry?: DateTimeNullableWithAggregatesFilter<"Admin"> | Date | string | null
    admin_jwt_token?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_jwt_expiry?: DateTimeNullableWithAggregatesFilter<"Admin"> | Date | string | null
    admin_login_status?: BoolWithAggregatesFilter<"Admin"> | boolean
    admin_last_login_system?: JsonNullableWithAggregatesFilter<"Admin">
    admin_otp?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_otp_expiry?: DateTimeNullableWithAggregatesFilter<"Admin"> | Date | string | null
    admin_address?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_village?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_city?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_state?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_pincode?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_created_at?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    admin_created_by?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_updated_at?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    admin_updated_by?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_deleted_at?: DateTimeNullableWithAggregatesFilter<"Admin"> | Date | string | null
    admin_deleted_by?: StringNullableWithAggregatesFilter<"Admin"> | string | null
    admin_is_deleted?: BoolWithAggregatesFilter<"Admin"> | boolean
  }

  export type DbSeriesWhereInput = {
    AND?: DbSeriesWhereInput | DbSeriesWhereInput[]
    OR?: DbSeriesWhereInput[]
    NOT?: DbSeriesWhereInput | DbSeriesWhereInput[]
    id?: IntFilter<"DbSeries"> | number
    series_name?: StringFilter<"DbSeries"> | string
    last_number?: IntFilter<"DbSeries"> | number
    created_at?: DateTimeFilter<"DbSeries"> | Date | string
    updated_at?: DateTimeFilter<"DbSeries"> | Date | string
  }

  export type DbSeriesOrderByWithRelationInput = {
    id?: SortOrder
    series_name?: SortOrder
    last_number?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DbSeriesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    series_name?: string
    AND?: DbSeriesWhereInput | DbSeriesWhereInput[]
    OR?: DbSeriesWhereInput[]
    NOT?: DbSeriesWhereInput | DbSeriesWhereInput[]
    last_number?: IntFilter<"DbSeries"> | number
    created_at?: DateTimeFilter<"DbSeries"> | Date | string
    updated_at?: DateTimeFilter<"DbSeries"> | Date | string
  }, "id" | "series_name">

  export type DbSeriesOrderByWithAggregationInput = {
    id?: SortOrder
    series_name?: SortOrder
    last_number?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: DbSeriesCountOrderByAggregateInput
    _avg?: DbSeriesAvgOrderByAggregateInput
    _max?: DbSeriesMaxOrderByAggregateInput
    _min?: DbSeriesMinOrderByAggregateInput
    _sum?: DbSeriesSumOrderByAggregateInput
  }

  export type DbSeriesScalarWhereWithAggregatesInput = {
    AND?: DbSeriesScalarWhereWithAggregatesInput | DbSeriesScalarWhereWithAggregatesInput[]
    OR?: DbSeriesScalarWhereWithAggregatesInput[]
    NOT?: DbSeriesScalarWhereWithAggregatesInput | DbSeriesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DbSeries"> | number
    series_name?: StringWithAggregatesFilter<"DbSeries"> | string
    last_number?: IntWithAggregatesFilter<"DbSeries"> | number
    created_at?: DateTimeWithAggregatesFilter<"DbSeries"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"DbSeries"> | Date | string
  }

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
    own_plan_id?: IntNullableFilter<"Owner"> | number | null
    own_max_firms?: IntNullableFilter<"Owner"> | number | null
    own_max_staff?: IntNullableFilter<"Owner"> | number | null
    own_start_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_expiry_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
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
    plan?: XOR<PlanNullableRelationFilter, PlanWhereInput> | null
    ownerPermissions?: OwnerPermissionListRelationFilter
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
    own_plan_id?: SortOrderInput | SortOrder
    own_max_firms?: SortOrderInput | SortOrder
    own_max_staff?: SortOrderInput | SortOrder
    own_start_date?: SortOrderInput | SortOrder
    own_expiry_date?: SortOrderInput | SortOrder
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
    plan?: PlanOrderByWithRelationInput
    ownerPermissions?: OwnerPermissionOrderByRelationAggregateInput
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
    own_plan_id?: IntNullableFilter<"Owner"> | number | null
    own_max_firms?: IntNullableFilter<"Owner"> | number | null
    own_max_staff?: IntNullableFilter<"Owner"> | number | null
    own_start_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_expiry_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
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
    plan?: XOR<PlanNullableRelationFilter, PlanWhereInput> | null
    ownerPermissions?: OwnerPermissionListRelationFilter
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
    own_plan_id?: SortOrderInput | SortOrder
    own_max_firms?: SortOrderInput | SortOrder
    own_max_staff?: SortOrderInput | SortOrder
    own_start_date?: SortOrderInput | SortOrder
    own_expiry_date?: SortOrderInput | SortOrder
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
    own_plan_id?: IntNullableWithAggregatesFilter<"Owner"> | number | null
    own_max_firms?: IntNullableWithAggregatesFilter<"Owner"> | number | null
    own_max_staff?: IntNullableWithAggregatesFilter<"Owner"> | number | null
    own_start_date?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
    own_expiry_date?: DateTimeNullableWithAggregatesFilter<"Owner"> | Date | string | null
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

  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    plan_id?: IntFilter<"Plan"> | number
    plan_uuid?: StringFilter<"Plan"> | string
    plan_name?: StringFilter<"Plan"> | string
    plan_code?: StringFilter<"Plan"> | string
    plan_description?: StringNullableFilter<"Plan"> | string | null
    plan_price?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    plan_offer_price?: DecimalNullableFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFilter<"Plan"> | string
    plan_billing_cycle?: EnumPlanBillingCycleFilter<"Plan"> | $Enums.PlanBillingCycle
    plan_duration_days?: IntNullableFilter<"Plan"> | number | null
    plan_max_firms?: IntFilter<"Plan"> | number
    plan_max_staff?: IntFilter<"Plan"> | number
    plan_modules?: JsonFilter<"Plan">
    plan_features?: JsonNullableFilter<"Plan">
    plan_image?: JsonNullableFilter<"Plan">
    plan_is_popular?: BoolFilter<"Plan"> | boolean
    plan_sort_order?: IntFilter<"Plan"> | number
    plan_status?: EnumPlanStatusFilter<"Plan"> | $Enums.PlanStatus
    plan_created_at?: DateTimeFilter<"Plan"> | Date | string
    plan_created_by?: StringNullableFilter<"Plan"> | string | null
    plan_updated_at?: DateTimeFilter<"Plan"> | Date | string
    plan_updated_by?: StringNullableFilter<"Plan"> | string | null
    plan_deleted_at?: DateTimeNullableFilter<"Plan"> | Date | string | null
    plan_deleted_by?: StringNullableFilter<"Plan"> | string | null
    plan_is_deleted?: BoolFilter<"Plan"> | boolean
    owners?: OwnerListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    plan_id?: SortOrder
    plan_uuid?: SortOrder
    plan_name?: SortOrder
    plan_code?: SortOrder
    plan_description?: SortOrderInput | SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrderInput | SortOrder
    plan_currency?: SortOrder
    plan_billing_cycle?: SortOrder
    plan_duration_days?: SortOrderInput | SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_modules?: SortOrder
    plan_features?: SortOrderInput | SortOrder
    plan_image?: SortOrderInput | SortOrder
    plan_is_popular?: SortOrder
    plan_sort_order?: SortOrder
    plan_status?: SortOrder
    plan_created_at?: SortOrder
    plan_created_by?: SortOrderInput | SortOrder
    plan_updated_at?: SortOrder
    plan_updated_by?: SortOrderInput | SortOrder
    plan_deleted_at?: SortOrderInput | SortOrder
    plan_deleted_by?: SortOrderInput | SortOrder
    plan_is_deleted?: SortOrder
    owners?: OwnerOrderByRelationAggregateInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    plan_id?: number
    plan_uuid?: string
    plan_code?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    plan_name?: StringFilter<"Plan"> | string
    plan_description?: StringNullableFilter<"Plan"> | string | null
    plan_price?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    plan_offer_price?: DecimalNullableFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFilter<"Plan"> | string
    plan_billing_cycle?: EnumPlanBillingCycleFilter<"Plan"> | $Enums.PlanBillingCycle
    plan_duration_days?: IntNullableFilter<"Plan"> | number | null
    plan_max_firms?: IntFilter<"Plan"> | number
    plan_max_staff?: IntFilter<"Plan"> | number
    plan_modules?: JsonFilter<"Plan">
    plan_features?: JsonNullableFilter<"Plan">
    plan_image?: JsonNullableFilter<"Plan">
    plan_is_popular?: BoolFilter<"Plan"> | boolean
    plan_sort_order?: IntFilter<"Plan"> | number
    plan_status?: EnumPlanStatusFilter<"Plan"> | $Enums.PlanStatus
    plan_created_at?: DateTimeFilter<"Plan"> | Date | string
    plan_created_by?: StringNullableFilter<"Plan"> | string | null
    plan_updated_at?: DateTimeFilter<"Plan"> | Date | string
    plan_updated_by?: StringNullableFilter<"Plan"> | string | null
    plan_deleted_at?: DateTimeNullableFilter<"Plan"> | Date | string | null
    plan_deleted_by?: StringNullableFilter<"Plan"> | string | null
    plan_is_deleted?: BoolFilter<"Plan"> | boolean
    owners?: OwnerListRelationFilter
  }, "plan_id" | "plan_uuid" | "plan_code">

  export type PlanOrderByWithAggregationInput = {
    plan_id?: SortOrder
    plan_uuid?: SortOrder
    plan_name?: SortOrder
    plan_code?: SortOrder
    plan_description?: SortOrderInput | SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrderInput | SortOrder
    plan_currency?: SortOrder
    plan_billing_cycle?: SortOrder
    plan_duration_days?: SortOrderInput | SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_modules?: SortOrder
    plan_features?: SortOrderInput | SortOrder
    plan_image?: SortOrderInput | SortOrder
    plan_is_popular?: SortOrder
    plan_sort_order?: SortOrder
    plan_status?: SortOrder
    plan_created_at?: SortOrder
    plan_created_by?: SortOrderInput | SortOrder
    plan_updated_at?: SortOrder
    plan_updated_by?: SortOrderInput | SortOrder
    plan_deleted_at?: SortOrderInput | SortOrder
    plan_deleted_by?: SortOrderInput | SortOrder
    plan_is_deleted?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    plan_id?: IntWithAggregatesFilter<"Plan"> | number
    plan_uuid?: StringWithAggregatesFilter<"Plan"> | string
    plan_name?: StringWithAggregatesFilter<"Plan"> | string
    plan_code?: StringWithAggregatesFilter<"Plan"> | string
    plan_description?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    plan_price?: DecimalWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    plan_offer_price?: DecimalNullableWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringWithAggregatesFilter<"Plan"> | string
    plan_billing_cycle?: EnumPlanBillingCycleWithAggregatesFilter<"Plan"> | $Enums.PlanBillingCycle
    plan_duration_days?: IntNullableWithAggregatesFilter<"Plan"> | number | null
    plan_max_firms?: IntWithAggregatesFilter<"Plan"> | number
    plan_max_staff?: IntWithAggregatesFilter<"Plan"> | number
    plan_modules?: JsonWithAggregatesFilter<"Plan">
    plan_features?: JsonNullableWithAggregatesFilter<"Plan">
    plan_image?: JsonNullableWithAggregatesFilter<"Plan">
    plan_is_popular?: BoolWithAggregatesFilter<"Plan"> | boolean
    plan_sort_order?: IntWithAggregatesFilter<"Plan"> | number
    plan_status?: EnumPlanStatusWithAggregatesFilter<"Plan"> | $Enums.PlanStatus
    plan_created_at?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
    plan_created_by?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    plan_updated_at?: DateTimeWithAggregatesFilter<"Plan"> | Date | string
    plan_updated_by?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    plan_deleted_at?: DateTimeNullableWithAggregatesFilter<"Plan"> | Date | string | null
    plan_deleted_by?: StringNullableWithAggregatesFilter<"Plan"> | string | null
    plan_is_deleted?: BoolWithAggregatesFilter<"Plan"> | boolean
  }

  export type AnnouncementWhereInput = {
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    ann_id?: IntFilter<"Announcement"> | number
    ann_uuid?: StringFilter<"Announcement"> | string
    ann_title?: StringFilter<"Announcement"> | string
    ann_body?: StringFilter<"Announcement"> | string
    ann_type?: EnumAnnouncementTypeFilter<"Announcement"> | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFilter<"Announcement"> | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFilter<"Announcement"> | boolean
    ann_sort_order?: IntFilter<"Announcement"> | number
    ann_publish_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_expires_at?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    ann_created_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_created_by?: StringNullableFilter<"Announcement"> | string | null
    ann_updated_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_updated_by?: StringNullableFilter<"Announcement"> | string | null
    ann_deleted_at?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    ann_deleted_by?: StringNullableFilter<"Announcement"> | string | null
    ann_is_deleted?: BoolFilter<"Announcement"> | boolean
  }

  export type AnnouncementOrderByWithRelationInput = {
    ann_id?: SortOrder
    ann_uuid?: SortOrder
    ann_title?: SortOrder
    ann_body?: SortOrder
    ann_type?: SortOrder
    ann_status?: SortOrder
    ann_is_pinned?: SortOrder
    ann_sort_order?: SortOrder
    ann_publish_at?: SortOrder
    ann_expires_at?: SortOrderInput | SortOrder
    ann_created_at?: SortOrder
    ann_created_by?: SortOrderInput | SortOrder
    ann_updated_at?: SortOrder
    ann_updated_by?: SortOrderInput | SortOrder
    ann_deleted_at?: SortOrderInput | SortOrder
    ann_deleted_by?: SortOrderInput | SortOrder
    ann_is_deleted?: SortOrder
  }

  export type AnnouncementWhereUniqueInput = Prisma.AtLeast<{
    ann_id?: number
    ann_uuid?: string
    AND?: AnnouncementWhereInput | AnnouncementWhereInput[]
    OR?: AnnouncementWhereInput[]
    NOT?: AnnouncementWhereInput | AnnouncementWhereInput[]
    ann_title?: StringFilter<"Announcement"> | string
    ann_body?: StringFilter<"Announcement"> | string
    ann_type?: EnumAnnouncementTypeFilter<"Announcement"> | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFilter<"Announcement"> | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFilter<"Announcement"> | boolean
    ann_sort_order?: IntFilter<"Announcement"> | number
    ann_publish_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_expires_at?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    ann_created_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_created_by?: StringNullableFilter<"Announcement"> | string | null
    ann_updated_at?: DateTimeFilter<"Announcement"> | Date | string
    ann_updated_by?: StringNullableFilter<"Announcement"> | string | null
    ann_deleted_at?: DateTimeNullableFilter<"Announcement"> | Date | string | null
    ann_deleted_by?: StringNullableFilter<"Announcement"> | string | null
    ann_is_deleted?: BoolFilter<"Announcement"> | boolean
  }, "ann_id" | "ann_uuid">

  export type AnnouncementOrderByWithAggregationInput = {
    ann_id?: SortOrder
    ann_uuid?: SortOrder
    ann_title?: SortOrder
    ann_body?: SortOrder
    ann_type?: SortOrder
    ann_status?: SortOrder
    ann_is_pinned?: SortOrder
    ann_sort_order?: SortOrder
    ann_publish_at?: SortOrder
    ann_expires_at?: SortOrderInput | SortOrder
    ann_created_at?: SortOrder
    ann_created_by?: SortOrderInput | SortOrder
    ann_updated_at?: SortOrder
    ann_updated_by?: SortOrderInput | SortOrder
    ann_deleted_at?: SortOrderInput | SortOrder
    ann_deleted_by?: SortOrderInput | SortOrder
    ann_is_deleted?: SortOrder
    _count?: AnnouncementCountOrderByAggregateInput
    _avg?: AnnouncementAvgOrderByAggregateInput
    _max?: AnnouncementMaxOrderByAggregateInput
    _min?: AnnouncementMinOrderByAggregateInput
    _sum?: AnnouncementSumOrderByAggregateInput
  }

  export type AnnouncementScalarWhereWithAggregatesInput = {
    AND?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    OR?: AnnouncementScalarWhereWithAggregatesInput[]
    NOT?: AnnouncementScalarWhereWithAggregatesInput | AnnouncementScalarWhereWithAggregatesInput[]
    ann_id?: IntWithAggregatesFilter<"Announcement"> | number
    ann_uuid?: StringWithAggregatesFilter<"Announcement"> | string
    ann_title?: StringWithAggregatesFilter<"Announcement"> | string
    ann_body?: StringWithAggregatesFilter<"Announcement"> | string
    ann_type?: EnumAnnouncementTypeWithAggregatesFilter<"Announcement"> | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusWithAggregatesFilter<"Announcement"> | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolWithAggregatesFilter<"Announcement"> | boolean
    ann_sort_order?: IntWithAggregatesFilter<"Announcement"> | number
    ann_publish_at?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
    ann_expires_at?: DateTimeNullableWithAggregatesFilter<"Announcement"> | Date | string | null
    ann_created_at?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
    ann_created_by?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    ann_updated_at?: DateTimeWithAggregatesFilter<"Announcement"> | Date | string
    ann_updated_by?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    ann_deleted_at?: DateTimeNullableWithAggregatesFilter<"Announcement"> | Date | string | null
    ann_deleted_by?: StringNullableWithAggregatesFilter<"Announcement"> | string | null
    ann_is_deleted?: BoolWithAggregatesFilter<"Announcement"> | boolean
  }

  export type OwnerPermissionWhereInput = {
    AND?: OwnerPermissionWhereInput | OwnerPermissionWhereInput[]
    OR?: OwnerPermissionWhereInput[]
    NOT?: OwnerPermissionWhereInput | OwnerPermissionWhereInput[]
    op_id?: IntFilter<"OwnerPermission"> | number
    op_own_id?: IntFilter<"OwnerPermission"> | number
    op_perm_key?: StringFilter<"OwnerPermission"> | string
    op_granted?: BoolFilter<"OwnerPermission"> | boolean
    op_created_at?: DateTimeFilter<"OwnerPermission"> | Date | string
    op_updated_at?: DateTimeFilter<"OwnerPermission"> | Date | string
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
  }

  export type OwnerPermissionOrderByWithRelationInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
    op_perm_key?: SortOrder
    op_granted?: SortOrder
    op_created_at?: SortOrder
    op_updated_at?: SortOrder
    owner?: OwnerOrderByWithRelationInput
  }

  export type OwnerPermissionWhereUniqueInput = Prisma.AtLeast<{
    op_id?: number
    op_own_id_op_perm_key?: OwnerPermissionOp_own_idOp_perm_keyCompoundUniqueInput
    AND?: OwnerPermissionWhereInput | OwnerPermissionWhereInput[]
    OR?: OwnerPermissionWhereInput[]
    NOT?: OwnerPermissionWhereInput | OwnerPermissionWhereInput[]
    op_own_id?: IntFilter<"OwnerPermission"> | number
    op_perm_key?: StringFilter<"OwnerPermission"> | string
    op_granted?: BoolFilter<"OwnerPermission"> | boolean
    op_created_at?: DateTimeFilter<"OwnerPermission"> | Date | string
    op_updated_at?: DateTimeFilter<"OwnerPermission"> | Date | string
    owner?: XOR<OwnerRelationFilter, OwnerWhereInput>
  }, "op_id" | "op_own_id_op_perm_key">

  export type OwnerPermissionOrderByWithAggregationInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
    op_perm_key?: SortOrder
    op_granted?: SortOrder
    op_created_at?: SortOrder
    op_updated_at?: SortOrder
    _count?: OwnerPermissionCountOrderByAggregateInput
    _avg?: OwnerPermissionAvgOrderByAggregateInput
    _max?: OwnerPermissionMaxOrderByAggregateInput
    _min?: OwnerPermissionMinOrderByAggregateInput
    _sum?: OwnerPermissionSumOrderByAggregateInput
  }

  export type OwnerPermissionScalarWhereWithAggregatesInput = {
    AND?: OwnerPermissionScalarWhereWithAggregatesInput | OwnerPermissionScalarWhereWithAggregatesInput[]
    OR?: OwnerPermissionScalarWhereWithAggregatesInput[]
    NOT?: OwnerPermissionScalarWhereWithAggregatesInput | OwnerPermissionScalarWhereWithAggregatesInput[]
    op_id?: IntWithAggregatesFilter<"OwnerPermission"> | number
    op_own_id?: IntWithAggregatesFilter<"OwnerPermission"> | number
    op_perm_key?: StringWithAggregatesFilter<"OwnerPermission"> | string
    op_granted?: BoolWithAggregatesFilter<"OwnerPermission"> | boolean
    op_created_at?: DateTimeWithAggregatesFilter<"OwnerPermission"> | Date | string
    op_updated_at?: DateTimeWithAggregatesFilter<"OwnerPermission"> | Date | string
  }

  export type AdminCreateInput = {
    admin_uuid?: string
    admin_add_date?: Date | string
    admin_first_name: string
    admin_middle_name?: string | null
    admin_last_name: string
    admin_phone_no?: string | null
    admin_mobile_no?: string | null
    admin_email: string
    admin_login_id: string
    admin_password: string
    admin_company_name?: string | null
    admin_refresh_token?: string | null
    admin_refresh_expiry?: Date | string | null
    admin_jwt_token?: string | null
    admin_jwt_expiry?: Date | string | null
    admin_login_status?: boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: string | null
    admin_otp_expiry?: Date | string | null
    admin_address?: string | null
    admin_village?: string | null
    admin_city?: string | null
    admin_state?: string | null
    admin_pincode?: string | null
    admin_created_at?: Date | string
    admin_created_by?: string | null
    admin_updated_at?: Date | string
    admin_updated_by?: string | null
    admin_deleted_at?: Date | string | null
    admin_deleted_by?: string | null
    admin_is_deleted?: boolean
  }

  export type AdminUncheckedCreateInput = {
    admin_id?: number
    admin_uuid?: string
    admin_add_date?: Date | string
    admin_first_name: string
    admin_middle_name?: string | null
    admin_last_name: string
    admin_phone_no?: string | null
    admin_mobile_no?: string | null
    admin_email: string
    admin_login_id: string
    admin_password: string
    admin_company_name?: string | null
    admin_refresh_token?: string | null
    admin_refresh_expiry?: Date | string | null
    admin_jwt_token?: string | null
    admin_jwt_expiry?: Date | string | null
    admin_login_status?: boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: string | null
    admin_otp_expiry?: Date | string | null
    admin_address?: string | null
    admin_village?: string | null
    admin_city?: string | null
    admin_state?: string | null
    admin_pincode?: string | null
    admin_created_at?: Date | string
    admin_created_by?: string | null
    admin_updated_at?: Date | string
    admin_updated_by?: string | null
    admin_deleted_at?: Date | string | null
    admin_deleted_by?: string | null
    admin_is_deleted?: boolean
  }

  export type AdminUpdateInput = {
    admin_uuid?: StringFieldUpdateOperationsInput | string
    admin_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_first_name?: StringFieldUpdateOperationsInput | string
    admin_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_last_name?: StringFieldUpdateOperationsInput | string
    admin_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_mobile_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_email?: StringFieldUpdateOperationsInput | string
    admin_login_id?: StringFieldUpdateOperationsInput | string
    admin_password?: StringFieldUpdateOperationsInput | string
    admin_company_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_login_status?: BoolFieldUpdateOperationsInput | boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: NullableStringFieldUpdateOperationsInput | string | null
    admin_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_address?: NullableStringFieldUpdateOperationsInput | string | null
    admin_village?: NullableStringFieldUpdateOperationsInput | string | null
    admin_city?: NullableStringFieldUpdateOperationsInput | string | null
    admin_state?: NullableStringFieldUpdateOperationsInput | string | null
    admin_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    admin_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AdminUncheckedUpdateInput = {
    admin_id?: IntFieldUpdateOperationsInput | number
    admin_uuid?: StringFieldUpdateOperationsInput | string
    admin_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_first_name?: StringFieldUpdateOperationsInput | string
    admin_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_last_name?: StringFieldUpdateOperationsInput | string
    admin_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_mobile_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_email?: StringFieldUpdateOperationsInput | string
    admin_login_id?: StringFieldUpdateOperationsInput | string
    admin_password?: StringFieldUpdateOperationsInput | string
    admin_company_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_login_status?: BoolFieldUpdateOperationsInput | boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: NullableStringFieldUpdateOperationsInput | string | null
    admin_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_address?: NullableStringFieldUpdateOperationsInput | string | null
    admin_village?: NullableStringFieldUpdateOperationsInput | string | null
    admin_city?: NullableStringFieldUpdateOperationsInput | string | null
    admin_state?: NullableStringFieldUpdateOperationsInput | string | null
    admin_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    admin_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AdminCreateManyInput = {
    admin_id?: number
    admin_uuid?: string
    admin_add_date?: Date | string
    admin_first_name: string
    admin_middle_name?: string | null
    admin_last_name: string
    admin_phone_no?: string | null
    admin_mobile_no?: string | null
    admin_email: string
    admin_login_id: string
    admin_password: string
    admin_company_name?: string | null
    admin_refresh_token?: string | null
    admin_refresh_expiry?: Date | string | null
    admin_jwt_token?: string | null
    admin_jwt_expiry?: Date | string | null
    admin_login_status?: boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: string | null
    admin_otp_expiry?: Date | string | null
    admin_address?: string | null
    admin_village?: string | null
    admin_city?: string | null
    admin_state?: string | null
    admin_pincode?: string | null
    admin_created_at?: Date | string
    admin_created_by?: string | null
    admin_updated_at?: Date | string
    admin_updated_by?: string | null
    admin_deleted_at?: Date | string | null
    admin_deleted_by?: string | null
    admin_is_deleted?: boolean
  }

  export type AdminUpdateManyMutationInput = {
    admin_uuid?: StringFieldUpdateOperationsInput | string
    admin_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_first_name?: StringFieldUpdateOperationsInput | string
    admin_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_last_name?: StringFieldUpdateOperationsInput | string
    admin_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_mobile_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_email?: StringFieldUpdateOperationsInput | string
    admin_login_id?: StringFieldUpdateOperationsInput | string
    admin_password?: StringFieldUpdateOperationsInput | string
    admin_company_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_login_status?: BoolFieldUpdateOperationsInput | boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: NullableStringFieldUpdateOperationsInput | string | null
    admin_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_address?: NullableStringFieldUpdateOperationsInput | string | null
    admin_village?: NullableStringFieldUpdateOperationsInput | string | null
    admin_city?: NullableStringFieldUpdateOperationsInput | string | null
    admin_state?: NullableStringFieldUpdateOperationsInput | string | null
    admin_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    admin_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AdminUncheckedUpdateManyInput = {
    admin_id?: IntFieldUpdateOperationsInput | number
    admin_uuid?: StringFieldUpdateOperationsInput | string
    admin_add_date?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_first_name?: StringFieldUpdateOperationsInput | string
    admin_middle_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_last_name?: StringFieldUpdateOperationsInput | string
    admin_phone_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_mobile_no?: NullableStringFieldUpdateOperationsInput | string | null
    admin_email?: StringFieldUpdateOperationsInput | string
    admin_login_id?: StringFieldUpdateOperationsInput | string
    admin_password?: StringFieldUpdateOperationsInput | string
    admin_company_name?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_refresh_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_jwt_token?: NullableStringFieldUpdateOperationsInput | string | null
    admin_jwt_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_login_status?: BoolFieldUpdateOperationsInput | boolean
    admin_last_login_system?: NullableJsonNullValueInput | InputJsonValue
    admin_otp?: NullableStringFieldUpdateOperationsInput | string | null
    admin_otp_expiry?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_address?: NullableStringFieldUpdateOperationsInput | string | null
    admin_village?: NullableStringFieldUpdateOperationsInput | string | null
    admin_city?: NullableStringFieldUpdateOperationsInput | string | null
    admin_state?: NullableStringFieldUpdateOperationsInput | string | null
    admin_pincode?: NullableStringFieldUpdateOperationsInput | string | null
    admin_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    admin_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    admin_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type DbSeriesCreateInput = {
    series_name: string
    last_number?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DbSeriesUncheckedCreateInput = {
    id?: number
    series_name: string
    last_number?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DbSeriesUpdateInput = {
    series_name?: StringFieldUpdateOperationsInput | string
    last_number?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DbSeriesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    series_name?: StringFieldUpdateOperationsInput | string
    last_number?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DbSeriesCreateManyInput = {
    id?: number
    series_name: string
    last_number?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type DbSeriesUpdateManyMutationInput = {
    series_name?: StringFieldUpdateOperationsInput | string
    last_number?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DbSeriesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    series_name?: StringFieldUpdateOperationsInput | string
    last_number?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    plan?: PlanCreateNestedOneWithoutOwnersInput
    ownerPermissions?: OwnerPermissionCreateNestedManyWithoutOwnerInput
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
    own_plan_id?: number | null
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    ownerPermissions?: OwnerPermissionUncheckedCreateNestedManyWithoutOwnerInput
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    plan?: PlanUpdateOneWithoutOwnersNestedInput
    ownerPermissions?: OwnerPermissionUpdateManyWithoutOwnerNestedInput
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
    own_plan_id?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    ownerPermissions?: OwnerPermissionUncheckedUpdateManyWithoutOwnerNestedInput
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
    own_plan_id?: number | null
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    own_plan_id?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type PlanCreateInput = {
    plan_uuid?: string
    plan_name: string
    plan_code: string
    plan_description?: string | null
    plan_price: Decimal | DecimalJsLike | number | string
    plan_offer_price?: Decimal | DecimalJsLike | number | string | null
    plan_currency?: string
    plan_billing_cycle?: $Enums.PlanBillingCycle
    plan_duration_days?: number | null
    plan_max_firms?: number
    plan_max_staff?: number
    plan_modules: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: boolean
    plan_sort_order?: number
    plan_status?: $Enums.PlanStatus
    plan_created_at?: Date | string
    plan_created_by?: string | null
    plan_updated_at?: Date | string
    plan_updated_by?: string | null
    plan_deleted_at?: Date | string | null
    plan_deleted_by?: string | null
    plan_is_deleted?: boolean
    owners?: OwnerCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    plan_id?: number
    plan_uuid?: string
    plan_name: string
    plan_code: string
    plan_description?: string | null
    plan_price: Decimal | DecimalJsLike | number | string
    plan_offer_price?: Decimal | DecimalJsLike | number | string | null
    plan_currency?: string
    plan_billing_cycle?: $Enums.PlanBillingCycle
    plan_duration_days?: number | null
    plan_max_firms?: number
    plan_max_staff?: number
    plan_modules: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: boolean
    plan_sort_order?: number
    plan_status?: $Enums.PlanStatus
    plan_created_at?: Date | string
    plan_created_by?: string | null
    plan_updated_at?: Date | string
    plan_updated_by?: string | null
    plan_deleted_at?: Date | string | null
    plan_deleted_by?: string | null
    plan_is_deleted?: boolean
    owners?: OwnerUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owners?: OwnerUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
    owners?: OwnerUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanCreateManyInput = {
    plan_id?: number
    plan_uuid?: string
    plan_name: string
    plan_code: string
    plan_description?: string | null
    plan_price: Decimal | DecimalJsLike | number | string
    plan_offer_price?: Decimal | DecimalJsLike | number | string | null
    plan_currency?: string
    plan_billing_cycle?: $Enums.PlanBillingCycle
    plan_duration_days?: number | null
    plan_max_firms?: number
    plan_max_staff?: number
    plan_modules: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: boolean
    plan_sort_order?: number
    plan_status?: $Enums.PlanStatus
    plan_created_at?: Date | string
    plan_created_by?: string | null
    plan_updated_at?: Date | string
    plan_updated_by?: string | null
    plan_deleted_at?: Date | string | null
    plan_deleted_by?: string | null
    plan_is_deleted?: boolean
  }

  export type PlanUpdateManyMutationInput = {
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanUncheckedUpdateManyInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnnouncementCreateInput = {
    ann_uuid?: string
    ann_title: string
    ann_body: string
    ann_type?: $Enums.AnnouncementType
    ann_status?: $Enums.AnnouncementStatus
    ann_is_pinned?: boolean
    ann_sort_order?: number
    ann_publish_at?: Date | string
    ann_expires_at?: Date | string | null
    ann_created_at?: Date | string
    ann_created_by?: string | null
    ann_updated_at?: Date | string
    ann_updated_by?: string | null
    ann_deleted_at?: Date | string | null
    ann_deleted_by?: string | null
    ann_is_deleted?: boolean
  }

  export type AnnouncementUncheckedCreateInput = {
    ann_id?: number
    ann_uuid?: string
    ann_title: string
    ann_body: string
    ann_type?: $Enums.AnnouncementType
    ann_status?: $Enums.AnnouncementStatus
    ann_is_pinned?: boolean
    ann_sort_order?: number
    ann_publish_at?: Date | string
    ann_expires_at?: Date | string | null
    ann_created_at?: Date | string
    ann_created_by?: string | null
    ann_updated_at?: Date | string
    ann_updated_by?: string | null
    ann_deleted_at?: Date | string | null
    ann_deleted_by?: string | null
    ann_is_deleted?: boolean
  }

  export type AnnouncementUpdateInput = {
    ann_uuid?: StringFieldUpdateOperationsInput | string
    ann_title?: StringFieldUpdateOperationsInput | string
    ann_body?: StringFieldUpdateOperationsInput | string
    ann_type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFieldUpdateOperationsInput | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFieldUpdateOperationsInput | boolean
    ann_sort_order?: IntFieldUpdateOperationsInput | number
    ann_publish_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnnouncementUncheckedUpdateInput = {
    ann_id?: IntFieldUpdateOperationsInput | number
    ann_uuid?: StringFieldUpdateOperationsInput | string
    ann_title?: StringFieldUpdateOperationsInput | string
    ann_body?: StringFieldUpdateOperationsInput | string
    ann_type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFieldUpdateOperationsInput | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFieldUpdateOperationsInput | boolean
    ann_sort_order?: IntFieldUpdateOperationsInput | number
    ann_publish_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnnouncementCreateManyInput = {
    ann_id?: number
    ann_uuid?: string
    ann_title: string
    ann_body: string
    ann_type?: $Enums.AnnouncementType
    ann_status?: $Enums.AnnouncementStatus
    ann_is_pinned?: boolean
    ann_sort_order?: number
    ann_publish_at?: Date | string
    ann_expires_at?: Date | string | null
    ann_created_at?: Date | string
    ann_created_by?: string | null
    ann_updated_at?: Date | string
    ann_updated_by?: string | null
    ann_deleted_at?: Date | string | null
    ann_deleted_by?: string | null
    ann_is_deleted?: boolean
  }

  export type AnnouncementUpdateManyMutationInput = {
    ann_uuid?: StringFieldUpdateOperationsInput | string
    ann_title?: StringFieldUpdateOperationsInput | string
    ann_body?: StringFieldUpdateOperationsInput | string
    ann_type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFieldUpdateOperationsInput | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFieldUpdateOperationsInput | boolean
    ann_sort_order?: IntFieldUpdateOperationsInput | number
    ann_publish_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AnnouncementUncheckedUpdateManyInput = {
    ann_id?: IntFieldUpdateOperationsInput | number
    ann_uuid?: StringFieldUpdateOperationsInput | string
    ann_title?: StringFieldUpdateOperationsInput | string
    ann_body?: StringFieldUpdateOperationsInput | string
    ann_type?: EnumAnnouncementTypeFieldUpdateOperationsInput | $Enums.AnnouncementType
    ann_status?: EnumAnnouncementStatusFieldUpdateOperationsInput | $Enums.AnnouncementStatus
    ann_is_pinned?: BoolFieldUpdateOperationsInput | boolean
    ann_sort_order?: IntFieldUpdateOperationsInput | number
    ann_publish_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ann_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ann_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    ann_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OwnerPermissionCreateInput = {
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
    owner: OwnerCreateNestedOneWithoutOwnerPermissionsInput
  }

  export type OwnerPermissionUncheckedCreateInput = {
    op_id?: number
    op_own_id: number
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
  }

  export type OwnerPermissionUpdateInput = {
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: OwnerUpdateOneRequiredWithoutOwnerPermissionsNestedInput
  }

  export type OwnerPermissionUncheckedUpdateInput = {
    op_id?: IntFieldUpdateOperationsInput | number
    op_own_id?: IntFieldUpdateOperationsInput | number
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnerPermissionCreateManyInput = {
    op_id?: number
    op_own_id: number
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
  }

  export type OwnerPermissionUpdateManyMutationInput = {
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnerPermissionUncheckedUpdateManyInput = {
    op_id?: IntFieldUpdateOperationsInput | number
    op_own_id?: IntFieldUpdateOperationsInput | number
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AdminCountOrderByAggregateInput = {
    admin_id?: SortOrder
    admin_uuid?: SortOrder
    admin_add_date?: SortOrder
    admin_first_name?: SortOrder
    admin_middle_name?: SortOrder
    admin_last_name?: SortOrder
    admin_phone_no?: SortOrder
    admin_mobile_no?: SortOrder
    admin_email?: SortOrder
    admin_login_id?: SortOrder
    admin_password?: SortOrder
    admin_company_name?: SortOrder
    admin_refresh_token?: SortOrder
    admin_refresh_expiry?: SortOrder
    admin_jwt_token?: SortOrder
    admin_jwt_expiry?: SortOrder
    admin_login_status?: SortOrder
    admin_last_login_system?: SortOrder
    admin_otp?: SortOrder
    admin_otp_expiry?: SortOrder
    admin_address?: SortOrder
    admin_village?: SortOrder
    admin_city?: SortOrder
    admin_state?: SortOrder
    admin_pincode?: SortOrder
    admin_created_at?: SortOrder
    admin_created_by?: SortOrder
    admin_updated_at?: SortOrder
    admin_updated_by?: SortOrder
    admin_deleted_at?: SortOrder
    admin_deleted_by?: SortOrder
    admin_is_deleted?: SortOrder
  }

  export type AdminAvgOrderByAggregateInput = {
    admin_id?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    admin_id?: SortOrder
    admin_uuid?: SortOrder
    admin_add_date?: SortOrder
    admin_first_name?: SortOrder
    admin_middle_name?: SortOrder
    admin_last_name?: SortOrder
    admin_phone_no?: SortOrder
    admin_mobile_no?: SortOrder
    admin_email?: SortOrder
    admin_login_id?: SortOrder
    admin_password?: SortOrder
    admin_company_name?: SortOrder
    admin_refresh_token?: SortOrder
    admin_refresh_expiry?: SortOrder
    admin_jwt_token?: SortOrder
    admin_jwt_expiry?: SortOrder
    admin_login_status?: SortOrder
    admin_otp?: SortOrder
    admin_otp_expiry?: SortOrder
    admin_address?: SortOrder
    admin_village?: SortOrder
    admin_city?: SortOrder
    admin_state?: SortOrder
    admin_pincode?: SortOrder
    admin_created_at?: SortOrder
    admin_created_by?: SortOrder
    admin_updated_at?: SortOrder
    admin_updated_by?: SortOrder
    admin_deleted_at?: SortOrder
    admin_deleted_by?: SortOrder
    admin_is_deleted?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    admin_id?: SortOrder
    admin_uuid?: SortOrder
    admin_add_date?: SortOrder
    admin_first_name?: SortOrder
    admin_middle_name?: SortOrder
    admin_last_name?: SortOrder
    admin_phone_no?: SortOrder
    admin_mobile_no?: SortOrder
    admin_email?: SortOrder
    admin_login_id?: SortOrder
    admin_password?: SortOrder
    admin_company_name?: SortOrder
    admin_refresh_token?: SortOrder
    admin_refresh_expiry?: SortOrder
    admin_jwt_token?: SortOrder
    admin_jwt_expiry?: SortOrder
    admin_login_status?: SortOrder
    admin_otp?: SortOrder
    admin_otp_expiry?: SortOrder
    admin_address?: SortOrder
    admin_village?: SortOrder
    admin_city?: SortOrder
    admin_state?: SortOrder
    admin_pincode?: SortOrder
    admin_created_at?: SortOrder
    admin_created_by?: SortOrder
    admin_updated_at?: SortOrder
    admin_updated_by?: SortOrder
    admin_deleted_at?: SortOrder
    admin_deleted_by?: SortOrder
    admin_is_deleted?: SortOrder
  }

  export type AdminSumOrderByAggregateInput = {
    admin_id?: SortOrder
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

  export type DbSeriesCountOrderByAggregateInput = {
    id?: SortOrder
    series_name?: SortOrder
    last_number?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DbSeriesAvgOrderByAggregateInput = {
    id?: SortOrder
    last_number?: SortOrder
  }

  export type DbSeriesMaxOrderByAggregateInput = {
    id?: SortOrder
    series_name?: SortOrder
    last_number?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DbSeriesMinOrderByAggregateInput = {
    id?: SortOrder
    series_name?: SortOrder
    last_number?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DbSeriesSumOrderByAggregateInput = {
    id?: SortOrder
    last_number?: SortOrder
  }

  export type EnumOwnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusFilter<$PrismaModel> | $Enums.OwnerStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type PlanNullableRelationFilter = {
    is?: PlanWhereInput | null
    isNot?: PlanWhereInput | null
  }

  export type OwnerPermissionListRelationFilter = {
    every?: OwnerPermissionWhereInput
    some?: OwnerPermissionWhereInput
    none?: OwnerPermissionWhereInput
  }

  export type OwnerPermissionOrderByRelationAggregateInput = {
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
    own_plan_id?: SortOrder
    own_max_firms?: SortOrder
    own_max_staff?: SortOrder
    own_start_date?: SortOrder
    own_expiry_date?: SortOrder
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
    own_plan_id?: SortOrder
    own_max_firms?: SortOrder
    own_max_staff?: SortOrder
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
    own_plan_id?: SortOrder
    own_max_firms?: SortOrder
    own_max_staff?: SortOrder
    own_start_date?: SortOrder
    own_expiry_date?: SortOrder
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
    own_plan_id?: SortOrder
    own_max_firms?: SortOrder
    own_max_staff?: SortOrder
    own_start_date?: SortOrder
    own_expiry_date?: SortOrder
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
    own_plan_id?: SortOrder
    own_max_firms?: SortOrder
    own_max_staff?: SortOrder
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

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumPlanBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanBillingCycle | EnumPlanBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanBillingCycleFilter<$PrismaModel> | $Enums.PlanBillingCycle
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type EnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
  }

  export type OwnerListRelationFilter = {
    every?: OwnerWhereInput
    some?: OwnerWhereInput
    none?: OwnerWhereInput
  }

  export type OwnerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanCountOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_uuid?: SortOrder
    plan_name?: SortOrder
    plan_code?: SortOrder
    plan_description?: SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrder
    plan_currency?: SortOrder
    plan_billing_cycle?: SortOrder
    plan_duration_days?: SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_modules?: SortOrder
    plan_features?: SortOrder
    plan_image?: SortOrder
    plan_is_popular?: SortOrder
    plan_sort_order?: SortOrder
    plan_status?: SortOrder
    plan_created_at?: SortOrder
    plan_created_by?: SortOrder
    plan_updated_at?: SortOrder
    plan_updated_by?: SortOrder
    plan_deleted_at?: SortOrder
    plan_deleted_by?: SortOrder
    plan_is_deleted?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrder
    plan_duration_days?: SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_sort_order?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_uuid?: SortOrder
    plan_name?: SortOrder
    plan_code?: SortOrder
    plan_description?: SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrder
    plan_currency?: SortOrder
    plan_billing_cycle?: SortOrder
    plan_duration_days?: SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_is_popular?: SortOrder
    plan_sort_order?: SortOrder
    plan_status?: SortOrder
    plan_created_at?: SortOrder
    plan_created_by?: SortOrder
    plan_updated_at?: SortOrder
    plan_updated_by?: SortOrder
    plan_deleted_at?: SortOrder
    plan_deleted_by?: SortOrder
    plan_is_deleted?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_uuid?: SortOrder
    plan_name?: SortOrder
    plan_code?: SortOrder
    plan_description?: SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrder
    plan_currency?: SortOrder
    plan_billing_cycle?: SortOrder
    plan_duration_days?: SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_is_popular?: SortOrder
    plan_sort_order?: SortOrder
    plan_status?: SortOrder
    plan_created_at?: SortOrder
    plan_created_by?: SortOrder
    plan_updated_at?: SortOrder
    plan_updated_by?: SortOrder
    plan_deleted_at?: SortOrder
    plan_deleted_by?: SortOrder
    plan_is_deleted?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    plan_id?: SortOrder
    plan_price?: SortOrder
    plan_offer_price?: SortOrder
    plan_duration_days?: SortOrder
    plan_max_firms?: SortOrder
    plan_max_staff?: SortOrder
    plan_sort_order?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumPlanBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanBillingCycle | EnumPlanBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.PlanBillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumPlanBillingCycleFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
  }

  export type EnumAnnouncementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeFilter<$PrismaModel> | $Enums.AnnouncementType
  }

  export type EnumAnnouncementStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementStatus | EnumAnnouncementStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementStatusFilter<$PrismaModel> | $Enums.AnnouncementStatus
  }

  export type AnnouncementCountOrderByAggregateInput = {
    ann_id?: SortOrder
    ann_uuid?: SortOrder
    ann_title?: SortOrder
    ann_body?: SortOrder
    ann_type?: SortOrder
    ann_status?: SortOrder
    ann_is_pinned?: SortOrder
    ann_sort_order?: SortOrder
    ann_publish_at?: SortOrder
    ann_expires_at?: SortOrder
    ann_created_at?: SortOrder
    ann_created_by?: SortOrder
    ann_updated_at?: SortOrder
    ann_updated_by?: SortOrder
    ann_deleted_at?: SortOrder
    ann_deleted_by?: SortOrder
    ann_is_deleted?: SortOrder
  }

  export type AnnouncementAvgOrderByAggregateInput = {
    ann_id?: SortOrder
    ann_sort_order?: SortOrder
  }

  export type AnnouncementMaxOrderByAggregateInput = {
    ann_id?: SortOrder
    ann_uuid?: SortOrder
    ann_title?: SortOrder
    ann_body?: SortOrder
    ann_type?: SortOrder
    ann_status?: SortOrder
    ann_is_pinned?: SortOrder
    ann_sort_order?: SortOrder
    ann_publish_at?: SortOrder
    ann_expires_at?: SortOrder
    ann_created_at?: SortOrder
    ann_created_by?: SortOrder
    ann_updated_at?: SortOrder
    ann_updated_by?: SortOrder
    ann_deleted_at?: SortOrder
    ann_deleted_by?: SortOrder
    ann_is_deleted?: SortOrder
  }

  export type AnnouncementMinOrderByAggregateInput = {
    ann_id?: SortOrder
    ann_uuid?: SortOrder
    ann_title?: SortOrder
    ann_body?: SortOrder
    ann_type?: SortOrder
    ann_status?: SortOrder
    ann_is_pinned?: SortOrder
    ann_sort_order?: SortOrder
    ann_publish_at?: SortOrder
    ann_expires_at?: SortOrder
    ann_created_at?: SortOrder
    ann_created_by?: SortOrder
    ann_updated_at?: SortOrder
    ann_updated_by?: SortOrder
    ann_deleted_at?: SortOrder
    ann_deleted_by?: SortOrder
    ann_is_deleted?: SortOrder
  }

  export type AnnouncementSumOrderByAggregateInput = {
    ann_id?: SortOrder
    ann_sort_order?: SortOrder
  }

  export type EnumAnnouncementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
  }

  export type EnumAnnouncementStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementStatus | EnumAnnouncementStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementStatusWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementStatusFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementStatusFilter<$PrismaModel>
  }

  export type OwnerRelationFilter = {
    is?: OwnerWhereInput
    isNot?: OwnerWhereInput
  }

  export type OwnerPermissionOp_own_idOp_perm_keyCompoundUniqueInput = {
    op_own_id: number
    op_perm_key: string
  }

  export type OwnerPermissionCountOrderByAggregateInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
    op_perm_key?: SortOrder
    op_granted?: SortOrder
    op_created_at?: SortOrder
    op_updated_at?: SortOrder
  }

  export type OwnerPermissionAvgOrderByAggregateInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
  }

  export type OwnerPermissionMaxOrderByAggregateInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
    op_perm_key?: SortOrder
    op_granted?: SortOrder
    op_created_at?: SortOrder
    op_updated_at?: SortOrder
  }

  export type OwnerPermissionMinOrderByAggregateInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
    op_perm_key?: SortOrder
    op_granted?: SortOrder
    op_created_at?: SortOrder
    op_updated_at?: SortOrder
  }

  export type OwnerPermissionSumOrderByAggregateInput = {
    op_id?: SortOrder
    op_own_id?: SortOrder
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

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlanCreateNestedOneWithoutOwnersInput = {
    create?: XOR<PlanCreateWithoutOwnersInput, PlanUncheckedCreateWithoutOwnersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutOwnersInput
    connect?: PlanWhereUniqueInput
  }

  export type OwnerPermissionCreateNestedManyWithoutOwnerInput = {
    create?: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput> | OwnerPermissionCreateWithoutOwnerInput[] | OwnerPermissionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: OwnerPermissionCreateOrConnectWithoutOwnerInput | OwnerPermissionCreateOrConnectWithoutOwnerInput[]
    createMany?: OwnerPermissionCreateManyOwnerInputEnvelope
    connect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
  }

  export type OwnerPermissionUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput> | OwnerPermissionCreateWithoutOwnerInput[] | OwnerPermissionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: OwnerPermissionCreateOrConnectWithoutOwnerInput | OwnerPermissionCreateOrConnectWithoutOwnerInput[]
    createMany?: OwnerPermissionCreateManyOwnerInputEnvelope
    connect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
  }

  export type EnumOwnerStatusFieldUpdateOperationsInput = {
    set?: $Enums.OwnerStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlanUpdateOneWithoutOwnersNestedInput = {
    create?: XOR<PlanCreateWithoutOwnersInput, PlanUncheckedCreateWithoutOwnersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutOwnersInput
    upsert?: PlanUpsertWithoutOwnersInput
    disconnect?: PlanWhereInput | boolean
    delete?: PlanWhereInput | boolean
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutOwnersInput, PlanUpdateWithoutOwnersInput>, PlanUncheckedUpdateWithoutOwnersInput>
  }

  export type OwnerPermissionUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput> | OwnerPermissionCreateWithoutOwnerInput[] | OwnerPermissionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: OwnerPermissionCreateOrConnectWithoutOwnerInput | OwnerPermissionCreateOrConnectWithoutOwnerInput[]
    upsert?: OwnerPermissionUpsertWithWhereUniqueWithoutOwnerInput | OwnerPermissionUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: OwnerPermissionCreateManyOwnerInputEnvelope
    set?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    disconnect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    delete?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    connect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    update?: OwnerPermissionUpdateWithWhereUniqueWithoutOwnerInput | OwnerPermissionUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: OwnerPermissionUpdateManyWithWhereWithoutOwnerInput | OwnerPermissionUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: OwnerPermissionScalarWhereInput | OwnerPermissionScalarWhereInput[]
  }

  export type OwnerPermissionUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput> | OwnerPermissionCreateWithoutOwnerInput[] | OwnerPermissionUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: OwnerPermissionCreateOrConnectWithoutOwnerInput | OwnerPermissionCreateOrConnectWithoutOwnerInput[]
    upsert?: OwnerPermissionUpsertWithWhereUniqueWithoutOwnerInput | OwnerPermissionUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: OwnerPermissionCreateManyOwnerInputEnvelope
    set?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    disconnect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    delete?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    connect?: OwnerPermissionWhereUniqueInput | OwnerPermissionWhereUniqueInput[]
    update?: OwnerPermissionUpdateWithWhereUniqueWithoutOwnerInput | OwnerPermissionUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: OwnerPermissionUpdateManyWithWhereWithoutOwnerInput | OwnerPermissionUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: OwnerPermissionScalarWhereInput | OwnerPermissionScalarWhereInput[]
  }

  export type OwnerCreateNestedManyWithoutPlanInput = {
    create?: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput> | OwnerCreateWithoutPlanInput[] | OwnerUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OwnerCreateOrConnectWithoutPlanInput | OwnerCreateOrConnectWithoutPlanInput[]
    createMany?: OwnerCreateManyPlanInputEnvelope
    connect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
  }

  export type OwnerUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput> | OwnerCreateWithoutPlanInput[] | OwnerUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OwnerCreateOrConnectWithoutPlanInput | OwnerCreateOrConnectWithoutPlanInput[]
    createMany?: OwnerCreateManyPlanInputEnvelope
    connect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumPlanBillingCycleFieldUpdateOperationsInput = {
    set?: $Enums.PlanBillingCycle
  }

  export type EnumPlanStatusFieldUpdateOperationsInput = {
    set?: $Enums.PlanStatus
  }

  export type OwnerUpdateManyWithoutPlanNestedInput = {
    create?: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput> | OwnerCreateWithoutPlanInput[] | OwnerUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OwnerCreateOrConnectWithoutPlanInput | OwnerCreateOrConnectWithoutPlanInput[]
    upsert?: OwnerUpsertWithWhereUniqueWithoutPlanInput | OwnerUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: OwnerCreateManyPlanInputEnvelope
    set?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    disconnect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    delete?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    connect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    update?: OwnerUpdateWithWhereUniqueWithoutPlanInput | OwnerUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: OwnerUpdateManyWithWhereWithoutPlanInput | OwnerUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: OwnerScalarWhereInput | OwnerScalarWhereInput[]
  }

  export type OwnerUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput> | OwnerCreateWithoutPlanInput[] | OwnerUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: OwnerCreateOrConnectWithoutPlanInput | OwnerCreateOrConnectWithoutPlanInput[]
    upsert?: OwnerUpsertWithWhereUniqueWithoutPlanInput | OwnerUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: OwnerCreateManyPlanInputEnvelope
    set?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    disconnect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    delete?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    connect?: OwnerWhereUniqueInput | OwnerWhereUniqueInput[]
    update?: OwnerUpdateWithWhereUniqueWithoutPlanInput | OwnerUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: OwnerUpdateManyWithWhereWithoutPlanInput | OwnerUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: OwnerScalarWhereInput | OwnerScalarWhereInput[]
  }

  export type EnumAnnouncementTypeFieldUpdateOperationsInput = {
    set?: $Enums.AnnouncementType
  }

  export type EnumAnnouncementStatusFieldUpdateOperationsInput = {
    set?: $Enums.AnnouncementStatus
  }

  export type OwnerCreateNestedOneWithoutOwnerPermissionsInput = {
    create?: XOR<OwnerCreateWithoutOwnerPermissionsInput, OwnerUncheckedCreateWithoutOwnerPermissionsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutOwnerPermissionsInput
    connect?: OwnerWhereUniqueInput
  }

  export type OwnerUpdateOneRequiredWithoutOwnerPermissionsNestedInput = {
    create?: XOR<OwnerCreateWithoutOwnerPermissionsInput, OwnerUncheckedCreateWithoutOwnerPermissionsInput>
    connectOrCreate?: OwnerCreateOrConnectWithoutOwnerPermissionsInput
    upsert?: OwnerUpsertWithoutOwnerPermissionsInput
    connect?: OwnerWhereUniqueInput
    update?: XOR<XOR<OwnerUpdateToOneWithWhereWithoutOwnerPermissionsInput, OwnerUpdateWithoutOwnerPermissionsInput>, OwnerUncheckedUpdateWithoutOwnerPermissionsInput>
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

  export type NestedEnumOwnerStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.OwnerStatus | EnumOwnerStatusFieldRefInput<$PrismaModel>
    in?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.OwnerStatus[] | ListEnumOwnerStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumOwnerStatusFilter<$PrismaModel> | $Enums.OwnerStatus
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumPlanBillingCycleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanBillingCycle | EnumPlanBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanBillingCycleFilter<$PrismaModel> | $Enums.PlanBillingCycle
  }

  export type NestedEnumPlanStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusFilter<$PrismaModel> | $Enums.PlanStatus
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumPlanBillingCycleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanBillingCycle | EnumPlanBillingCycleFieldRefInput<$PrismaModel>
    in?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanBillingCycle[] | ListEnumPlanBillingCycleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanBillingCycleWithAggregatesFilter<$PrismaModel> | $Enums.PlanBillingCycle
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanBillingCycleFilter<$PrismaModel>
    _max?: NestedEnumPlanBillingCycleFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanStatus | EnumPlanStatusFieldRefInput<$PrismaModel>
    in?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanStatus[] | ListEnumPlanStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanStatusWithAggregatesFilter<$PrismaModel> | $Enums.PlanStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanStatusFilter<$PrismaModel>
    _max?: NestedEnumPlanStatusFilter<$PrismaModel>
  }

  export type NestedEnumAnnouncementTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeFilter<$PrismaModel> | $Enums.AnnouncementType
  }

  export type NestedEnumAnnouncementStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementStatus | EnumAnnouncementStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementStatusFilter<$PrismaModel> | $Enums.AnnouncementStatus
  }

  export type NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementType | EnumAnnouncementTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementType[] | ListEnumAnnouncementTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementTypeWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementTypeFilter<$PrismaModel>
  }

  export type NestedEnumAnnouncementStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AnnouncementStatus | EnumAnnouncementStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.AnnouncementStatus[] | ListEnumAnnouncementStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumAnnouncementStatusWithAggregatesFilter<$PrismaModel> | $Enums.AnnouncementStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAnnouncementStatusFilter<$PrismaModel>
    _max?: NestedEnumAnnouncementStatusFilter<$PrismaModel>
  }

  export type PlanCreateWithoutOwnersInput = {
    plan_uuid?: string
    plan_name: string
    plan_code: string
    plan_description?: string | null
    plan_price: Decimal | DecimalJsLike | number | string
    plan_offer_price?: Decimal | DecimalJsLike | number | string | null
    plan_currency?: string
    plan_billing_cycle?: $Enums.PlanBillingCycle
    plan_duration_days?: number | null
    plan_max_firms?: number
    plan_max_staff?: number
    plan_modules: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: boolean
    plan_sort_order?: number
    plan_status?: $Enums.PlanStatus
    plan_created_at?: Date | string
    plan_created_by?: string | null
    plan_updated_at?: Date | string
    plan_updated_by?: string | null
    plan_deleted_at?: Date | string | null
    plan_deleted_by?: string | null
    plan_is_deleted?: boolean
  }

  export type PlanUncheckedCreateWithoutOwnersInput = {
    plan_id?: number
    plan_uuid?: string
    plan_name: string
    plan_code: string
    plan_description?: string | null
    plan_price: Decimal | DecimalJsLike | number | string
    plan_offer_price?: Decimal | DecimalJsLike | number | string | null
    plan_currency?: string
    plan_billing_cycle?: $Enums.PlanBillingCycle
    plan_duration_days?: number | null
    plan_max_firms?: number
    plan_max_staff?: number
    plan_modules: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: boolean
    plan_sort_order?: number
    plan_status?: $Enums.PlanStatus
    plan_created_at?: Date | string
    plan_created_by?: string | null
    plan_updated_at?: Date | string
    plan_updated_by?: string | null
    plan_deleted_at?: Date | string | null
    plan_deleted_by?: string | null
    plan_is_deleted?: boolean
  }

  export type PlanCreateOrConnectWithoutOwnersInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutOwnersInput, PlanUncheckedCreateWithoutOwnersInput>
  }

  export type OwnerPermissionCreateWithoutOwnerInput = {
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
  }

  export type OwnerPermissionUncheckedCreateWithoutOwnerInput = {
    op_id?: number
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
  }

  export type OwnerPermissionCreateOrConnectWithoutOwnerInput = {
    where: OwnerPermissionWhereUniqueInput
    create: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput>
  }

  export type OwnerPermissionCreateManyOwnerInputEnvelope = {
    data: OwnerPermissionCreateManyOwnerInput | OwnerPermissionCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type PlanUpsertWithoutOwnersInput = {
    update: XOR<PlanUpdateWithoutOwnersInput, PlanUncheckedUpdateWithoutOwnersInput>
    create: XOR<PlanCreateWithoutOwnersInput, PlanUncheckedCreateWithoutOwnersInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutOwnersInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutOwnersInput, PlanUncheckedUpdateWithoutOwnersInput>
  }

  export type PlanUpdateWithoutOwnersInput = {
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanUncheckedUpdateWithoutOwnersInput = {
    plan_id?: IntFieldUpdateOperationsInput | number
    plan_uuid?: StringFieldUpdateOperationsInput | string
    plan_name?: StringFieldUpdateOperationsInput | string
    plan_code?: StringFieldUpdateOperationsInput | string
    plan_description?: NullableStringFieldUpdateOperationsInput | string | null
    plan_price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    plan_offer_price?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    plan_currency?: StringFieldUpdateOperationsInput | string
    plan_billing_cycle?: EnumPlanBillingCycleFieldUpdateOperationsInput | $Enums.PlanBillingCycle
    plan_duration_days?: NullableIntFieldUpdateOperationsInput | number | null
    plan_max_firms?: IntFieldUpdateOperationsInput | number
    plan_max_staff?: IntFieldUpdateOperationsInput | number
    plan_modules?: JsonNullValueInput | InputJsonValue
    plan_features?: NullableJsonNullValueInput | InputJsonValue
    plan_image?: NullableJsonNullValueInput | InputJsonValue
    plan_is_popular?: BoolFieldUpdateOperationsInput | boolean
    plan_sort_order?: IntFieldUpdateOperationsInput | number
    plan_status?: EnumPlanStatusFieldUpdateOperationsInput | $Enums.PlanStatus
    plan_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_created_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    plan_updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    plan_deleted_by?: NullableStringFieldUpdateOperationsInput | string | null
    plan_is_deleted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OwnerPermissionUpsertWithWhereUniqueWithoutOwnerInput = {
    where: OwnerPermissionWhereUniqueInput
    update: XOR<OwnerPermissionUpdateWithoutOwnerInput, OwnerPermissionUncheckedUpdateWithoutOwnerInput>
    create: XOR<OwnerPermissionCreateWithoutOwnerInput, OwnerPermissionUncheckedCreateWithoutOwnerInput>
  }

  export type OwnerPermissionUpdateWithWhereUniqueWithoutOwnerInput = {
    where: OwnerPermissionWhereUniqueInput
    data: XOR<OwnerPermissionUpdateWithoutOwnerInput, OwnerPermissionUncheckedUpdateWithoutOwnerInput>
  }

  export type OwnerPermissionUpdateManyWithWhereWithoutOwnerInput = {
    where: OwnerPermissionScalarWhereInput
    data: XOR<OwnerPermissionUpdateManyMutationInput, OwnerPermissionUncheckedUpdateManyWithoutOwnerInput>
  }

  export type OwnerPermissionScalarWhereInput = {
    AND?: OwnerPermissionScalarWhereInput | OwnerPermissionScalarWhereInput[]
    OR?: OwnerPermissionScalarWhereInput[]
    NOT?: OwnerPermissionScalarWhereInput | OwnerPermissionScalarWhereInput[]
    op_id?: IntFilter<"OwnerPermission"> | number
    op_own_id?: IntFilter<"OwnerPermission"> | number
    op_perm_key?: StringFilter<"OwnerPermission"> | string
    op_granted?: BoolFilter<"OwnerPermission"> | boolean
    op_created_at?: DateTimeFilter<"OwnerPermission"> | Date | string
    op_updated_at?: DateTimeFilter<"OwnerPermission"> | Date | string
  }

  export type OwnerCreateWithoutPlanInput = {
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
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    ownerPermissions?: OwnerPermissionCreateNestedManyWithoutOwnerInput
  }

  export type OwnerUncheckedCreateWithoutPlanInput = {
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
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    ownerPermissions?: OwnerPermissionUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type OwnerCreateOrConnectWithoutPlanInput = {
    where: OwnerWhereUniqueInput
    create: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput>
  }

  export type OwnerCreateManyPlanInputEnvelope = {
    data: OwnerCreateManyPlanInput | OwnerCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type OwnerUpsertWithWhereUniqueWithoutPlanInput = {
    where: OwnerWhereUniqueInput
    update: XOR<OwnerUpdateWithoutPlanInput, OwnerUncheckedUpdateWithoutPlanInput>
    create: XOR<OwnerCreateWithoutPlanInput, OwnerUncheckedCreateWithoutPlanInput>
  }

  export type OwnerUpdateWithWhereUniqueWithoutPlanInput = {
    where: OwnerWhereUniqueInput
    data: XOR<OwnerUpdateWithoutPlanInput, OwnerUncheckedUpdateWithoutPlanInput>
  }

  export type OwnerUpdateManyWithWhereWithoutPlanInput = {
    where: OwnerScalarWhereInput
    data: XOR<OwnerUpdateManyMutationInput, OwnerUncheckedUpdateManyWithoutPlanInput>
  }

  export type OwnerScalarWhereInput = {
    AND?: OwnerScalarWhereInput | OwnerScalarWhereInput[]
    OR?: OwnerScalarWhereInput[]
    NOT?: OwnerScalarWhereInput | OwnerScalarWhereInput[]
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
    own_plan_id?: IntNullableFilter<"Owner"> | number | null
    own_max_firms?: IntNullableFilter<"Owner"> | number | null
    own_max_staff?: IntNullableFilter<"Owner"> | number | null
    own_start_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
    own_expiry_date?: DateTimeNullableFilter<"Owner"> | Date | string | null
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
  }

  export type OwnerCreateWithoutOwnerPermissionsInput = {
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
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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
    plan?: PlanCreateNestedOneWithoutOwnersInput
  }

  export type OwnerUncheckedCreateWithoutOwnerPermissionsInput = {
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
    own_plan_id?: number | null
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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

  export type OwnerCreateOrConnectWithoutOwnerPermissionsInput = {
    where: OwnerWhereUniqueInput
    create: XOR<OwnerCreateWithoutOwnerPermissionsInput, OwnerUncheckedCreateWithoutOwnerPermissionsInput>
  }

  export type OwnerUpsertWithoutOwnerPermissionsInput = {
    update: XOR<OwnerUpdateWithoutOwnerPermissionsInput, OwnerUncheckedUpdateWithoutOwnerPermissionsInput>
    create: XOR<OwnerCreateWithoutOwnerPermissionsInput, OwnerUncheckedCreateWithoutOwnerPermissionsInput>
    where?: OwnerWhereInput
  }

  export type OwnerUpdateToOneWithWhereWithoutOwnerPermissionsInput = {
    where?: OwnerWhereInput
    data: XOR<OwnerUpdateWithoutOwnerPermissionsInput, OwnerUncheckedUpdateWithoutOwnerPermissionsInput>
  }

  export type OwnerUpdateWithoutOwnerPermissionsInput = {
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    plan?: PlanUpdateOneWithoutOwnersNestedInput
  }

  export type OwnerUncheckedUpdateWithoutOwnerPermissionsInput = {
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
    own_plan_id?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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

  export type OwnerPermissionCreateManyOwnerInput = {
    op_id?: number
    op_perm_key: string
    op_granted?: boolean
    op_created_at?: Date | string
    op_updated_at?: Date | string
  }

  export type OwnerPermissionUpdateWithoutOwnerInput = {
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnerPermissionUncheckedUpdateWithoutOwnerInput = {
    op_id?: IntFieldUpdateOperationsInput | number
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnerPermissionUncheckedUpdateManyWithoutOwnerInput = {
    op_id?: IntFieldUpdateOperationsInput | number
    op_perm_key?: StringFieldUpdateOperationsInput | string
    op_granted?: BoolFieldUpdateOperationsInput | boolean
    op_created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    op_updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OwnerCreateManyPlanInput = {
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
    own_max_firms?: number | null
    own_max_staff?: number | null
    own_start_date?: Date | string | null
    own_expiry_date?: Date | string | null
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

  export type OwnerUpdateWithoutPlanInput = {
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    ownerPermissions?: OwnerPermissionUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateWithoutPlanInput = {
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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
    ownerPermissions?: OwnerPermissionUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type OwnerUncheckedUpdateManyWithoutPlanInput = {
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
    own_max_firms?: NullableIntFieldUpdateOperationsInput | number | null
    own_max_staff?: NullableIntFieldUpdateOperationsInput | number | null
    own_start_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    own_expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
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



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use OwnerCountOutputTypeDefaultArgs instead
     */
    export type OwnerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlanCountOutputTypeDefaultArgs instead
     */
    export type PlanCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlanCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AdminDefaultArgs instead
     */
    export type AdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DbSeriesDefaultArgs instead
     */
    export type DbSeriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DbSeriesDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OwnerDefaultArgs instead
     */
    export type OwnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PlanDefaultArgs instead
     */
    export type PlanArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PlanDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AnnouncementDefaultArgs instead
     */
    export type AnnouncementArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AnnouncementDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OwnerPermissionDefaultArgs instead
     */
    export type OwnerPermissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OwnerPermissionDefaultArgs<ExtArgs>

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