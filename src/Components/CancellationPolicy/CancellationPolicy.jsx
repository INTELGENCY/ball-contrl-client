import { policyData } from "./data";

const CancellationPolicy = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold text-main-darker">
        Cancellation & Rescheduling Policy
      </h1>
      <p className="text-gray-900 mt-2">
        We understand that life can get busy, and sometimes plans change. To
        ensure fairness for both players and coaches, we’ve set out the
        following cancellation and rescheduling guidelines:
      </p>
      {policyData.map((policy, index) => (
        <div key={index} className="mt-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {policy.title}
          </h2>
          <p className="text-gray-800">{policy.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CancellationPolicy;
