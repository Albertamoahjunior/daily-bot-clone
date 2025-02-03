import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {BrowserRouter, Routes, Route} from "react-router-dom";

import DashBoardLayout from './layouts/DashBoardLayout';

import {TeamsPage} from './pages/TeamsPage'
import {EditTeamPage} from './pages/EditTeamPage'
import {StandupDashboardPage} from './pages/StandupDashboardPage'
import {KudosPage} from './pages/KudosPage'
import {TeamMoodPage} from './pages/TeamMoodPage'

import TeamsContextProvider from './contexts/TeamsContextProvider'
import StandupsContextProvider from './contexts/StandupsContextProvider'


function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<DashBoardLayout/>} >
          <Route path='teams' element={
            <TeamsContextProvider>
              <TeamsPage/>
            </TeamsContextProvider>
          } />
          
          <Route path='teams/edit/:teamId' element={
            <TeamsContextProvider>
              <StandupsContextProvider>
                <EditTeamPage/>
              </StandupsContextProvider>
            </TeamsContextProvider>
          } />

          <Route path='standupdashboard' element={
            <TeamsContextProvider>
              <StandupsContextProvider>
                  <StandupDashboardPage/>
              </StandupsContextProvider>
            </TeamsContextProvider>
          } />

          <Route path='kudos' element={
            <TeamsContextProvider>
              {/* <StandupsContextProvider> */}
                  <KudosPage/>
              {/* </StandupsContextProvider> */}
            </TeamsContextProvider>
          } />

          <Route path='team-mood' element={
            <TeamsContextProvider>
              {/* <StandupsContextProvider> */}
                  <TeamMoodPage/>
              {/* </StandupsContextProvider> */}
            </TeamsContextProvider>
          } />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

library.add(fab, fas, far)