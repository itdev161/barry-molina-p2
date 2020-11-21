import React from 'react';

const List = props => {
    const { list } = props;

    return (
        <div>
            <h2>{list.title}</h2>
            <ol className="listOl">
                {list.items.map( item => (
                    <li key={item._id} className="listLi">{item.desc}</li>
                ))}
            </ol>
        </div>
    );
};

export default List;