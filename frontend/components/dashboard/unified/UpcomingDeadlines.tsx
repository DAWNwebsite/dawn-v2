'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const deadlinesData = [
  { type: 'Assignment', subject: 'Biology', date: '25 Apr 2024 | 10:30', status: 'Pending' },
  { type: 'Quiz', subject: 'History', date: '27 Apr 2024 | 14:00', status: 'Pending' },
  { type: 'Quiz', subject: 'Agriculture', date: '28 Apr 2024 | 09:00', status: 'Completed' },
];

export function UpcomingDeadlines() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {deadlinesData.map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{item.type}: {item.subject}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <Badge variant={item.status === 'Completed' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 