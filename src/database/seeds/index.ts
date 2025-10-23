import 'dotenv/config';
import { AppDataSource } from '../../data-source';
import seedRoles from './role.seed';
import seedUsers from './user.seed';
import { seedJobOrders } from './seed-job-orders';

async function runSeeders() {
    await AppDataSource.initialize();

    await seedRoles(AppDataSource);
    await seedUsers(AppDataSource);
    await seedJobOrders(AppDataSource);
    await AppDataSource.destroy();
}

runSeeders().catch((err) => {
    process.exit(1);
});
