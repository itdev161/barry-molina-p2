import React from 'react';
import { useHistory } from 'react-router-dom';
import slugify from 'slugify';
import './styles.css';

const ListBankItem = props => {
    const { list, clickList } = props;
    const history = useHistory();

    const handleClickList = list => {
        const slug = slugify(list.title, { lower: true });

        clickList(list);
        history.push(`/lists/${slug}`);
    };

    return (
        <div>
            <div className="listBankItem" onClick={() => handleClickList(list)}>
                <h3 className="listBankTitle">{list.title}</h3>
                <ol className="listBankOl">
                    {list.items.map( item => (
                        <li key={item._id} className="listBankLi">{item.desc}</li>
                    ))}
                </ol>
            </div>
            {/* <div className="listControls">
                <button onClick={() => deleteList(list)}>Delete</button>
            </div> */}
        </div>
    );
};

export default ListBankItem;