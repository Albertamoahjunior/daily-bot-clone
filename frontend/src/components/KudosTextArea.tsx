import React from 'react';

interface KudosTextAreaProps {
  kudosReason: string;
  setKudosReason: (reason: string) => void;
}

export const KudosTextArea: React.FC<KudosTextAreaProps> = ({ kudosReason, setKudosReason }) => {
  return (
    <div className="mb-4">
      <label className="block text-black font-medium mb-2">
        Add A Reason For Kudos Given (required)
      </label>
      <textarea
        className="w-full p-2 border border-gray-400 rounded-lg bg-white"
        rows={3}
        value={kudosReason}
        onChange={(e) => setKudosReason(e.target.value)}
        placeholder="Enter a reason for the kudos..."
        required
      />
    </div>
  );
};

