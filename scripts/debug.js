const { exec } = require('child_process');
const Vue = require('vue');

const getSHA = () =>
  new Promise((resolve, reject) => {
    exec('git rev-parse HEAD', (err, stdout) => {
      if (err) reject(err);

      resolve(stdout.replace('\n', ''));
    });
  });

const out = {
  VUE_VER: Vue.version,
  BUILD_TIME: new Date().toString(),
};

(async () => {
  out.SHA = await getSHA();
  console.log(JSON.stringify(out, null, 2));
})();
