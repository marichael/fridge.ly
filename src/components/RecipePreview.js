import React from 'react';
import { Link } from 'react-router';

export default class RecipePreview extends React.Component {
  render() {
    return (
      <div className="recipe-preview">
        <h2 className="name">{this.props.name}</h2>
      </div>
    );
  }
}
