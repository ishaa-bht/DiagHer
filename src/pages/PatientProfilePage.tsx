import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Calendar, 
  Activity,
  FileText,
  Brain,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  currentMedications: string[];
  riskFactors: {
    pregnancy: boolean;
    menstruation: boolean;
    menopause: boolean;
    familyHistory: string[];
  };
}

interface ConsultationHistory {
  id: string;
  date: string;
  condition: string;
  confidence: number;
  status: 'confirmed' | 'rejected' | 'pending';
  prescription: string[];
  notes: string;
}

const PatientProfilePage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data
  const patient: PatientProfile = {
    id: patientId || '1',
    name: 'Sarah Mitchell',
    age: 32,
    gender: 'Female',
    email: 'sarah.mitchell@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, San Francisco, CA 94102',
    emergencyContact: 'John Mitchell - +1 (555) 987-6543',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Shellfish'],
    currentMedications: ['Ibuprofen 400mg', 'Vitamin D3'],
    riskFactors: {
      pregnancy: false,
      menstruation: true,
      menopause: false,
      familyHistory: ['Breast Cancer', 'Diabetes Type 2']
    }
  };

  const consultationHistory: ConsultationHistory[] = [
    {
      id: '1',
      date: '2025-01-06',
      condition: 'Endometriosis',
      confidence: 87.5,
      status: 'confirmed',
      prescription: ['Naproxen 500mg', 'Hormonal therapy'],
      notes: 'Patient responded well to treatment. Follow-up in 3 months.'
    },
    {
      id: '2',
      date: '2024-12-15',
      condition: 'PCOS',
      confidence: 72.3,
      status: 'rejected',
      prescription: [],
      notes: 'Further testing ruled out PCOS. Symptoms attributed to stress.'
    },
    {
      id: '3',
      date: '2024-11-20',
      condition: 'Migraine',
      confidence: 91.2,
      status: 'confirmed',
      prescription: ['Sumatriptan 50mg', 'Preventive therapy'],
      notes: 'Migraine pattern identified. Preventive treatment initiated.'
    }
  ];

  const aiFeedbackLog = [
    {
      id: '1',
      date: '2025-01-06',
      prediction: 'Endometriosis',
      confidence: 87.5,
      feedback: 'confirmed',
      notes: 'AI prediction was accurate. Laparoscopy confirmed diagnosis.'
    },
    {
      id: '2',
      date: '2024-12-15',
      prediction: 'PCOS',
      confidence: 72.3,
      feedback: 'rejected',
      notes: 'False positive. Need to improve algorithm for stress-related symptoms.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
    { id: 'history', label: 'Consultation History', icon: <FileText className="h-4 w-4" /> },
    { id: 'feedback', label: 'AI Feedback Log', icon: <Brain className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patients')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Records</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-600" />
              <span className="text-lg font-semibold text-gray-900">Patient Profile</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-rose-100 p-4 rounded-full">
                <User className="h-8 w-8 text-rose-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/diagnosis')}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Consultation</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{patient.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{patient.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{patient.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Blood Type</p>
                        <p className="font-medium">{patient.bloodType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Emergency Contact</p>
                        <p className="font-medium">{patient.emergencyContact}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
                    <div className="space-y-2">
                      {patient.allergies.map((allergy, index) => (
                        <span key={index} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                    <div className="space-y-2">
                      {patient.currentMedications.map((medication, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium text-blue-900">{medication}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Current Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${patient.riskFactors.pregnancy ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Pregnancy</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${patient.riskFactors.menstruation ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Menstruation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${patient.riskFactors.menopause ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span className="text-sm">Menopause</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Family History</h4>
                      <div className="space-y-2">
                        {patient.riskFactors.familyHistory.map((condition, index) => (
                          <span key={index} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Consultation History Tab */}
            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {consultationHistory.map((consultation, index) => (
                  <div key={consultation.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{consultation.condition}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(consultation.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-rose-600 mb-1">{consultation.confidence}%</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                          {getStatusIcon(consultation.status)}
                          <span className="ml-1">{consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                    
                    {consultation.prescription.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">Prescription</h5>
                        <div className="space-y-1">
                          {consultation.prescription.map((med, medIndex) => (
                            <span key={medIndex} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
                      <p className="text-gray-700">{consultation.notes}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* AI Feedback Log Tab */}
            {activeTab === 'feedback' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-blue-900">AI Learning Feedback</h3>
                  </div>
                  <p className="text-blue-700 text-sm mt-2">
                    This log tracks AI predictions and their accuracy to continuously improve our diagnostic algorithms.
                  </p>
                </div>

                {aiFeedbackLog.map((feedback, index) => (
                  <div key={feedback.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">AI Prediction: {feedback.prediction}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(feedback.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600 mb-1">{feedback.confidence}%</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.feedback)}`}>
                          {getStatusIcon(feedback.feedback)}
                          <span className="ml-1">{feedback.feedback.charAt(0).toUpperCase() + feedback.feedback.slice(1)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Feedback Notes</h5>
                      <p className="text-gray-700">{feedback.notes}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientProfilePage;