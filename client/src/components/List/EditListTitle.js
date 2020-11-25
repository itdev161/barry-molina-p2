import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'


const EditListTitle = ({ token, list, titleUpdated, cancel }) => {

    const [title, setTitle] = useState(list.title);

    const onChange = e => {
        setTitle(e.target.value);
    }

    const updateTitle = async e => {
        e.preventDefault();
        if (!title) {
            console.log('List title is required');
        } else {
            const updatedList = {
                title: title
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(updatedList);
                const res = await axios.put(
                    `http://localhost:5000/api/lists/${list._id}`,
                    body,
                    config
                );

                titleUpdated(res.data);
                

            } catch (error) {
                console.error(`Error updating list: ${error}`);
            }
        }
    }

    return (
        <React.Fragment>
            <form onSubmit={e => updateTitle(e)}>
                <input
                    className='editTitle'
                    type="text"
                    value={title}
                    onChange={e => onChange(e)}
                    onBlur={() => cancel()}
                    autoFocus
                    onFocus={e => e.currentTarget.select()}
                />
                <button type="button" onMouseDown={e => updateTitle(e)}>Update</button>
                <button type="button" onClick={() => cancel()}>Cancel</button>
            </form>
        </React.Fragment>
    )
}

export default EditListTitle;