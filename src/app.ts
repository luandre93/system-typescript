import express from 'express';
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import bodyParser from "body-parser";
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './controllers/users.routes.config';
import { PrintersRoutes } from './controllers/printers.routes.config';
import debug from 'debug';
import { ConsoleLine } from './util/console.msg';
import { LoginRoutes } from './controllers/login.routes.config';
import { RulesRoutes } from './controllers/rules.routes.config';
import { SwaggerRoutes } from './controllers/swagger.routes.config';
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
const lineConsole = new ConsoleLine();
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));
routes.push(new PrintersRoutes(app));
routes.push(new LoginRoutes(app));
routes.push(new RulesRoutes(app));
routes.push(new SwaggerRoutes(app));

const runningMessage: string = `Servidor: http://localhost:${port}.`;

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    lineConsole.frontLn(runningMessage)
});