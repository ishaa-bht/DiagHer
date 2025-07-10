import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Droplets, Moon, Sun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CycleData {
  date: string;
  day: number;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy' | 'none';
  mood: number; // 1-10 scale
  pain: number; // 1-10 scale
}

interface PeriodPrediction {
  nextPeriod: string;
  ovulation: string;
  cycleLength: number;
  confidence: number;
}

const MenstrualTracker = () => {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [prediction, setPrediction] = useState<PeriodPrediction | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Generate mock cycle data for the last 3 months
  const generateMockData = () => {
    const data: CycleData[] = [];
    const today = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayOfCycle = (90 - i) % 28 + 1;
      let phase: CycleData['phase'] = 'follicular';
      let flow: CycleData['flow'] = 'none';
      
      if (dayOfCycle >= 1 && dayOfCycle <= 5) {
        phase = 'menstrual';
        flow = dayOfCycle === 1 ? 'heavy' : dayOfCycle === 2 ? 'heavy' : dayOfCycle === 3 ? 'medium' : 'light';
      } else if (dayOfCycle >= 6 && dayOfCycle <= 13) {
        phase = 'follicular';
      } else if (dayOfCycle >= 14 && dayOfCycle <= 16) {
        phase = 'ovulation';
      } else {
        phase = 'luteal';
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        day: dayOfCycle,
        phase,
        symptoms: phase === 'menstrual' ? ['cramping', 'fatigue'] : 
                 phase === 'ovulation' ? ['increased_energy', 'breast_tenderness'] : [],
        flow,
        mood: Math.floor(Math.random() * 10) + 1,
        pain: flow !== 'none' ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 3) + 1
      });
    }
    
    return data;
  };

  const fetchPeriodData = async () => {
    setLoading(true);
    try {
      // Simulate API call to periods tracking service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = generateMockData();
      setCycleData(mockData);
      
      // Generate prediction
      const mockPrediction: PeriodPrediction = {
        nextPeriod: '2025-01-15',
        ovulation: '2025-01-22',
        cycleLength: 28,
        confidence: 85
      };
      setPrediction(mockPrediction);
    } catch (error) {
      console.error('Failed to fetch period data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodData();
  }, []);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '#dc2626';
      case 'follicular': return '#2563eb';
      case 'ovulation': return '#16a34a';
      case 'luteal': return '#ca8a04';
      default: return '#6b7280';
    }
  };

  const getFlowIcon = (flow: string) => {
    switch (flow) {
      case 'heavy': return '🔴';
      case 'medium': return '🟠';
      case 'light': return '🟡';
      default: return '⚪';
    }
  };

  const chartData = cycleData.slice(-30).map(day => ({
    date: new Date(day.date).getDate(),
    mood: day.mood,
    pain: day.pain,
    phase: day.phase
  }));

  const phaseData = [
    { phase: 'Menstrual', days: 5, color: '#dc2626' },
    { phase: 'Follicular', days: 8, color: '#2563eb' },
    { phase: 'Ovulation', days: 3, color: '#16a34a' },
    { phase: 'Luteal', days: 12, color: '#ca8a04' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menstrual Cycle Tracker</h2>
          <p className="text-gray-600">Track your cycle and predict future periods</p>
        </div>
        <button
          onClick={fetchPeriodData}
          disabled={loading}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      {/* Predictions */}
      {prediction && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Droplets className="h-5 w-5 text-rose-600" />
                <span className="text-sm font-medium text-rose-800">Next Period</span>
              </div>
              <p className="text-2xl font-bold text-rose-900">{new Date(prediction.nextPeriod).toLocaleDateString()}</p>
              <p className="text-sm text-rose-600">In {Math.ceil((new Date(prediction.nextPeriod).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sun className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Ovulation</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{new Date(prediction.ovulation).toLocaleDateString()}</p>
              <p className="text-sm text-green-600">Fertile window</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Cycle Length</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{prediction.cycleLength} days</p>
              <p className="text-sm text-blue-600">{prediction.confidence}% confidence</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Cycle Calendar */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Calendar</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cycleData.slice(-28).map((day, index) => (
            <motion.div
              key={day.date}
              className={`aspect-square p-2 rounded-lg cursor-pointer transition-all ${
                selectedDate === day.date ? 'ring-2 ring-rose-500' : ''
              }`}
              style={{ backgroundColor: `${getPhaseColor(day.phase)}20` }}
              onClick={() => setSelectedDate(day.date)}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">
                  {new Date(day.date).getDate()}
                </div>
                <div className="text-xs mt-1">
                  {getFlowIcon(day.flow)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood & Pain Tracking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#16a34a" strokeWidth={2} name="Mood" />
              <Line type="monotone" dataKey="pain" stroke="#dc2626" strokeWidth={2} name="Pain" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cycle Phases</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={phaseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="phase" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="days" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Symptoms Overview */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Symptoms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { symptom: 'Cramping', frequency: 65, color: 'bg-red-500' },
            { symptom: 'Fatigue', frequency: 45, color: 'bg-orange-500' },
            { symptom: 'Mood Changes', frequency: 38, color: 'bg-yellow-500' },
            { symptom: 'Bloating', frequency: 52, color: 'bg-purple-500' }
          ].map((item, index) => (
            <motion.div
              key={item.symptom}
              className="bg-gray-50 p-4 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{item.symptom}</span>
                <span className="text-sm text-gray-600">{item.frequency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.frequency}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MenstrualTracker;