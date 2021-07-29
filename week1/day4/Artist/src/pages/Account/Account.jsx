import React, {useContext, useState, useEffect, useCallback} from 'react';
import {useParams} from 'react-router';

import FlowContext from '../../context/Flow.jsx';

import Collection from '../Home/Collection.jsx';

function Account(props) {
  const params = useParams();
  const [address, setAddress] = useState(null);
  const [collection, setCollection] = useState(undefined);
  const flow = useContext(FlowContext);

  const fetchCollection = useCallback(
    async (addresss) => {
      const collection = await flow.fetchCollection(addresss);
      setCollection(collection);
    },
    [flow]
  );

  useEffect(() => {
    if (address !== params.address) {
      setAddress(params.address);
      setCollection(undefined);
      fetchCollection(params.address);
    }
  }, [address, params.address, fetchCollection]);

  return (
    <React.Fragment>
      <h5 className="title is-5">
        Collection
      </h5>
      <div className="block">
        <div className="tags has-addons">
          <span className="tag">Account</span>
          <span className="tag is-info">{params.address}</span>
        </div>
      </div>
      <Collection
        collection={collection}
        noCollectionNotification={
          <div className="notification">
            This account doesn't have a Picture collection.
          </div>
        }
        emptyCollectionNotification={
          <div className="notification">
            This collection is empty.
          </div>
        }
      />
    </React.Fragment>
  );
}

export default Account;