import pandas as pd
import numpy as np
from typing import Dict, List, Optional
import os
from datetime import datetime

class DrugAnalyzer:
    def __init__(self, csv_path: str = 'data/female_drug_side_effects.csv'):
        """Initialize the drug analyzer with CSV data"""
        self.csv_path = csv_path
        self.drug_data = None
        self.load_data()
    
    def load_data(self):
        """Load and process the CSV data"""
        try:
            if os.path.exists(self.csv_path):
                self.drug_data = pd.read_csv(self.csv_path)
                print(f"Loaded {len(self.drug_data)} records from {self.csv_path}")
            else:
                print(f"CSV file not found: {self.csv_path}")
                self.create_sample_data()
        except Exception as e:
            print(f"Error loading data: {e}")
            self.create_sample_data()
    
    def create_sample_data(self):
        """Create sample data based on your CSV structure"""
        sample_data = [
            {
                'drug_name': 'ACE_Inhibitors',
                'side_effect': 'dry_cough',
                'gender_specific': 'General',
                'severity': 'Mild',
                'age_group': '18-30',
                'frequency_in_females': 'Common',
                'category': 'Cardiovascular',
                'risk_level': 'Higher',
                'requires_monitoring': 'Yes',
                'safer_alternative': 'ARBs (Angiotensin Receptor Blockers)',
                'pregnancy_risk': 'Medium',
                'breastfeeding_risk': 'High'
            },
            {
                'drug_name': 'ACE_Inhibitors',
                'side_effect': 'cough_3x_more_common',
                'gender_specific': 'Female_Specific',
                'severity': 'Moderate',
                'age_group': '31-45',
                'frequency_in_females': 'Frequent',
                'category': 'Cardiovascular',
                'risk_level': 'Higher',
                'requires_monitoring': 'Yes',
                'safer_alternative': 'ARBs (Angiotensin Receptor Blockers)',
                'pregnancy_risk': 'High',
                'breastfeeding_risk': 'Medium'
            },
            {
                'drug_name': 'Beta_Blockers',
                'side_effect': 'depression_risk',
                'gender_specific': 'Female_Specific',
                'severity': 'Moderate',
                'age_group': '18-30',
                'frequency_in_females': 'Frequent',
                'category': 'Cardiovascular',
                'risk_level': 'Higher',
                'requires_monitoring': 'Yes',
                'safer_alternative': 'Calcium Channel Blockers',
                'pregnancy_risk': 'Medium',
                'breastfeeding_risk': 'High'
            },
            {
                'drug_name': 'Beta_Blockers',
                'side_effect': 'weight_gain',
                'gender_specific': 'Female_Specific',
                'severity': 'Mild',
                'age_group': '31-45',
                'frequency_in_females': 'Common',
                'category': 'Cardiovascular',
                'risk_level': 'Higher',
                'requires_monitoring': 'Yes',
                'safer_alternative': 'Calcium Channel Blockers',
                'pregnancy_risk': 'High',
                'breastfeeding_risk': 'Medium'
            },
            {
                'drug_name': 'Calcium_Channel_Blockers',
                'side_effect': 'ankle_edema_2x_risk',
                'gender_specific': 'Female_Specific',
                'severity': 'Moderate',
                'age_group': '46-60',
                'frequency_in_females': 'Common',
                'category': 'Cardiovascular',
                'risk_level': 'Higher',
                'requires_monitoring': 'Yes',
                'safer_alternative': 'Consult physician for alternatives',
                'pregnancy_risk': 'Medium',
                'breastfeeding_risk': 'High'
            }
        ]
        self.drug_data = pd.DataFrame(sample_data)
        print("Created sample data for testing")
    
    def get_age_group(self, age: int) -> str:
        """Determine age group based on age"""
        if age <= 30:
            return "18-30"
        elif age <= 45:
            return "31-45"
        elif age <= 60:
            return "46-60"
        else:
            return "60+"
    
    def calculate_risk_score(self, drug_name: str, age_group: str) -> Dict:
        """Calculate risk score for a drug based on side effects"""
        if self.drug_data is None:
            return {'level': 'Unknown', 'score': 0}
        
        drug_effects = self.drug_data[
            (self.drug_data['drug_name'].str.contains(drug_name, case=False, na=False)) &
            (self.drug_data['age_group'] == age_group)
        ]
        
        if drug_effects.empty:
            return {'level': 'Unknown', 'score': 0}
        
        severity_scores = {'Mild': 1, 'Moderate': 2, 'Severe': 3}
        frequency_scores = {'Rare': 1, 'Common': 2, 'Frequent': 3}
        
        total_score = 0
        count = 0
        
        for _, effect in drug_effects.iterrows():
            severity_score = severity_scores.get(effect.get('severity', 'Mild'), 1)
            frequency_score = frequency_scores.get(effect.get('frequency_in_females', 'Rare'), 1)
            total_score += severity_score * frequency_score
            count += 1
        
        if count == 0:
            return {'level': 'Unknown', 'score': 0}
        
        avg_score = total_score / count
        
        if avg_score <= 3:
            risk_level = 'Low'
        elif avg_score <= 6:
            risk_level = 'Medium'
        else:
            risk_level = 'High'
        
        return {'level': risk_level, 'score': avg_score}
    
    def get_side_effects(self, drug_name: str, age_group: str) -> List[Dict]:
        """Get side effects for a specific drug and age group"""
        if self.drug_data is None:
            return []
        
        drug_effects = self.drug_data[
            (self.drug_data['drug_name'].str.contains(drug_name, case=False, na=False)) &
            (self.drug_data['age_group'] == age_group)
        ]
        
        side_effects = []
        for _, effect in drug_effects.iterrows():
            side_effects.append({
                'side_effect': effect.get('side_effect', ''),
                'severity': effect.get('severity', ''),
                'frequency': effect.get('frequency_in_females', ''),
                'frequency_percentage': self.get_frequency_percentage(effect.get('frequency_in_females', '')),
                'gender_specific': effect.get('gender_specific', ''),
                'category': effect.get('category', ''),
                'requires_monitoring': effect.get('requires_monitoring', '')
            })
        
        return side_effects
    
    def get_frequency_percentage(self, frequency: str) -> str:
        """Convert frequency to percentage"""
        percentages = {
            'Rare': '< 5%',
            'Common': '5-15%',
            'Frequent': '15-30%'
        }
        return percentages.get(frequency, 'Unknown')
    
    def get_safer_alternatives(self, drug_name: str, age_group: str) -> List[str]:
        """Get safer alternatives for a drug"""
        if self.drug_data is None:
            return []
        
        drug_effects = self.drug_data[
            (self.drug_data['drug_name'].str.contains(drug_name, case=False, na=False)) &
            (self.drug_data['age_group'] == age_group)
        ]
        
        alternatives = drug_effects['safer_alternative'].dropna().unique().tolist()
        return alternatives
    
    def get_pregnancy_breastfeeding_risks(self, drug_name: str, age_group: str) -> Dict:
        """Get pregnancy and breastfeeding risks"""
        if self.drug_data is None:
            return {'pregnancy_risk': 'Unknown', 'breastfeeding_risk': 'Unknown'}
        
        drug_effects = self.drug_data[
            (self.drug_data['drug_name'].str.contains(drug_name, case=False, na=False)) &
            (self.drug_data['age_group'] == age_group)
        ]
        
        if drug_effects.empty:
            return {'pregnancy_risk': 'Unknown', 'breastfeeding_risk': 'Unknown'}
        
        pregnancy_risk = drug_effects['pregnancy_risk'].mode().iloc[0] if not drug_effects['pregnancy_risk'].empty else 'Unknown'
        breastfeeding_risk = drug_effects['breastfeeding_risk'].mode().iloc[0] if not drug_effects['breastfeeding_risk'].empty else 'Unknown'
        
        return {
            'pregnancy_risk': pregnancy_risk,
            'breastfeeding_risk': breastfeeding_risk
        }
    
    def check_monitoring_required(self, drug_name: str, age_group: str) -> bool:
        """Check if monitoring is required for the drug"""
        if self.drug_data is None:
            return False
        
        drug_effects = self.drug_data[
            (self.drug_data['drug_name'].str.contains(drug_name, case=False, na=False)) &
            (self.drug_data['age_group'] == age_group)
        ]
        
        return any(drug_effects['requires_monitoring'] == 'Yes')
    
    def analyze_drug(self, drug_info: Dict) -> Dict:
        """Analyze a single drug"""
        drug_name = drug_info.get('drug_name', '')
        age = drug_info.get('age', 25)
        is_pregnant = drug_info.get('is_pregnant', False)
        is_breastfeeding = drug_info.get('is_breastfeeding', False)
        
        age_group = self.get_age_group(age)
        
        risk_info = self.calculate_risk_score(drug_name, age_group)
        side_effects = self.get_side_effects(drug_name, age_group)
        alternatives = self.get_safer_alternatives(drug_name, age_group)
        pregnancy_bf_risks = self.get_pregnancy_breastfeeding_risks(drug_name, age_group)
        requires_monitoring = self.check_monitoring_required(drug_name, age_group)
        
        result = {
            'drug_name': drug_name,
            'age_group': age_group,
            'risk_level': risk_info['level'],
            'risk_score': risk_info['score'],
            'side_effects': side_effects,
            'safer_alternatives': alternatives,
            'requires_monitoring': requires_monitoring,
            'pregnancy_risk': pregnancy_bf_risks['pregnancy_risk'] if is_pregnant else None,
            'breastfeeding_risk': pregnancy_bf_risks['breastfeeding_risk'] if is_breastfeeding else None,
            'special_considerations': self.get_special_considerations(
                drug_name, age_group, is_pregnant, is_breastfeeding
            )
        }
        
        return result
    
    def get_special_considerations(self, drug_name: str, age_group: str, 
                                 is_pregnant: bool, is_breastfeeding: bool) -> List[str]:
        """Get special considerations for the drug"""
        considerations = []
        
        if is_pregnant:
            pregnancy_risk = self.get_pregnancy_breastfeeding_risks(drug_name, age_group)['pregnancy_risk']
            if pregnancy_risk == 'High':
                considerations.append("High pregnancy risk - consult physician immediately")
            elif pregnancy_risk == 'Medium':
                considerations.append("Moderate pregnancy risk - close monitoring required")
        
        if is_breastfeeding:
            bf_risk = self.get_pregnancy_breastfeeding_risks(drug_name, age_group)['breastfeeding_risk']
            if bf_risk == 'High':
                considerations.append("High breastfeeding risk - consider alternatives")
            elif bf_risk == 'Medium':
                considerations.append("Moderate breastfeeding risk - monitor infant closely")
        
        return considerations

