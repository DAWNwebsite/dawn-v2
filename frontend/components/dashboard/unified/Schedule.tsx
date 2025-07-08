'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scheduleData = {
  'Mon 01': [
    { time: '08 AM - 09 AM', subject: 'Mathematics', color: 'bg-blue-100 text-blue-800' },
    { time: '09 AM - 10 AM', subject: 'English', color: 'bg-red-100 text-red-800' },
  ],
  'Tue 02': [
    { time: '10 AM - 11 AM', subject: 'History', color: 'bg-yellow-100 text-yellow-800' },
  ],
  'Wed 03': [
      { time: '11 AM - 12 PM', subject: 'Economics', color: 'bg-green-100 text-green-800' },
  ],
  'Thu 04': [
    { time: '08 AM - 09 AM', subject: 'Biology', color: 'bg-purple-100 text-purple-800' },
  ],
  'Fri 05': [
      { time: '08 AM - 09 AM', subject: 'Biology', color: 'bg-purple-100 text-purple-800' },
  ],
};

export function Schedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(scheduleData).map(([day, classes]) => (
            <div key={day} className="space-y-2">
              <h3 className="font-semibold text-center">{day.split(' ')[0]} <span className="text-gray-500">{day.split(' ')[1]}</span></h3>
              <div className="space-y-2">
                {classes.map((c, index) => (
                  <div key={index} className={`p-2 rounded-lg ${c.color}`}>
                    <p className="text-sm font-bold">{c.subject}</p>
                    <p className="text-xs">{c.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 