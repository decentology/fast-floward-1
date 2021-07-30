import {useReducer, useContext, useEffect} from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import FlowContext from '../../context/Flow.jsx';

import Picture from '../../model/Picture.js';
import Pixel from '../../model/Pixel.js';

import Frame from './Frame.jsx';

function reducer(state, action) {
  switch (action.type) {
    case 'setPicture': {
      return {
        ...state,
        picture: action.payload
      };
    }
    case 'startLoading': {
      return {
        ...state,
        message: null,
        isLoading: true
      };
    }
    case 'stopLoading': {
      return {
        ...state,
        isLoading: false
      };
    }
    case 'setMessage': {
      return {
        ...state,
        message: action.payload,
        isLoading: false
      };
    }
    default:
      return state;
  }
}

function Draw(props) {
  const [state, dispatch] = useReducer(reducer, {
    picture: new Picture(window.sessionStorage.getItem('drawingPicture') || '0000000000000000000000000'),
    message: null,
    isLoading: false
  });
  const flow = useContext(FlowContext);

  const onTogglePixel = (index, brush) => {
    dispatch({
      type: 'setPicture',
      payload: state.picture.togglePixelAt(index, brush)
    });
  }

  const onCreateCollection = async () => {
    if (!state.isLoading) {
      dispatch({type: 'startLoading'});
      try {
        const response = await flow.createCollection();
        if (response.statusCode === 0) {
          await flow.fetchCollection();
          dispatch({type: 'stopLoading'});
        }
      } catch (error) {
        dispatch({
          type: 'setMessage',
          payload: {
            type: 'warning',
            contents: error.toString().replace('Error: ', '')
          }
        });
      }
    }
  };
  const onPrint = async () => {
    if (!state.isLoading) {
      dispatch({type: 'startLoading'});
      try {
        const response = await flow.printPicture(state.picture);

        if (response === null) {
          return dispatch({
            type: 'setMessage',
            payload: {
              type: 'warning',
              contents: <p><code>print.cdc</code> not yet implemented using <code>fcl.send</code>.</p>
            }
          });
        }

        const didSucceed = response.events.find((event) => event.type.endsWith(`${process.env.REACT_APP_ARTIST_CONTRACT_NAME}.PicturePrintSuccess`));
        const didFail = response.events.find((event) => event.type.endsWith(`${process.env.REACT_APP_ARTIST_CONTRACT_NAME}.PicturePrintFailure`));
        if (didSucceed) {
          dispatch({
            type: 'setMessage',
            payload: {
              type: 'success',
              contents: <p>Awesome! This Picture (<span className="tag is-family-monospace">{state.picture.pixels}</span>) was added to your <Link to="/">collection</Link>.</p>
            }
          });
        } else if (didFail) {
          dispatch({
            type: 'setMessage',
            payload: {
              type: 'warning',
              contents: <p>Oops! This Picture (<span className="tag is-family-monospace">{state.picture.pixels}</span>) already exists. Try drawing something else.</p>
            }
          });
        } else {

        }
        if (response.statusCode === 0) {
          await flow.fetchCollection();
          dispatch({type: 'stopLoading'});
        }
      } catch (error) {
        dispatch({
          type: 'setMessage',
          payload: {
            type: 'warning',
            contents: error.toString().replace('Error: ', '')
          }
        });
      }
    }
  };
  const onClear = () => {
    dispatch({
      type: 'setPicture',
      payload: new Picture('0000000000000000000000000')
    });
  };

  useEffect(() => {
    window.sessionStorage.setItem('drawingPicture', state.picture.pixels);
  }, [state.picture]);

  if (flow.state.collection === null) {
    return (
      <div>
        <h5 className="title is-5">Draw a Picture</h5>
        <p className="block">
          Before you can start drawing, please create a Picture Collection.
        </p>
        {state.message &&
          <div
            className={classNames({
              'notification': true,
              'is-warning': state.message.type === 'warning',
              'is-success': state.message.type === 'success'
            })}
          >
            {state.message.contents}
          </div>
        }
        <div className="control block">
          <button
            className={classNames({
              'button is-primary': true,
              'is-loading': state.isLoading
            })}
            onClick={onCreateCollection}
          >
            Create Collection
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h5 className="title is-5">Draw a Picture</h5>
        <div className="block">
          <Frame
            pixel={Pixel.full}
            picture={state.picture}
            onTogglePixel={onTogglePixel}
          />
        </div>
        {state.message &&
          <div
            className={classNames({
              'notification': true,
              'is-warning': state.message.type === 'warning'
            })}
          >
            {state.message.contents}
          </div>
        }
        <div className="block">
          <div className="field is-grouped block">
            <div className="control">
              <button
                className={classNames({
                  'button is-primary': true,
                  'is-loading': state.isLoading
                })}
                onClick={onPrint}
              >
                Print
              </button>
            </div>
            <div className="control">
              <button
                className="button"
                onClick={onClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="block content">
          Once you're happy with your drawing, you can create a unique NFT (Non-Fungible Token) on the Flow blockchain, just click <strong>Print</strong>.
        </div>
        <div className="tags has-addons block">
          <span className="tag is-dark">Pixels</span>
          <span className="tag is-family-monospace">
            {state.picture.pixels}
          </span>
        </div>
      </div>
    );
  }
}

export default Draw;