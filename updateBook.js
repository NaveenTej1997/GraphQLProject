import React from 'react';
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import  { useState } from "react";
import './books.css'


const BooksQuery = gql`
  query getBooks{
    books {
      id
      name
      genre
      
    }
  }
`;


const updateBooks= gql`
  mutation updateBook($id: ID!
    $name: String!
    $genre: String! ){
      updateBook(id:$id
        name:$name
        genre: $genre)
  }
`

function UpdateBooks() {
        const { loading, error, data } = useQuery(BooksQuery);
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [genre, setGenre] = useState("");
    const [updateBook] = useMutation(updateBooks, {
        variables: {
          id: id,
          name: name,
          genre:genre,
          
          
        },
        refetchQueries: [ {query: BooksQuery}]
      });


      if (loading) 
    return <h3>Loading...</h3>
    if (error) return `Error! ${error.message}`;
    
    return (
        <div className="update">
                <div >
                        {data.books.map(book =>{ 
                                let path = window.location.pathname
                                let id = path.slice(13)
                                if(id == book.id){
                                        return(
                                                <form name = "myForm" onSubmit={event => {
                                                        event.preventDefault();
                                                        updateBook().catch(error => {
                                                          console.log(error);
                                                        });
                                                        setId(book.id);
                                                        if(name == ""){
                                                          setName(book.name);
                                                        }else{
                                                          setName(name);
                                                        }
                                                        if(genre == ""){
                                                          setGenre(book.genre);
                                                        }else{
                                                          setGenre(genre);
                                                        }
                                                        
                                                        
                                                      }} className="myForm">

<h1 className='text'>Book Update</h1>
                <label>Id</label>
		            <input className="formField" type="number" name="id" defaultValue={book.id} disabled required /><br/>
		            
                            <label>Book Name</label>
		            <input className="formField" type="text" name="name" defaultValue={book.name}  onChange={e => setName(e.target.value)} placeholder='Enter a Book name' required /><br/>
                    
                        <label>Genre</label>
		        <input className="formField" type="text" name="genre" defaultValue={book.genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" required /><br/>
                    
               
                         <button type="submit" className='myButton' >Update</button>
                   </form>
                                        )
                                }
                        })}
                </div>
        </div>
    )






}

export default UpdateBooks;



