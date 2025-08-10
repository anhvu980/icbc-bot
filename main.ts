import { Worker } from 'worker_threads';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'csv-parse';

type User = {
  lastName: string;
  licenceNumber: string;
  keyword: string;
};

// Read CSV and return User[]
function readUsersFromCSV(filePath: string): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const users: User[] = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => {
        users.push({
          lastName: row.lastName,
          licenceNumber: row.licenceNumber,
          keyword: row.keyword,
        });
      })
      .on('end', () => resolve(users))
      .on('error', (error) => reject(error));
  });
}

// Split array into chunks
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function main() {
  try {
    const users = await readUsersFromCSV('./users.csv');
    const workerCount = 4; // number of parallel workers
    const chunks = chunkArray(users, Math.ceil(users.length / workerCount));

    let completedWorkers = 0;

    for (const chunk of chunks) {
      const worker = new Worker(path.resolve(__dirname, 'dist', 'worker.js'), {
        workerData: chunk,
      });

      worker.on('message', (msg) => {
        console.log(`[Worker] ${msg}`);
      });

      worker.on('error', (err) => {
        console.error('[Worker error]', err);
      });

      worker.on('exit', (code) => {
        completedWorkers++;
        console.log(`[Worker] exited with code ${code}`);
        if (completedWorkers === chunks.length) {
          console.log('All workers finished');
        }
      });
    }
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
