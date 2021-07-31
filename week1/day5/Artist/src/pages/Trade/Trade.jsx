import {useContext, useReducer, useEffect} from 'react';

import {Link} from 'react-router-dom';
import classNames from 'classnames';

import Pixel from '../../model/Pixel.js';
import Picture from '../../model/Picture.js';

import FlowContext from '../../context/Flow.jsx';

import Frame from '../Draw/Frame.jsx';

const constants = {
  flowFormat: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4
  })
};

function reducer(state, action) {
  switch (action.type) {
    case 'setListings': {
      return {
        ...state,
        listings: action.payload.map((listing) => ({
          ...listing,
          picture: new Picture(listing.canvas.pixels, listing.canvas.width, listing.canvas.height),
          price: Number.parseFloat(listing.price)
        }))
      };
    }
    case 'startProcessing': {
      return {
        ...state,
        processingListingIndex: action.payload
      };
    }
    case 'stopProcessing': {
      return {
        ...state,
        processingListingIndex: null
      };
    }
    default:
      return state;
  }
}

function Trade(props) {
  const flow = useContext(FlowContext);
  const [state, dispatch] = useReducer(reducer, {
    listings: null,
    processingListingIndex: null
  });

  useEffect(() => {
    flow
      .fetchListings()
      .then((listings) => dispatch({type: 'setListings', payload: listings}));
  }, [flow]);

  const onBuy = async (listingIndex) => {
    console.log(listingIndex);
    dispatch({type: 'startProcessing', payload: listingIndex});
    // TODO: Once your buy() method is implemented in Flow.jsx, uncomment this line.
    // await flow.buy(listingIndex);
    await flow.fetchCollection()
    const listings = await flow.fetchListings();
    await flow.fetchBalance();
    dispatch({type: 'setListings', payload: listings});
    dispatch({type: 'stopProcessing'});
  };
  const onWithdraw = async (listingIndex) => {
    console.log(listingIndex);
    dispatch({type: 'startProcessing', payload: listingIndex});
    // TODO: Once your withdrawListing() method is implemented in Flow.jsx, uncomment this line.
    // await flow.withdrawListing(listingIndex);
    await flow.fetchCollection();
    await flow.fetchBalance();
    const listings = await flow.fetchListings();
    dispatch({type: 'setListings', payload: listings});
    dispatch({type: 'stopProcessing'});
  };

  return (
    <div>
      <h5 className="title is-5">Buy and Sell Pictures</h5>
      <table className="table is-fullwidth is-striped is-narrow">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Seller</th>
            <th className="is-justify-content-flex-end has-text-right">Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {state.listings && state.listings.map((listing, index) => {
            const isUserOwner = flow.state.user.addr === listing.seller;

            return (
              <tr key={listing.picture.pixels}>
                <td>
                  <Frame
                    pixel={Pixel.thumbnail}
                    picture={listing.picture}
                  />
                </td>
                <td>
                  {listing.seller}
                </td>
                <td className="is-justify-content-end">
                  <div className="tags has-addons are-medium is-justify-content-flex-end">
                    <span className="tag is-primary is-light">FLOW</span>
                    <span className="tag">
                      {constants.flowFormat.format(listing.price)}
                    </span>
                  </div>
                </td>
                <td>
                  {!isUserOwner &&
                    <button
                      className={classNames({
                        'button is-success': true,
                        'is-loading': state.processingListingIndex === index
                      })}
                      onClick={() => onBuy(index)}
                    >
                      Buy
                    </button>
                  }
                  {isUserOwner &&
                    <button
                      className={classNames({
                        'button is-warning': true,
                        'is-loading': state.processingListingIndex === index
                      })}
                      onClick={() => onWithdraw(index)}
                    >
                      Withdraw
                    </button>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Trade;