import React, { useState } from 'react';
import AddListItem from './AddListItem';
import ListItem from './ListItem';
import EditListTitle from './EditListTitle';
import './styles.css';

const List = ({ token, list, onItemAdded, deleteItem, onItemUpdated, onTitleUpdated, onListDeleted }) => {
    const [editingTitle, setEditingTitle] = useState(false);
    const [addingItem, setAddingItem] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const titleUpdated = list => {
        setEditingTitle(false);
        onTitleUpdated(list);
    }

    const deleteList = () => {
        console.log("deleting list");
        onListDeleted(list);
    }

    return (
        <div className="list">
            <h2>
                {editingTitle ? (
                    <EditListTitle
                        token={token}
                        list={list}
                        titleUpdated={titleUpdated}
                        cancel={() => setEditingTitle(false)}
                    />
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
            <button id="deleteListBtn" onClick={() => deleteList()}>Delete List</button>
            <button id="newItemBtn" onClick={() => setAddingItem(true)}>Add List Item</button>
        {deleting && 
            <DeleteList 
                token={token}
                list={list}
                deleteList={deleteList}
                cancel={() => setDeleting(false)}
            />
        }
        </div>
    );
};

export default List;