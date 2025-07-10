// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useParams } from 'react-router-dom';
// import { 
//   Heart, 
//   ArrowLeft, 
//   User, 
//   Calendar, 
//   Activity,
//   FileText,
//   Brain,
//   Phone,
//   Mail,
//   MapPin,
//   AlertCircle,
//   CheckCircle,
//   Clock,
//   Plus,
//   Upload,
//   Camera,
//   Link,
//   X,
//   Eye,
//   Download
// } from 'lucide-react';
// import MenstrualTracker from './MenstrualTracker';
// import AIInsights from './AIInsights';


// interface PatientProfile {
//   id: string;
//   name: string;
//   age: number;
//   gender: string;
//   email: string;
//   phone: string;
//   address: string;
//   emergencyContact: string;
//   bloodType: string;
//   allergies: string[];
//   currentMedications: string[];
//   riskFactors: {
//     pregnancy: boolean;
//     menstruation: boolean;
//     menopause: boolean;
//     familyHistory: string[];
//   };
// }

// interface ConsultationHistory {
//   id: string;
//   date: string;
//   condition: string;
//   confidence: number;
//   status: 'confirmed' | 'rejected' | 'pending';
//   prescription: string[];
//   notes: string;
// }

// interface FileUpload {
//   id: string;
//   name: string;
//   type: string;
//   size: number;
//   uploadDate: string;
//   url: string;
// }

// interface MenstrualData {
//   date: string;
//   flow: 'light' | 'medium' | 'heavy';
//   symptoms: string[];
//   notes: string;
// }

// const PatientProfilePage = () => {
//   const navigate = useNavigate();
//   const { patientId } = useParams();
//   const [activeTab, setActiveTab] = useState('overview');
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [uploadType, setUploadType] = useState<'lab' | 'scan' | 'ehr'>('lab');
//   const [showAIInsights, setShowAIInsights] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [menstrualData, setMenstrualData] = useState<MenstrualData[]>([]);
//   const [newCycleData, setNewCycleData] = useState({
//     date: '',
//     flow: 'medium' as const,
//     symptoms: [] as string[],
//     notes: ''
//   });

//   // Mock patient data
//   const patient: PatientProfile = {
//     id: patientId || '1',
//     name: 'Sarah Mitchell',
//     age: 32,
//     gender: 'Female',
//     email: 'sarah.mitchell@email.com',
//     phone: '+1 (555) 123-4567',
//     address: '123 Main St, San Francisco, CA 94102',
//     emergencyContact: 'John Mitchell - +1 (555) 987-6543',
//     bloodType: 'A+',
//     allergies: ['Penicillin', 'Shellfish'],
//     currentMedications: ['Ibuprofen 400mg', 'Vitamin D3'],
//     riskFactors: {
//       pregnancy: false,
//       menstruation: true,
//       menopause: false,
//       familyHistory: ['Breast Cancer', 'Diabetes Type 2']
//     }
//   };

//   const consultationHistory: ConsultationHistory[] = [
//     {
//       id: '1',
//       date: '2025-01-06',
//       condition: 'Endometriosis',
//       confidence: 87.5,
//       status: 'confirmed',
//       prescription: ['Naproxen 500mg', 'Hormonal therapy'],
//       notes: 'Patient responded well to treatment. Follow-up in 3 months.'
//     },
//     {
//       id: '2',
//       date: '2024-12-15',
//       condition: 'PCOS',
//       confidence: 72.3,
//       status: 'rejected',
//       prescription: [],
//       notes: 'Further testing ruled out PCOS. Symptoms attributed to stress.'
//     },
//     {
//       id: '3',
//       date: '2024-11-20',
//       condition: 'Migraine',
//       confidence: 91.2,
//       status: 'confirmed',
//       prescription: ['Sumatriptan 50mg', 'Preventive therapy'],
//       notes: 'Migraine pattern identified. Preventive treatment initiated.'
//     }
//   ];

//   const [labReports, setLabReports] = useState<FileUpload[]>([
//     {
//       id: '1',
//       name: 'Blood Test - Complete Panel',
//       type: 'pdf',
//       size: 2456789,
//       uploadDate: '2025-01-05',
//       url: '#'
//     },
//     {
//       id: '2',
//       name: 'Hormone Levels',
//       type: 'pdf',
//       size: 1234567,
//       uploadDate: '2025-01-04',
//       url: '#'
//     }
//   ]);

