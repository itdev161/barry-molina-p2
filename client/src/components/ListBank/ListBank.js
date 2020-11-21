import React from 'react';
import ListBankItem from './ListBankItem';

const ListBank = props => {
    const { lists, clickList } = props;
    return lists.map(list => (
        <ListBankItem
            key={list._id}
            list={list}
            clickList={clickList}
        />
    ));
};

export default ListBank;