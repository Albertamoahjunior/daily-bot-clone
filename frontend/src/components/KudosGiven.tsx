

import React, {useState, useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Gift, Users } from 'lucide-react';
import { useTeamsContext } from '../hooks/useTeamsContext';


interface IKudosGiven {
  allKudos: Kudos[];
  userId: string | ""
}

export const KudosGiven = ({allKudos, userId}: IKudosGiven) => {
    const [givenKudos, setGivenKudos] = useState<Kudos[]|[]>([]);
    const {  members } = useTeamsContext();

  
    useEffect(() => {
      const kudosGivenToUser = allKudos.filter((kudos) => kudos.giverId === userId);
      setGivenKudos(kudosGivenToUser);
    }, []);


  return (
    <div className="max-w-6xl mx-auto">
    {/* Welcome Section */}
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Kudos I've Given To My Teammates</h2>
        <p className="text-slate-600">This month</p>
    </div>

    {/* Kudos Received Card */}
    {givenKudos.length > 0 ? 
      (givenKudos.map((kudos: Kudos) => {
          return (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
              <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                  <div className="bg-blue-500 p-3 rounded-lg">
                  <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                  <p className="text-slate-600 mb-1">For {kudos.reason}</p>
                  <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">1 kudos</span>
                      <span className="text-slate-500 text-sm">To {members?.find((member) => member.id === kudos.giverId)?.memberName || ""} · {kudos.createdAt.split("T")[0]}</span>
                  </div>
                  </div>
              </div>
              </CardContent>
          </Card>
          )
      }))
    :
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
        <CardHeader>
          <CardTitle>No Kudos Received</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
        <div className="flex items-center gap-4">
            No!😣...No Kudos Received This Month
        </div>
        </CardContent>
    </Card> 

    }

    </div>
  );
};
