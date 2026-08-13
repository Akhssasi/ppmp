"use client";

import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyCount, ProjectStats, TechUsage } from "@/lib/types";

const CHART_COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

export function ProjectStatusChart({ stats }: { stats: ProjectStats }) {
  const data = Object.entries(stats.byStatus).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects by status</CardTitle>
        <CardDescription>Distribution across all project statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function ProjectVisibilityChart({ stats }: { stats: ProjectStats }) {
  const data = Object.entries(stats.byVisibility).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibility breakdown</CardTitle>
        <CardDescription>Public, private and draft projects</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function TechUsageChart({ data }: { data: TechUsage[] }) {
  const chartData = data.slice(0, 8).map((item) => ({
    name: item.technology,
    value: item.usageCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top technologies</CardTitle>
        <CardDescription>Most used technologies across your projects</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function ActivityTrendChart({ data }: { data: DailyCount[] }) {
  const chartData = data
    .slice(-14)
    .map((item) => ({ name: item.date.slice(5), value: item.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project creation trend</CardTitle>
        <CardDescription>Projects created per day (last 14 days)</CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        {chartData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data yet
    </div>
  );
}
