import { DataSource } from 'typeorm';
import { StatusJobOrder } from '../../entities/status-job-order.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { JobOrder } from '../../entities/job-order.entity';
import { Manifest } from '../../entities/manifest.entity';
import { Location } from '../../entities/location.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

export async function seedJobOrders(dataSource: DataSource) {
    const { faker } = await import('@faker-js/faker');

    const statusRepo = dataSource.getRepository(StatusJobOrder);
    const vehicleRepo = dataSource.getRepository(Vehicle);
    const roleRepo = dataSource.getRepository(Role);
    const userRepo = dataSource.getRepository(User);
    const jobRepo = dataSource.getRepository(JobOrder);
    const manifestRepo = dataSource.getRepository(Manifest);
    const locationRepo = dataSource.getRepository(Location);

    let driverRole = await roleRepo.findOne({ where: { role_name: 'Driver' } });
    if (!driverRole) driverRole = await roleRepo.save(roleRepo.create({ role_name: 'Driver' }));

    let adminRole = await roleRepo.findOne({ where: { role_name: 'Admin' } });
    if (!adminRole) adminRole = await roleRepo.save(roleRepo.create({ role_name: 'Admin' }));

    const statuses = ['Pending', 'Assigned', 'On Delivery', 'Delivered', 'Canceled'];
    const statusEntities: StatusJobOrder[] = [];
    for (const nama of statuses) {
        const existing = await statusRepo.findOne({ where: { nama } });
        statusEntities.push(existing ?? await statusRepo.save(statusRepo.create({ nama })));
    }

    const vehicleTypes = ['Truck', 'Pickup', 'Box', 'Van'];
    const vehicles: Vehicle[] = [];
    for (let i = 0; i < 10; i++) {
        const v = vehicleRepo.create({
            nama_kendaraan: `Vehicle-${i + 1}`,
            plate_number: `B${faker.number.int({ min: 1000, max: 9999 })}${faker.string.alpha({ casing: 'upper', length: 2 })}`,
            warna: faker.color.human(),
            type: faker.helpers.arrayElement(vehicleTypes),
            capacity: Number(faker.number.float({ min: 1000, max: 10000, fractionDigits: 2 })),
        });
        vehicles.push(v);
    }
    await vehicleRepo.save(vehicles);

    const drivers: User[] = [];
    for (let i = 0; i < 5; i++) {
        const driver = userRepo.create({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: driverRole,
            role_id: driverRole.id_role,
        });
        drivers.push(await userRepo.save(driver));
    }

    const jobOrders: JobOrder[] = [];
    for (let i = 0; i < 30; i++) {
        const randomStatus = faker.helpers.arrayElement(statusEntities);
        const randomDriver = faker.helpers.arrayElement(drivers);
        const randomVehicle = faker.helpers.arrayElement(vehicles);

        const jobOrder = jobRepo.create({
            transaction_number: `JOB-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
            customer_name: faker.person.fullName(),
            pickup_address: faker.location.streetAddress(),
            destination_address: faker.location.streetAddress(),
            status: randomStatus,
            driver: randomDriver,
            vehicle: randomVehicle,
            total_weight: Number(faker.number.float({ min: 100, max: 5000, fractionDigits: 2 })),
            total_volume: Number(faker.number.float({ min: 5, max: 200, fractionDigits: 2 })),
        });

        const savedJob = await jobRepo.save(jobOrder);
        jobOrders.push(savedJob);

        const manifestCount = faker.number.int({ min: 2, max: 6 });
        for (let j = 0; j < manifestCount; j++) {
            const manifest = manifestRepo.create({
                jobOrder: savedJob,
                item_name: faker.commerce.productName(),
                quantity: faker.number.int({ min: 1, max: 10 }),
                weight: Number(faker.number.float({ min: 1, max: 50, fractionDigits: 2 })),
                volume: Number(faker.number.float({ min: 0.1, max: 2, fractionDigits: 2 })),
                notes: faker.lorem.sentence(),
            });
            await manifestRepo.save(manifest);
        }

        const pickup = new Location();
        pickup.jobOrder = savedJob;
        pickup.type = 'pickup';
        pickup.address = faker.location.streetAddress();
        pickup.lat = faker.location.latitude().toString();
        pickup.lng = faker.location.longitude().toString();
        pickup.province = 'DKI Jakarta';
        pickup.city = 'Jakarta';
        pickup.district = faker.location.city();

        const destination = new Location();
        destination.jobOrder = savedJob;
        destination.type = 'destination';
        destination.address = faker.location.streetAddress();
        destination.lat = faker.location.latitude().toString();
        destination.lng = faker.location.longitude().toString();
        destination.province = 'Jawa Barat';
        destination.city = faker.location.city();
        destination.district = faker.location.city();

        await locationRepo.save(pickup);
        await locationRepo.save(destination);
    }
}
