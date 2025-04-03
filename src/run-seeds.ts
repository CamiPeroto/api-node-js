import { AppDataSource } from "./data-source";
import CreateSituationsSeed from "./seeds/CreateSituationsSeed";
import CreateProductSituationsSeed from "./seeds/CreateProductSituationsSeed";
import CreateProductCategoriesSeed from "./seeds/CreateProductCategoriesSeed";

const runSeeds = async () => {
  console.log("Conectando ao banco de dados...");

  //inicializar a conexão com o banco
  await AppDataSource.initialize();
  console.log("Banco de dados conectado.");

  try {
    //criar uma instância das classes de seed
    const situationsSeed = new CreateSituationsSeed();
    const productSituationsSeed = new CreateProductSituationsSeed();
    const productCategoriesSeed = new CreateProductCategoriesSeed();

    //Executar as seeds
    await situationsSeed.run(AppDataSource);
    await productSituationsSeed.run(AppDataSource);
    await productCategoriesSeed.run(AppDataSource);
  } catch (error) {
    console.error("Erro ao executar a seed: ", error);
  } finally {
    await AppDataSource.destroy();
    console.log("Conexão com o banco de dados encerrada.");
  }
};

runSeeds();
