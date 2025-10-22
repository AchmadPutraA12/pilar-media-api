import { DataSource } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export default async function seedUsers(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const count = await userRepo.count();

  if (count === 0) {
    const hash = await bcrypt.hash('password123', 10);
    await userRepo.insert([
      {
        name: 'Admin SendPick',
        email: 'admin@sendpick.com',
        password: hash,
        role_id: 1,
      },
      {
        name: 'User Biasa',
        email: 'user@sendpick.com',
        password: hash,
        role_id: 2,
      },
    ]);
    console.log('✅ Users seeded successfully!');
  } else {
    console.log('ℹ️ Users already exist, skipping...');
  }
}
