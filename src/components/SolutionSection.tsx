import React from 'react';
import { Brain, Stethoscope, Target, CheckCircle } from 'lucide-react';

interface SolutionSectionProps {
  scrollY: number; // still included in props, in case you need it elsewhere
}

const SolutionSection: React.FC<SolutionSectionProps> = () => {
  const steps = [
    {
      icon: Stethoscope,
      title: 'Symptom Analysis',
      description: 'Doctor enters patient symptoms into DiagHer\'s intelligent interface. Our AI instantly analyzes patterns through a gender-specific lens.',
      image: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'rose-800',
      sample: '"Chest pain, fatigue, nausea..."'
    },
    {
      icon: Target,
      title: 'Smart Diagnosis',
      description: 'DiagHer provides gender-specific disease likelihoods based on current research, highlighting conditions often missed in women.',
      image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=600',
      color: 'gray-700',
      results: [
        { condition: 'Heart Disease', percentage: '78%', color: 'rose-800' },
        { condition: 'Anxiety', percentage: '23%', color: 'gray-600' }
      ]
    },
    {
      icon: CheckCircle,
      title: 'Safe Treatment',
      description: 'Analyzes prescribed medications for women-specific side effects and suggests safer alternatives with transparent risk analysis.',
      image: 'src/assets/treatment(1).jpg',
      color: 'emerald-600',
      alert: 'Safer Alternative Found'
    }
  ];

  return (
    <section id="solution" className="relative py-32 bg-gray-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-800 to-rose-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
            <Brain className="w-4 h-4" />
            <span>Intelligent Solution</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            How{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600">
              DiagHer
            </span>{' '}
            Works
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered system provides gender-specific medical insights at every step of the diagnostic journey
          </p>
        </div>

        {/* Step Cards */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-3xl p-8 h-full shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105 hover:border-gray-300">
                <div className={`w-16 h-16 bg-${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                {/* Image Frame */}
                <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{
                      backgroundImage: `url('${step.image}')`,
                      backgroundPosition: 'center 40%'
                    }}
                  ></div>
                </div>

                {/* Step-specific content */}
                {step.sample && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">Sample Input:</div>
                    <div className="text-gray-800 italic font-medium">{step.sample}</div>
                  </div>
                )}

                {step.results && (
                  <div className="space-y-2">
                    {step.results.map((result, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors">
                        <span className="text-sm text-gray-700 font-medium">{result.condition}</span>
                        <span className={`text-sm font-semibold text-${result.color}`}>{result.percentage}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.alert && (
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.alert}</span>
                    </div>
                    <div className="text-sm text-gray-600">Adjusted dosage for optimal female metabolism</div>
                  </div>
                )}
              </div>

              {/* Connection Lines (between steps) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
