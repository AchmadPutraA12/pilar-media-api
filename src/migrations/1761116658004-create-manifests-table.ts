import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateManifestsTable1761116658004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'manifests',
                columns: [
                    { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                    { name: 'job_order_id', type: 'int' },
                    { name: 'item_name', type: 'varchar' },
                    { name: 'quantity', type: 'int' },
                    { name: 'weight', type: 'float', isNullable: true },
                    { name: 'volume', type: 'float', isNullable: true },
                    { name: 'notes', type: 'text', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'manifests',
            new TableForeignKey({
                columnNames: ['job_order_id'],
                referencedTableName: 'job_orders',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('manifests');
    }
}
