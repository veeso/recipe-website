/**
 * @author Christian Visintin <christian.visintin1997@gmail.com>
 * @version 0.1.0
 * @license "please refer to <http://unlicense.org>"
 */

import React from "react";
import { Badge, Card, Carousel, Row } from "react-bootstrap";
import { FormattedDate } from "react-intl";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

//Actions
import { fetchRecipes, getRecipe } from "../actions/recipeActions";

//Classes
import Recipe from "../lib/data/recipe";
import RecipeLoader from "../components/RecipeLoader";
import { Category } from "../lib/data/category";
import { RootState } from "../store/index";

// Components
const RecipeCard = styled(Card)`
  margin-top: 3em;
  margin-bottom: 3em;
  padding: 3em 5em 3em 5em;
  border: 1px solid #c0c0c0;
`;

const RecipePicture = styled(Card.Img)`
  border-radius: 0.7em;
`;

const RecipeTitle = styled(Card.Title)`
  font-size: 2.5em;
`;

const RecipeSection = styled(Card.Title)`
  font-size: 1.8em;
  color: #404040;
`;

const RecipeDate = styled(Card.Title)`
  font-size: 0.8em;
  color: #808080;
`;

const IngredientList = styled.ul`
  list-style-type: circle;
`;

const IngredientName = styled.h4`
  font-size: 1.2em;
  color: #404040;
  display: inline-block;
  margin-right: 1ch;
`;

const IngredientQuantity = styled.h5`
  font-size: 0.9em;
  color: #606060;
  display: inline-block;
`;

// Props
interface OwnProps {
  recipeId: string;
  lang: string;
  categories: Array<Category>;
}

interface DispatchProps {
  fetchRecipes: Function;
  getRecipe: Function;
}

interface StateProps {
  recipe: Recipe;
  related: Array<Recipe>;
}

type RecipeProps = StateProps & OwnProps & DispatchProps;

// States
interface OwnStates {
  recipeLoaded: boolean;
  relatedLoaded: boolean;
}

class RecipeView extends React.Component<RecipeProps, OwnStates> {
  static propTypes = {
    recipeId: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
  };

  constructor(props: RecipeProps) {
    super(props);
    this.state = {
      recipeLoaded: false,
      relatedLoaded: false,
    };
  }

  render() {
    if (this.state.recipeLoaded) {
      return this.buildRecipe(this.props.recipe, this.props.related);
    } else {
      // Return loader
      return <RecipeLoader />;
    }
  }

  componentDidMount() {
    // Load recipe
    this.props
      .getRecipe(this.props.lang, this.props.categories, this.props.recipeId)
      .then(() => {
        //Once recipes have been loaded, set recipe loaded to true
        this.setState({ recipeLoaded: true }, () => {
          // Load related
          const recipeName = this.props.recipe.title;
          const category: string | undefined = this.props.categories[0]
            ? this.props.categories[0].name
            : undefined;
          // Related recipe: title likes recipe, has the same first category, shuffle, limit 5
          this.props
            .fetchRecipes(
              this.props.lang,
              this.props.categories,
              recipeName,
              category,
              undefined,
              5,
              undefined,
              true
            )
            .then(() => {
              this.setState({ relatedLoaded: true });
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }

  /**
   * @description build recipe component
   * @param {Recipe} recipe
   * @param {Array<Recipe>} related
   * @returns {React.Node}
   */
  buildRecipe(recipe: Recipe, related: Array<Recipe>): React.ReactNode {
    const relatedRecipes = this.state.relatedLoaded
      ? related.map((recipe) => (
          <React.Fragment key={recipe.id}>
            <Card.Text>&nbsp;•&nbsp;</Card.Text>
            <Card.Link href={"/#/recipe/" + recipe.id}>
              {recipe.title}
            </Card.Link>
          </React.Fragment>
        ))
      : null;
    //Prepare pictures
    const recipePictures = this.props.recipe.img.map((img) => (
      <Carousel.Item key={img}>
        <RecipePicture className="border" variant="top" src={img} />
      </Carousel.Item>
    ));
    //Prepare categories
    const categories = recipe.categories.map((tag, index) => (
      <React.Fragment key={index}>
        <Badge variant="secondary">#{tag}</Badge>
        &nbsp;
      </React.Fragment>
    ));
    // Prepare ingredients
    const ingredients = recipe.ingredients
      ? recipe.ingredients.map((ingredient, _) => {
          const translationKey = "recipes.ingredients." + ingredient.name;
          return (
            <li>
              <IngredientName>
                <FormattedMessage id={translationKey} />
              </IngredientName>
              <IngredientQuantity>
                {ingredient.quantity}&nbsp;{ingredient.measure}
              </IngredientQuantity>
            </li>
          );
        })
      : null;
    return (
      <div className="row align-items-center">
        <RecipeCard className="col-md-6 offset-md-3">
          <RecipeDate>
            <FormattedDate
              value={recipe.date}
              year="numeric"
              month="long"
              day="numeric"
            />
          </RecipeDate>
          <RecipeTitle>{recipe.title}</RecipeTitle>
          <Card.Text>{categories}</Card.Text>
          <Carousel className="d-block" interval={5000}>
            {recipePictures}
          </Carousel>
          <Card.Body>
            <RecipeSection>
              <FormattedMessage id="recipes.ingredientsKey" />
            </RecipeSection>
            <IngredientList>{ingredients}</IngredientList>
            <RecipeSection>
              <FormattedMessage id="recipes.preparation" />
            </RecipeSection>
            <Card.Text>{recipe.body}</Card.Text>
          </Card.Body>
          <hr />
          <div className="row d-flex flex-row-reverse align-items-end">
            <Row>
              <Card.Link href="/#/recipes">
                <FormattedMessage id="recipes.recipes" />
              </Card.Link>
              {relatedRecipes}
            </Row>
          </div>
          <hr />
        </RecipeCard>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  related: state.recipes.items,
  recipe: state.recipes.item,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, any>) => ({
  fetchRecipes: (
    lang: string,
    categories: Array<Category>,
    title: string | undefined = undefined,
    category: string | undefined = undefined,
    orderBy: string | undefined = undefined,
    limit: number | undefined = undefined,
    offset: number | undefined = undefined,
    shuffle: boolean = false
  ) =>
    dispatch(
      fetchRecipes(
        lang,
        categories,
        title,
        category,
        orderBy,
        limit,
        offset,
        shuffle
      )
    ),
  getRecipe: (lang: string, categories: Array<Category>, id: string) =>
    dispatch(getRecipe(lang, categories, id)),
});

export default connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(RecipeView);
