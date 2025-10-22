import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1761116611091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id_user",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    { name: "name", type: "varchar" },
                    { name: "email", type: "varchar", isUnique: true },
                    { name: "email_verified_at", type: "timestamp", isNullable: true },
                    { name: "password", type: "varchar" },
                    { name: "role_id", type: "int" },
                    { name: "remember_token", type: "varchar", isNullable: true },
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
                        columnNames: ["role_id"],
                        referencedTableName: "roles",
                        referencedColumnNames: ["id_role"],
                        onDelete: "CASCADE",
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}
