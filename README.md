## Requisitos

* Node.js 22 ou superior - Conferir a versão: node -v

## Como rodar o projeto baixado

Instalar todas as dependencias indicada pelo package.json.
```
npm install
```

Compilar o arquivo TypeScript.
```
npx tsc
```

Executar o arquivo gerado com Node.js.
```
node dist/index.js
```

## Sequencia para criar o projeto

Criar o arquivo package.
```
npm init
```

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outra funcionalidades.
```
npm i express
```

Instalar os pacotes para suporte ao TypeScript.
```
npm i --save-dev @types/express
npm i --save-dev @types/node
```

Instalar o compilador projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado.
```
npm i --save-dev ts-node
```

Gerar o arquivo de configuração para o TypeScript.
```
npx tsc --init
```

Compilar o arquivo TypeScript.
```
npx tsc
```

Executar o arquivo gerado com Node.js.
```
node dist/index.js
```


## Como enviar e baixar os arquivos do GitHub

Baixar os arquivos do Git.
```
git clone -b <branch_name> <repository_url> .
```

Verificar em qual está branch.
```
git branch 
```

Baixar as atualizações do GitHub.
```
git pull
```

Adicionar todos os arquivos modificados no staging area - área de preparação.
```
git add .
```

commit representa um conjunto de alterações em um ponto específico da história do seu projeto, registra apenas as alterações adicionadas ao índice de preparação.
O comando -m permite que insira a mensagem de commit diretamente na linha de comando.
```
git commit -m "Base projeto"
```

Enviar os commits locais, para um repositório remoto.
```
git push <remote> <branch>
git push origin develop
```