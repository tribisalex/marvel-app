import './charInfo.scss';
import React, {Component} from "react";
import MarvelService from "../../services/MarvelService";
import Skeleton from "../skeleton/Skeleton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        // this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }

        // this.foo.bar = 0;
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
        });
    };

    onCharLoading = () => {
        this.setState({
            loading: false,
        });
    };

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        });
    };

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();

        this.marvelService
        .getCharacter(charId)
        .then(this.onCharLoaded)
        .catch(this.onError);
    }

    render() {
        const {char, loading, error} = this.state;

        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <View char={char}/> : null;

        return (
          <div className="char__info">
              {skeleton}
              {errorMessage}
              {spinner}
              {content}
          </div>
        );
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    return (
      <div className="char__info">
          <div className="char__basics">
              {
                  thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
                    ? <img src={thumbnail}
                           style={{objectFit: 'contain'}}
                           alt={name} className="randomchar__img"/>
                    : <img src={thumbnail}
                           style={{objectFit: 'cover'}}
                           alt={name} className="randomchar__img"/>
              }
              <div>
                  <div className="char__info-name">{name}</div>
                  <div className="char__btns">
                      <a href={homepage} className="button button__main">
                          <div className="inner">homepage</div>
                      </a>
                      <a href={wiki} className="button button__secondary">
                          <div className="inner">Wiki</div>
                      </a>
                  </div>
              </div>
          </div>
          <div className="char__descr">{description}</div>
          {comics.length === 0
            ? <div className="char__comics">There is no comics with this character</div>
            : <div className="char__comics">Comics:</div>
          }
          <ul className="char__comics-list">

              {comics.map((item, i) => {
                  if (i > 9) return;

                  return (
                    <li key={i} className="char__comics-item">
                        {item.name}
                    </li>
                  );
              })}
          </ul>
      </div>
    )
}

export default CharInfo;
