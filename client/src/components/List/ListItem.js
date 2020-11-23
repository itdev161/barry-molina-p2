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
    return(
        <React.Fragment>
            {editing ? (
                <EditListItem
                    token={token}
                    list={list}
                    item={item}
                    onItemUpdated={onItemUpdated}
                    cancel={cancel}
                />
            ) : ( 
                <li
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => editItem()}
                >
                    <span className='liText'> {item.desc} </span>
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