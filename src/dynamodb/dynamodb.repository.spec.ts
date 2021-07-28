import { QueryIterator } from "@aws/dynamodb-data-mapper";
import { DynamoDBRepository } from "./dynamodb.repository";
import { testData, TestModel } from "./dynamodb.repository.testdata";

describe('dynamodb repository', () => {

  let repo: DynamoDBRepository<TestModel>;
  beforeAll(() => {
    repo = new DynamoDBRepository<TestModel>(TestModel, {
      endpoint: 'http://localhost:8000',
      region: 'us-east-2',
      environment: 'testing'
    });
  });

  it('gets data from dynamodb through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.get;

    const mock = jest
      .spyOn(mapper, 'get')
      .mockImplementation(async () => responseData);

    const response = await repo.get({
      hash_key: 'test',
      range_key: 'test',
    });

    expect(mock).toBeCalledWith({ hash_key: 'test', range_key: 'test' });
    expect(response).toEqual(responseData);
  });

  it('puts data to dynamodb client through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.put;

    const mock = jest
      .spyOn(mapper, 'put')
      .mockImplementation(async () => responseData);

    const newData = {
      hash_key: 'test',
      range_key: 'test',
      test_attribute: 'test',
    };
    const response = await repo.put(newData);

    expect(mock).toBeCalledWith(newData);
    expect(response).toEqual(responseData);
  });

  it('updates data to dynamodb client through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.update;

    const mock = jest
      .spyOn(mapper, 'update')
      .mockImplementation(async () => responseData);

    const newData = {
      hash_key: 'test',
      range_key: 'test',
      test_attribute: 'test',
    };
    const response = await repo.update(newData);

    expect(mock).toBeCalledWith(newData);
    expect(response).toEqual(responseData);
  });
  it('queries data from dynamodb through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.query;

    const mock = jest
      .spyOn(mapper, 'query')
      .mockImplementation(() => responseData as unknown as QueryIterator<any>);

    const searchQuery = {
      hash_key: 'test',
      range_key: 'test',
    };
    const response = await repo.query(searchQuery);

    expect(mock).toBeCalledWith(TestModel, searchQuery, undefined);
    expect(response).toEqual(responseData);
  });

  it('scans data from dynamodb through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.query;

    const mock = jest
      .spyOn(mapper, 'scan')
      .mockImplementation(() => responseData as unknown as QueryIterator<any>);

    const response = await repo.scan();

    expect(mock).toBeCalledWith(TestModel, undefined);
    expect(response).toEqual(responseData);
  });

  it('deletes data from dynamodb through mapper', async () => {
    const mapper = repo.getMapper();
    const responseData = testData.get;

    const mock = jest
      .spyOn(mapper, 'delete')
      .mockImplementation(async () => responseData);

    const deleteQuery = {
      hash_key: 'test',
      range_key: 'test',
    };
    const response = await repo.delete(deleteQuery);

    expect(mock).toBeCalledWith(deleteQuery, undefined);
    expect(response).toEqual(responseData);
  });
})