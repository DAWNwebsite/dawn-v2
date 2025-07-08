'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notificationsData = [
  { date: '26 Apr- 07-07 PM', message: 'Maths: Impromptu Live Class has been scheduled' },
  { date: '26 Apr- 07-07 PM', message: 'Maths: Impromptu Live Class has been scheduled' },
  { date: '26 Apr- 07-07 PM', message: 'Biology: Impromptu Live Class has been scheduled' },
  { date: '26 Apr- 07-07 PM', message: 'History: Impromptu Live Class has been scheduled' },
];

export function Notifications() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notificationsData.map((item, index) => (
            <li key={index} className="border-l-4 border-purple-600 pl-4">
              <p className="font-semibold">{item.message}</p>
              <p className="text-sm text-gray-500">{item.date}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 