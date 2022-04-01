import React from 'react'

const Users = ({ users }) => (
  <div id="users">
    <h2>Users</h2>
    <table>
      <tbody>
        <tr>
          <td>
          </td>
          <td>
            <h4>blogs created</h4>
          </td>
        </tr>
        {users.map(user => (
          <React.Fragment key={user.name}>
            <tr>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
)

export default Users
