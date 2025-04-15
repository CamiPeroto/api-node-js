import { DataSource } from "typeorm";
import { Situation } from "../entity/Situation";
import { User } from "../entity/User";

export default class CreateUsersSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a geração de seeds da tabela users...");
    //obter o repositório user e situations
    const userRepository = dataSource.getRepository(User);
    const situationRepository = dataSource.getRepository(Situation);

    //Verifica se já existem registros na tabela
    const existingCount = await userRepository.count();
    if (existingCount > 0) {
      console.log("A tabela users já possui dados. Nenhuma alteração foi realizada!");
      return;
    }
    //Buscar a situação no banco de dados
    const situation = await situationRepository.findOne({where: {id: 1 }});

    //Verificar se encontrou a situação no banco
    if(!situation){
      console.error("Erro: Nenhuma situação encontrada com o id 1. Verifique se a tabela situations tem dados válidos. ");
      return;
    }
    //Criar usuários que devem ser cadastradas no banco
    const users = [
        { id: 1, 
          name: " Camila",
          email: "camilaperoto@gmail.com",
          password: "123456A#",
          situation: situation,
         },
         { id: 2, 
          name: " Rafael",
          email: "rafaelgasperin@gmail.com",
          password: "123456A#",
          situation: situation,
         },
         { id: 3, 
          name: "Cesar",
          email: "celke@gmail.com",
          password: "123456A#",
          situation: situation,
         },
         { id: 4, 
          name: "Mew",     
          email: "mewtwo@gmail.com",
          password: "123456A#",
          situation: situation,
         },
    ];
    //Salvar o registro no banco de dados
    await userRepository.save(users);

    console.log("Seed executada com sucesso: usuários cadastrados!");
  }
}
