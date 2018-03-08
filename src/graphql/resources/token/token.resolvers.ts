import { Dbconnection } from "../../../Interfaces/DbConnectionInterface";
import { UserInstance } from "../../../Models/UserModel";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../../../utils/utils";

export const tokenResolvers = {
    Mutation: {
        createToken: (parent, { email, password}, {db}: {db: Dbconnection}) => {
            return db.User.findOne({
                where: {email: email},
                attributes: ['id', 'password']
            }).then((user: UserInstance) => {
                if (!user || !user.isPasswordValid(user.get('password'), password)) {
                    throw new Error('Unauthorized, wrong email or password!');
                }

                const payload = {sub: user.get('id')};

                return {
                    token: jwt.sign(payload, JWT_SECRET)
                }
            });
        }
    }
}