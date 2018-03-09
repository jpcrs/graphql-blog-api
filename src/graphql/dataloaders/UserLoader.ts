import { UserModel, UserInstance } from "../../Models/UserModel";
import { DataLoaderParam } from "../../Interfaces/DataLoaderParamInterface";
import { RequestedFields } from "../ast/RequestedFields";

export class UserLoader {
    static batchUsers(User: UserModel, params: DataLoaderParam<number>[], requestedFields: RequestedFields): Promise<UserInstance[]> {
        let ids: number[] = params.map(param => param.key);
        return Promise.resolve(
            User.findAll({
                where: { id: { $in: ids } },
                attributes: requestedFields.getFields(params[0].info, {keep: ['id'], exclude: ['posts']})
            })
        );
    }
}
