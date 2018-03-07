import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import schema from './graphql/schema';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    private middleware(): void {
        // this.express.use('/hello', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        //     res.send({
        //         hello: 'Hello World!'
        //     })
        // });
        this.express.use('/graphql', graphqlHTTP({
          schema,
          graphiql: process.env.NODE_ENV === 'development'
        }));
    }
}

export default new App().express;