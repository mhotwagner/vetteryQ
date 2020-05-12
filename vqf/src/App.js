import React from 'react';
import './App.css';
import Container from "@material-ui/core/Container";

import axios from 'axios';
import UserCard from "./UserCard";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export class UserList extends React.Component {
    state = {
        users: [],
        checkedBackend: true,
        checkedFrontend: true,
    };
    constructor(props) {
        super(props);
        this.toggleCheckedBackend = this.toggleCheckedBackend.bind(this)
        this.toggleCheckedFrontend = this.toggleCheckedFrontend.bind(this)
    }

    toggleCheckedBackend() {
        this.setState({checkedBackend: !this.state.checkedBackend}, () => {
            this.fetchUsers()
            }
        )
    }


    toggleCheckedFrontend() {
      this.setState({checkedFrontend: !this.state.checkedFrontend}, () => {
          this.fetchUsers()
        }
      )
    }


    fetchUsers() {
        const params = {
            backend: this.state.checkedBackend,
            frontend: this.state.checkedFrontend,
        }
        console.log(params)
        axios.get(`/api/users/`, { params })
            .then(res => {
                console.log('Users retrieved');
                const users = res.data.items;
                console.log(users);
                this.setState({ users });
            }).catch(err => {
            console.log('failed to retrieve Users');
            console.log(err)
        })
    }

  componentDidMount() {
    console.log('UserList mounted');
    this.fetchUsers();
  }

  render() {
    return (
    <div>
        <ul>
            <li>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="checkBackend"
                            checked={this.state.checkedBackend}
                            onChange={this.toggleCheckedBackend}
                        />}
                    label="Backend"
                    />
            </li>
            <li>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="checkFrontend"
                            checked={this.state.checkedFrontend}
                            onChange={this.toggleCheckedFrontend}
                        />}
                    label="Frontend"
                    />
            </li>
        </ul>
          <ul>
            { this.state.users.map(user => <UserCard user={user}/>)}
          </ul>
    </div>
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
