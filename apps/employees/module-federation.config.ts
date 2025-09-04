import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'employees',
  exposes: {
    './Routes': 'apps/employees/src/app/remote-entry/entry.routes.ts',
    './EmployeesList':
      'apps/employees/src/app/remote-entry/employees-list.component.ts',
  },
};

/**
 * Nx requires a default export of the config to allow correct resolution of the module federation graph.
 **/
export default config;
