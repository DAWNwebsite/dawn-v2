'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", attended: 80, missed: 20 },
  { name: "Tue", attended: 90, missed: 10 },
  { name: "Wed", attended: 75, missed: 25 },
  { name: "Thu", attended: 95, missed: 5 },
  { name: "Fri", attended: 85, missed: 15 },
  { name: "Sat", attended: 98, missed: 2 },
];

export function Attendance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
        <CardDescription>Classes Attended vs. Classes Missed</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Bar dataKey="attended" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="missed" fill="#ffc658" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 