import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const formatBreadcrumb = (text: string) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav
      className="flex px-4 py-2 bg-transparent rounded-lg"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-2 text-gray-700">
        {/* Home Link */}
        <li className="inline-flex items-center">
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#0c172bea]"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M19.707 9.293l-2-2-7-7a1 1 0 00-1.414 0l-7 7-2 2a1 1 0 001.414 1.414L2 10.414V18a2 2 0 002 2h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a2 2 0 002-2v-7.586l.293.293a1 1 0 001.414-1.414z" />
            </svg>
            Home
          </Link>
        </li>

        {/* Dynamic Breadcrumb Links */}
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const isFirstAfterHome = index === 0; // First link after Home

          return (
            <li key={to} className="flex items-center">
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 9l4-4-4-4"
                />
              </svg>

              {isLast ? (
                <span className="text-sm font-medium text-gray-500">
                  {formatBreadcrumb(value)}
                </span>
              ) : isFirstAfterHome ? (
                <span className="text-sm font-medium text-gray-700 hover:text-yellow-600">
                  <li className="inline-flex items-center">
                    <span className="inline-flex items-center text-sm font-medium text-gray-500 cursor-not-allowed">
                      {formatBreadcrumb(value)}
                    </span>
                  </li>
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-500 cursor-not-allowed">
                  {formatBreadcrumb(value)}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
