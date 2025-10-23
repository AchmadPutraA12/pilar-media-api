import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVehiclesTable1761116645002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'vehicles',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'nama_kendaraan', type: 'varchar' },
                    { name: 'plate_number', type: 'varchar', isUnique: true },
                    { name: 'warna', type: 'varchar' },
                    { name: 'type', type: 'varchar' },
                    { name: 'capacity', type: 'float', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('vehicles');
    }
}
