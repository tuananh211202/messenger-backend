import { DataSource } from "typeorm";
import { User } from "./user.entity";
import { dataProvideName } from "src/database/constants";
import { userProvideName } from "./constants";

export const userProviders = [
  {
    provide: userProvideName,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [dataProvideName]
  },
]
