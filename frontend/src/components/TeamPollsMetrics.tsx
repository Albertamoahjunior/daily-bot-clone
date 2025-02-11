import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

interface IMetrics{
    selectedTeamPoll: Poll | undefined;
    selectedTeamPollResponses: PollResponse[] | undefined;
    teamMembers: { value: string; label: string }[] | undefined;
}

interface OptionStats {
    option: string;
    votes: number;
    percentage: number;
}


// const responseData = [
//   { option: 'Option A', votes: 50, percentage: 33 },
//   { option: 'Option B', votes: 70, percentage: 47 },
//   { option: 'Option C', votes: 30, percentage: 20 },
// ];

export const TeamPollsMetrics = ({selectedTeamPoll, selectedTeamPollResponses, teamMembers}: IMetrics) => {
    const [responseData, setResponseData] = useState<OptionStats[] | undefined>(undefined) 
    const [pieData, setPieData] = useState<{name: string, value:number}[]>() 
    const COLORS = ['#5EEAD4', '#E2E8F0']; // Active & Inactive colors
    const [participationData, setParticipationData] = useState<{
        participationPercentage: number;
        respondedMembers: number;
        totalMembers: number
      } >() 



    function calculatePollResponseStats(poll: Poll, responses: PollResponse[]): OptionStats[] {
        // Filter responses for this specific poll
        const pollResponses = responses.filter(response => response.pollId === poll.id);
        
        // Validate responses based on choice type
        const validResponses = pollResponses.filter(response => {
            if (poll.choiceType === "single") {
                // For single choice, ensure only one answer is selected
                return response.answer.length === 1 && poll.options.includes(response.answer[0]);
            } else {
                // For multi choice, ensure all answers are valid options
                return response.answer.every(ans => poll.options.includes(ans));
            }
        });
    
        // Initialize counters for each option
        const optionCounts: { [key: string]: number } = {};
        poll.options.forEach(option => {
            optionCounts[option] = 0;
        });
    
        // Count votes for each option
        validResponses.forEach(response => {
            response.answer.forEach(answer => {
                optionCounts[answer]++;
            });
        });
    
        // Calculate total responses and votes
        const totalResponses = validResponses.length;
        const totalVotes = Object.values(optionCounts).reduce((sum, count) => sum + count, 0);
    
        // Calculate base for percentage based on choice type
        const percentageBase = poll.choiceType === "single" ? totalResponses : totalVotes;
    
        // Create response data array with percentages
        const responseData: OptionStats[] = poll.options.map(option => {
            const votes = optionCounts[option];
            const percentage = percentageBase > 0 
                ? Math.round((votes / percentageBase) * 100) 
                : 0;
    
            return {
                option,
                votes,
                percentage
            };
        });
    
        return responseData;
    }

    function calculateParticipationPercentage(teamMembers: { value: string; label: string }[],pollResponses: PollResponse[]): { 
        participationPercentage: number, 
        respondedMembers: number, 
        totalMembers: number 
      } {
        // Ensure we have valid inputs
        if (!teamMembers || !pollResponses) {
          return { 
            participationPercentage: 0, 
            respondedMembers: 0, 
            totalMembers: 0 
          };
        }
      
        // Get unique respondent IDs
        const uniqueRespondentIds = new Set(
          pollResponses.filter(response => response.pollId === selectedTeamPoll?.id)
            .map(response => response.userId)
        );
      
        const respondedMembers = uniqueRespondentIds.size;
        const totalMembers = teamMembers.length;
      
        // Calculate participation percentage
        const participationPercentage = totalMembers > 0 
          ? Math.round((respondedMembers / totalMembers) * 100)
          : 0;

      
        return {
          participationPercentage,
          respondedMembers,
          totalMembers
        };
      }
      
      
      useEffect(()=> {
          if(selectedTeamPoll && selectedTeamPollResponses){
              const data:OptionStats[] = calculatePollResponseStats(selectedTeamPoll, selectedTeamPollResponses )
              setResponseData(data);
            }
            if(teamMembers && selectedTeamPollResponses){
                const { 
                    participationPercentage, 
                    respondedMembers, 
                    totalMembers 
                } = calculateParticipationPercentage(teamMembers, selectedTeamPollResponses);

                setParticipationData({
                    participationPercentage,
                    respondedMembers,
                    totalMembers
                })

                const pieData = [
                    { name: "Responded", value: respondedMembers },
                    { name: "Not Responded", value: totalMembers - respondedMembers }
                ];
            
                setPieData(pieData);
            }

    }, [selectedTeamPoll, selectedTeamPollResponses])


  const reportStreaks = [
    { name: 'Kate Martinez', streak: 1248, avatar: '/api/placeholder/30/30' },
    { name: 'Brandon Clark', streak: 748, avatar: '/api/placeholder/30/30' },
    { name: 'Dwayne Washington', streak: 139, avatar: '/api/placeholder/30/30' },
    { name: 'Helen Flanagan', streak: 98, avatar: '/api/placeholder/30/30' },
    { name: 'Susan Green', streak: 75, avatar: '/api/placeholder/30/30' },
  ];

  return (
    <div className="flex gap-6 mt-6">
      <div className='flex flex-col w-[75%] space-y-10'>
        {/* Snack Preferences */}
        {selectedTeamPoll ? 
        <Card className='bg-white'>
            <CardHeader>
            <CardTitle className="text-lg font-medium">
                {selectedTeamPoll.question}
            </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {selectedTeamPoll.options.map((option, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                    <div className="text-sm">{selectedTeamPoll.question}</div>
                    <div className="h-2 mt-1 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                        className="h-full bg-teal-400" 
                        style={{ width: `${responseData && responseData.find((data) => data.option === option)?.percentage}%` }}
                        />
                    </div>
                    </div>
                    <div className="ml-4 text-sm text-gray-500 whitespace-nowrap">
                    {responseData && responseData.find((data) => data.option === option)?.percentage}% {responseData && responseData.find((data) => data.option === option)?.votes} votes
                    </div>
                </div>
                ))}
                <div className="text-sm text-gray-500 mt-4">{selectedTeamPollResponses?.length} total responses</div>
            </div>
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


        {/* Response Breakdown */}
        {selectedTeamPoll ? 
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="text-lg font-medium">Response Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseData}>
                        <XAxis dataKey="option" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="votes" fill="#5EEAD4" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                    {responseData?.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                        <span>{item.option}:</span>
                        <span>{item.votes} responses ({item.percentage}%)</span>
                    </div>
                    ))}
                </div>
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
        
      </div>

      <div className="flex flex-col w-[25%] space-y-10">
        {/* Participation Card */}
        {selectedTeamPoll ? 
            <Card>
                <CardHeader>
                <CardTitle className="text-lg font-medium">Participation</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-center">
                    <ResponsiveContainer width={150} height={150}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                fill="#5EEAD4"
                                paddingAngle={2}
                            >
                                {pieData?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                    <div className="text-green-500"> <span className="text-black">Reported:</span> {participationData?.respondedMembers} people out of {participationData?.totalMembers}</div>
                    {/* <div className="text-sm text-green-500">+5% since Monday, Nov 4th</div> */}
                </div>
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

        {/* Report Streak */}
        {/* {selectedTeamPoll ? 
        <Card className="col-span-2">
            <CardHeader>
            <CardTitle className="text-lg font-medium">Report streak 🚀</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="space-y-4">
                {reportStreaks.map((person, index) => (
                <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <img 
                        src={person.avatar} 
                        alt={person.name} 
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{person.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <span>{person.streak}</span>
                    <span className="text-orange-500">🔥</span>
                    </div>
                </div>
                ))}
            </div>
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
        } */}
      </div>

    </div>
  );
};

// export default TeamPollsMetrics;