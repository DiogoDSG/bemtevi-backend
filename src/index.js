import { httpServer } from './socket.js';

const port = process.env.PORT;

httpServer.listen(port, () => console.log(`Listening on port ${port}`));
