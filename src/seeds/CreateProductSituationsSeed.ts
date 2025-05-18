import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituation";

export default class CreateProductSituationsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a geração de seeds da tabela product situations...");
    //obter o repositório
    const productSituationRepository = dataSource.getRepository(ProductSituation);

    //Verifica se já existem registros na tabela
    const existingCount = await productSituationRepository.count();
    if (existingCount > 0) {
      console.log("A tabela product situations já possui dados. Nenhuma alteração foi realizada!");
      return;
    }
    //Criar as situações que devem ser cadastradas no banco
    const productSituations = [
        { name: "Ativo" },
        { name: "Inativo" },
        { name: "Pendente" },
    ];
    //Salvar o registro no banco de dados
    await productSituationRepository.save(productSituations);

    console.log("Seed executada com sucesso: situações cadastradas!");
  }
}
