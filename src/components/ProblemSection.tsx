import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ProblemSectionProps {
  scrollY: number;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ scrollY }) => {
  const sectionOffset = Math.max(0, scrollY - 600);

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      {/* Background Blur Element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-50 blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div
            className="space-y-8"
            style={{
              transform: `translateY(${sectionOffset * 0.1}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-800 px-4 py-2 text-sm font-medium shadow-lg">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Healthcare Gap</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Women's Health{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600">
                Overlooked
              </span>{' '}
              for Too Long
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Medical research has historically excluded women, leading to misdiagnoses, 
              inappropriate treatments, and preventable complications. It's time for change.
            </p>

            <div className="space-y-6 pt-4">
              {[
                {
                  stat: '80%',
                  title: 'Misdiagnosis Rate',
                  desc: 'Women are 80% more likely to be misdiagnosed during heart attacks',
                },
                {
                  stat: '2x',
                  title: 'Drug Reactions',
                  desc: 'Women experience twice as many adverse drug reactions',
                },
                {
                  stat: '75%',
                  title: 'Research Gap',
                  desc: '75% of medical research excludes female subjects',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-rose-800 font-bold text-lg">{item.stat}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Frame with Parallax Effect */}
          <div className="relative">
            <div className="w-full h-96 overflow-hidden shadow-2xl border border-transparent relative group">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-300 ease-out"
                style={{
                  backgroundImage: `url('src/assets/problem.jpg')`,
                  transform: `translateY(${sectionOffset * 0.15}px)`,
                  backgroundPosition: 'center',
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
            </div>

            {/* Floating Stat Card */}
            <div
              className="absolute -bottom-8 -right-8 bg-white p-6 shadow-2xl border border-transparent backdrop-blur-sm"
              style={{
                transform: `translateY(${sectionOffset * 0.1}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-800">67%</div>
                <div className="text-sm text-gray-600 font-medium">Pain Dismissed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
