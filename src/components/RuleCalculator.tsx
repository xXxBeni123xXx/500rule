import React from 'react';
import { RuleConstant } from '../utils/astro';

type RuleCalculatorProps = {
  ruleConstant: RuleConstant;
  onRuleConstantChange: (constant: RuleConstant) => void;
};

export const RuleCalculator: React.FC<RuleCalculatorProps> = ({
  ruleConstant,
  onRuleConstantChange
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Rule Constant
      </label>
      
      <div className="flex space-x-4">
        <button
          onClick={() => onRuleConstantChange(500)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            ruleConstant === 500
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          500 Rule
        </button>
        
        <button
          onClick={() => onRuleConstantChange(400)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            ruleConstant === 400
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          400 Rule
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>
          <strong>500 Rule:</strong> More permissive, good for wide-angle lenses
        </p>
        <p>
          <strong>400 Rule:</strong> More conservative, better for telephoto lenses
        </p>
      </div>
    </div>
  );
};
