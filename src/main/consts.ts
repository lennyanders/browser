import { join } from 'path';
import { app } from 'electron';
import { isDev } from '../shared/consts';

export const cwd = process.cwd();

export const userDataPath = isDev ? join(process.cwd(), '..', 'userData') : app.getPath('userData');
