const { GraphQLServer } =  require('graphql-yoga')
const knex = require('knex')({
        client: 'mysql',
        connection: {
          host : 'localhost',
          user : 'root',
          password : 'naveen',
          database : 'employeedb'
        }
      });

      const typeDefs=`

      type Book{
              id:ID!,
              name:String!,
              genre:String!
      }
      type Author{
              id:ID!,
              name:String!
      }
      type Query{
              books:[Book],
              book(id:ID!):Book,
              authors:[Author],
              author(id:ID!):Author
      }
      type Mutation{
              createBook(name:String!,
                genre:String!):Book
                

                createAuthor(name:String!):Author

                deleteBook(id: ID!) : Boolean
                deleteAuthor(id: ID!) : Boolean

                updateBook(id:ID!,name:String,genre: String): Boolean

                updateAuthor(id:ID!,name:String): Boolean
      }
       `
       const resolvers={
               Query:{
                books:()=>knex("books").select("*"),
                book: async(_,{id})=>{return await knex("books").where({id}).first().select("*")},
               authors:()=>knex("authors").select("*"),
               author:async(_,{id})=>{return await knex("authors").where({id}).first().select("*")}
        },
       Mutation:{
                createBook:async(_,{name,genre})=>{
                        const [book] = await knex("books")
                .returning("*")
                .insert({ name, genre});
            return book;
                },
                
                
                createAuthor:async(_,{name})=>{
                        const [author] = await knex("authors")
                .returning("*")
                .insert({ name});
            return author;
                },
                deleteBook: async(_,{id}) => {
                        const isDeleted = await knex("books")
                          .where({id})
                          .del();
                        return isDeleted;
                      },
                      deleteAuthor: async(_, {id}) => {
                        return(
                          await knex("authors")
                          .where({id})
                          .del()
                        );
                      },
                      updateBook: async(_,{id,name, genre}) => {
                        return (
                          await knex("books")
                          .where({id})
                          .update({name,genre})
                        );
                      },
                      updateAuthor: async(_,{id,name}) => {
                        return (
                          await knex("authors")
                          .where({id})
                          .update({name})
                        );
                      }
        }

   }
   const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))


