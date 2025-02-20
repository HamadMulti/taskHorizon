const SkeletonTable = ({count}:{count: number}) => {
  return (
    <>
      <tbody
        role="status"
        className="whitespace-nowrap p-4 space-y-8 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse md:p-6"
      >
        {Array.from({ length: count }).map((_, index) => (
          <tr className="p-4 my-2.5" key={index}>
            <td className="h-6 py-2 px-1 rounded-3xl bg-gray-300 mr-2 w-full"></td>
            <td className="h-6 py-2 px-1 rounded-3xl bg-gray-300 mr-2 w-full"></td>
            <td className="h-6 py-2 px-1 rounded-3xl bg-gray-300 w-full"></td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default SkeletonTable;