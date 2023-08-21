import express from 'express';
import detectPort from 'detect-port';
import waitOn from 'wait-on';
import open from "open"

const app = express();

app.use(express.static('./'));

waitOn({
  resources: ["repl/dist/moreMaps-repl.js"]
}).then(() => detectPort(6500)).then((port) => {
  app.listen(port, () => {
    console.log("")
    console.log(`Listening at http://127.0.0.1:${port}`)
    open(`http://127.0.0.1:${port}`)
  })
})
