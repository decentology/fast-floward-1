import {useContext, useReducer, useEffect} from 'react';

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
    case 'startLoading': {
      return {
        ...state,
        isLoading: true
      };
    }
    case 'stopLoading': {
      return {
        ...state,
        isLoading: false
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
    isLoading: false
  });

  useEffect(() => {
    flow
      .fetchListings()
      .then((listings) => dispatch({type: 'setListings', payload: listings}));
  }, [flow]);

  const onBuy = (listingIndex) => {
    console.log(listingIndex);
    // flow.buy(listingIndex);
  };
  const onWithdraw = (listingIndex) => {
    console.log(listingIndex);
    // flow.withdraw(listingIndex);
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
                      className="button is-success"
                      onClick={() => onBuy(index)}
                    >
                      Buy
                    </button>
                  }
                  {isUserOwner &&
                    <button
                      className="button is-warning"
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