//   const [scans, setScans] = useState<FileUpload[]>([
//     {
//       id: '1',
//       name: 'Pelvic Ultrasound',
//       type: 'jpg',
//       size: 5678901,
//       uploadDate: '2025-01-03',
//       url: '#'
//     }
//   ]);

//   const [ehrLinks, setEhrLinks] = useState<string[]>([
//     'https://ehr.hospital.com/patient/12345',
//     'https://records.clinic.com/sarah-mitchell'
//   ]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'confirmed': return <CheckCircle className="h-4 w-4" />;
//       case 'rejected': return <AlertCircle className="h-4 w-4" />;
//       case 'pending': return <Clock className="h-4 w-4" />;
//       default: return <Activity className="h-4 w-4" />;
//     }
//   };

//   const getFileIcon = (type: string) => {
//     switch (type) {
//       case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
//       case 'jpg':
//       case 'jpeg':
//       case 'png': return <Camera className="h-5 w-5 text-blue-500" />;
//       default: return <FileText className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       handleFileUpload(files[0]);
//     }
//   };

//   const handleFileUpload = (file: File) => {
//     const newFile: FileUpload = {
//       id: Date.now().toString(),
//       name: file.name,
//       type: file.type.split('/')[1] || 'unknown',
//       size: file.size,
//       uploadDate: new Date().toISOString().split('T')[0],
//       url: URL.createObjectURL(file)
//     };
    
//     if (uploadType === 'lab') {
//       setLabReports([...labReports, newFile]);
//     } else if (uploadType === 'scan') {
//       setScans([...scans, newFile]);
//     }
    
//     setShowUploadModal(false);
//   };

//   const handleAddEHRLink = (link: string) => {
//     if (link && !ehrLinks.includes(link)) {
//       setEhrLinks([...ehrLinks, link]);
//     }
//   };

//   const addMenstrualData = () => {
//     if (newCycleData.date) {
//       setMenstrualData([...menstrualData, { ...newCycleData }]);
//       setNewCycleData({ date: '', flow: 'medium', symptoms: [], notes: '' });
//     }
//   };

//   const getFlowColor = (flow: string) => {
//     switch (flow) {
//       case 'light': return 'bg-green-100 text-green-800';
//       case 'medium': return 'bg-yellow-100 text-yellow-800';
//       case 'heavy': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <User className="h-4 w-4" /> },
//     { id: 'history', label: 'Consultation History', icon: <FileText className="h-4 w-4" /> },
//     { id: 'files', label: 'Files & Reports', icon: <Upload className="h-4 w-4" /> },
//     { id: 'menstrual', label: 'Menstrual Cycle', icon: <Calendar className="h-4 w-4" /> }
//   ];

//   const UploadModal = () => (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         className="bg-white rounded-xl shadow-xl max-w-md w-full"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//       >
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold text-gray-900">Upload Files</h3>
//             <button
//               onClick={() => setShowUploadModal(false)}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
        
//         <div className="p-6 space-y-4">
//           <div className="flex space-x-4">
//             {(['lab', 'scan', 'ehr'] as const).map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setUploadType(type)}
//                 className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                   uploadType === type
//                     ? 'bg-rose-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {type === 'lab' ? 'Lab Report' : type === 'scan' ? 'Scan' : 'EHR Link'}
//               </button>
//             ))}
//           </div>
          
//           {uploadType === 'ehr' ? (
//             <div className="space-y-4">
//               <input
//                 type="url"
//                 placeholder="Enter EHR link URL"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleAddEHRLink(e.currentTarget.value);
//                     e.currentTarget.value = '';
//                     setShowUploadModal(false);
//                   }
//                 }}
//               />
//               <button 
//                 onClick={() => {
//                   const input = document.querySelector('input[type="url"]') as HTMLInputElement;
//                   if (input) {
//                     handleAddEHRLink(input.value);
//                     input.value = '';
//                     setShowUploadModal(false);
//                   }
//                 }}
//                 className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
//               >
//                 Add EHR Link
//               </button>
//             </div>
//           ) : (
//             <div
//               className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                 dragActive ? 'border-rose-500 bg-rose-50' : 'border-gray-300'
//               }`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
//               <input
//                 type="file"
//                 id="file-upload"
//                 className="hidden"
//                 accept={uploadType === 'lab' ? '.pdf,.doc,.docx' : '.jpg,.jpeg,.png,.dcm'}
//                 onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="bg-rose-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-rose-700 transition-colors"
//               >
//                 Choose File
//               </label>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );

