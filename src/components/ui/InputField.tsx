interface InputFieldProps {
  label?: string;
  placeholder: string;
  value: string | number;
  type?: string;
  large?: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}

export const InputField = ({
  label,
  placeholder,
  value,
  type,
  large = false,
  onChange,
}: InputFieldProps) => {
  // Common classes for both input and textarea
  const baseClasses = `
    w-full p-2 mt-1 border rounded-md
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-200 ease-in-out
  `;

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {large ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseClasses} min-h-[100px] resize-y`}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={baseClasses}
        />
      )}
    </div>
  );
};