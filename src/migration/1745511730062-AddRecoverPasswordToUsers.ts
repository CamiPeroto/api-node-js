import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRecoverPasswordToUsers1745511730062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(  "users", new TableColumn({
                name: "recoverPassword",
                type: "varchar",
                isUnique: true,
                isNullable: true,
              }));
        
              //Ajustar a ordem da coluna
              await queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER password`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("users", "recoverPassword");
    }

}
