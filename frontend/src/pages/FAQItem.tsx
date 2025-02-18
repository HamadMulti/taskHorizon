interface FAQItemProps {
  index: number;
  isOpen: boolean;
  setActiveIndex: (index: number | null) => void;
  question: string;
  answer: string;
}

export default function FAQItem({
  index,
  isOpen,
  setActiveIndex,
  question,
  answer
}: FAQItemProps) {
  const handleClick = () => {
    setActiveIndex(isOpen ? null : index);
  };

  return (
    <div className="shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] border-2 border-yellow-600 rounded-md transition-all">
      <button
        type="button"
        className="w-full font-semibold text-left py-5 px-6 flex items-center"
        onClick={handleClick}
      >
        <span className="text-base mr-4">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 fill-current ml-auto shrink-0 transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 px-6">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
