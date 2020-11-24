import React, { useState } from 'react';
import './styles.css';
import EditListItem from './EditListItem';

const ListItem = ({ token, list, item, deleteItem, onItemUpdated }) => {
    const [hovered, setHovered] = useState(false);
    const [editing, setEditing] = useState(false);

    const editItem = () => {
        setEditing(true);
    }

    const cancel = () => {
        setEditing(false);
    }

    const itemUpdated = item => {
        setEditing(false);
        onItemUpdated(item);
    }

    return(
        <React.Fragment>
            {editing ? (
                <EditListItem
                    key="editListItem"
                    token={token}
                    list={list}
                    item={item}
                    itemUpdated={itemUpdated}
                    cancel={cancel}
                />
            ) : ( 
                <li
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <span className='liText' onClick={() => editItem()}> {item.desc} </span>
                    <button 
                        id='deleteBtn'
                        className={hovered ? 'visible' : 'hidden'}
                        type='button'
                        onClick={() => deleteItem(item)}
                    >Delete</button>
                </li>
            )}
        </React.Fragment>
    )
};

export default ListItem;