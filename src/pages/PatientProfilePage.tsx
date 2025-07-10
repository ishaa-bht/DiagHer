import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  Search, 
  Filter,
  User,
  Calendar,
  Activity,
  Eye,
  Edit,
  MoreVertical,
  Upload,
  FileText,
  Camera,
  Link,
  Brain,
  Plus,
  X
} from 'lucide-react';
import DrugChecker from './DrugChecker';
import MenstrualTracker from './MenstrualTracker';
import AIInsights from './AIInsights';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: 'completed' | 'pending' | 'follow-up';
  confidence: number;
  labReports: FileUpload[];
  scans: FileUpload[];
  ehrLinks: string[];
}

interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

const PatientRecordsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<PatientRecord | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'lab' | 'scan' | 'ehr'>('lab');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Mock patient records data with file uploads
  const patientRecords: PatientRecord[] = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      age: 32,
      gender: 'Female',
      lastVisit: '2025-01-06',
      condition: 'Endometriosis',
      status: 'completed',
      confidence: 87.5,
      labReports: [
        {
          id: '1',
          name: 'Blood Test - Complete Panel',
          type: 'pdf',
          size: 2456789,
          uploadDate: '2025-01-05',
          url: '#'
        },
        {
          id: '2',
          name: 'Hormone Levels',
          type: 'pdf',
          size: 1234567,
          uploadDate: '2025-01-04',
          url: '#'
        }
      ],
      scans: [
        {
          id: '1',
          name: 'Pelvic Ultrasound',
          type: 'jpg',
          size: 5678901,
          uploadDate: '2025-01-03',
          url: '#'
        }
      ],
      ehrLinks: [
        'https://ehr.hospital.com/patient/12345',
        'https://records.clinic.com/sarah-mitchell'
      ]
    },
    {
      id: '2',
      name: 'Maria Lopez',
      age: 28,
      gender: 'Female',
      lastVisit: '2025-01-05',
      condition: 'PCOS',
      status: 'follow-up',
      confidence: 92.3,
      labReports: [],
      scans: [],
      ehrLinks: []
    },
    {
      id: '3',
      name: 'Jennifer Kim',
      age: 35,
      gender: 'Female',
      lastVisit: '2025-01-04',
      condition: 'Fibromyalgia',
      status: 'pending',
      confidence: 78.9,
      labReports: [],
      scans: [],
      ehrLinks: []
    }
  ];

  const filteredRecords = patientRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✓';
      case 'pending': return '⏳';
      case 'follow-up': return '🔄';
      default: return '•';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <Camera className="h-5 w-5 text-blue-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Mock file upload
    const newFile: FileUpload = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.split('/')[1] || 'unknown',
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file)
    };
    
    console.log('File uploaded:', newFile);
    setShowUploadModal(false);
  };

  const UploadModal = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex space-x-4">
            {(['lab', 'scan', 'ehr'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUploadType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  uploadType === type
                    ? 'bg-rose-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'lab' ? 'Lab Report' : type === 'scan' ? 'Scan' : 'EHR Link'}
              </button>
            ))}
          </div>
          
          {uploadType === 'ehr' ? (
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Enter EHR link URL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <button className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors">
                Add EHR Link
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept={uploadType === 'lab' ? '.pdf,.doc,.docx' : '.jpg,.jpeg,.png,.dcm'}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
              />
              <label
                htmlFor="file-upload"
                className="bg-rose-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-rose-700 transition-colors"
              >
                Choose File
              </label>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-600" />
              <span className="text-lg font-semibold text-gray-900">Patient Records</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedRecord ? (
          <>
            {/* Page Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Records</h1>
              <p className="text-gray-600">Manage and review patient diagnoses and medical history</p>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients or conditions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="follow-up">Follow-up</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Records Table */}
            <motion.div
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Last Visit
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-rose-100 p-2 rounded-full mr-3">
                              <User className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{record.name}</div>
                              <div className="text-sm text-gray-500">{record.age} years, {record.gender}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{record.condition}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-rose-600">{record.confidence}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            <span className="mr-1">{getStatusIcon(record.status)}</span>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(record.lastVisit).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedRecord(record)}
                              className="text-rose-600 hover:text-rose-900 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Empty State */}
            {filteredRecords.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </motion.div>
            )}
          </>
        ) : (
          /* Patient Detail View */
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Patient Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-rose-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-rose-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedRecord.name}</h1>
                    <p className="text-gray-600">{selectedRecord.age} years, {selectedRecord.gender}</p>
                    <p className="text-sm text-gray-500">Last visit: {new Date(selectedRecord.lastVisit).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAIInsights(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Brain className="h-4 w-4" />
                    <span>View AI Insights</span>
                  </button>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to List
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'files', label: 'Files & Reports', icon: FileText },
                    { id: 'menstrual', label: 'Menstrual Cycle', icon: Calendar },
                    { id: 'drugs', label: 'Drug Checker', icon: Activity }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-rose-500 text-rose-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis Summary</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Primary Condition:</span>
                          <span className="font-semibold text-gray-900">{selectedRecord.condition}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Confidence Level:</span>
                          <span className="font-bold text-rose-600">{selectedRecord.confidence}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                            {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors">
                          Schedule Follow-up
                        </button>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Generate Report
                        </button>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                          Send to Specialist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Files & Reports</h3>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Lab Reports */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Lab Reports</h4>
                        <div className="space-y-2">
                          {selectedRecord.labReports.map((file) => (
                            <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              {getFileIcon(file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadDate}</p>
                              </div>
                            </div>
                          ))}
                          {selectedRecord.labReports.length === 0 && (
                            <p className="text-sm text-gray-500">No lab reports uploaded</p>
                          )}
                        </div>
                      </div>

                      {/* Scans */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Medical Scans</h4>
                        <div className="space-y-2">
                          {selectedRecord.scans.map((file) => (
                            <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              {getFileIcon(file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadDate}</p>
                              </div>
                            </div>
                          ))}
                          {selectedRecord.scans.length === 0 && (
                            <p className="text-sm text-gray-500">No scans uploaded</p>
                          )}
                        </div>
                      </div>

                      {/* EHR Links */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">EHR Links</h4>
                        <div className="space-y-2">
                          {selectedRecord.ehrLinks.map((link, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Link className="h-5 w-5 text-blue-500" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{link}</p>
                                <p className="text-xs text-gray-500">External EHR System</p>
                              </div>
                            </div>
                          ))}
                          {selectedRecord.ehrLinks.length === 0 && (
                            <p className="text-sm text-gray-500">No EHR links added</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'menstrual' && (
                <MenstrualTracker />
              )}

              {activeTab === 'drugs' && (
                <DrugChecker />
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && <UploadModal />}
      </AnimatePresence>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-900">AI Insights - {selectedRecord?.name}</h3>
                  <button
                    onClick={() => setShowAIInsights(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <AIInsights patientId={selectedRecord?.id || ''} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientRecordsPage;