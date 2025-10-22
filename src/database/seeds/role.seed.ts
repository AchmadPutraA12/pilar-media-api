import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';

export default async function seedRoles(dataSource: DataSource) {
    const roleRepo = dataSource.getRepository(Role);

    const count = await roleRepo.count();
    if (count === 0) {
        await roleRepo.insert([
            { role_name: 'Admin' },
            { role_name: 'User' },
        ]);
        console.log('✅ Roles seeded successfully!');
    } else {
        console.log('ℹ️ Roles already exist, skipping...');
    }
}
