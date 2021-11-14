import React, { useState } from 'react';

function isSearched(searchTerm) {
    return function (item) {
      return item.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }

const Search = ({ value, children, users }) => {

    const [searchTerm, changeSearchTerm] = useState('')
    const [allUsers, updateUsers] = useState(users)

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
                            />
                </form>
                { allUsers
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
          <a href={`/${item.username}`}>{item.username}</a>
        </span>
      </div>
    )}
  </div>

export default Search
