import { setRemoteDefinitions } from '@nx/angular/mf';

// TODO: Step 0: try to use ZOD
// validate env
// zod -> schema validation -> parse()

// try {
//  validationSchema.parse(process.env)
// } catch (error) {

// console.log('hello! ', process.env['NX_PUBLIC_TARGET_ENV']);

// TODO: Step 1: change webpack configuration to read env variables and pass them to the frontend

// TODO: Step 2: read variable and select proper manifest file
// for production -> federation-manifest.production.json
// for staging -> federation-manifest.staging.json
// for local -> federation-manifest.local.json
const manifestFile = '/federation-manifest.json';

// STEP 3: fetch manifest file and bootstrap app
fetch(manifestFile)
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));

// import('./bootstrap').catch((err) => console.error(err));
