import { setRemoteDefinitions } from '@nx/angular/mf';

// validate env
// zod -> schema validation -> parse()

// try {
//  validationSchema.parse(process.env)
// } catch (error) {

// console.log('hello! ', process.env['NX_PUBLIC_TARGET_ENV']);

const manifestFile = '/federation-manifest.json';

// if (process.env['NX_PUBLIC_TARGET_ENV'] === 'local') {
//   manifestFile = '/federation-manifest.local.json';
// } else {
//   throw new Error('TARGET_ENV is not set');
// }

fetch(manifestFile)
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));

// import('./bootstrap').catch((err) => console.error(err));
