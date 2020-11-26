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
                <header>
                    <span id='closeBtn' onClick={() => cancel()}>&times;</span>
                    <h2>Delete a List</h2>
                    <form onSubmit={e => handleDelete(e)}>
                        <label>
                            List Title:
                            <input
                                id='newTitle'
                                type="text"
                                value={title}
                                onChange={e => onChange(e)}
                                autoFocus
                            />
                        </label>
                        <div className='buttons'>
                            <button type="submit">Ok</button>
                        </div>
                    </form>


                </header>

            </div>
        </div>
    )

}

export default DeleteList;