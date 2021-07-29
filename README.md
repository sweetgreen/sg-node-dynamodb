# sg-node-dynamodb

## How to Guide

### NestsJS

`sg-node-dynamodb` provides an injectable dynamo repository that eases the developer experience by following conventions established by TypeORM and NestJS.

1. Setup the dynamodb connection by specifying REGION and DDB_ENDPOINT in .env:

   ```bash
   REGION=us-east-1
   DDB_ENDPOINT=http://localhost:8000
   ```

2. Markup your entity class as DynamoDB table with annotations from `@aws/dynamodb-data-mapper-annotations`

   ```ts
   import {
     hashKey,
     rangeKey,
     attribute,
     table,
   } from '@aws/dynamodb-data-mapper-annotations';

   @table('test_table')
   export class TestModel {
     @hashKey()
     hash_key: string;

     @rangeKey()
     range_key: string;

     @attribute()
     test_attribute: string;
   }

   // For a live example, refer to:
   // `apps/kitchen-ingredient-forecast/src/ingredients/entities/active-ingredient.entity.ts`.
   ```

3. Include a call to DynamoDBMapperModule.forFeature() in module imports array. Specify models that will be used in the module as parameters:

   ```js
   @Module({
     imports: [
       DynamoDBMapperModule.forFeature([TestModel]),
     ],
   })

   // For a live example, refer to:
   // `apps/kitchen-ingredient-forecast/src/ingredients/ingredients.module.ts`.
   ```

4. Inject and use `DynamoDBRepository` in classes using the SgInjectDynamoRepository decorator:

   ```js
   @Injectable()
   export class TestServiceService {
     // Inject
     constructor(
       @SgInjectDynamoRepository(TestModel)
       private readonly testRepository: DynamoDBRepository<TestModel>
     ) {}

     // Use
     async myMethod() {
       return this.testRepository.get({ hash_key: 'test', range_key: 'test' })
     }
   }

   // For a live example, refer to:
   // `apps/kitchen-ingredient-forecast/src/ingredients/ingredients.service.ts`.

   // The repository provides methods to get, put, update, query, scan and delete.
   ```
