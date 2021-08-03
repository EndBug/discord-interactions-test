import nodemon from 'nodemon'
import fs from 'fs'

var child = nodemon(
  '--exec "node -r ts-node/register --max-old-space-size=600 --trace-warnings" src/main.ts'
)

child.on('log', ({ colour }) => console.log(colour))
child.on('readable', function () {
  // the `readable` event indicates that data is ready to pick up
  this.stdout.pipe(fs.createWriteStream('output.txt'))
  this.stderr.pipe(fs.createWriteStream('err.txt'))
})
