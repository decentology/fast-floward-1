import {useContext, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import FlowContext from '../../context/Flow.jsx';

function Authenticate(props) {
  const flow = useContext(FlowContext);
  const history = useHistory();

  useEffect(() => {
    if (flow.state.user && flow.state.user.loggedIn) {
      history.push('/');
    }
  }, [flow.state.user, history]);

  return (
    <article className="message is-info">
      <div className="message-header">
        <p>Authenticate</p>
      </div>
      <div className="message-body">
        Please log in with your <strong>Blocto</strong> testnet wallet.
      </div>
    </article>
  );
}

export default Authenticate;