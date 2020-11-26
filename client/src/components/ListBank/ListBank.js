import React, { useState } from 'react';
import ListBankItem from './ListBankItem';
import addList from './addList.png';
import CreateList from './CreateList';

const ListBank = ({ token, lists, clickList, onListCreated }) => {
    const [creating, setCreating] = useState(false);

    const createList = list => {
        setCreating(false);
        onListCreated(list);
        
    }
    return(
        <div id='listBankContainer'>
            <div id='listBank'>
                {lists.map(list => (
                <ListBankItem
                    key={list._id}
                    list={list}
                    clickList={clickList}
                />))}
            </div>
            <img 
                src={addList} 
                alt='Create a List' 
                title='Create a List'
                onClick={() => setCreating(true)}
            />
            {creating && 
                <CreateList 
                    token={token}
                    createList={createList}
                    cancel={() => setCreating(false)}
                />
            }
        </div>
    );
};

export default ListBank;