//   const AIInsightsModal = () => (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.9, opacity: 0 }}
//       >
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-bold text-gray-900">AI Insights - {patient.name}</h3>
//             <button
//               onClick={() => setShowAIInsights(false)}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
//         <div className="p-6 space-y-6">
//           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//             <h4 className="font-semibold text-purple-900 mb-2">Diagnostic Patterns</h4>
//             <p className="text-purple-700 text-sm">
//               Based on consultation history and symptoms, AI has identified recurring patterns consistent with endometriosis progression.
//             </p>
//           </div>
          
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-900 mb-2">Treatment Recommendations</h4>
//             <ul className="text-blue-700 text-sm space-y-1">
//               <li>• Continue current hormonal therapy</li>
//               <li>• Monitor pain levels weekly</li>
//               <li>• Consider dietary modifications</li>
//             </ul>
//           </div>
          
//           <div className="bg-green-50 border border-green-200 rounded-lg p-4">
//             <h4 className="font-semibold text-green-900 mb-2">Risk Assessment</h4>
//             <p className="text-green-700 text-sm">
//               Low risk for complications based on current treatment response and family history analysis.
//             </p>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => navigate('/patients')}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
//               >
//                 <ArrowLeft className="h-5 w-5" />
//                 <span>Back to Records</span>
//               </button>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Heart className="h-6 w-6 text-rose-600" />
//               <span className="text-lg font-semibold text-gray-900">Patient Profile</span>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Patient Header */}
//         <motion.div
//           className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="flex items-center space-x-4 mb-4 md:mb-0">
//               <div className="bg-rose-100 p-4 rounded-full">
//                 <User className="h-8 w-8 text-rose-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
//                 <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setShowAIInsights(true)}
//                 className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
//               >
//                 <Brain className="h-5 w-5" />
//                 <span>View AI Insights</span>
//               </button>
//               <button
//                 onClick={() => navigate('/diagnosis')}
//                 className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-2"
//               >
//                 <Plus className="h-5 w-5" />
//                 <span>New Consultation</span>
//               </button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Tabs */}
//         <motion.div
//           className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//         >
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
//                     activeTab === tab.id
//                       ? 'border-rose-500 text-rose-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {tab.icon}
//                   <span>{tab.label}</span>
//                 </button>
//               ))}
//             </nav>
//           </div>

//           <div className="p-6">
//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="space-y-8"
//               >
//                 {/* Personal Information */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-4">
//                       <div className="flex items-center space-x-3">
//                         <Mail className="h-5 w-5 text-gray-400" />
//                         <div>
//                           <p className="text-sm text-gray-600">Email</p>
//                           <p className="font-medium">{patient.email}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <Phone className="h-5 w-5 text-gray-400" />
//                         <div>
//                           <p className="text-sm text-gray-600">Phone</p>
//                           <p className="font-medium">{patient.phone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <MapPin className="h-5 w-5 text-gray-400" />
//                         <div>
//                           <p className="text-sm text-gray-600">Address</p>
//                           <p className="font-medium">{patient.address}</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="space-y-4">
//                       <div>
//                         <p className="text-sm text-gray-600">Blood Type</p>
//                         <p className="font-medium">{patient.bloodType}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-gray-600">Emergency Contact</p>
//                         <p className="font-medium">{patient.emergencyContact}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Medical Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
//                     <div className="space-y-2">
//                       {patient.allergies.map((allergy, index) => (
//                         <span key={index} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2">
//                           {allergy}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
//                     <div className="space-y-2">
//                       {patient.currentMedications.map((medication, index) => (
//                         <div key={index} className="bg-blue-50 p-3 rounded-lg">
//                           <p className="font-medium text-blue-900">{medication}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Risk Factors */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factors</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-3">Current Status</h4>
//                       <div className="space-y-2">
//                         <div className="flex items-center space-x-2">
//                           <div className={`w-3 h-3 rounded-full ${patient.riskFactors.pregnancy ? 'bg-green-500' : 'bg-gray-300'}`} />
//                           <span className="text-sm">Pregnancy</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className={`w-3 h-3 rounded-full ${patient.riskFactors.menstruation ? 'bg-green-500' : 'bg-gray-300'}`} />
//                           <span className="text-sm">Menstruation</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <div className={`w-3 h-3 rounded-full ${patient.riskFactors.menopause ? 'bg-green-500' : 'bg-gray-300'}`} />
//                           <span className="text-sm">Menopause</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900 mb-3">Family History</h4>
//                       <div className="space-y-2">
//                         {patient.riskFactors.familyHistory.map((condition, index) => (
//                           <span key={index} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2">
//                             {condition}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             )}

