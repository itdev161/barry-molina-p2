import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'


const EditListItem = ({ token, list, item, itemUpdated, cancel }) => {

    const [desc, setDesc] = useState(item.desc);

    const onChange = e => {
        setDesc(e.target.value);
    }

    const updateItem = async e => {
        e.preventDefault();
        if (!desc) {
            console.log('Item description is required');
        } else {
            const updatedItem = {
                desc: desc
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(updatedItem);
                const res = await axios.put(
                    `http://localhost:5000/api/lists/${list._id}/${item._id}`,
                    body,
                    config
                );
                itemUpdated(res.data);
                

            } catch (error) {
                console.error(`Error updating item: ${error.response.data}`);
            }
        }
    }

    return (
        <React.Fragment>
            <li>
                <form onSubmit={e => updateItem(e)}>
                    <input
                        className='editInput'
                        type="text"
                        value={desc}
                        onChange={e => onChange(e)}
                        onBlur={() => cancel()}
                        autoFocus
                    />
                    <button type="button" onMouseDown={e => updateItem(e)}>Update</button>
                    <button type="button" onClick={() => cancel()}>Cancel</button>
                </form>
            </li>
        </React.Fragment>
    )
}

export default EditListItem;