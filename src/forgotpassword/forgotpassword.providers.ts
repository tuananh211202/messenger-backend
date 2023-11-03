import { DataSource } from "typeorm";
import { ForgotPassword } from "./forgotpassword.entity";
import { dataProvideName } from "src/database/constants";
import { forgotpasswordProviderName } from "./constants";

export const forgotpasswordProvider = [
  {
    provide: forgotpasswordProviderName,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ForgotPassword),
    inject: [dataProvideName]
  },
]
