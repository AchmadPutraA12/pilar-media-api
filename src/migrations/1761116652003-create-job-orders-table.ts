import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateJobOrdersTable1761116652003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'job_orders',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'transaction_number', type: 'varchar', isUnique: true },
                    { name: 'customer_name', type: 'varchar' },
                    { name: 'pickup_address', type: 'text' },
                    { name: 'destination_address', type: 'text' },
                    { name: 'status_job_order_id', type: 'int' },
                    { name: 'driver_id', type: 'int' },
                    { name: 'vehicle_id', type: 'int', isNullable: true },
                    { name: 'total_weight', type: 'float', isNullable: true },
                    { name: 'total_volume', type: 'float', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKeys('job_orders', [
            new TableForeignKey({
                columnNames: ['status_job_order_id'],
                referencedTableName: 'status_job_orders',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['driver_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id_user'],
                onDelete: 'CASCADE',
            }),
            new TableForeignKey({
                columnNames: ['vehicle_id'],
                referencedTableName: 'vehicles',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('job_orders');
    }
}
