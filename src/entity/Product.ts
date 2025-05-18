import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProductSituation } from "./ProductSituation"; // Importa a entidade relacionada
import { ProductCategory } from "./ProductCategory"; // Importa a entidade relacionada

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; 

    @Column({unique:true})
    slug!: string; 

    @Column()
    description!: string; 

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number;

    // Relacionamento ManyToOne com a tabela product_situations
    @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
    @JoinColumn({ name: "productSituationId" }) // Nome da chave estrangeira
    situation!: ProductSituation;

    // Relacionamento ManyToOne com a tabela product_situations
    @ManyToOne(() => ProductCategory, (productCategory) => productCategory.products)
    @JoinColumn({ name: "productCategoryId" }) // Nome da chave estrangeira
    category!: ProductCategory;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;
}
