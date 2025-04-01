import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./Product"; // Importa a entidade relacionada

@Entity("product_situations")
export class ProductSituation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string; // Nome da situação

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    // Relacionamento OneToMany com a tabela products
    @OneToMany(() => Product, (product) => product.situation)
    products!: Product[];
}
