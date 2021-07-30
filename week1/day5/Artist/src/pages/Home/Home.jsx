import React, {useContext, useState} from 'react';
import classNames from 'classnames';
import {Link, useHistory} from 'react-router-dom';

import Pixel from '../../model/Pixel.js';

import FlowContext from '../../context/Flow.jsx';

import Collection from './Collection.jsx';
import Frame from '../Draw/Frame.jsx';

import './Home.css';

function Home(props) {
  const [focusedPicture, setFocusedPicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const flow = useContext(FlowContext);
  const history = useHistory();

  const onFocus = (picture) => {
    if (focusedPicture === picture) {
      setFocusedPicture(null);
    } else {
      setFocusedPicture(picture);
    }
  };
  const onSell = async () => {
    setIsLoading(true);

    const rawPrice = window.prompt("How much FLOW would you like to sell for?");
    const price = Number.parseFloat(rawPrice);
    
    if (price > 0) {
      try {
        const transactionResult = await flow.postListing(
          focusedPicture,
          price
        );
        await flow.fetchCollection();

        setIsLoading(false);

        if (transactionResult.events.find((event) => event.type.endsWith('ItemPosted'))) {
          console.log(transactionResult);
          history.push('/trade');
        } else {
          console.log('Something went wrong putting this Picture up for sale.');
        }
      } catch (error) {
        console.log('There was an error putting this Picture up for sale.');
        console.log(error);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h5 className="title is-5">
        Account Information
      </h5>
      <table className="table is-bordered is-fullwidth">
        <tbody>
          <tr>
            <td>Address</td>
            <td>{flow.state.user.addr}</td>
          </tr>
          <tr>
            <td>FLOW balance</td>
            <td>{flow.state.balance}</td>
          </tr>
        </tbody>
      </table>

      <h5 className="title is-5">
        Collection
      </h5>
      <Collection
        collection={flow.state.collection}
        focusedPicture={focusedPicture}
        noCollectionNotification={
          <div className="notification">
            You don't have a collection, please create one in the <Link to="/draw">Draw</Link> tab.
          </div>
        }
        emptyCollectionNotification={
          <div className="notification">
            Your collection is empty.
          </div>
        }
        onFocus={onFocus}
      />
      
      {focusedPicture &&
        <React.Fragment>
          <h5 className="title is-5">
            Picture
          </h5>
          <div className="block">
            <Frame
              pixel={Pixel.full}
              picture={focusedPicture}
            />
          </div>
          <div className="tags has-addons block">
            <span className="tag is-dark">Serialized</span>
            <span className="tag is-family-monospace">
              {focusedPicture.pixels}
            </span>
          </div>
          <div className="block">
            <div className="field is-grouped block">
              <div className="control">
                <button
                  className={classNames({
                    'button is-primary': true,
                    'is-loading': isLoading
                  })}
                  onClick={onSell}
                >
                  Sell
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>
      }
    </div>
  );
}

export default Home;