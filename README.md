# Nevernote
O Nevernote é uma aplicação web progressiva para anotações, inspirada nas versões antigas do Evernote. Foi desenvolvida utilizando a framework Angular 21 como projeto para a matéria "Projeto De Software" do curso de Engenharia da Computação da UFAL.

## Rodando a Aplicação para Desenvolvimento
Certifique-se que a última versão do Node.js e o gerenciador de pacotes npm estão instalados na sua máquina. Na pasta do repositório então, instale as dependências e inicialize o servidor de desenvolvimento:
```
# TODO: conserte o conflito de dependências
npm install --legacy-peer-deps
npm run dev
```
É fortemente recomendado que o mantenedor conheça os recursos e mecanismos básicos do Angular 21, documentados no [site oficial da framework](https://angular.dev/)
## Funcionalidades
Inicialmente, foram especificadas dez funcionalidades-base para o projeto, as quais, no momento, encontram-se implementadas e funcionais em maior parte
### 1. Captura Rápida
A UI deve sempre apresentar ao usuário e colocar em evidência - exceto onde não haja sentido, como na lixeira - um botão para criação de uma nova anotação, de forma a agilizar esse fluxo de ação do ponto de vista de UX. A definição de uma anotação pode ser encontrada em `src/app/note.ts`

Essa criação é implementada no método `onCapture` da classe-mãe `NoteShellBase`, que serve como base para os componentes que correspondem às principais rotas da aplicação. Por exemplo, ao acessar `/notebooks` é renderizado o componente `NotebookShell` que herda da classe já menciona funções, estados e o template para renderizar um conjunto de notas bem como o painel para visualização/edição, modificando apenas o contexto dos dados e sobrescrevendo as heranças quando necessário - uma classe herdeira irá renderizar todas as anotações encontradas, já outra, apenas aquelas correspondentes a um **caderno**, etc.
### 2. Cadernos e Etiquetas
São meios de organizar e categorizar as anotações. Os atributos de uma anotação incluirão um `notebookId` para manter o identificadir correspondente a um caderno no banco de dados utilizado, e uma array `tagIds` que contém os ids das tags associadas à nota. 

### 3. Editor de Texto Rico
Um editor de texto rico refere-se à um editor com uso de elementos que são renderizados de forma idêntica à apresentação enquanto editado. É o padrão de aplicações com uso pesado de edição textual como Notion ou Docs, que oferecem diferentes formatações de texto, imagens, tabelas, etc.

Foi feito uso da biblioteca Tiptap para garantir esses recursos, porém, o código de integração foi elaborado de forma a mitigar o acoplamento da biblioteca com a codebase. Assim, na pasta `editor/` foram definidas as interfaces `Editor`, que especifica métodos para controlar e obter informações, e `EditorFactory` que irá gerar o objeto anterior. Na prática, foi implementada uma classe `TipTapFactory` para "embrulhar" as APIs dentro dos métodos definidos em `Editor`.

### 4. Painel de Pré-Visualização
Toma-se vantagem da funcionalidade de edição de texto rica previamente descrita para utilizar-se do editor em modo de leitura como forma de renderizar e apresentar o conteúdo em um painel de pré-visualização quando o usuário clica em uma anotação 
### 5. Busca de Texto Completo (FullText Search)
Em vez de buscar por substrings, o mecanismo de busca se baseia nas **palavras** de um documento já indexado por uma ampla variedade de técnicas. Assim, é possível buscar mais rápidas e eficientes uma vez que o usuário não precisa digitar uma substring exata.

Vários bancos de dados como PostgreSQL ou SQLite oferecem suporte a essa funcionalidade, porém, este não é o caso do IndexedDB, banco nativo do navegador utilizado na versão atual do Nevernote. Portanto, foi usada a biblioteca MiniSearch para indexar as notas e realizar a busca a partir de uma query. No momento, o MiniSearch realiza a indexação sempre que a aplicação é inicializada, uma vez que o volume de dados é pequeno.
### 6. Notas Fixadas
A interface que descreve é uma nota contém um atributo chamado `pinned`, que estabelece se a nota está fixada ou não. Caso verdadeiro, tomará prioridade na ordenação das notas listadas, ou seja, aparecerá no topo junto à outras notas fixadas.
### 7. Lixeira
Cada nota possui um atributo `trashed`, que determina se está na lixeira ou não. Caso verdadeira, a nota só poderá ser listada na rota referente à lixeira, que carregará o componente `TrashShell`. Este irá conter um componente de lista especializado para a lixeira. ao contrário das outras classes que herdam de `NoteShellBase` e renderizam `NoteList`. A classe `NoteTrasher` funciona como uma facade capaz de executar todas as ações desejadas no contexto da lixeira.
### 8. Lembretes
> A implementação dessa funcionalidade deixa muito a desejar na versão atual do Nevernote. Isso porque, dadas as APIs atuais do navegadores, não existe maneira confiável de programar notificações para um instante de tempo específico, a não ser pelo uso de Push Notifications. Entretanto, essa API exige a implementação de um backend, o qual não foi inicialmente planejado para a aplicação.

Toda nota possui um atributo `reminderAt` cujo valor corresponde a um objeto da classe `Date` do Javascript. No momento, esse objeto representa apenas um intervalo de tempo que, quando decorrido, solicitará o envio de uma notificação para o navegador. Os lembretes são adicionados dentro do painel de edição (`NoteEditor`) e programados por um objeto da classe `ReminderService`. Atualmente, é usada a função `setTimeout` para essa tarefa.
### 9. Tema Escuro / Claro
A aplicação utiliza do TailwindCSS junto com a biblioteca DaisyUI para prover estilos aos templates. Uma vez que o DaisyUI possui suporte nativo a diferentes temas, a implementação da opção entre um tema escuro e um claro se reduz a uma configuração em `styles.css`, a UI necessária para o botão, e a classe `ThemeToggler`.
### 10. Contador de Palavras / Tempo de Leitura
> **TODO:** implementação do tempo de leitura

A contagem de palavras já é oferecida como um plugin do Tiptap, e torna-se disponível por intermédio de um estado definido na interface `Editor`. O tempo de leitura pode ser trivialmente implemetado dividindo-se a quantidade de palavras por uma média de velocidade de leitura da população.
## Uso de Herança/Polimorfismo
O uso de herança abstrata é feito principalmente pela abstração do acesso à camada de persistência da aplicação (forma de armazenar os dados). A versão atual utiliza o IndexedDB como banco de dados, mas uma migração para uma API remota ou SQLite ofereceria dificuldades caso as chamadas para o banco fossem realizadas de forma direta ao longo da codebase. 

Assim, para cada operação em um conjunto de dados foi designada uma classe abstrata homônima sufixada por "Repository", como `NoteRepository` para as notas, ou `SearchRepository` para operação de busca de texto completo. Ademais, as classes dentro do subdiretório idb herdam dessas para implementar suas funcionalidade usando a API do IndexedDB.

O uso de polimorfismo complementa essa herança por meio do padrão conhecido como **injeção de dependência**, dessa forma, é fortemente recomendado o conhecimento sobre esse padrão, explicado tanto na documentação do framework como em vários recursos pela Internet. As classes que acessam a camada de dados, isto é, realizam operações para inserir, atualizar, obter dados geralmente vão conter a seguinte linha:
```js
noteRepo = inject(NoteRepository)
```
A função inject retornará uma instância do objeto associada ao seu parâmetro. No caso, o parâmetro foi a própia classe NoteRepository, e o valor de retorno será do mesmo tipo. Nas configurações disponíveis em `idb/providers.ts` , realiza-se a associação entre as classes abstratas e as classes herdeiras específicas ao IndexedDB, de forma a instruir o framework o que retornar em uma chamada de `inject` como essa.


