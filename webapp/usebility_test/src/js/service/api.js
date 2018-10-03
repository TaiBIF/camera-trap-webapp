
import * as db from './db.js';

export function getProjects() {
  return new Promise((resolve, reject) => {
    let data = db.projects;
    resolve(data);
  })
}
