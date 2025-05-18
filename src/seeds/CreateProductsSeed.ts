import { DataSource } from "typeorm";
import { Product } from "../entity/Product";
import { ProductSituation } from "../entity/ProductSituation";
import { ProductCategory } from "../entity/ProductCategory";


export default class CreateProductsSeed {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando a geração de seeds da tabela products...");
    //obter o repositório produtos e situações de produtos
    const productRepository = dataSource.getRepository(Product);
    const productSituationRepository = dataSource.getRepository(ProductSituation);
    const productCategoryRepository = dataSource.getRepository(ProductCategory);

    //Verifica se já existem registros na tabela
    const existingCount = await productRepository.count();
    if (existingCount > 0) {
      console.log("A tabela products já possui dados. Nenhuma alteração foi realizada!");
      return;
    }
    //Buscar a situação no banco de dados
    const situation = await productSituationRepository.findOne({where: {id: 1 }});

    //Verificar se encontrou a situação no banco
    if(!situation){
      console.error("Erro: Nenhuma situação encontrada com o id 1. Verifique se a tabela situations tem dados válidos. ");
      return;
    }
    // Buscar a categoria no banco de dados
    const category = await productCategoryRepository.findOne({ where: { id: 1 } });

    // Verificar se encontrou a categoria no banco de dados
    if (!category) {
        console.error("Erro: Nenhuma categoria encontrada com ID 1. Verifique se a tabela 'product_categories' está populada.");
        return;
    }

    //Criar produtos que devem ser cadastradas no banco
    const products = [
      Object.assign(new Product(),
        {
          id: 1,
          name: "Curso de Node.js",
          slug: "curso-de-nodejs",
          description: "No Curso de Node.js é abordado o desenvolvimento ...",
          price: 222.10,
          category: category,
          situation: situation,
        }),
      Object.assign(new Product(),
        {
          id: 2,
          name: "Curso de React",
          slug: "curso-de-react",
          description: "No Curso de React é abordado o desenvolvimento ...",
          price: 20.10,
          category: category,
          situation: situation,
        }),
      Object.assign(new Product(),
        {
          id: 3,
          name: "Curso de Node.js e React",
          slug: "curso-de-nodejs-e-react",
          description: "No Curso de Node.js e React é abordado o desenvolvimento ...",
          price: 20.10,
          category: category,
          situation: situation,
        })
    ];
    //Salvar o registro no banco de dados
    await productRepository.save(products);

    console.log("Seed executada com sucesso: produtos cadastrados!");
  }
}
