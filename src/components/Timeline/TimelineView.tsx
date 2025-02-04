import React, { useEffect, useState } from 'react';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TimeframeOption = 'daily' | 'weekly' | 'monthly' | 'yearly' | '5years';

interface TimelineViewProps {
  enterpriseId: string;
  csvTasks: Array<{
    'Sub-Task': string;
    'Full Description': string;
    Occurrence: string;
  }>;
}

interface TimelineView {
  id: string;
  enterprise_id: string;
  timeframe: TimeframeOption;
  created_at: string;
  updated_at: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ enterpriseId, csvTasks }) => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<TimeframeOption>('daily');
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const setupTimelineView = async () => {
      try {
        const { data: existingView, error } = await supabase
          .from('timeline_views')
          .select('*')
          .eq('enterprise_id', enterpriseId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No record found, create one
            const { error: insertError } = await supabase
              .from('timeline_views')
              .insert([{ enterprise_id: enterpriseId, timeframe }]);
            
            if (insertError) throw insertError;
          } else {
            throw error;
          }
        } else {
          const view = existingView as TimelineView;
          if (view.timeframe) {
            setTimeframe(view.timeframe);
          }
        }

        // Subscribe to real-time updates
        const channel = supabase
          .channel('timeline_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'timeline_views',
              filter: `enterprise_id=eq.${enterpriseId}`,
            },
            (payload) => {
              const newData = payload.new as TimelineView;
              if (newData?.timeframe) {
                setTimeframe(newData.timeframe);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up timeline view:', error);
        toast({
          title: "Error",
          description: "Failed to load timeline preferences",
          variant: "destructive",
        });
      }
    };

    setupTimelineView();
  }, [enterpriseId, toast, timeframe]);

  useEffect(() => {
    // Process CSV tasks based on timeframe
    const now = new Date();
    const processedData = csvTasks.map((task, index) => {
      let startDate = now;
      let endDate;

      // Calculate end date based on occurrence pattern and timeframe
      switch (timeframe) {
        case 'daily':
          endDate = addDays(startDate, 1);
          break;
        case 'weekly':
          endDate = addWeeks(startDate, 1);
          break;
        case 'monthly':
          endDate = addMonths(startDate, 1);
          break;
        case 'yearly':
          endDate = addYears(startDate, 1);
          break;
        case '5years':
          endDate = addYears(startDate, 5);
          break;
        default:
          endDate = addDays(startDate, 1);
      }

      return {
        name: task['Sub-Task'],
        description: task['Full Description'],
        occurrence: task.Occurrence,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        duration: index + 1, // Example duration for visualization
      };
    });

    setChartData(processedData);
  }, [csvTasks, timeframe]);

  const handleTimeframeChange = async (value: TimeframeOption) => {
    try {
      await supabase
        .from('timeline_views')
        .upsert({
          enterprise_id: enterpriseId,
          timeframe: value,
          updated_at: new Date().toISOString(),
        });

      setTimeframe(value);
      toast({
        title: "Success",
        description: "Timeline view updated",
      });
    } catch (error) {
      console.error('Error updating timeframe:', error);
      toast({
        title: "Error",
        description: "Failed to update timeline view",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timeline View</h2>
        <Select value={timeframe} onValueChange={handleTimeframeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="5years">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: 70,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
            />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 rounded-lg shadow-lg border">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-sm text-gray-600">{data.description}</p>
                      <p className="text-sm">Occurrence: {data.occurrence}</p>
                      <p className="text-sm">
                        Period: {data.startDate} to {data.endDate}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="duration"
              fill="#0263E0"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
