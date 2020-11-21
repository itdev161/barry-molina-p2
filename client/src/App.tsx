import React from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import { isAssertionExpression } from 'typescript';
import ListBank from './components/ListBank/ListBank';
import List from './components/List/List';

class App extends React.Component {
  state = {
    lists: [],
    list: null,
    token: null,
    user: null
  }

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios.get('http://localhost:5000/api/lists', config)
        .then((response) => {
          this.setState({
            lists: response.data
          });
        })
        .catch((error) => {
          console.error(`Error fetching data: ${error}`);
        })
    }
  }

  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('user')
      this.setState({ user: null });
    }

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      }
      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('user', response.data.name);
          this.setState(
            { 
              user: response.data.name,
              token: token
            },
            () => {
              this.loadData()
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem('user');
          this.setState({ user: null });
          console.log(`Error logging in: ${error}`);
        })
    }
  }

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null, token: null });
  }

  viewList = list => {
    console.log(`view ${list.title}`)
    this.setState({
      list:list
    })
  }

  componentDidMount() {
      this.authenticateUser();
  }
  render() {
    let { user, lists, list } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser,
    }
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>WishList</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                {user ?
                  <Link to="" onClick={this.logOut}>Log out</Link> :
                  <Link to="/login">Log in</Link>
                }
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {user ?
                  <React.Fragment>
                    <h2 id="greeting">Hello, {user}!</h2>
                    <p>Here are your lists:</p>
                    <ListBank
                      lists={lists}
                      clickList={this.viewList}
                    />
                  </React.Fragment> :
                  <React.Fragment>
                    Please Register or Login
                  </React.Fragment>
                }
              </Route>
              <Route path="/lists/:listTitle">
                <List list={list}/>
              </Route>
              <Route 
                exact path="/register" 
                render={() => <Register {...authProps} />} />
              <Route 
                exact path="/login" 
                render={() => <Login {...authProps} />} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
