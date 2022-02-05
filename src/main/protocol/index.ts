import { join, extname } from 'path';
import { protocol } from 'electron';

export const registerProtocol = () => {
  protocol.registerFileProtocol('browser', (request, callback) => {
    const url = request.url.substring(10);

    if (extname(url)) return callback({ path: join('.', 'pages', url) });

    callback({ path: join('.', 'pages', url, 'index.html') });
  });
};
