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
import {MoodData}  from '../types/Mood';
import { BarChart, Bar, RadialBarChart, RadialBar,} from 'recharts';
import {MemberMoodHistory} from '../components/MemberMoodHistory';
import {CreateMoodModal} from '../components/CreateMoodModal'
import {MoodResponse} from "../types/Mood";

const Insights = ({ moodData }: { moodData: MoodData[] | undefined }) => {
  if (!moodData || moodData.length === 0) {
    return (
      <Card className="bg-white shadow-2xl rounded-2xl">
        <CardContent className="w-full">
          <p className="text-center text-gray-500">No mood data available</p>
        </CardContent>
      </Card>
    );
  }

  const totalMoods = moodData.reduce((acc, day) => acc + day.happy + day.neutral + day.unhappy, 0);
  const participation = Math.round((totalMoods / (moodData.length * 19)) * 100);

  const calculateMoodScore = () => {
    const happyScore = moodData.reduce((acc, day) => acc + day.happy, 0) * 1;
    const neutralScore = moodData.reduce((acc, day) => acc + day.neutral, 0) * 0.5;
    const unhappyScore = moodData.reduce((acc, day) => acc + day.unhappy, 0) * 0;
    return totalMoods ? (happyScore + neutralScore + unhappyScore) / totalMoods : 0;
  };

  const avgMoodScore = calculateMoodScore().toFixed(1);

  const participationData = [{ name: "Participation", value: participation, fill: "#34D399" }];

  const responseData = moodData.map((day) => ({
    date: day.date,
    responses: day.happy + day.neutral + day.unhappy,
  }));

  const moodScoreData = [
    { name: "Happy", value: moodData.reduce((acc, day) => acc + day.happy, 0), fill: "#34D399" },
    { name: "Neutral", value: moodData.reduce((acc, day) => acc + day.neutral, 0), fill: "#FBBF24" },
    { name: "Unhappy", value: moodData.reduce((acc, day) => acc + day.unhappy, 0), fill: "#F87171" },
  ];

  return (
    <Card className="bg-white shadow-2xl rounded-2xl">
      <CardHeader>
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Responses Bar Chart */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Responses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseData}>
              <Bar dataKey="responses" fill="#3B82F6" />
              <XAxis dataKey="date" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Participation Radial Chart */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Participation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              startAngle={90}
              endAngle={-270}
              innerRadius="70%"
              outerRadius="100%"
              data={participationData}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background dataKey="value" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-4xl font-bold">{participation}%</p>
        </div>

        {/* Mood Score Pie Chart */}
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">Avg Mood Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={moodScoreData} dataKey="value" innerRadius={50} outerRadius={80} label>
                {moodScoreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-4xl font-bold">{avgMoodScore}/5</p>
        </div>
      </CardContent>
    </Card>
  );
};




export const TeamMoodPage: React.FC = () => {
  const {teamMood, allMoodResponses, allEmojis} = useTeamMoodContext();
  const [moodCheckInConfigured, setMoodCheckInConfigured] = useState(true);
  const [createMoodPage, setCreateMoodPage] = useState(true);
  const [pageState, setPageState] = useState<"home"|"mood-history">("home")
  const { teams, members } = useTeamsContext();

  // const [moodQuestion, setMoodQuestion] = useState("");


  const [selectedTeam, setSelectedTeam] = useState('');
  const [membersList, setMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [teamsList, setTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<string>("");

  const [moodHistSelectedUser, setMoodHistSelectedUser] = useState<string>("");
  const [selectedMoodHistTeam, setMoodHistSelectedTeam] = useState<string>("");
  const [moodHistMembersList, setMoodHistMembersList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [moodHistTeamsList, setMoodHistTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
  const [moodHistDate, setMoodHistDate] = useState<string>("");

    const [filteredMoodResponses, setFilteredMoodResponses] = useState<MoodResponse[] | undefined>(undefined);
  

    // Filter logic
    const handleFilter = () => {
      let filtered = allMoodResponses;
      

      if (selectedMoodHistTeam) {
        filtered = filtered?.filter((team) => team.teamId === selectedMoodHistTeam);
      }

      if (selectedMoodHistTeam && moodHistSelectedUser) {
        console.log("Filters Mood Hist Team: ", selectedMoodHistTeam);
        console.log("Filters Mood Hist Member: ", moodHistSelectedUser);
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
          teams.map((team) => ({
            value: team.teamID,
            label: team.teamName,
          }))
        );
        setMoodHistTeamsList(
          teams.map((team) => ({
            value: team.teamID,
            label: team.teamName,
          }))
        );

      }, [teams]);


    
      // Populate membersList based on the selected team
      useEffect(() => {
        if (selectedTeam) {
          const filteredMembers = members
            .filter((member) => member.teamId.includes(selectedTeam))
            .map((member) => ({
              value: member.id,
              label: member.name,
            }));
          setMembersList(filteredMembers);
        } else {
          setMembersList(undefined);
        }
      }, [selectedTeam, members]);


      useEffect(() => {
        if (selectedMoodHistTeam) {
          const filteredMembers = members
            .filter((member) => member.teamId.includes(selectedMoodHistTeam))
            .map((member) => ({
              value: member.id,
              label: member.name,
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
            <button onClick={() => setMoodCheckInConfigured(false)} className="flex items-center gap-2 bg-black text-white hover:bg-slate-800 rounded-lg px-4 py-2 transition-colors duration-200 "> Delete Your Mood Check In</button>
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

            <Card className="bg-white shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle>Team Mood Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamMood} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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



            <Insights moodData={teamMood} />

            <Card className="bg-white shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodPercentageDisplay moodData={teamMood} />
              </CardContent>
            </Card>

          </main>}


          {pageState === "mood-history" && <main className="flex flex-col gap-6">
            <Card className="bg-white shadow-2xl rounded-2xl">
              <CardHeader>
                <CardTitle>Check Individual Mood Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teamMood} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

