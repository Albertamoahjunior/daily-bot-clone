import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface INoData{
    title: string;
    content:  string;
}
export const NoDataCard = ({title, content}: INoData) => {
  return (
    <Card className='bg-white'> 
    <CardHeader>
        <CardTitle className="text-lg font-medium">
           {title}
        </CardTitle>
    </CardHeader>
    <CardContent>
        <div className="text-sm text-gray-500">
            {content}
        </div>
    </CardContent>
    </Card>
  )
}

// export default NoDataCard
