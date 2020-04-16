import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import './books.css'
import {Link} from "react-router-dom"


const BooksQuery = gql`
  query getBooks{
    books {
      id
      name
      genre
      
    }
  }
`;
const createBook = gql`
  mutation createBook(
    $name: String!
    $genre: String!
   
  ) {
    createBook(
      name: $name
      genre: $genre
      
    ) {
      id
    }
  }
`;


const deleteBook = gql`
  mutation deleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;
{/*const updateBook = gql`
  mutation updateBook($id: ID!
    $name: String!
    $genre: String! ){
      updateBook(id:$id
        name:$name
        genre: $genre)
  }
`;*/}


function AddBook() {
        const [name, setName] = useState("");
        const [genre, setGenre] = useState("");
        
        const [createABook] = useMutation(createBook, {
          variables: {
            name: name,
            genre: genre,
           
          },
          refetchQueries: ["getBooks"]
        });
        return (
                <div>
                  <h2 className="addbook">Add Book</h2>
                  <form className='boxfield'
                    onSubmit={event => {
                      event.preventDefault();
                      console.log("Book Name: ", name);
                      createABook().catch(error => {
                        console.log(error);
                        
                      });
                      
                      setName("");
                      setGenre("");
                     
                    }}>
                             <label><span className='name'>Book Name:</span> </label>
                             <input className="inputfield" 
                             type="text" 
                             value={name}
              onChange={e => setName(e.target.value)}/><br/>

                                <label><span className='name'>Book Genre:</span> </label>
                             <input className="inputfield" 
                             type="text" 
                             value={genre}
              onChange={e => setGenre(e.target.value)}/><br/>

                        <button type="submit" className='button' >submit</button>

                  </form><br/><br/>
            
                 </div> 
        );
}
function BooksTag() {
        const [deleteABook] = useMutation(deleteBook);
       /* const [updateABook]=useMutation(updateBook);*/
  const { loading, error, data } = useQuery(BooksQuery );
  if (loading) return <p>Loading</p>;
  if (error) return <p>Error :(</p>;
        return (
                <table id='books'> 
          <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Genre</th>
              <th>Delete</th>
              <th>Update</th>
              
          </tr>
          
                  {data.books.map(book=>(
                          <tr key={`$book.id`}>
                            <td>{book.id}</td>
                                <td>{book.name}</td>
                                <td>{book.genre}</td>

                                <td><button onClick={event => {
                        event.preventDefault();
                        console.log("delete book:", book.name);
                        deleteABook({
                          variables: {
                            id: book.id
                          },
                          refetchQueries: ["getBooks"]
                        }).catch(error => {
                          alert("Cannot Delete this Book");
                        });
                      }}
                                >Delete</button ></td>
                                <td><Link to ={{pathname:`/update/${book.id}`, id:book.id}}><button  className="btn btn-success" style={{margin:'5px',width:'100px'}}>Update</button></Link></td>
                                
                           </tr>
                  ))}
          
          </table>
        );

}    
export default class Books extends React.Component {
        render(){
                return(
                        <div style={{ margin: "auto", width: "600" }}>
                        <div>
                        <h1>Books</h1>
                      </div>
                      
                      <div>
                              
                            <AddBook/> 
                            <BooksTag/> 
                      </div>
                      </div>
                );
        }
}


                          