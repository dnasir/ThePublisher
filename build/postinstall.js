if (process.env.NODE_ENV === 'production') {
  var exec = require('child_process').exec;
  exec('npm run build', function (err, stdout, stderr) {
    if (err) throw err;
    else console.log(stdout);
  });
}