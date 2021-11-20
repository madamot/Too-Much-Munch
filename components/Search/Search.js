import React, { useState } from 'react';
import Link from 'next/link';

function isSearched(searchTerm) {
    return function (item) {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }

const Search = ({ value, children, users }) => {

  console.log(users);

    const [searchTerm, changeSearchTerm] = useState('')
    const [allUsers, updateUsers] = useState(users)
    const [focus, setFocus] = useState(false) 
    const toggleFocus = () => setFocus(value => !value);

    const onSearchChange = (event) => {
        changeSearchTerm(event.target.value)
      }

    return (
        <div>
            <form>
                {children} <input
                    type="text"
                    value={searchTerm}
                    onChange={onSearchChange}
                    onFocus={toggleFocus}
                    onBlur={toggleFocus}
                            />
                </form>
                { allUsers && focus
                    ? <Table
                        list={allUsers}
                        pattern={searchTerm}
                    />
                    : null
                }
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
