import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategory";

export default class CreateCategoriesSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a geração de seeds da tabela product categories...");
    //obter o repositório
    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    //Verifica se já existem registros na tabela
    const existingCount = await productCategoryRepository.count();
    if (existingCount > 0) {
      console.log("A tabela product category já possui dados. Nenhuma alteração foi realizada!");
      return;
    }
    //Criar as categorias que devem ser cadastradas no banco
    const productCategories = [
        { name: "Casa" },
        { name: "Apartamento" },
        { name: "Sobrado" },
    ];
    //Salvar o registro no banco de dados
    await productCategoryRepository.save(productCategories);

    console.log("Seed executada com sucesso: categorias cadastradas!");
  }
}
