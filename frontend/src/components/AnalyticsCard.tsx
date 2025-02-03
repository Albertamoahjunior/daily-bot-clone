import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsCard{
    title: string;
    height?: string;
    children: React.ReactNode;
}

// Analytics Card Component
export const AnalyticsCard = ({ title , height = 'h-72', children }: AnalyticsCard) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="pb-2">
        <CardTitle className="text-slate-700 text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className={height}>
        {children}
    </CardContent>
    </Card>
);