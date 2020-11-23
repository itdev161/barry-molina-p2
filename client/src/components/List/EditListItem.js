import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'


const EditListItem = ({ token, list, item, onItemUpdated, cancel }) => {

    const [desc, setDesc] = useState(item.desc);

    const onChange = e => {
        setDesc(e.target.value);
    }

    const updateItem = async e => {
        e.preventDefault();
    }
    // const addItem = async e => {
    //     if (!desc) {
    //         console.log('Item description is required');
    //     } else {
    //         const newItem = {
    //             desc: desc
    //         }

    //         try {
    //             const config = {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'x-auth-token': token
    //                 }
    //             };

    //             const body = JSON.stringify(newItem);
    //             const res = await axios.post(
    //                 `http://localhost:5000/api/lists/${list._id}`,
    //                 body,
    //                 config
    //             );
    //             onItemAdded(res.data);
    //             setItemData({
    //                 desc: ''
    //             })
    //             itemInput.current.focus();

    //         } catch (error) {
    //             console.error(`Error creating list: ${error.response.data}`);
    //         }
    //     }
    // }

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
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => cancel()}>Cancel</button>
                </form>
            </li>
        </React.Fragment>
    )
}

export default EditListItem;