import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle, Eye, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface SymptomEvolution {
  date: string;
  severity: number;
  frequency: number;
  duration: number;
}

interface AIInsight {
  id: string;
  type: 'trend' | 'pattern' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

interface PatientProgress {
  metric: string;
  current: number;
  previous: number;
  change: number;
  trend: 'improving' | 'stable' | 'concerning';
}

const AIInsights = ({ patientId }: { patientId: string }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [symptomData, setSymptomData] = useState<SymptomEvolution[]>([]);
  const [progress, setProgress] = useState<PatientProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');

  const generateMockData = () => {
    // Mock symptom evolution data
    const mockSymptomData: SymptomEvolution[] = [];
    const dates = [];
    const today = new Date();
    
    for (let i = 90; i >= 0; i -= 7) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    dates.forEach((date, index) => {
      mockSymptomData.push({
        date,
        severity: Math.max(1, 8 - (index * 0.5) + Math.random() * 2),
        frequency: Math.max(1, 7 - (index * 0.3) + Math.random() * 1.5),
        duration: Math.max(1, 6 - (index * 0.2) + Math.random() * 1)
      });
    });
    
    // Mock AI insights
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'trend',
        title: 'Symptom Severity Decreasing',
        description: 'Analysis shows a 35% reduction in symptom severity over the past 3 months, indicating positive response to treatment.',
        confidence: 92,
        date: '2025-01-07',
        priority: 'high'
      },
      {
        id: '2',
        type: 'pattern',
        title: 'Cyclical Pattern Detected',
        description: 'Symptoms show a recurring 28-day pattern, likely correlated with menstrual cycle. Consider hormonal evaluation.',
        confidence: 87,
        date: '2025-01-06',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Lifestyle Modification Suggestion',
        description: 'Based on symptom patterns, implementing stress management techniques may provide additional relief.',
        confidence: 78,
        date: '2025-01-05',
        priority: 'medium'
      },
      {
        id: '4',
        type: 'alert',
        title: 'Medication Adherence Alert',
        description: 'Irregular symptom patterns suggest possible medication non-adherence. Follow-up recommended.',
        confidence: 85,
        date: '2025-01-04',
        priority: 'high'
      }
    ];
    
    // Mock progress data
    const mockProgress: PatientProgress[] = [
      {
        metric: 'Symptom Severity',
        current: 4.2,
        previous: 6.8,
        change: -38,
        trend: 'improving'
      },
      {
        metric: 'Quality of Life',
        current: 7.3,
        previous: 5.1,
        change: 43,
        trend: 'improving'
      },
      {
        metric: 'Sleep Quality',
        current: 6.8,
        previous: 6.5,
        change: 5,
        trend: 'stable'
      },
      {
        metric: 'Pain Episodes',
        current: 3.2,
        previous: 2.8,
        change: 14,
        trend: 'concerning'
      }
    ];
    
    return { mockSymptomData, mockInsights, mockProgress };
  };

  const fetchAIInsights = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { mockSymptomData, mockInsights, mockProgress } = generateMockData();
      setSymptomData(mockSymptomData);
      setInsights(mockInsights);
      setProgress(mockProgress);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights();
  }, [patientId, selectedTimeframe]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'pattern': return <Brain className="h-5 w-5" />;
      case 'recommendation': return <CheckCircle className="h-5 w-5" />;
      case 'alert': return <AlertCircle className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-50 border-red-200 text-red-800';
    if (priority === 'medium') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const getProgressColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'concerning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'stable': return '→';
      case 'concerning': return '↘️';
      default: return '•';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <p className="text-gray-600">Advanced analytics and symptom evolution tracking</p>
        </div>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Progress Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {progress.map((metric, index) => (
          <motion.div
            key={metric.metric}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
              <span className={`text-sm ${getProgressColor(metric.trend)}`}>
                {getProgressIcon(metric.trend)}
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{metric.current}</span>
              <span className={`text-sm font-medium ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change >= 0 ? '+' : ''}{metric.change}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">vs. previous period</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Symptom Evolution Chart */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptom Evolution Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AreaChart data={symptomData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [`${value}/10`, name]}
              />
              <Area
                type="monotone"
                dataKey="severity"
                stackId="1"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.6}
                name="Severity"
              />
              <Area
                type="monotone"
                dataKey="frequency"
                stackId="2"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
                name="Frequency"
              />
              <Area
                type="monotone"
                dataKey="duration"
                stackId="3"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Duration"
              />
            </AreaChart>
          </motion.div>
        </ResponsiveContainer>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Generated Insights</h3>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              className={`rounded-lg p-4 border ${getInsightColor(insight.type, insight.priority)}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <span className="font-semibold">{insight.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{insight.confidence}%</span>
                  <span className="text-xs text-gray-500">{new Date(insight.date).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Correlation Analysis */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptom Correlation Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <BarChart data={[
              { symptom: 'Pelvic Pain', correlation: 0.85 },
              { symptom: 'Fatigue', correlation: 0.72 },
              { symptom: 'Heavy Periods', correlation: 0.68 },
              { symptom: 'Mood Changes', correlation: 0.54 },
              { symptom: 'Bloating', correlation: 0.49 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symptom" />
              <YAxis domain={[0, 1]} />
              <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Correlation']} />
              <Bar dataKey="correlation" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </motion.div>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AIInsights;