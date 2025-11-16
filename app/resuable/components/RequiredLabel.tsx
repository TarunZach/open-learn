export const RequiredLabel = ({ children }: { children: string }) => {
  return (
    <label className="flex items-center gap-1 font-medium">
      {children}
      <span className="text-red-500">*</span>
    </label>
  );
};
