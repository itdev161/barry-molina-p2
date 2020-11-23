import React, { useState, useRef } from 'react';
import axios from 'axios';


const AddListItem = ({ token, list, onItemAdded, cancel }) => {
    const itemInput = useRef(null);

    const [itemData, setItemData] = useState ({
        desc: ''
    });

    const { desc } = itemData;

    const onChange = e => {
        const { name, value } = e.target;

        setItemData({
            ...itemData,
            [name]: value
        })
    }

    const onSubmit = e => {
        e.preventDefault();
        addItem();
    }
    const addItem = async e => {
        e.preventDefault();
        if (!desc) {
            console.log('Item description is required');
        } else {
            const newItem = {
                desc: desc
            }

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                };

                const body = JSON.stringify(newItem);
                const res = await axios.post(
                    `http://localhost:5000/api/lists/${list._id}`,
                    body,
                    config
                );
                onItemAdded(res.data);
                setItemData({
                    desc: ''
                })
                itemInput.current.focus();

            } catch (error) {
                console.error(`Error creating list: ${error.response.data}`);
            }
        }
    }

    return (
        <React.Fragment>
            <li>
                <form onSubmit={e => addItem(e)}>
                    <input
                        name="desc"
                        type="text"
                        value={desc}
                        onChange={e => onChange(e)}
                        autoFocus
                        ref={itemInput}
                    />
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => cancel()}>Cancel</button>
                </form>
            </li>
        </React.Fragment>
    )
}

export default AddListItem;