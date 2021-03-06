import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostSatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';
import styled from 'styled-components';

const AppBlock = styled.div`
    margin: 0 auto;
    max-width: 800px;
`

export default class App extends Component {

    constructor(props) {
        super(props);
        const oldState = this.getStateFromStorage();
        if (!oldState) {
            this.state = {
                data: [
                    { label: 'Going to learn React', important: true, like: false, id: 1 },
                    { label: 'That is so good', important: false, like: false, id: 2 },
                    { label: 'I need a break...', important: false, like: false, id: 3 }
                ],
                term: '',
                filter: 'all'
            }

            this.maxId = 4;
        } else {
            this.state = JSON.parse(oldState);

            this.maxId = this.state.data.length + 1;
        }

        this.deleteItem = this.deleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.onToggleImportant = this.onToggleImportant.bind(this);
        this.onToggleLiked = this.onToggleLiked.bind(this);
        this.onUpdateSearch = this.onUpdateSearch.bind(this);
        this.onFilterSelect = this.onFilterSelect.bind(this);


    }

    saveStateToStorage() {
        const serializedState = JSON.stringify(this.state);
        localStorage.setItem('state', serializedState)
    }

    getStateFromStorage() {
        return localStorage.getItem('state')
    }

    deleteItem(id) {
        this.setState(({ data }) => {
            const index = data.findIndex(elem => elem.id === id);

            const befor = data.slice(0, index);
            const after = data.slice(index + 1);

            const newArr = [...befor, ...after];

            return {
                data: newArr
            }

        });
    }

    addItem(body) {
        const newItem = {
            label: body,
            important: false,
            id: this.maxId++
        }

        this.setState(({ data }) => {
            const newArr = [...data, newItem];
            return {
                data: newArr
            }
        })
    }

    onToggleImportant(id) {
        this.setState(({ data }) => {
            const index = data.findIndex(elem => elem.id === id);
            const old = data[index];
            const newItem = { ...old, important: !old.important };

            const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

            return {
                data: newArr
            }
        });
    }

    onToggleLiked(id) {
        this.setState(({ data }) => {
            const index = data.findIndex(elem => elem.id === id);
            const old = data[index];
            const newItem = { ...old, like: !old.like };

            const newArr = [...data.slice(0, index), newItem, ...data.slice(index + 1)];

            return {
                data: newArr
            }
        });
    }

    searchPost(items, term) {
        if (term.length === 0) {
            return items;
        }

        return items.filter(item => {
            return item.label.indexOf(term) > -1;
        });
    }

    filterPost(items, filter) {
        if (filter === 'like') {
            return items.filter(item => item.like === true);
        } else if (filter === 'star') {
            return items.filter(item => item.important === true);
        } else {
            return items;
        }
    }

    onUpdateSearch(term) {
        this.setState({ term });
    }

    onFilterSelect(filter) {
        this.setState({ filter });
    }

    render() {

        this.saveStateToStorage();

        const { data, term, filter } = this.state;
        const liked = data.filter(item => item.like === true).length;
        const allPost = data.length;

        const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

        return (
            <AppBlock>
                <AppHeader
                    liked={liked}
                    allPost={allPost} />
                <div className="search-panel d-flex">
                    <SearchPanel
                        onUpdateSearch={this.onUpdateSearch} />
                    <PostSatusFilter
                        filter={filter}
                        onFilterSelect={this.onFilterSelect} />
                </div>
                <PostList
                    posts={visiblePosts}
                    onDelete={this.deleteItem}
                    onToggleImportant={this.onToggleImportant}
                    onToggleLiked={this.onToggleLiked} />
                <PostAddForm
                    onAdd={this.addItem} />
            </AppBlock>
        )
    }
}
