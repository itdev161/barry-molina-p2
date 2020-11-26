import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import slugify from 'slugify';
import './styles.css';

const CreateList = ({ token, createList, cancel }) => {
    let history = useHistory();
    const [title, setTitle] = useState('');

    const onChange = e => {
        setTitle(e.target.value);
    }
    
    const create = async e => {
        e.preventDefault();
        if (!title) {
            console.log('List title is required');
        } else {
            const list = {
                title: title
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(list);
                const res = await axios.post(
                    `http://localhost:5000/api/lists/`,
                    body,
                    config
                );

                const newList = res.data;

                const slug = slugify(newList.title, { lower: true });
                createList(newList);
                history.push(`/lists/${slug}`);


            } catch (error) {
                console.error(`Error creating list: ${error}`);
            }
        }
    }

    return(
        <div className='modal'>
            <div className='modalContent'>
                <span className='closeBtn' onClick={() => cancel()}>&times;</span>
                <h2>Create a List</h2>
                <form onSubmit={e => create(e)}>
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
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default CreateList;