import './charList.scss';
import React, {Component} from "react";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError);
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }))

        this.setState({});
    };

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true,
        });
    };

    onError = () => {
        this.setState({
            ...this.state,
            loading: false,
            error: true,
        });
    };

    liItemRefs = [];

    setLiRef = (el) => {
        this.liItemRefs.push(el);
    };

    shadowChar = (id) => {
        this.liItemRefs.forEach((item) =>
          item.classList.remove('char__item_selected')
        );
        this.liItemRefs[id].classList.add('char__item_selected');
        this.liItemRefs[id].focus();
    };

    renderItems(charList) {
        return (
          <ul className="char__grid">
              {charList.map((item, i) => {
                  return (
                    <li onClick={() => {
                        this.props.onCharSelected(item.id);
                        this.shadowChar(i);
                    }}
                        key={item.id}
                        className="char__item"
                        ref={this.setLiRef}>
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
        )
    }


    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (

          <div className="char__list">
              {errorMessage}
              {spinner}
              {content}
              <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{display: charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offset)}
              >
                  <div className="inner">load more</div>
              </button>
          </div>
        )
    }
}

export default CharList;
