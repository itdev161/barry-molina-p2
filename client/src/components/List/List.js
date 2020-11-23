import React, { useState } from 'react';
import AddListItem from './AddListItem';
import ListItem from './ListItem';
import './styles.css';

const List = ({ token, list, onItemAdded, deleteItem, onItemUpdated }) => {
    const [listStatus, setListStatus] = useState({
        addingItem: false
    });

    const { addingItem } = listStatus;

    const newItem = () => {
        setListStatus({
            ...listStatus,
            addingItem: true
        });
    };
    
    const cancel = () => {
        setListStatus({
            ...listStatus,
            addingItem: false
        });
    }

    return (
        <div className="list">
            <h2>{list.title}</h2>
            <ol>
                {list.items.map( item => (
                    <ListItem 
                        key={item._id}
                        token={token}
                        list={list}
                        item={item}
                        deleteItem={deleteItem}
                        onItemUpdated={onItemUpdated}
                    />
                ))}
                {addingItem &&
                    <AddListItem 
                        token={token}
                        list={list}
                        onItemAdded={onItemAdded}
                        cancel={cancel}
                    />
                }
            </ol>
            <button id="newItemBtn" onClick={() => newItem()}>Add List Item</button>
        </div>
    );
};

export default List;