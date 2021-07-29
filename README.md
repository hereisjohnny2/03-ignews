# ig.news

![cover](/.github/assets/cover.png)

## 📕 Sobre

Nesse projetos foi desenvolvido o **ig.news**, um blog voltado a notícias acerca do universo do ReactJS. Ele dá continuidade a uma série de projetos desenvolvidos durante o Bootcamp da *Rocketseat*, o **Ignite**. Dessa vez, foi abordada a contrução de uma aplicação com [NextJS](https://nextjs.org/), framework criado pela *Vercel*, baseado em React, que inclui ferramentas que aumentam a produtividade do desenvolvedor e permitem funcionalidades como geração de páginas estáticas e *server-side rendering*. A escolha do *Next* permite que o onteúdo das postagens possam ser indexadas em motores de busca, como Google, Bing e DuckDuckGo.

Para a edição do conteúdo das postagens também foi utilizado um sistema de genrenciamento de conteúdo, ou CMS (content management system). O sistema escolhido foi o [PrismicIO](https://prismic.io/) devido a sua facilidade de integração direta com aplicações *NextJS*. 

Além disso, para simular um sistema de assinatura mensal para acessar o conteúdo do blog foi utilizado o [Stripe](https://stripe.com/br). Por meio de sua API é possível receber e gerenciar pagamentos por meio de cartões de crédito de forma segura. 

Por fim, o cadastro dos usuários na aplicação e a autenticação de acesso foram feitas respectivamentes pelo [FaunaDB](https://fauna.com/) e pelo [NextAuth](https://next-auth.js.org/). O *Fauna* é um banco de dados de documentos, *NoSQL*, que permite que as operações sejam realizadas sem manter uma conexão constante aberta, portanto perfeita para a utilização de função *serverless*. Além disso é possivel criar índices que permitem a busca por determinados parâmetros dentro do banco de dados. Outra vantagem do fauna é sua FQL (*Fauna Query Language*), que permite a execução de operações de uma forma bem semântica, como mostrado abaixo:

```javascript
await fauna.query(
  q.If(                             // Se
    q.Not(                          // Não
      q.Exists(                     // Existir
        q.Match(                    // Um usuário com o email buscado
          q.Index("userByEmail"),   
          q.Casefold(email),
        )
      )
    ),
    q.Create(                       // Crie
      q.Collection("users"),        // Na coleção de usuários
      { data: { email } }           // Um novo usuário com os dados "email"
    ),
    q.Get(                          // Caso contrário retorne
      q.Match(                      // O usuário 
        q.Index("userByEmail"),     // Com esse email
        q.Casefold(email),
      )
    )
  )
);  
```

Nessa query é criado um novo usuário caso não existem nenhum outro usuário com o mesmo email cadastrado. Contudo, se existir, simplesmente são retornadas suas informações.

Já o *NextAuth* permite a autenticação por meio de diversas plataformas e redes sociais. Para esse projeto foi escolhido o GitHub, mas a inclusão de novos provedores seria também muito fácil de ser feita. 


Em resumo, nela é possivel:
 - Logar com conta do GitHub;
 - Assinar um plano mensal de acesso com cartão de crédito;
 - Ler o conteúdo do blog;
 - (Criador de Conteúdo) Adicionar, editar e remover postagens;

## 💻 Tecnologias

 - ReactJS
 - TypeScript
 - NextJS
 - FaunaDB
 - Prismic CMS
 - Stripe
 - CSS Modules
 - SASS

## 🚀 Rodando a aplicação

Para rodar essa aplicação localmente é necessário clonar esse repositório:

```bash
$ git clone https://github.com/hereisjohnny2/03-ignews.git
``` 

Em seguida, acessar a pasta do repositório e rodar o comando `yarn` para instalar as depêndencias:

```bash
$ cd 03-ignews
$ yarn
```

Por fim, rodar o servidor local da aplicação:

```bash
$ yarn dev
```

A aplaicação estará disponível em http://localhost:8080/, portanto certifique-se que você não possui mais nada rodando nessa porta.