def calculate_overall_risk(results: List[Dict]) -> Dict:
    """Calculate overall risk assessment from individual drug results"""
    if not results:
        return {'level': 'Unknown', 'message': 'No medications to analyze'}
    
    risk_scores = []
    high_risk_count = 0
    monitoring_required = False
    
    for result in results:
        if result['risk_level'] == 'High':
            high_risk_count += 1
        if result['requires_monitoring']:
            monitoring_required = True
        if result['risk_score'] > 0:
            risk_scores.append(result['risk_score'])
    
    if not risk_scores:
        return {'level': 'Unknown', 'message': 'Unable to calculate risk'}
    
    avg_risk = sum(risk_scores) / len(risk_scores)
    
    if high_risk_count > 0 or avg_risk > 6:
        level = 'High'
        message = f'High risk combination. {high_risk_count} high-risk medications detected.'
    elif avg_risk > 4:
        level = 'Medium'
        message = 'Moderate risk combination. Monitor patient closely.'
    else:
        level = 'Low'
        message = 'Low risk combination.'
    
    if monitoring_required:
        message += ' Regular monitoring required.'
    
    return {
        'level': level,
        'message': message,
        'average_risk_score': avg_risk,
        'high_risk_count': high_risk_count,
        'monitoring_required': monitoring_required
    }