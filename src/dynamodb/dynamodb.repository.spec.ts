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
})