import { hashKey, rangeKey, attribute, table } from '@aws/dynamodb-data-mapper-annotations';

const sampleData = {
    hash_key: 'test',
    range_key: 'test',
    test_attribute: 'test'
} as TestModel;

export const testData = {
    get: sampleData,
    put: sampleData,
    delete: sampleData,
    update: sampleData,
    query: [sampleData]
}

@table('test_table')
export class TestModel {
    @hashKey()
    hash_key!: string;

    @rangeKey()
    range_key!: string;

    @attribute()
    test_attribute!: string;
}
