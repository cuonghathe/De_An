const UserList = ({ users, onDeleteUser }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user._id} className="user-item">
          <span>{user.name} ({user.email})</span>
          <button onClick={() => onDeleteUser(user._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UserList;