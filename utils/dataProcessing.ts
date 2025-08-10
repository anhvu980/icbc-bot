import { readFileSync } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { User } from '../types/user';

// export function readUsersFromCSV(filePath: string): Promise<User[]> {
//   return new Promise((resolve, reject) => {
//     const users: User[] = [];
//     fs.createReadStream(filePath)
//       .pipe(parse({ columns: true, trim: true }))
//       .on('data', (row) => {
//         users.push({
//           lastName: row.lastName,
//           licenseNumber: row.licenseNumber,
//           keyword: row.keyword,
//         });
//       })
//       .on('end', () => resolve(users))
//       .on('error', (error) => reject(error));
//   });
// }

export function readUsersFromCSV(fileName: string): User[] {
  const csvFilePath = path.resolve('data', fileName);
  const csvContent = readFileSync(csvFilePath, 'utf-8');
  return parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

export function getUserFromCSVByIndex(fileName: string, index = 0): User {
  const csvFilePath = path.resolve('data', fileName);
  const csvContent = readFileSync(csvFilePath, 'utf-8');
  const users: User[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  if (index < 0 || index >= users.length) {
    throw new Error(`User index ${index} out of range. CSV has ${users.length} rows.`);
  }
  return users[index];
}
