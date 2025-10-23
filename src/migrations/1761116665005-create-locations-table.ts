import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLocationsTable1761116665005 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'locations',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'job_order_id', type: 'int' },
                    { name: 'type', type: 'varchar' },
                    { name: 'address', type: 'text' },
                    { name: 'lat', type: 'decimal', precision: 10, scale: 6, isNullable: true },
                    { name: 'lng', type: 'decimal', precision: 10, scale: 6, isNullable: true },
                    { name: 'province', type: 'varchar', isNullable: true },
                    { name: 'city', type: 'varchar', isNullable: true },
                    { name: 'district', type: 'varchar', isNullable: true },
                    { name: 'province_id', type: 'int', isNullable: true },
                    { name: 'city_id', type: 'int', isNullable: true },
                    { name: 'district_id', type: 'int', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'locations',
            new TableForeignKey({
                columnNames: ['job_order_id'],
                referencedTableName: 'job_orders',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('locations');
    }
}
