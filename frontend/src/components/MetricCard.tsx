import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: IconDefinition;
  variant: "info" | "success" | "warning" | "purple";
};

export const MetricCard = ({ 
  title, 
  value, 
  icon, 
  variant 
}: MetricCardProps) => {
  const variants = {
    success: {
      background: "bg-gradient-to-br from-emerald-50 to-green-50",
      title: "text-emerald-800",
      icon: "text-emerald-600",
      value: "text-emerald-700"
    },
    warning: {
      background: "bg-gradient-to-br from-amber-50 to-yellow-50",
      title: "text-amber-800",
      icon: "text-amber-600",
      value: "text-amber-700"
    },
    info: {
      background: "bg-gradient-to-br from-blue-50 to-indigo-50",
      title: "text-blue-800",
      icon: "text-blue-600",
      value: "text-blue-700"
    },
    purple: {
      background: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
      title: "text-purple-800",
      icon: "text-purple-600",
      value: "text-purple-700"
    }
  };

  const styles = variants[variant];

  return (
    <Card className={`${styles.background} hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${styles.title}`}>
          {title}
        </CardTitle>
        <FontAwesomeIcon icon={icon} className={` ${styles.icon}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${styles.value}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
};
