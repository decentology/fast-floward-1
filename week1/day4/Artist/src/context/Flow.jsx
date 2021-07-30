import React, {useReducer, useEffect, useCallback} from 'react';
import * as fcl from '@onflow/fcl';
import * as FlowTypes from '@onflow/types';

import Picture from '../model/Picture.js';

const Context = React.createContext({});

function reducer(state, action) {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.payload
      };
    }
    case 'setBalance': {
      return {
        ...state,
        balance: action.payload
      };
    }
    case 'setCollection': {
      if (action.payload) {
        return {
          ...state,
          collection: action.payload
        };
      } else {
        return {
          ...state,
          collection: action.payload
        };
      }
    }
    default:
      return state;
  }
}

function Provider(props) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    balance: null,
    collection: undefined
  });

  const isReady = (
    state.balance !== null &&
    state.collection !== undefined
  );

  const fetchBalance = useCallback(
    async () => {
      if (state.user.addr && state.user.addr !== '0xLocalArtist') {
        // A sample script execution.
        // Query for the account's FLOW token balance.
        const balance = await fcl.send([
          fcl.script`
            import FungibleToken from 0x9a0766d93b6608b7
            import FlowToken from 0x7e60df042a9c0868
  
            pub fun main(address: Address): UFix64 {
              let vaultRef = getAccount(address)
                .getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
                ?? panic("Could not borrow Balance reference to the Vault");
  
              return vaultRef.balance;
            }
          `,
          fcl.args([
            fcl.arg(state.user.addr, FlowTypes.Address)
          ])
        ]).then(fcl.decode);

        dispatch({type: 'setBalance', payload: balance});
      } else {
        return dispatch({type: 'setBalance', payload: -42});
      }
    },
    [state.user]
  );
  const createCollection = useCallback(
    async () => {
        // TODO: Implement the createCollection transaction using "fcl.send".

        /*
        const transactionId = await fcl
          .send([])
          .then(fcl.decode);
        return fcl.tx(transactionId).onceSealed();
        */
      
        return null;
    },
    []
  );
  const destroyCollection = useCallback(
    async () => {
      // TODO: Implement the destroyCollection.cdc transaction using "fcl.send".

      /*
      const transactionId = await fcl
        .send([])
        .then(fcl.decode);
      return fcl.tx(transactionId).onceSealed();
      */

      return null;
    },
    []
  );
  const fetchCollection = useCallback(
    async (address) => {
      if (address || state.user.addr) {
        try {
          let args = null;
          if (address) {
            // eslint-disable-next-line
            args = fcl.args([
              fcl.arg(address, FlowTypes.Address)
            ]);
          } else {
            // eslint-disable-next-line
            args = fcl.args([
              fcl.arg(state.user.addr, FlowTypes.Address)
            ]);
          }
          
          // TODO: Implement the getCollections.cdc script using "fcl.script", and
          // the "args" in place for the script's arguments.
          // Use the "fetchBalance" as an example.

          const collection = [];
          const mappedCollection = collection.map(
            (serialized) => new Picture(
              serialized.pixels,
              serialized.width,
              serialized.height
            )
          );

          if (address) {
            return mappedCollection;
          } else {
            dispatch({type: 'setCollection', payload: mappedCollection});
          }
        } catch (error) {
          if (address) {
            return null;
          } else {
            dispatch({type: 'setCollection', payload: null});
          }
        }
      }
    },
    [state.user]
  );
  const printPicture = useCallback(
    async (picture) => {
      // TODO: Implement the print.cdc transcation using "fcl.send".
      
      /*
      const transactionId = await fcl
        .send([])
        .then(fcl.decode);
      return fcl.tx(transactionId).onceSealed();
      */

      return null;
    },
    []
  );

  const setUser = (user) => {
    dispatch({type: 'setUser', payload: user});
  };
  const logIn = () => {
    // TODO: Implement FCL log in.
    // TODO: Once implemented, remove the "setUser" call.
    setUser({
      loggedIn: true,
      addr: '0xLocalArtist'
    });
  };
  const logOut = () => {
    // TODO: Implement FCL log out.
  };

  useEffect(() => {
    // TODO: Implement FCL subscription to get current user.
    // TODO: Once implemented, remove the "setUser" call.
    setUser({
      loggedIn: null
    });
  }, []);

  useEffect(() => {
    if (state.user && state.user.addr) {
      fetchBalance();
      fetchCollection();
    }
  }, [state.user, fetchBalance, fetchCollection]);

  return (
    <Context.Provider
      value={{
        state,
        isReady,
        dispatch,
        logIn,
        logOut,
        fetchBalance,
        fetchCollection,
        createCollection,
        destroyCollection,
        printPicture
      }}
    >
      {props.children}
    </Context.Provider>
  );
}

export {
  Context as default,
  Provider
};