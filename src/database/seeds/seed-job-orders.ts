import { DataSource } from 'typeorm';
import { StatusJobOrder } from '../../entities/status-job-order.entity';
import { Vehicle } from '../../entities/vehicle.entity';
import { JobOrder } from '../../entities/job-order.entity';
import { Manifest } from '../../entities/manifest.entity';
import { Location } from '../../entities/location.entity';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

export async function seedJobOrders(dataSource: DataSource) {
    const { fakerID_ID: faker } = await import('@faker-js/faker');

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
            nama_kendaraan: `Kendaraan-${i + 1}`,
            plate_number: `B ${faker.number.int({ min: 1000, max: 9999 })} ${faker.string.alpha({ length: 2, casing: 'upper' })}`,
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

    const cityData = [
        { province: 'DKI Jakarta', city: 'Jakarta Selatan', lat: -6.2607, lng: 106.8106, city_id: 152 },
        { province: 'Jawa Barat', city: 'Bandung', lat: -6.9175, lng: 107.6191, city_id: 23 },
        { province: 'Jawa Tengah', city: 'Semarang', lat: -6.9667, lng: 110.4167, city_id: 39 },
        { province: 'DI Yogyakarta', city: 'Yogyakarta', lat: -7.7956, lng: 110.3695, city_id: 501 },
        { province: 'Jawa Timur', city: 'Surabaya', lat: -7.2575, lng: 112.7521, city_id: 114 },
        { province: 'Banten', city: 'Tangerang', lat: -6.1783, lng: 106.6319, city_id: 151 },
    ];

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

        const pickupCity = faker.helpers.arrayElement(cityData);
        let destinationCity = faker.helpers.arrayElement(cityData);
        while (destinationCity.city === pickupCity.city) {
            destinationCity = faker.helpers.arrayElement(cityData);
        }

        const pickup = locationRepo.create({
            jobOrder: savedJob,
            type: 'pickup',
            address: `${faker.location.streetAddress()}, ${pickupCity.city}`,
            province: pickupCity.province,
            city: pickupCity.city,
            district: faker.location.city(),
            lat: (pickupCity.lat + faker.number.float({ min: -0.02, max: 0.02 })).toFixed(6),
            lng: (pickupCity.lng + faker.number.float({ min: -0.02, max: 0.02 })).toFixed(6),
            province_id: 0,
            city_id: pickupCity.city_id,
            district_id: 0,
        });

        const destination = locationRepo.create({
            jobOrder: savedJob,
            type: 'destination',
            address: `${faker.location.streetAddress()}, ${destinationCity.city}`,
            province: destinationCity.province,
            city: destinationCity.city,
            district: faker.location.city(),
            lat: (destinationCity.lat + faker.number.float({ min: -0.02, max: 0.02 })).toFixed(6),
            lng: (destinationCity.lng + faker.number.float({ min: -0.02, max: 0.02 })).toFixed(6),
            province_id: 0,
            city_id: destinationCity.city_id,
            district_id: 0,
        });

        await locationRepo.save([pickup, destination]);
    }

    console.log('✅ Seeder Job Orders (realistic Indonesia data) selesai');
}
