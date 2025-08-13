import { 
	calculateMaxShutter, 
	calculateEffectiveFocalLength, 
	formatShutterFraction, 
	getTrailRisk,
	RuleConstant 
} from '../utils/astro';

type ResultCardProps = {
	focalLength: number | null;
	cropFactor: number | null;
	ruleConstant: RuleConstant;
};

export const ResultCard: React.FC<ResultCardProps> = ({
	focalLength,
	cropFactor,
	ruleConstant
}) => {
	if (!focalLength || !cropFactor) {
		return (
			<div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Calculation Results
				</h3>
				<p className="text-gray-500">
					Please select a lens and camera format to see the 500-rule calculation.
				</p>
			</div>
		);
	}

	const maxShutter = calculateMaxShutter(focalLength, cropFactor, ruleConstant);
	const effectiveFocalLength = calculateEffectiveFocalLength(focalLength, cropFactor);
	const trailRisk = getTrailRisk(focalLength, cropFactor);

	if (!maxShutter) {
		return (
			<div className="bg-red-50 border border-red-200 rounded-lg p-6">
				<h3 className="text-lg font-semibold text-red-900 mb-2">
					Calculation Error
				</h3>
				<p className="text-red-700">
					Unable to calculate shutter speed. Please check your inputs.
				</p>
			</div>
		);
	}

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'low': return 'text-green-600 bg-green-50';
			case 'medium': return 'text-yellow-600 bg-yellow-50';
			case 'high': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				500-Rule Results
			</h3>
			
			<div className="space-y-4">
				{/* Main Result */}
				<div className="bg-blue-50 rounded-lg p-4">
					<h4 className="font-medium text-blue-900 mb-2">Maximum Shutter Speed</h4>
					<div className="text-2xl font-bold text-blue-800">
						{maxShutter.toFixed(2)} seconds
					</div>
					<div className="text-lg text-blue-700 mt-1">
						≈ {formatShutterFraction(maxShutter)}
					</div>
				</div>

				{/* Formula Breakdown */}
				<div className="bg-gray-50 rounded-lg p-4">
					<h4 className="font-medium text-gray-900 mb-2">Formula Breakdown</h4>
					<p className="font-mono text-sm text-gray-700">
						{ruleConstant} / ({focalLength}mm × {cropFactor}) = {maxShutter.toFixed(2)}s
					</p>
				</div>

				{/* Additional Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-gray-50 rounded-lg p-3">
						<h5 className="font-medium text-gray-900 text-sm">Crop Factor</h5>
						<p className="text-gray-700">{cropFactor}×</p>
					</div>
					
					<div className="bg-gray-50 rounded-lg p-3">
						<h5 className="font-medium text-gray-900 text-sm">Effective Focal Length</h5>
						<p className="text-gray-700">{effectiveFocalLength.toFixed(0)}mm (35mm eq.)</p>
					</div>
				</div>

				{/* Trail Risk Indicator */}
				<div className={`rounded-lg p-3 ${getRiskColor(trailRisk)}`}>
					<h5 className="font-medium text-sm">Star Trail Risk</h5>
					<p className="capitalize font-medium">{trailRisk}</p>
					<p className="text-xs mt-1">
						{trailRisk === 'low' && 'Good for wide-angle astrophotography'}
						{trailRisk === 'medium' && 'Moderate risk, watch your exposure time'}
						{trailRisk === 'high' && 'High risk of star trails, use shorter exposures'}
					</p>
				</div>

				{/* Pro Tips */}
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
					<h5 className="font-medium text-amber-900 text-sm mb-1">Pro Tips</h5>
					<ul className="text-xs text-amber-800 space-y-1">
						<li>• The {ruleConstant}-rule is a starting point - test and adjust for your setup</li>
						<li>• Modern cameras with better high-ISO performance may allow longer exposures</li>
						<li>• Consider using a star tracker for longer exposures</li>
						{cropFactor > 1.5 && <li>• Crop sensors effectively increase focal length, requiring shorter exposures</li>}
					</ul>
				</div>
			</div>
		</div>
	);
}; 