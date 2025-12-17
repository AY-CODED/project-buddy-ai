import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layouts from './components/Layouts';

import ActiveProjects from './pages/ActiveProjects';
import Marketplace from './pages/Marketplace';
import Memory from './pages/Memory';
import NewProject from './pages/NewProject';
import Templates from './pages/Templates';
import ProjectsPage from './pages/ProjectsPage';
import ProjectResult from './pages/ProjectResult';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfilePage from './pages/ProfilePage';
import Pricing from './pages/Pricing';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='' element={<Layouts />}>
          <Route path='/active-projects' element={<ActiveProjects />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="memory" element={<Memory />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path='/new-project' element={<NewProject />} />
          <Route path='templates' element={<Templates />} />
          <Route path='/projects-page' element={<ProjectsPage />} />
          <Route path="/project-result" element={<ProjectResult />} />
          <Route path="/pricing" element={<Pricing/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;