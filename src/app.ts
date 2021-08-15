import { ProjectList } from './comps/projectList';
import { ProjectInput } from './comps/projectInput';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');

console.log('Dev server is working!');
