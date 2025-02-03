import React from 'react';
import { Trash2, MessageCircle, Settings, AlertCircle, Type, List, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StandupQuestion } from '@/types/StandupDashboard';
import { useStandupContext } from '../hooks/useStandupContext';
import { useParams } from 'react-router-dom';


export const StandupQuestionCard: React.FC<{ 
    question: StandupQuestion; 
    onDelete: () => void;
}> = ({ question, onDelete }) => {
    const {teamId} = useParams();
    const { standups } = useStandupContext();
    const teamStandupResponses = standups.find(standup => standup.teamId === teamId)

    // Determine question type based on response format
    const questionType = question.questionType;
    const isRequired = question.required ?? false;

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-slate-800">
                        {question.questionText}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MessageCircle className="h-3 w-3" />
                        <span>{teamStandupResponses? teamStandupResponses.standup.length : 0 } responses </span>
                    </div>
                </div>
                <button 
                    onClick={onDelete}
                    className="text-slate-400 hover:text-red-500 transition-colors duration-200"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </CardHeader>
            <CardContent className="flex flex-col h-auto ">
                <div className="flex-grow space-y-4">
                    {/* Question Format */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-medium">Format:</span>
                            <div className="flex items-center gap-1">
                                {questionType === 'text' ? (
                                    <Type className="h-4 w-4 text-blue-500" />
                                ) : (
                                    <List className="h-4 w-4 text-purple-500" />
                                )}
                                <span className="capitalize">{questionType} Response</span>
                            </div>
                        </div>

                        {/* Show Options if present */}
                        {questionType === 'multiple_choice' && (
                            <div className="flex flex-wrap gap-2">
                                {question.options.map((option, idx) => (
                                    <span 
                                    key={idx}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                    >
                                        {option}
                                    </span>
                                ))}
                            </div>
                        )}

                        {questionType === 'single_choice' && (
                            <div className="flex flex-wrap gap-2">
                                <span 
                                  key={"Yes"}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                    Yes
                                </span>
                                <span 
                                  key={"No"}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                >
                                    No
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {isRequired ? <ToggleRight className="h-4 w-4 text-slate-500" /> : <ToggleLeft className="h-4 w-4 text-slate-500" />}
                            <span className="text-sm text-slate-600">
                                {isRequired ? 'Required' : 'Optional'}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
