import { registerStore } from '@wordpress/data';
import { controls } from '@wordpress/data-controls';
import reducer from './reducer';
import selectors from './selectors';
import actions from './actions';

const STORE_KEY = 'easy-custom-sidebars';

const store = registerStore(STORE_KEY, {
  reducer,
  selectors,
  actions,
  controls,
  resolvers: {}
});

export default store;
