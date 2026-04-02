import {createRoot} from 'react-dom/client';
import {Counter} from './components/Counter';
import {User} from './components/User';

const root = createRoot(document.getElementById('root'));
root.render(
    <div>
      <Counter/>
      <User/>
    </div>
);
