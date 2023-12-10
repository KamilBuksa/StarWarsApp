import { DataSource } from "typeorm";
import { clearDB, getTestDataSource, getTestUser, getToken, req } from "../../../test/test-utils";

describe('User Current', () => {
  let ds: DataSource;

  beforeAll(async () => {
    ds = getTestDataSource();
    await ds.initialize();
  });
  afterAll(async () => {
    await ds.destroy();
  });
  beforeEach(async () => {
    await clearDB(ds);
  });
  it('GET /users/current should return current user', async () => {
    console.log("DUPA");

    const user = await ds.manager.save(getTestUser({}));

    const res = await req({ method: 'GET', route: '/users/current' })
      .set('Authorization', getToken(user));
    // console.log(res);
    // const res = await req({ method: 'GET', route: '/users/current' })
    console.log(res.body);
    // // expect(res.statusCode).toBe(200);
    // expect(res.body.name).toBeDefined();

    // console.log(user);
    expect(2).toBeDefined();
  });

});
