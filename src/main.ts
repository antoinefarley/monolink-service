import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import 'module-alias/register';
import { MonolinkApp } from '@index';

const app = new MonolinkApp();
app.run();
