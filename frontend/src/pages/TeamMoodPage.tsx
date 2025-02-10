import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid,PolarAngleAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodPercentageDisplay } from '@/components/MoodPercentageDisplay';
import { AnimationWrapper } from '@/common/page-animation';
import { TeamInputDropdown } from '../components/TeamDropdownInput';
import {useTeamsContext} from '../hooks/useTeamsContext';
import { useTeamMoodContext } from '../hooks/useTeamMoodContext';

import {MemberMoodHistory} from '../components/MemberMoodHistory';
import {CreateMoodModal} from '../components/CreateMoodModal'
import {MoodInsights} from '../components/MoodInsights'
import {DeleteModal} from '../components/DeleteModal'
import {MoodResponse,MoodData, AllMoods} from "../types/Mood";


import {moodService} from "../services/api"
import {toast} from "react-toastify";






export const TeamMoodPage: React.FC = () => {
  const { allMoodResponses, allEmojis, allTeamMoods} = useTeamMoodContext();
  const [moodCheckInConfigured, setMoodCheckInConfigured] = useState(true);
  const [createMoodPage, setCreateMoodPage] = useState(true);
  const [pageState, setPageState] = useState<"home"|"mood-history">("home")
  const { teams, members } = useTeamsContext();

  // const [moodQuestion, setMoodQuestion] = useState("");


  const [selectedTeam, setSelectedTeam] = useState('');
  const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [deleteMood, setDeleteMood] = useState<boolean>(false);

  const [moodHistSelectedUser, setMoodHistSelectedUser] = useState<string>("");
  const [selectedMoodHistTeam, setMoodHistSelectedTeam] = useState<string>("");
  const [moodHistMembersList, setMoodHistMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [moodHistTeamsList, setMoodHistTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [moodHistDate, setMoodHistDate] = useState<string>("");

  const [teamMoodSummaryByDate, setTeamMoodSummaryByDate] = useState<MoodData[]>()

    const [filteredMoodResponses, setFilteredMoodResponses] = useState<MoodResponse[] | undefined>(undefined);
  

    // Filter logic
    const handleFilter = async () => {

      let filtered = allMoodResponses;
      

      if (selectedMoodHistTeam && !moodHistSelectedUser) {
        toast.error("Select A Member to view his/her mood response")
        // filtered = filtered?.filter((team) => team.teamId === selectedMoodHistTeam);
      }

      if (selectedMoodHistTeam && moodHistSelectedUser) {
        console.log("Filters Mood Hist Team: ", selectedMoodHistTeam);
        console.log("Filters Mood Hist Member: ", moodHistSelectedUser);
        filtered = await moodService.getMoodResponse(moodHistSelectedUser);
        // console.log("Filtered Mood Responses", filtered);
        if(filtered && filtered.length > 1)
          filtered = filtered?.filter((moodResponse) => (moodResponse.teamId === selectedMoodHistTeam && moodResponse.userId === moodHistSelectedUser ));
      }

      if(moodHistDate){
        console.log("Date", moodHistDate);

        filtered = filtered?.filter((moodResponse) => (moodResponse.createdAt == moodHistDate.split('T')[0]  ));
      }


      console.log("Filtered MoodResponses", filtered);
      setFilteredMoodResponses(filtered);
        
    }
  

  const handleDateSelect = (date: string | null) => {
    if(date){
      console.log("Selected Date", date);
      setMoodHistDate(date);
    }
  }

  const handleUserSelect = (user: string | null) => {
    if (user && !selectedUser.length) {
      setSelectedUser(user);
    }
  };

  const handleMoodHistUserSelect = (user: string | null) => {
    if (user) {
      // console.log("Inside handleMoodHistUserDeselect")
      setMoodHistSelectedUser(user);
    }
  };

  const handleMoodHistUserDeselect = () => {
    // console.log("Inside handleMoodHistUserDeselect")
    setMoodHistSelectedUser("");
  };



      // Populate teamsList
      useEffect(() => {
        setTeamsList(
          teams?.map((team) => ({
            value: team.id,
            label: team.teamName,
          }))
        );
        setMoodHistTeamsList(
          teams?.map((team) => ({
            value: team.id,
            label: team.teamName,
          }))
        );

      }, [teams]);


    
      // Populate membersList based on the selected team
      useEffect(() => {
        const fetchMoodData = async (teamId: string) => {
          const data = await moodService.getMoodAnalyticsForTeam(teamId);
          console.log("Selected Team: ", teamId);
          console.log("Mood Data For Selected Team", data);
          setTeamMoodSummaryByDate(data);
        };
        
        if (selectedTeam) {
          fetchMoodData(selectedTeam);

          const filteredMembers = members?.filter((member:Member) => member.teams.includes(selectedTeam))
            .map((member) => ({
              value: member.id,
              label: member.memberName,
            }));
          setMembersList(filteredMembers);
        } else {
          setMembersList(undefined);
        }
      }, [selectedTeam, members]);


      useEffect(() => {
        if (selectedMoodHistTeam) {
          const filteredMembers = members?.filter((member) => member.teams.includes(selectedMoodHistTeam))
            .map((member) => ({
              value: member.id,
              label: member.memberName,
            }));
          setMoodHistMembersList(filteredMembers);
        } else {
          setMoodHistMembersList(undefined);
        }
      }, [selectedMoodHistTeam, members]);
      

  






  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
  };
  const handleMoodHistTeamChange = (value: string) => {
    setMoodHistSelectedTeam(value);
  };

  const handleDeleteMood = () => {
    setDeleteMood(true);
    setMoodCheckInConfigured(false)
  }

// Custom Tooltip Component
  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '5px' }}>
          <p style={{ color: '#111' }}>{`Date: ${payload[0].payload.date}`}</p>
          {payload.map((entry, index) => {
            if (entry.value !== undefined) {
              return (
                <p key={`item-${index}`} style={{ color: entry.color }}>
                  {`${entry.name}: ${entry.value}`}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }

    return null;
  };


  return (
    <AnimationWrapper key={"mood-page"}>
    <div className="p-6 bg-slate-50 min-h-screen text-gray-800">
      {moodCheckInConfigured ? (
        <>
          <header className="mb-8">
            <div className="mb-4 flex justify-between">
                <h1 className="text-4xl font-extrabold text-left">Team Mood Dashboard</h1>
                <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setPageState("home")} className={`text-slate-600 hover:underline ${pageState === "home"? "underline":""}`}>Home</Button>
                    <Button variant="ghost" onClick={() => setPageState("mood-history")} className={`text-slate-600 hover:underline ${pageState === "mood-history"? "underline":""}`}>Mood History</Button>
                </div>
            </div>

            <div className="flex w-full justify-between">
            <p className="text-left text-lg mt-2">Track and analyze your team's mood trends and engagement</p>
            {selectedTeam && allTeamMoods && Object.keys(allTeamMoods).includes(selectedTeam) ?
            <button onClick={() => {setDeleteMood(true)}} className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200 "> Delete Your Mood Check In </button>
            : ""}
            {deleteMood && <DeleteModal title={"Delete Mood"} description={"Do You Want To Delete Your Team's Mood Check-In"} isOpen={deleteMood} onConfirm={handleDeleteMood} onClose={() => setDeleteMood(false)}/>}
            </div>
          </header>



          {pageState === "home" && 
          <main className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-sm shadow-sm border-black border-1">

            <TeamInputDropdown
                  inputName="Select a Team To Check Its Mood Recently"
                  options={teamsList}
                  selectedValue={selectedTeam}
                  onOptionChange={handleTeamChange}
            />
            </div>

            {selectedTeam.length ? 
              teamMoodSummaryByDate?.length !== 0?
                <Card className="bg-white shadow-2xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Team Mood Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={teamMoodSummaryByDate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="excited" stroke="#34D399" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="smile" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="angry" stroke="#F87171" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="meh" stroke="#A1A1AA" strokeWidth={2} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="sad" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card> : 
                <Card className="bg-white shadow-2xl rounded-2xl">
                  <CardHeader>
                    <CardTitle>Team Mood Trends</CardTitle>
                  </CardHeader>
                <CardContent className="w-full">
                  <p className="text-center text-gray-500">No mood data available</p>
                </CardContent>
              </Card>
            :
            <Card className='bg-white'>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">
                        No Team Selected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">
                        Please select a team to view the mood results.
                    </div>
                </CardContent>
            </Card>

            }



            <MoodInsights moodData={teamMoodSummaryByDate} selectedTeam={selectedTeam}/>


            {selectedTeam.length ? 

              <Card className="bg-white shadow-2xl rounded-2xl">
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodPercentageDisplay moodData={teamMoodSummaryByDate} />
                </CardContent>
              </Card>
            :
              <Card className='bg-white'>
                  <CardHeader>
                      <CardTitle className="text-lg font-medium">
                          No Team Selected
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="text-sm text-gray-500">
                          Please select a team to view the mood results.
                      </div>
                  </CardContent>
              </Card>
            }

          </main>}


          {pageState === "mood-history" && <main className="flex flex-col gap-6">

            <MemberMoodHistory 
              handleMoodHistTeamChange={handleMoodHistTeamChange}  
              handleMoodHistUserDeselect={handleMoodHistUserDeselect}
              handleMoodHistUserSelect={handleMoodHistUserSelect}
              moodHistTeamsList={moodHistTeamsList}
              moodHistMembersList={moodHistMembersList}
              moodHistSelectedUser={moodHistSelectedUser}
              selectedMoodHistTeam={selectedMoodHistTeam}
              moodHistDate = {moodHistDate}
              handleDateSelect = {handleDateSelect}
              onFilter = {handleFilter}
              filteredMoodResponses = {filteredMoodResponses}
              allEmojis = {allEmojis}
             />


            {selectedTeam.length ? 
            <Card className="bg-white shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle>Check Individual Mood Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamMoodSummaryByDate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", color: "#111" }} />
                    <Line type="monotone" dataKey="happy" stroke="#34D399" strokeWidth={2} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="neutral" stroke="#FBBF24" strokeWidth={2} dot={{ r: 5 }} />
                    <Line type="monotone" dataKey="unhappy" stroke="#F87171" strokeWidth={2} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            :
            <Card className='bg-white'>
                <CardHeader>
                    <CardTitle className="text-lg font-medium">
                        No Poll Selected
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-gray-500">
                        Please select a team poll to view the results.
                    </div>
                </CardContent>
            </Card>
            }




          </main>}


        </>
      ) : (
        <>
        <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-left">Team Mood Dashboard</h1>
            <p className="text-left text-lg mt-2">Track and analyze your team's mood trends and engagement</p>
        </header>
        <main className="flex flex-col text-center items-center mt-60">
            <p>You Have No Daily Mood CheckIns Configured</p>
            <div className="mt-8 flex justify-center">
            <Button
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center space-x-2"
                onClick={() => setCreateMoodPage(true)}
                >
                <Settings className="w-5 h-5" />
                <span >Configure Daily Mood Check-In</span>
            </Button>
            </div>
        </main>
        </>
      )}
    </div>
    {createMoodPage && 
    <CreateMoodModal 
      isOpen={createMoodPage} 
      onClose={() => setCreateMoodPage(false)}/> }
    </AnimationWrapper>
  );
};

