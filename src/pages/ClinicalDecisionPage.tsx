import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ArrowLeft, 
  User, 
  Activity,
  Brain,
  Pill,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Save,
  Send,
  Eye,
  Shield,
  Clock,
  Search,
  Baby,
  UserCheck
} from 'lucide-react';

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
}

interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
}

interface DiagnosisResult {
  condition: string;
  confidence: number;
  confidence_level: string;
  recommendation: string;
  overridden?: boolean;
}

interface DrugCheckResult {
  drugName: string;
  ageGroup: string;
  riskLevel: 'low' | 'medium' | 'high' | 'contraindicated';
  riskScore: number;
  saferAlternative: string[];
  sideEffects: string[];
  requiresMonitoring: boolean;
  pregnancyRisk: string;
  breastfeedingRisk: string;
  specialConsiderations: string[];
}

interface DrugCheckInput {
  drugName: string;
  pregnancy: boolean;
  breastfeeding: boolean;
}

const ClinicalDecisionPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: '',
    age: 0,
    gender: '',
    weight: 0,
    height: 0
  });

  const [vitals, setVitals] = useState<Vitals>({
    bloodPressure: '',
    heartRate: 0,
    temperature: 0,
    respiratoryRate: 0
  });

  const [symptoms, setSymptoms] = useState<Record<string, number>>({});
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResult | null>(null);
  
  // Drug Checker State
  const [drugCheckInput, setDrugCheckInput] = useState<DrugCheckInput>({
    drugName: '',
    pregnancy: false,
    breastfeeding: false
  });
  const [drugCheckResults, setDrugCheckResults] = useState<DrugCheckResult[]>([]);

  const symptomsList = [
    'pelvic_pain', 'heavy_periods', 'fatigue', 'nausea', 'headache',
    'back_pain', 'mood_changes', 'weight_gain', 'bloating', 'cramping',
    'irregular_periods', 'hot_flashes', 'breast_tenderness', 'anxiety',
    'depression', 'sleep_issues', 'joint_pain', 'digestive_issues'
  ];

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: checked ? 1 : 0
    }));
  };

  const handleDiagnosisSubmit = async () => {
    setLoading(true);
    
    // Simulate AI diagnosis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: DiagnosisResult[] = [
      {
        condition: "Endometriosis",
        confidence: 87.5,
        confidence_level: "High",
        recommendation: "Recommend laparoscopic examination and hormonal therapy evaluation."
      },
      {
        condition: "PCOS",
        confidence: 72.3,
        confidence_level: "Medium",
        recommendation: "Consider hormonal evaluation and ultrasound examination."
      },
      {
        condition: "Fibromyalgia",
        confidence: 45.8,
        confidence_level: "Low",
        recommendation: "Monitor symptoms and consider rheumatology consultation."
      }
    ];
    
    setDiagnosisResults(mockResults);
    setSelectedDiagnosis(mockResults[0]);
    setLoading(false);
    setCurrentStep(2);
  };

  const handleDrugCheck = async () => {
    if (!drugCheckInput.drugName.trim()) return;
    
    setLoading(true);
    
    // Simulate drug checker API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock drug check results based on input
    const mockResult: DrugCheckResult = {
      drugName: drugCheckInput.drugName,
      ageGroup: getAgeGroup(patientInfo.age),
      riskLevel: getRiskLevel(drugCheckInput.drugName, drugCheckInput.pregnancy, drugCheckInput.breastfeeding),
      riskScore: Math.floor(Math.random() * 100),
      saferAlternative: getSaferAlternatives(drugCheckInput.drugName),
      sideEffects: getSideEffects(drugCheckInput.drugName),
      requiresMonitoring: getMonitoringRequirement(drugCheckInput.drugName),
      pregnancyRisk: drugCheckInput.pregnancy ? getPregnancyRisk(drugCheckInput.drugName) : 'N/A',
      breastfeedingRisk: drugCheckInput.breastfeeding ? getBreastfeedingRisk(drugCheckInput.drugName) : 'N/A',
      specialConsiderations: getSpecialConsiderations(drugCheckInput.drugName, drugCheckInput.pregnancy, drugCheckInput.breastfeeding)
    };
    
    setDrugCheckResults(prev => [mockResult, ...prev]);
    setDrugCheckInput({ drugName: '', pregnancy: drugCheckInput.pregnancy, breastfeeding: drugCheckInput.breastfeeding });
    setLoading(false);
    setCurrentStep(3);
  };

  // Helper functions for mock data
  const getAgeGroup = (age: number): string => {
    if (age < 18) return 'Pediatric';
    if (age < 65) return 'Adult';
    return 'Geriatric';
  };

  const getRiskLevel = (drug: string, pregnancy: boolean, breastfeeding: boolean): 'low' | 'medium' | 'high' | 'contraindicated' => {
    const riskLevels = ['low', 'medium', 'high'];
    if (pregnancy && ['aspirin', 'ibuprofen', 'warfarin'].some(d => drug.toLowerCase().includes(d))) {
      return 'contraindicated';
    }
    return riskLevels[Math.floor(Math.random() * riskLevels.length)] as 'low' | 'medium' | 'high';
  };

  const getSaferAlternatives = (drug: string): string[] => {
    const alternatives: Record<string, string[]> = {
      'ibuprofen': ['Acetaminophen', 'Topical NSAIDs'],
      'aspirin': ['Acetaminophen', 'Low-dose aspirin (if indicated)'],
      'naproxen': ['Acetaminophen', 'Celecoxib'],
      'default': ['Consult pharmacist', 'Non-pharmacological alternatives']
    };
    
    const drugKey = Object.keys(alternatives).find(key => 
      drug.toLowerCase().includes(key)
    ) || 'default';
    
    return alternatives[drugKey];
  };

  const getSideEffects = (drug: string): string[] => {
    const commonSideEffects = [
      'Nausea', 'Dizziness', 'Headache', 'Drowsiness', 
      'Stomach upset', 'Dry mouth', 'Fatigue'
    ];
    return commonSideEffects.slice(0, Math.floor(Math.random() * 4) + 2);
  };

  const getMonitoringRequirement = (drug: string): boolean => {
    const monitoringDrugs = ['warfarin', 'lithium', 'digoxin', 'phenytoin'];
    return monitoringDrugs.some(d => drug.toLowerCase().includes(d)) || Math.random() > 0.6;
  };

  const getPregnancyRisk = (drug: string): string => {
    const risks = ['Category A (Safe)', 'Category B (Probably Safe)', 'Category C (Use with Caution)', 'Category D (Avoid)', 'Category X (Contraindicated)'];
    return risks[Math.floor(Math.random() * risks.length)];
  };

  const getBreastfeedingRisk = (drug: string): string => {
    const risks = ['Compatible', 'Use with Caution', 'Monitor Infant', 'Avoid if Possible', 'Contraindicated'];
    return risks[Math.floor(Math.random() * risks.length)];
  };

  const getSpecialConsiderations = (drug: string, pregnancy: boolean, breastfeeding: boolean): string[] => {
    const considerations = [];
    
    if (pregnancy) {
      considerations.push('Monitor fetal development regularly');
      considerations.push('Consider dose adjustment in third trimester');
    }
    
    if (breastfeeding) {
      considerations.push('Monitor infant for adverse effects');
      considerations.push('Consider timing doses after breastfeeding');
    }
    
    considerations.push('Regular liver function monitoring may be required');
    considerations.push('Avoid alcohol consumption');
    
    return considerations.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const handleOverrideDiagnosis = (diagnosis: DiagnosisResult) => {
    const updatedResults = diagnosisResults.map(d => 
      d.condition === diagnosis.condition 
        ? { ...d, overridden: true }
        : d
    );
    setDiagnosisResults(updatedResults);
  };

  const handleFinalize = () => {
    alert('Diagnosis and drug checks finalized and saved to patient history.');
    navigate('/patients');
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'contraindicated': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
              <span className="text-lg font-semibold text-gray-900">Clinical Decision Support</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Symptom Input', icon: <Activity className="h-5 w-5" /> },
              { step: 2, title: 'Diagnosis Results', icon: <Brain className="h-5 w-5" /> },
              { step: 3, title: 'Drug Checker', icon: <Pill className="h-5 w-5" /> }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= item.step 
                    ? 'bg-rose-600 border-rose-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {item.icon}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= item.step ? 'text-rose-600' : 'text-gray-400'
                }`}>
                  {item.title}
                </span>
                {item.step < 3 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    currentStep > item.step ? 'bg-rose-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 1: Symptom Input */}
        {currentStep === 1 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Patient Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-rose-600" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={patientInfo.age || ''}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <select
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Vitals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-rose-600" />
                Vital Signs (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Blood Pressure (120/80)"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Heart Rate (bpm)"
                  value={vitals.heartRate || ''}
                  onChange={(e) => setVitals(prev => ({ ...prev, heartRate: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Temperature (°F)"
                  value={vitals.temperature || ''}
                  onChange={(e) => setVitals(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0 }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Respiratory Rate"
                  value={vitals.respiratoryRate || ''}
                  onChange={(e) => setVitals(prev => ({ ...prev, respiratoryRate: parseInt(e.target.value) || 0 }))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptoms Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {symptomsList.map((symptom) => (
                  <label key={symptom} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={symptoms[symptom] === 1}
                      onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {symptom.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleDiagnosisSubmit}
                disabled={loading || !patientInfo.name || !patientInfo.age || !patientInfo.gender}
                className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5" />
                    <span>Get AI Diagnosis</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Diagnosis Results */}
        {currentStep === 2 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Diagnosis Results</h3>
              <div className="space-y-4">
                {diagnosisResults.map((diagnosis, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedDiagnosis?.condition === diagnosis.condition 
                      ? 'border-rose-500 bg-rose-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={() => setSelectedDiagnosis(diagnosis)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{diagnosis.condition}</h4>
                          {diagnosis.overridden && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Overridden
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{diagnosis.recommendation}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOverrideDiagnosis(diagnosis);
                            }}
                            className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                          >
                            Override Diagnosis
                          </button>
                          <button className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </button>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-rose-600 mb-1">{diagnosis.confidence.toFixed(1)}%</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(diagnosis.confidence_level)}`}>
                          {diagnosis.confidence_level} Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Symptoms
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-2"
              >
                <Pill className="h-5 w-5" />
                <span>Check Medications</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Drug Checker */}
        {currentStep === 3 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Drug Checker Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Pill className="h-5 w-5 mr-2 text-rose-600" />
                Drug Safety Checker
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter drug name (e.g., Ibuprofen, Naproxen)"
                      value={drugCheckInput.drugName}
                      onChange={(e) => setDrugCheckInput(prev => ({ ...prev, drugName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Patient Age: {patientInfo.age} years ({getAgeGroup(patientInfo.age)})
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={drugCheckInput.pregnancy}
                      onChange={(e) => setDrugCheckInput(prev => ({ ...prev, pregnancy: e.target.checked }))}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Baby className="h-4 w-4 mr-1 text-pink-500" />
                      Pregnancy
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={drugCheckInput.breastfeeding}
                      onChange={(e) => setDrugCheckInput(prev => ({ ...prev, breastfeeding: e.target.checked }))}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-blue-500" />
                      Breastfeeding
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleDrugCheck}
                  disabled={loading || !drugCheckInput.drugName.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Check Drug Safety</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Drug Check Results */}
            {drugCheckResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Drug Safety Results</h3>
                {drugCheckResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{result.drugName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Age Group: {result.ageGroup}</span>
                          <span>Risk Score: {result.riskScore}/100</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {result.riskLevel.toUpperCase()} RISK
                        </span>
                        <div className="mt-2 flex items-center text-sm">
                          {result.requiresMonitoring ? (
                            <span className="text-orange-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Monitoring Required
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              No Monitoring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Side Effects */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Common Side Effects</h5>
                        <ul className="space-y-1">
                          {result.sideEffects.map((effect, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Safer Alternatives */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Safer Alternatives</h5>
                        <ul className="space-y-1">
                          {result.saferAlternative.map((alt, idx) => (
                            <li key={idx} className="text-sm text-green-600 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              {alt}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pregnancy & Breastfeeding Risks */}
                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Special Populations</h5>
                        <div className="space-y-2">
                          {result.pregnancyRisk !== 'N/A' && (
                            <div className="text-sm">
                              <span className="font-medium text-pink-600">Pregnancy:</span>
                              <span className="ml-1 text-gray-600">{result.pregnancyRisk}</span>
                            </div>
                          )}
                          {result.breastfeedingRisk !== 'N/A' && (
                            <div className="text-sm">
                              <span className="font-medium text-blue-600">Breastfeeding:</span>
                              <span className="ml-1 text-gray-600">{result.breastfeedingRisk}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Considerations */}
                    {result.specialConsiderations.length > 0 && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Special Considerations
                        </h5>
                        <ul className="space-y-1">
                          {result.specialConsiderations.map((consideration, idx) => (
                            <li key={idx} className="text-sm text-yellow-700">
                              • {consideration}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Finalize Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Finalize Consultation</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleFinalize}
                  className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>Save & Finalize</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send to Patient</span>
                </button>
                <button className="border border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Mark for AI Training</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Diagnosis
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClinicalDecisionPage;