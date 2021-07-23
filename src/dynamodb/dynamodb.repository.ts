import { DataMapper, ScanIterator, QueryOptions, ParallelScanWorkerOptions, ScanOptions, DeleteOptions } from "@aws/dynamodb-data-mapper";
import { DynamoDB } from "aws-sdk";
import { ConditionExpression } from "aws-sdk/clients/dynamodb";

export type Newable<T> = { new (...args: any[]): T };
export type DynamoDBCondition<T> =
  | ConditionExpression
  | Partial<Record<keyof T, ConditionExpression | any>>;


export interface DynamoDbRepositoryOptions {
  endpoint: string,
  region: string
}
export class DynamoDBRepository<T> {
    mapper: DataMapper;
    dynamoDbClient!: DynamoDB;
  
    constructor(private readonly entityClass: Newable<T>, options: DynamoDbRepositoryOptions) {
      const environment = 'development';

      try {
        this.dynamoDbClient = new DynamoDB(options)
      } catch(e) {
        const error = e as Error;
        console.error(`Failed to create dynamodb client: ${e.mesage}`)

        throw e;
      }
      this.mapper = new DataMapper({ client: this.dynamoDbClient, tableNamePrefix: `${environment}-` });
  
      if (environment === 'development') {
        console.log("Making sure table exists!");
        this.mapper.ensureTableExists(entityClass, {
          readCapacityUnits: 5,
          writeCapacityUnits: 5,
        });
      }
    }
  
    // eslint-disable-next-line new-cap
    private buildEntity = (arg: DynamoDBCondition<T>) => Object.assign(new this.entityClass(), arg);
  
    private async convertMapperResultsToArray(mapperResults: ScanIterator<T>) {
      const allResults = [];
      // Disabled linter for the line below, it follows syntax recomended by: https://github.com/awslabs/dynamodb-data-mapper-js
      // eslint-disable-next-line no-restricted-syntax
      for await (const result of mapperResults) {
        allResults.push(result);
      }
  
      return allResults;
    }
  
    async put(value: T): Promise<T> {
      return this.mapper.put(this.buildEntity(value));
    }
  
    async get(params: Partial<T>): Promise<T> {
      return this.mapper.get(this.buildEntity(params));
    }
  
    async query(
      params: DynamoDBCondition<T>,
      options?: QueryOptions,
    ): Promise<T[]> {
      const mapperResults = this.mapper.query(
        this.entityClass,
        this.buildEntity(params),
        options,
      );
  
      return this.convertMapperResultsToArray(mapperResults);
    }
  
    async scan(options?:  ScanOptions | ParallelScanWorkerOptions): Promise<T[]> {
      const mapperResults = this.mapper.scan(this.entityClass, options);
  
      return this.convertMapperResultsToArray(mapperResults);
    }
  
    getMapper() {
      return this.mapper;
    }
  
    getClient() {
      return this.dynamoDbClient;
    }
  
    getEntityClass() {
      return this.entityClass;
    }
  }
  