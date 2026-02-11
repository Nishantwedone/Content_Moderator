
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartProps {
    communityStats: { name: string; count: number }[]
    statusStats: { name: string; value: number }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function AdminCharts({ communityStats, statusStats }: ChartProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
            <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Posts by Community</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={communityStats}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={10} // Reduced font size for mobile
                                tickLine={false}
                                axisLine={false}
                                interval={0} // Show all labels (might overlap, let's leave default or handle overlap)
                            // angle={-45} // Optional: tilt labels if needed
                            // textAnchor="end"
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="count"
                                fill="#4f46e5"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Content Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={statusStats}
                                cx="50%"
                                cy="50%"
                                innerRadius="40%" // Responsive percentage
                                outerRadius="70%" // Responsive percentage
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
