import React, { useState, useRef } from 'react';
import Link from 'next/link';
import useOutsideClick from '../../utils/useOutsideClick';

function isSearched(searchTerm) {
    return function (item) {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }

const Search = ({ value, children, users }) => {

  const ref = useRef();

  console.log(users);

    const [searchTerm, changeSearchTerm] = useState('')
    const [allUsers, updateUsers] = useState(users)
    const [focus, setFocus] = useState(false) 
    const toggleFocus = () => setFocus(value => !value);

    const onSearchChange = (event) => {
        changeSearchTerm(event.target.value)
      }

    useOutsideClick(ref, () => {
      setFocus(value => !value)
    });


    return (
        <div ref={ref} onFocus={() => setFocus(true)}>
            <form>
                {children} <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                            />
                </form>
                { focus &&
                    <Table
                        list={allUsers}
                        pattern={searchTerm}
                    />}
        </div>
    )
}

const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
    {list.filter(isSearched(pattern)).map(item =>
      <div key={item.username} className="table-row">
        <span style={{ width: '40%' }}>
          <Link href={`/user/[id]`} as={`/user/${item.id}`}>
            <a>{item.username}</a>
          </Link>
        </span>
      </div>
    )}
  </div>

export default Search
