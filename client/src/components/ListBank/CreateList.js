import React, {useState } from 'react';

const CreateList = ({ token, createList, cancel }) => {
    const [title, setTitle] = useState('');

    const onChange = e => {
        setTitle(e.target.value);
    }

    return(
        <div className='modal'>
            <div className='modalContent'>
                <header>
                    <span id='closeBtn' onClick={() => cancel()}>&times;</span>
                    <h2>Create a New List</h2>
                    <form onSubmit={e => createList(e)}>
                        <label>
                            New List Title:
                            <input
                                id='newTitle'
                                type="text"
                                value={title}
                                onChange={e => onChange(e)}
                                autoFocus
                            />
                        </label>
                        <div className='buttons'>
                            <button type="submit">Create</button>
                        </div>
                    </form>


                </header>

            </div>
        </div>
    )

}

export default CreateList;