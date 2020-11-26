import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles.css';

const DeleteList = ({ token, list, deleteList, cancel }) => {
    let history = useHistory();

    const handleDelete = async e => {
        e.preventDefault();
        if (token) {
            const config = {
                headers: {
                    'x-auth-token': token
                }
            };

            axios
            .delete(`http://localhost:5000/api/lists/${list._id}`, config)
            .then(response => {
                deleteList(list);
                history.push('/');
            })
            .catch(error => {
              console.error(`Error deleting list: ${error}`);
            });
        }
    }

    return(
        <div className='modal'>
            <div className='modalContent'>
                <span className='closeBtn' onClick={() => cancel()}>&times;</span>
                <h2>Delete List</h2>
                <form onSubmit={e => handleDelete(e)}>
                    <p>Are you sure you want to delete <span className='blue'>{list.title}</span>?</p>
                    <div className='buttons'>
                        <button type="submit">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default DeleteList;