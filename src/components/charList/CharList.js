import './charList.scss';
import React, {Component} from "react";
import MarvelService from "../../services/MarvelService";

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
    };

    componentDidMount() {
        this.updateChars();
    }

    marvelServise = new MarvelService();

    onCharLoaded = (charList) => {
        this.setState({
            charList,
            loading: false,
            error: false,
        });
    };

    onCharLoading = () => {
        this.setState({
            loading: false,
        });
    };

    onError = () => {
        this.setState({
            ...this.state,
            loading: false,
            error: true,
        });
    };

    updateChars = () => {

        this.onCharLoading();

        this.marvelServise
        .getAllCharacters()
        .then(this.onCharLoaded)
        .catch(this.onError);
    }

    render() {
        return (
          <div className="char__list">
              <ul className="char__grid">
                  {this.state.charList.map(item => {
                      return (
                        <li onClick={() => this.props.onCharSelected(item.id)} key={item.id} className="char__item">
                            {
                                item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                                  ? <img src={item.thumbnail}
                                         style={{objectFit: 'contain'}}
                                         alt={item.name} className="randomchar__img"/>
                                  : <img src={item.thumbnail}
                                         style={{objectFit: 'cover'}}
                                         alt={item.name} className="randomchar__img"/>
                            }
                            <div className="char__name">{item.name}</div>
                        </li>
                        )
                   })
                  }
              </ul>
              <button className="button button__main button__long">
                  <div className="inner">load more</div>
              </button>
          </div>
        )
    }
}

export default CharList;
