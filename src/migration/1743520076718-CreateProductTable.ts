import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductTable1737654013869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar a tabela "products"
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "productSituationId",
                    type: "int",
                },
                {
                    name: "productCategoryId",
                    type: "int",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP",
                },
            ],
        }));

        // Criar a chave estrangeira "productSituationId"
        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productSituationId"],
                referencedTableName: "product_situations",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );

        // Criar a chave estrangeira "productCategoryId"
        await queryRunner.createForeignKey(
            "products",
            new TableForeignKey({
                columnNames: ["productCategoryId"],
                referencedTableName: "product_categories",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Obter a tabela "products"
        const table = await queryRunner.getTable("products");

        // Remover as chaves estrangeiras, se existirem
        if (table) {
            const foreignKeySituation = table.foreignKeys.find((fk) =>
                fk.columnNames.includes("productSituationId")
            );
            if (foreignKeySituation) {
                await queryRunner.dropForeignKey("products", foreignKeySituation);
            }

            const foreignKeyCategory = table.foreignKeys.find((fk) =>
                fk.columnNames.includes("productCategoryId")
            );
            if (foreignKeyCategory) {
                await queryRunner.dropForeignKey("products", foreignKeyCategory);
            }
        }

        // Remover a tabela "products"
        await queryRunner.dropTable("products");
    }
}
