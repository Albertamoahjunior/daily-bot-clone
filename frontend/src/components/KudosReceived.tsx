import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Gift, Users } from 'lucide-react';

export const KudosReceived = () => {
  return (
    <div className="max-w-6xl mx-auto">
    {/* Welcome Section */}
    <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Kudos I've received</h2>
        <p className="text-slate-600">This month</p>
    </div>

    {/* Kudos Received Card */}
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-none">
        <CardContent className="pt-6">
        <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg">
            <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
            <p className="text-slate-600 mb-1">For creating our DailyBot org and helping us to be more aligned</p>
            <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">1 kudos</span>
                <span className="text-slate-500 text-sm">by Rubeus Hagrid · 39 minutes ago</span>
            </div>
            </div>
        </div>
        </CardContent>
    </Card>


    </div>
  );
};

// export default KudosReceivedPage;