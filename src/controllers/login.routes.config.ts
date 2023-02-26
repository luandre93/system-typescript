import express from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
//import { getUserByUsername } from '../database/dal/users.dal';
import jwt from 'jsonwebtoken';
/* const ActiveDirectory = require("activedirectory"); */
interface Config {
    url: string;
    baseDN: string;
    username: string;
    password: string;
}

const version: string = "api/v1"

export class LoginRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'LoginRoutes');
    }
    configureRoutes() {
        /* let activedirectory: any; */
        this.app.route(`/${version}/login`)
            .post(async (req: express.Request, res: express.Response) => {
                let options: Config = {
                    username: `${req.body.username}@grupopereira.local`,
                    password: req.body.password,
                    url: 'ldap://grupopereira.local',
                    baseDN: 'dc=grupopereira,dc=local',
                }
                /*               activedirectory = new ActiveDirectory(paramAd);
                              activedirectory.authenticate(paramAd.username, paramAd.password, function (err: any, auth: any) { */
                /*    if (auth) { */
                const secret: jwt.Secret = "5094265240";
                // const token: string | undefined = req.header('Authorization');
                console.log(req.body.username)
                const result = ''
                //   const result: Promise<any> = await getUserByUserName(req.body.username);
                if (await result) {
                    jwt.sign(req.body.username, secret, (err: any, token: any) => {
                        if (err) {
                            res.status(500)
                                .json({ auth: false, access: false, serverOn: false });
                            return;
                        }
                        res.json({
                            username: req.body.username,
                            token: token,
                            auth: true,
                            access: true,
                        });
                        res.set("x-access-token", token);
                        res.end();
                    });
                    /*         } else {
                                res.json({ auth: true, access: false });
                                return;
                            } */
                    /*   } else {
                          res.json({ auth: false, access: false });
                          return;
                      } */
                }
                /*         }); */
            })
        return this.app;
    }
}
