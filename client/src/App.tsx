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
          const listId = localStorage.getItem('list');
          if (listId) {
            const list = this.state.lists.find(l => l._id === listId);
            // console.log(list);
            this.setState({
              list: list
            })
          }
        })
        .catch((error) => {
          console.error(`Error fetching data: ${error}`);
        })
    }
  };


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
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('list');
    this.setState({ user: null, token: null });
  };

  viewList = list => {
    this.setState({
      list:list
    });
    localStorage.setItem('list', list._id);
  };

  onListCreated = list => {
    const newLists = [...this.state.lists, list];
    this.setState({
      lists: newLists,
      list: list
    });
  };

  onItemAdded = listItem => {
    const newList = this.state.list;
    newList.items = [...newList.items, listItem];

    this.setState({
      list: newList
    });
  };

  onItemUpdated = listItem => {
    const newList = this.state.list;
    const index = newList.items.findIndex(item => item._id === listItem._id);

    newList.items[index] = listItem;

    this.setState({
      list: newList
    });
  };
  
  onTitleUpdated = list => {
    const newLists = [...this.state.lists];
    const index = newLists.findIndex(l => l._id === list._id);

    newLists[index] = list;

    this.setState({
      list: list,
      lists: newLists
    });
  };

  deleteItem = item => {
    const { token, list } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios
        .delete(`http://localhost:5000/api/lists/${list._id}/${item._id}`, config)
        .then(response => {
          const newList = this.state.list;
          newList.items = newList.items.filter(i => i._id !== item._id);

          this.setState({
            list: newList
          });
        })
        .catch(error => {
          console.error(`Error deleting list: ${error}`);
        });
    }
  };

  onListDeleted = list => {
    const newLists = this.state.lists.filter(l => l._id !== list._id);
    this.setState({
      lists: [...newLists]
    });

  }
  componentDidMount() {
      this.authenticateUser();
  };
  render() {
    let { user, lists, list, token } = this.state;
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
                    <p className='greyedout'>Here are your lists:</p>
                    <ListBank
                      token={token}
                      lists={lists}
                      clickList={this.viewList}
                      onListCreated={this.onListCreated}
                    />
                  </React.Fragment> :
                  <React.Fragment>
                    Please Register or Login
                  </React.Fragment>
                }
              </Route>
              <Route path="/lists/:listTitle">
                <List 
                  token={token} 
                  list={list} 
                  onItemAdded={this.onItemAdded}
                  onItemUpdated={this.onItemUpdated}
                  onTitleUpdated={this.onTitleUpdated}
                  deleteItem={this.deleteItem}
                  onListDeleted={this.onListDeleted}
                />
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
