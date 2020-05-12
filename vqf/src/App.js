import React from 'react';
import './App.css';
import Container from "@material-ui/core/Container";

import axios from 'axios';
import UserCard from "./UserCard";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";

export class UserList extends React.Component {
    state = {
        users: [],
        languages: [],
        checkedBackend: true,
        checkedFrontend: true,
    };

    constructor(props) {
        super(props);
        this.toggleCheckedBackend = this.toggleCheckedBackend.bind(this);
        this.toggleCheckedFrontend = this.toggleCheckedFrontend.bind(this);
        this.toggleLanguage = this.toggleLanguage.bind(this);
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

    toggleLanguage(e) {
        const languages = this.state.languages.map((l) => {
            if (l.name === e.target.name) {
                l.checked = !l.checked;
            }
            return l;
        })

        this.setState({languages: languages}, () => {
                this.fetchUsers()
            }
        )
    }

    fetchUsers() {
        const languages = this.state.languages.map((l) => {
            if (l.checked) {
                return l.id;
            }
        }).filter((l) => {
            return l !== undefined;
        })

        const params = {
            backend: this.state.checkedBackend,
            frontend: this.state.checkedFrontend,
            languages: languages,
        }
        axios.get(`/api/users/`, {params})
            .then(res => {
                const users = res.data.items;
                this.setState({users});
            }).catch(err => {
            console.log('failed to retrieve Users');
            console.log(err)
        })
    }

    fetchLanguages() {
        return new Promise( (resolve, reject) => {
            axios.get(`/api/languages/`)
                .then(res => {
                    const languages = res.data.items.map(language => {
                        return {
                            checked: true,
                            ...language
                        }
                    });
                    this.setState({languages: languages});
                    resolve(this);
                }).catch(err => {
                console.log('failed to retrieve Languages');
                console.log(err)
                reject();
            })
        })
    }

    componentDidMount() {
        this.fetchLanguages().then(this.fetchUsers.bind(this));
    }

    render() {
        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={3}/>

                    <Grid item xs={9}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="checkBackend"
                                    checked={this.state.checkedBackend}
                                    onChange={this.toggleCheckedBackend}
                                />}
                            label="Backend"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="checkFrontend"
                                    checked={this.state.checkedFrontend}
                                    onChange={this.toggleCheckedFrontend}
                                />}
                            label="Frontend"
                        />
                    </Grid>

                    <Grid items xs={3}>
                        <ul>
                            {this.state.languages.map(language =>
                                <FormControlLabel
                                    style={{display: 'block'}}
                                    control={
                                        <Checkbox
                                            name={language.name}
                                            checked={
                                                this.state.languages
                                                .filter((_language) => _language.name === language.name)[0]
                                                .checked
                                            }
                                            onChange={this.toggleLanguage}
                                        />}
                                    label={language.name}                                />
                            )}
                        </ul>
                    </Grid>

                    <Grid items xs={9}>
                        <ul>
                            {this.state.users.map(user => <UserCard user={user}/>)}
                        </ul>
                    </Grid>
                </Grid>
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
