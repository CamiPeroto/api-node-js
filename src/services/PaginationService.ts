import { Repository, ObjectLiteral, FindOptionsOrder } from "typeorm";
import { string } from "yup";

//definir uma interface para o resultado da paginação que será genérica e adaptável a qualquer tipo de entidade
interface PaginationResult<T> {
  error: boolean;
  data: T[]; //array de elementos do tipo genérico
  currentPage: number;
  lastPage: number;
  totalRecords: number;
  relations?: string[]; //permite passar relacionamentos como array de strings
}
//define uma classe de serviço para implementar a lógica de paginação
export class PaginationService {
  //metódo estático que realiza a paginação em qualquer repositório
  static async paginate<T extends ObjectLiteral>(repository: Repository<T>,
     page: number = 1,
      limit: number = 10, 
      order: FindOptionsOrder<T> = {},
      relations?: string[],//receber o relacionamento
    ): Promise<PaginationResult<T>> {
    //conta o total de registros do repositório para determinar a quantidade total de páginas
    const totalRecords = await repository.count();
    //calcular o número da última página baseada no total de registros e limite por página
    const lastPage = Math.ceil(totalRecords / limit);
    //verificar se a página solicitada é válida, se não retorna erro
    if (page > lastPage && lastPage > 0) {
      throw new Error(`Página inválida. Total de páginas ${lastPage}`);
    }
    //calcula o offset, que é o indice do primeiro registro que deve ser retornado na pagina atual
    const offset = (page - 1) * limit;
    //buscar os registros do repositório com base no limite, offset e ordem de classificação
    const data = await repository.find({
      take: limit,
      skip: offset,
      order,
      relations, //usar os relacionamentos passados dinamicamente
    });

    //retornar o resultado da paginação em um formato estruturado
    return {
      error: false,
      data,
      currentPage: page,
      lastPage,
      totalRecords,
      
    };
  }
}
