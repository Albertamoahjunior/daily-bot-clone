import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import DashBoardLayout from './layouts/DashBoardLayout';

import {TeamsPage} from './pages/TeamsPage'
import {TeamPollsPage} from './pages/TeamPollsPage'
import {EditTeamPage} from './pages/EditTeamPage'
import {StandupDashboardPage} from './pages/StandupDashboardPage'
import {KudosPage} from './pages/KudosPage'
import {TeamMoodPage} from './pages/TeamMoodPage'
import {AnalyticsPage} from './pages/AnalyticsPage'
import Signin from './pages/Signin';
import { TokenVerification } from './pages/TokenVerification';

import TeamsContextProvider from './contexts/TeamsContextProvider'
import PollsContextProvider from './contexts/PollsContextProvider'
import StandupsContextProvider from './contexts/StandupsContextProvider'
import TeamMoodContextProvider from './contexts/TeamMoodContextProvider';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signin/>} />
        <Route path="/auth/verify" element={<TokenVerification/>} />

        
        <Route path="/" element={<TeamsContextProvider><StandupsContextProvider><DashBoardLayout/></StandupsContextProvider></TeamsContextProvider>} >
        <Route index element={<Navigate to="/analytics" replace />} />
        <Route path='analytics' element={
            <TeamsContextProvider>

              <PollsContextProvider>
              <StandupsContextProvider>
              <TeamMoodContextProvider>
                  <AnalyticsPage/>
              </TeamMoodContextProvider>
              </StandupsContextProvider>
              </PollsContextProvider>
            </TeamsContextProvider>
          } />

          <Route path='teams' element={
            <TeamsContextProvider>
              <StandupsContextProvider>
              <TeamsPage/>
              </StandupsContextProvider>
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
              <TeamMoodContextProvider>
                  <TeamMoodPage/>
              </TeamMoodContextProvider>
            </TeamsContextProvider>
          } />

          <Route path='team-polls' element={
            <TeamsContextProvider>
              <PollsContextProvider>
                  <TeamPollsPage/>
              </PollsContextProvider>
            </TeamsContextProvider>
          } />


        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App

library.add(fab, fas, far)