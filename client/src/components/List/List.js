import React, { useState } from 'react';
import AddListItem from './AddListItem';
import ListItem from './ListItem';
import './styles.css';

const List = ({ token, list, onItemAdded, deleteItem, onItemUpdated }) => {
    const [editingTitle, setEditingTitle] = useState(false);
    const [addingItem, setAddingItem] = useState(false);

    return (
        <div className="list">
            <h2>
                {editingTitle ? (
                    <input type='text'/>
                ) : (
                    <span className="title" onClick={() => setEditingTitle(true)}>{list.title}</span>
                )}
            </h2>
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
                        cancel={() => setAddingItem(false)}
                    />
                }
            </ol>
            <button id="newItemBtn" onClick={() => setAddingItem(true)}>Add List Item</button>
        </div>
    );
};

export default List;