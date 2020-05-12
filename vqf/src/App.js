import React from 'react';
import logo from './logo.svg';
import './App.css';
import Container from "@material-ui/core/Container";

import axios from 'axios';
import UserCard from "./UserCard";

export class UserList extends React.Component {
  state = {
    users: []
  }

  componentDidMount() {
    axios.get(`/api/users/`)
      .then(res => {
        const users = res.data.items;
        this.setState({ users });
      })
  }

  render() {
    return (
      <ul>
        { this.state.users.map(user => <UserCard user={user}/>)}
      </ul>
    )
  }
}

function App() {
  return (
    <div className="App">
        <Container maxWidth="lg">
            <UserList/>
        </Container>

    </div>
  );
}

export default App;
