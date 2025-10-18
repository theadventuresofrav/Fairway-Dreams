
import React, { useState, useEffect } from 'react';
import { FamilyMember, FamilyMemberData } from '../types';

interface AddEditFamilyMemberScreenProps {
  onSave: (data: FamilyMemberData) => void;
  initialData: FamilyMember | null;
  onCancel: () => void;
}

const AddEditFamilyMemberScreen: React.FC<AddEditFamilyMemberScreenProps> = ({ onSave, initialData, onCancel }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [notes, setNotes] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setBirthDate(initialData.birthDate);
      setBirthTime(initialData.birthTime || '');
      setNotes(initialData.notes || '');
    } else {
      setFullName('');
      setBirthDate('');
      setBirthTime('');
      setNotes('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && birthDate) {
      onSave({ fullName, birthDate, birthTime, notes });
    }
  };

  return (
    <div className="bg-[#000000] rounded-2xl p-6 sm:p-8 shadow-2xl mb-6">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">{isEditing ? 'Edit Family Member' : 'Add a New Family Member'}</h2>
        <p className="text-center text-gray-400 mb-6 -mt-4">{isEditing ? "Update your family member's details below." : "Add a family member's details to get support insights."}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="fullName" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
              Family Member's Full Name
            </label>
            <input
              type="text"
              id="fullName"
              required
              placeholder="Jamie Anderson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
                <label htmlFor="birthDate" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
                    Family Member's Birth Date
                </label>
                <input
                type="date"
                id="birthDate"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
                />
            </div>
            <div>
                <label htmlFor="birthTime" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
                    Birth Time (Optional)
                </label>
                <input
                    type="time"
                    id="birthTime"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50"
                />
                <p className="text-xs text-gray-500 mt-2">Crucial for an accurate astrological reading (determines Moon & Rising signs).</p>
            </div>
          </div>
          
          <div className="mb-5">
            <label htmlFor="notes" className="block font-semibold mb-2 text-sm text-[#D5CBA3]">
                Personal Notes (Optional)
            </label>
             <p className="text-xs text-gray-500 mb-2">Use Markdown for formatting: **bold**, *italics*</p>
            <textarea
                id="notes"
                placeholder="Add notes here. You can use **bold text** or *italic text* for emphasis."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-[#1A1A1A] text-white border-2 border-gray-700 rounded-lg text-base transition-all focus:outline-none focus:border-[#FF7A2F] focus:ring-2 focus:ring-[#FF7A2F]/50 h-24 resize-none"
            />
        </div>


          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <button
                type="button"
                onClick={onCancel}
                className="bg-transparent border border-gray-600 text-gray-300 py-3.5 px-8 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors w-full md:w-auto"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-[#FF7A2F] text-black py-3.5 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 w-full hover:bg-[#ff8b50] hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex-grow"
                disabled={!fullName || !birthDate}
            >
                {isEditing ? 'Save Changes' : 'Add Family Member to Hub'}
            </button>
          </div>
        </form>
    </div>
  );
};

export default AddEditFamilyMemberScreen;