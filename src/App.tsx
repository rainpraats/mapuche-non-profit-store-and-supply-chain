import './App.css';
import { RouterProvider } from 'react-router';
import { router } from './Router';

const App = () => {
  return (
    <>
      {/* <AuthContext.Provider value={setIsSignedIn}> */}
      <RouterProvider router={router}></RouterProvider>
      {/* </AuthContext.Provider> */}
    </>
  );
};

export default App;
