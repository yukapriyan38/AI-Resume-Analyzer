const ProgressBar = ({ label, value = 0 }) => {
  const color = value >= 75 ? "bg-green-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
