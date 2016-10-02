import React from 'react';
import RecipePreview from './RecipePreview';
import recipes from '../data/recipes';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="athletes-selector">
          {recipes.map(recipeData => <RecipePreview key={recipeData.name} {...recipeData} />)}
        </div>
      </div>
    );
  }
}
