/**
* Sourced from https://facebook.github.io/react/docs/tutorial.html
*/

var RecipeBox = React.createClass({
  loadRecipesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleRecipeSubmit: function(recipe) {
    var recipes = this.state.data;
    var newRecipes = recipes.concat([recipe]);
    this.setState({data: newRecipes});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: recipe,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: recipes});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadRecipesFromServer();
    setInterval(this.loadRecipesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="recipeBox">
        Hello, world! I am a RecipeBox.
        <h1>Recipes</h1>
        <RecipeList data={this.state.data} />
        <RecipeForm onRecipeSubmit={this.handleRecipeSubmit} />
      </div>
    );
  }
});

var RecipeList = React.createClass({
  render: function() {
    var recipeNodes = this.props.data.map(function(recipe) {
      return (
        <Recipe name={recipe.name}
                book_name={recipe.book_name}
                page_number={recipe.page_number}
                link={recipe.link}
                key={recipe.id}>
        </Recipe>
      );
    });
    return (
      <div className="recipeList">
        {recipeNodes}
      </div>
    );
  }
});

var RecipeForm = React.createClass({
  getInitialState: function() {
    return {name: ''};
  },
  handleNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  handleBookNameChange: function(e) {
    this.setState({book_name: e.target.value});
  },
  handlePageNumberChange: function(e) {
    this.setState({page_number: e.target.value});
  },
  handleLinkChange: function(e) {
    this.setState({link: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var book_name = this.state.book_name;
    var page_number = this.state.page_number;
    var link = this.state.link;
    if (!name) {
      return;
    }
    this.props.onRecipeSubmit({name: name,
                               book_name: book_name,
                               page_number: page_number,
                               link: link});
    this.setState({name: '', book_name: '', page_number: '', link: ''});
  },
  render: function() {
    return (
      <form className="recipeForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Recipe name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input
          type="text"
          placeholder="Book"
          value={this.state.book_name}
          onChange={this.handleBookNameChange}
        />
        <input
          type="text"
          placeholder="Page number"
          value={this.state.page_number}
          onChange={this.handlePageNumberChange}
        />
        <input
          type="text"
          placeholder="Link"
          value={this.state.link}
          onChange={this.handleLinkChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Recipe = React.createClass({
  render: function() {
    var isBook = this.props.book_name;
    var description = null;
    if (isBook) {
      description = `${this.props.book_name} ( p. ${this.props.page_number} )`
    } else {
      description = this.props.link
    }
    return (
      <div className="recipe">
        <h2 className="recipeName">
          	{this.props.name}
        </h2>
        {description}
      </div>
    );
  }
});

ReactDOM.render(
  <RecipeBox url="/recipes" pollInterval={2000} />,
  document.getElementById('content')
);
