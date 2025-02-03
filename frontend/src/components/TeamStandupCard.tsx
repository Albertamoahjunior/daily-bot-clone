import React, {useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown, faCalendar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { TeamStandup, StandupQuestion, UserResponse } from '../types/StandupDashboard';


interface ITeamStandupCardProps {
    team: TeamStandup,
    expandedTeams: Record<string, boolean>,
    expandedQuestions: Record<string, boolean>,
    setExpandedTeams:  React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    setExpandedQuestions:  React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export const TeamStandupCard = ({expandedTeams,expandedQuestions, setExpandedTeams, setExpandedQuestions,  team}: ITeamStandupCardProps) => {

  const toggleTeam = (teamId: string) => {
    setExpandedTeams(prev => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Group responses by date
  const groupResponsesByDate = (responses: UserResponse[]) => {
    return responses.reduce((acc, response) => {
      const date = response.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(response);
      return acc;
    }, {} as Record<string, UserResponse[]>);
  };


  return (
    <div key={team.teamId} className="bg-white rounded-lg shadow-sm border border-gray-200 my-4">
        {/* Team Header */}
        <button
            onClick={() => toggleTeam(team.teamId)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50"
        >
            <div className="flex items-center space-x-3">
            {expandedTeams[team.teamId] ? 
                <FontAwesomeIcon icon={faAngleDown} /> :
                <FontAwesomeIcon icon={faAngleRight} />
            }
            <div>
                <h2 className="font-semibold text-lg text-gray-800">{team.teamName}</h2>
                <p className="text-sm text-gray-500">{team.standup.length} questions</p>
            </div>
            </div>
        </button>

        {/* Questions Panel */}
        {expandedTeams[team.teamId] && (
            <div className="p-4 border-t border-gray-200">
            {team.standup.map((question, qIndex) => {
                const questionId = `${team.teamId}-${qIndex}`;
                const responsesByDate = groupResponsesByDate(question.response);
                
                return (
                <div key={questionId} className="mb-4 last:mb-0">
                    {/* Question Header */}
                    <button
                    onClick={() => toggleQuestion(questionId)}
                    className="w-full py-2 px-4 flex items-center justify-between text-left hover:bg-gray-50 rounded"
                    >
                    <div className="flex items-center space-x-3">
                        {expandedQuestions[questionId] ? 
                        <FontAwesomeIcon icon={faAngleDown} /> :
                        <FontAwesomeIcon icon={faAngleRight} />
                        }
                        <span className="text-gray-700">{question.question}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                        {question.response.length} responses
                    </span>
                    </button>

                    {/* Responses by Date */}
                    {expandedQuestions[questionId] && (
                    <div className="ml-8 mt-2 space-y-4">
                        {Object.entries(responsesByDate).map(([date, responses]) => (
                        <div key={date} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                            <FontAwesomeIcon icon={faCalendar} />
                            <span className="text-sm font-medium text-gray-700">
                                {new Date(date).toLocaleDateString()}
                            </span>
                            </div>
                            <div className="space-y-2">
                            {responses.map((response, rIndex) => (
                                <div key={`${response.userId}-${rIndex}`} className="bg-white p-3 rounded border border-gray-200">
                                <div className="flex items-center space-x-2 mb-1">
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span className="text-sm text-gray-600">{response.userId}</span>
                                </div>
                                <p className="text-gray-800">{response.answer}</p>
                                {response.options.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                    {response.options.map((option, oIndex) => (
                                        <span 
                                        key={oIndex}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                        >
                                        {option}
                                        </span>
                                    ))}
                                    </div>
                                )}
                                </div>
                            ))}
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                );
            })}
            </div>
        )}

    </div>
  )
}

// export default TeamStandupCard
