import cors from 'cors';
import express, { RequestHandler } from 'express';
import { instantiateGenRoutes, Tokenizer } from '@index';

export class MonolinkApp {
  private app: express.Application;
  private router: express.Router;
  private tokenizer;

  constructor() {
    this.tokenizer = new Tokenizer();
    this.app = express();
    this.router = express.Router();
  }

  public run() {
    instantiateGenRoutes(this.router, this.tokenizer);

    this.app.use(cors());
    this.app.use(express.json() as RequestHandler);
    this.app.use('/', this.router);
    this.app.listen(3020);
  }
}
