import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <h1>Welcome to fridge.ly</h1>
        </header>
        <div className="app-content">{this.props.children}</div>
        <footer>
          <p>
            Made by Marichael.
          </p>
        </footer>
      </div>
    );
  }
}
