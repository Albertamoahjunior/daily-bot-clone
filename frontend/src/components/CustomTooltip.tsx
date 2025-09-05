// Custom Tooltip Component
export const CustomTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '5px' }}>
          <p style={{ color: '#111' }}>{`Date: ${payload[0].payload.date}`}</p>
          {payload.map((entry, index) => {
            if (entry.value !== undefined) {
              return (
                <p key={`item-${index}`} style={{ color: entry.color }}>
                  {`${entry.name}: ${entry.value}`}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    }

    return null;
  };