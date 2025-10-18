import React from 'react';

interface ReportModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ title, content, onClose }) => {
  const handleDownload = () => {
    // Replace markdown-style headings with plain text equivalents for the .txt file
    const plainTextContent = content
      .replace(/^(#+)\s*(.*)$/gm, (match, hashes, text) => `${text.toUpperCase()}\n${'-'.repeat(text.length)}`)
      .replace(/\*\*(.*?)\*\*/g, '$1');

    const blob = new Blob([plainTextContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${title.replace(/ /g, '_')}.txt`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 animate-fade-in" style={{animationDuration: '0.3s'}} onClick={onClose}>
      <div className="bg-[#1A1A1A] border-2 border-gray-700 rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
        </div>
        <div className="overflow-y-auto text-[#D5CBA3] whitespace-pre-wrap flex-grow pr-4" dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>').replace(/^(#+)\s*(.*)$/gm, '<h3 class="text-xl font-bold text-white mt-4 mb-2">$2</h3>') }}>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-700 flex flex-col sm:flex-row justify-end gap-4 flex-shrink-0">
             <button onClick={onClose} className="bg-transparent border border-gray-600 text-gray-300 py-2 px-6 rounded-lg text-base font-semibold hover:bg-gray-800 transition-colors">
                Close
            </button>
            <button onClick={handleDownload} className="bg-[#FF7A2F] text-black py-2 px-6 rounded-lg text-base font-semibold hover:bg-[#ff8b50] transition-all">
                Download as .txt
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;