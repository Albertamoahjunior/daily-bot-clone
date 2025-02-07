import React,{useState, useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamInputDropdown } from './TeamDropdownInput';
import { Button } from "@/components/ui/button";
import { useTeamsContext } from '../hooks/useTeamsContext';
import { Trophy, Gift, Star, Users, ChevronDown } from 'lucide-react';


export const KudosHome = () => {

        const {teams} = useTeamsContext();
        const [teamsOptions, setTeamsOptions] = useState<{value: string; label:string}[]| undefined>(undefined);
        const [selectedTeam, setSelectedTeam] = useState<string>("");
    
        useEffect(() => {
            const options = teams?.map((team) => ({
                value: team.id,
                label: team.teamName
            }));
            setTeamsOptions(options);
        }, [teams]); // Dependency array ensures this runs when `teams` changes
    
        const handleTeamOptionChange = (value: string) => {
            setSelectedTeam(value);
            console.log("Selected Team Id:", value);
        };


  return (
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, Alex!</h2>
          <p className="text-slate-600">Your positive impact on the team continues to grow.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-slate-800">7</h3>
                  <p className="text-slate-600">kudos received this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-none">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-lg">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-slate-800">4</h3>
                  <p className="text-slate-600">kudos given this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Leaderboard — Top receivers</CardTitle>
            <div className="flex gap-4">
              <Button variant="outline" className="text-slate-600">
                Last 30 days <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              {/* <Button variant="outline" className="text-slate-600">
                All teams <ChevronDown className="ml-2 h-4 w-4" />
              </Button> */}
                {/*Team Input Dropdown */}
                <TeamInputDropdown
                    optionText="All Teams"
                    options={teamsOptions}
                    selectedValue={selectedTeam}
                    onOptionChange={handleTeamOptionChange}
                />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Leaderboard Entry */}
              {[
                { position: 1, name: "Alex Chen", kudos: 7, team: "Engineering" },
                { position: 2, name: "Sarah Kim", kudos: 5, team: "Design" },
                { position: 3, name: "Mike Johnson", kudos: 4, team: "Product" }
              ].map((entry) => (
                <div key={entry.position} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-slate-600">#{entry.position}</span>
                    <div>
                      <p className="font-medium text-slate-800">{entry.name}</p>
                      <p className="text-sm text-slate-600">{entry.team}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{entry.kudos} kudos</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


      </div>
  )
}

// export default KudosHome
