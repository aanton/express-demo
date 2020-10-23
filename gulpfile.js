const helloTask = (cb) => {
  console.log('I am a Gulp task');

  cb();
}

exports.hello = helloTask;
