const cp = require('child_process');
const args = process.argv.filter((el, idx) => idx > 0);
args.splice(0, 0, process.env.OUTPUT || 'public');
cp.fork(require.resolve('http-server/bin/http-server'), args);