import { RouterProvider } from 'react-router';
import { router } from './routes';

function App() {
  return <RouterProvider router={router} />;
}

App.displayName = 'App';

export default App;
