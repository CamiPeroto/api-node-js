import { DataSource } from "typeorm";
import { Situation } from "../entity/Situation";

export default class CreateSituationsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a geração de seeds da tabela situations...");
    //obter o repositório
    const situationRepository = dataSource.getRepository(Situation);

    //Verifica se já existem registros na tabela
    const existingCount = await situationRepository.count();
    if (existingCount > 0) {
      console.log("A tabela situations já possui dados. Nenhuma alteração foi realizada!");
      return;
    }
    //Criar as situações que devem ser cadastradas no banco
    const situations = [
        { id: 1, nameSituation: "Ativo" },
        { id: 2, nameSituation: "Inativo" },
        { id: 3, nameSituation: "Pendente" },

    ];
    //Salvar o registro no banco de dados
    await situationRepository.save(situations);

    console.log("Seed executada com sucesso: situações cadastradas!");
  }
}