//             {/* Consultation History Tab */}
//             {activeTab === 'history' && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="space-y-6"
//               >
//                 {consultationHistory.map((consultation, index) => (
//                   <div key={consultation.id} className="bg-gray-50 rounded-lg p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div>
//                         <h4 className="text-lg font-semibold text-gray-900">{consultation.condition}</h4>
//                         <p className="text-sm text-gray-600 flex items-center mt-1">
//                           <Calendar className="h-4 w-4 mr-1" />
//                           {new Date(consultation.date).toLocaleDateString('en-US', { 
//                             year: 'numeric', 
//                             month: 'long', 
//                             day: 'numeric' 
//                           })}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-2xl font-bold text-rose-600 mb-1">{consultation.confidence}%</p>
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
//                           {getStatusIcon(consultation.status)}
//                           <span className="ml-1">{consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}</span>
//                         </span>
//                       </div>
//                     </div>
                    
//                     {consultation.prescription.length > 0 && (
//                       <div className="mb-4">
//                         <h5 className="font-medium text-gray-900 mb-2">Prescription</h5>
//                         <div className="space-y-1">
//                           {consultation.prescription.map((med, medIndex) => (
//                             <span key={medIndex} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">
//                               {med}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
                    
//                     <div>
//                       <h5 className="font-medium text-gray-900 mb-2">Notes</h5>
//                       <p className="text-gray-700">{consultation.notes}</p>
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>
//             )}

//             {/* Files & Reports Tab */}
//             {activeTab === 'files' && (
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4 }}
//                 className="space-y-6"
//               >
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-gray-900">Files & Reports</h3>
//                   <button
//                     onClick={() => setShowUploadModal(true)}
//                     className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center space-x-2"
//                   >
//                     <Plus className="h-4 w-4" />
//                     <span>Upload File</span>
//                   </button>
//                 </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       {/* Lab Reports */}
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-3">Lab Reports</h4>
//                         <div className="space-y-2">
//                           {selectedRecord.labReports.map((file) => (
//                             <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                               {getFileIcon(file.type)}
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
//                                 <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadDate}</p>
//                               </div>
//                             </div>
//                           ))}
//                           {selectedRecord.labReports.length === 0 && (
//                             <p className="text-sm text-gray-500">No lab reports uploaded</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* Scans */}
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-3">Medical Scans</h4>
//                         <div className="space-y-2">
//                           {selectedRecord.scans.map((file) => (
//                             <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                               {getFileIcon(file.type)}
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
//                                 <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadDate}</p>
//                               </div>
//                             </div>
//                           ))}
//                           {selectedRecord.scans.length === 0 && (
//                             <p className="text-sm text-gray-500">No scans uploaded</p>
//                           )}
//                         </div>
//                       </div>

//                       {/* EHR Links */}
//                       <div>
//                         <h4 className="font-medium text-gray-900 mb-3">EHR Links</h4>
//                         <div className="space-y-2">
//                           {selectedRecord.ehrLinks.map((link, index) => (
//                             <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
//                               <Link className="h-5 w-5 text-blue-500" />
//                               <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-900 truncate">{link}</p>
//                                 <p className="text-xs text-gray-500">External EHR System</p>
//                               </div>
//                             </div>
//                           ))}
//                           {selectedRecord.ehrLinks.length === 0 && (
//                             <p className="text-sm text-gray-500">No EHR links added</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'menstrual' && (
//                 <MenstrualTracker />
//               )}

//               {activeTab === 'drugs' && (
//                 <DrugChecker />
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Upload Modal */}
//       <AnimatePresence>
//         {showUploadModal && <UploadModal />}
//       </AnimatePresence>

//       {/* AI Insights Modal */}
//       <AnimatePresence>
//         {showAIInsights && (
//           <motion.div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//             >
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-xl font-bold text-gray-900">AI Insights - {selectedRecord?.name}</h3>
//                   <button
//                     onClick={() => setShowAIInsights(false)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <AIInsights patientId={selectedRecord?.id || ''} />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PatientProfile;