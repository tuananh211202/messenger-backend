import { DataSource } from "typeorm";
import { dataProvideName } from "src/database/constants";
import { friendRequestProvideName } from "./constants";
import { FriendRequest } from "./friend-request.entity";

export const friendRequestProviders = [
  {
    provide: friendRequestProvideName,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FriendRequest),
    inject: [dataProvideName]
  },
]
