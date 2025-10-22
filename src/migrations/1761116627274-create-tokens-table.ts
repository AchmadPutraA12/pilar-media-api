import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTokensTable1761116627274 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "token",
                columns: [
                    {
                        name: "id_token",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    { name: "user_id", type: "int" },
                    { name: "token", type: "varchar", length: "80", isUnique: true },
                    { name: "device_name", type: "varchar", isNullable: true },
                    { name: "last_used_at", type: "timestamp", isNullable: true },
                    { name: "expired_at", type: "timestamp", isNullable: true },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["user_id"],
                        referencedTableName: "users",
                        referencedColumnNames: ["id_user"],
                        onDelete: "CASCADE",
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("token");
    }
}
