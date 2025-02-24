import React from "react";

const NodeEditInput = ({
  inputValue,
  handleInputChange,
  handleInputBlur,
  topPosition = "20%",
}) => {
  return (
    <div className="fixed inset-0 flex justify-center">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
        className="px-3 py-2 w-52 absolute bg-white border border-gray-200 rounded-lg shadow-lg
                    text-gray-800 text-sm
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                    transition-all duration-200 ease-in-out"
        style={{
          top: topPosition,
          transform: "translateY(-50%)",
        }}
        autoFocus
        spellCheck={false}
      />
    </div>
  );
};

export default NodeEditInput;
