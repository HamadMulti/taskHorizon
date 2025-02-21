import { useEffect, useRef, useState } from "react";
import FAQItem from "./FAQItem";
import { Link } from "react-scroll";
import { useAuth } from "../hooks/useAuth";
import { Link as Linky } from "react-router-dom";

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { otpVerified, user, token, handleSubscriber } = useAuth();
  const [userData, setUserData] = useState({
    email: ""
  });
  const [error, setError] = useState("");

  const toggleOpenRef = useRef<HTMLButtonElement | null>(null);
  const toggleCloseRef = useRef<HTMLButtonElement | null>(null);
  const collapseMenuRef = useRef<HTMLDivElement | null>(null);
  const year = new Date().getFullYear();

  const faqs = [
    {
      question: "How do I create a new task?",
      answer:
        "To create a new task, click on the 'Add Task' button, enter the task details, set a due date, and click 'Save'."
    },
    {
      question: "Can I assign a task to multiple users?",
      answer:
        "Yes, when creating or editing a task, you can select multiple users under the 'Assigned To' field."
    },
    {
      question: "How do I set task priorities?",
      answer:
        "Each task has a priority level (Low, Medium, High). You can set it while creating or editing the task."
    },
    {
      question: "Is there a way to track task progress?",
      answer:
        "Yes, each task has a status indicator (To-Do, In Progress, Completed). You can update the status as you work on the task."
    },
    {
      question: "How do I get notified about task updates?",
      answer:
        "You will receive email and in-app notifications whenever a task is assigned, updated, or completed."
    },
    {
      question: "Is there a deadline reminder for tasks?",
      answer:
        "Yes, our system sends automatic reminders for upcoming deadlines via email and push notifications."
    }
  ];

  const handleClick = () => {
    setIsOpen((prevState) => !prevState);
  };
  const handleSelect = (index: number | null) => {
    setSelectedIndex(index);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubscriber(userData)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        console.log(res);
        return alert(res.data.message);
      })
      .catch((e) => setError(e));
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <div className="max-w-[1920px] mx-auto font-sans dark:bg-[#0c172c]">
      <div className="bg-white text-black text-[16px]">
        <header className="shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] sticky top-0 py-3 px-4 sm:px-10 bg-white z-50 min-h-[70px]">
          <div className="flex flex-wrap items-center gap-4">
            <Linky to="/">
              <img src="/logo/logo.png" alt="TaskHorizon" className="w-36" />
            </Linky>

            <div
              id="collapseMenu"
              ref={collapseMenuRef}
              style={{ display: isOpen ? "block" : "none" }}
              className="max-lg:hidden lg:!block max-lg:fixed max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
            >
              <button
                id="toggleClose"
                ref={toggleCloseRef}
                onClick={handleClick}
                className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 fill-black"
                  viewBox="0 0 320.591 320.591"
                >
                  <path
                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                    data-original="#000000"
                  ></path>
                  <path
                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                    data-original="#000000"
                  ></path>
                </svg>
              </button>

              <ul className="lg:ml-12 lg:flex gap-x-6 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                <li className="mb-6 hidden max-lg:block">
                  <Linky to="/">
                    <img src="/logo/logo.png" alt="logo" className="w-36" />
                  </Linky>
                </li>
                <li className="max-lg:border-b max-lg:py-3 px-3">
                  <Link
                    to="hero"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-80}
                    activeClass="text-yellow-600"
                    className="hover:text-yellow-600 block font-semibold transition-all"
                  >
                    Home
                  </Link>
                </li>
                <li className="max-lg:border-b max-lg:py-3 px-3">
                  <Link
                    to="features"
                    smooth={true}
                    duration={500}
                    offset={-80}
                    spy={true}
                    activeClass="text-yellow-600"
                    className="hover:text-yellow-600 block font-semibold transition-all"
                  >
                    Feature
                  </Link>
                </li>
                <li className="max-lg:border-b max-lg:py-3 px-3">
                  <Link
                    to="resources"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-90}
                    activeClass="text-yellow-600"
                    className="hover:text-yellow-600 block font-semibold transition-all"
                  >
                    Resources
                  </Link>
                </li>
                <li className="max-lg:border-b max-lg:py-3 px-3">
                  <Link
                    to="stats"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-100}
                    activeClass="text-yellow-600"
                    className="hover:text-yellow-600 block font-semibold transition-all"
                  >
                    Statistics
                  </Link>
                </li>
                <li className="max-lg:border-b max-lg:py-3 px-3">
                  <Link
                    to="faq"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-100}
                    activeClass="text-yellow-600"
                    className="hover:text-yellow-600 block font-semibold transition-all"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex ml-auto">
              {otpVerified && !!user && !!token ? (
                <>
                  <Linky
                    to="/dashboard/projects"
                    className="bg-yellow-600 hover:bg-yellow-700 transition-all text-white rounded-full px-5 py-2.5"
                  >
                    Dashboard
                  </Linky>
                </>
              ) : (
                <>
                  <button className="mr-6 font-semibold border-none outline-none">
                    <Linky
                      to="/login"
                      className="text-yellow-600 hover:underline"
                    >
                      Login
                    </Linky>
                  </button>
                  <Linky
                    to="/register"
                    className="bg-yellow-600 hover:bg-yellow-700 transition-all text-white rounded-full px-5 py-2.5"
                  >
                    Sign up
                  </Linky>
                </>
              )}
              <button
                id="toggleOpen"
                ref={toggleOpenRef}
                onClick={handleClick}
                className="lg:hidden ml-7"
              >
                <svg
                  className="w-7 h-7"
                  fill="#000"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-10">
            <div id="hero" className="min-h-[500px]">
              <div className="grid md:grid-cols-2 justify-center items-center gap-10">
                <div className="max-md:order-1">
                  <p className="mt-4 mb-2 font-semibold text-yellow-600">
                    <span className="rotate-90 inline-block mr-2">|</span> ALL
                    IN ONE TASK SCHEDULER
                  </p>
                  <h1 className="md:text-5xl text-4xl font-bold mb-4 md:!leading-[55px]">
                    Stay on track. Stay in control. Reach beyond the horizon
                    {/* 🌟 */}
                  </h1>
                  <p className="mt-4 text-base leading-relaxed">
                    Stay organized, prioritize effortlessly, and conquer
                    deadlines with <strong>TaskHorizon</strong>. The ultimate
                    task management system designed to keep you focused,
                    efficient, and always ahead. Whether you're managing
                    personal projects or leading a team,{" "}
                    <strong>TaskHorizon</strong> helps you streamline tasks,
                    collaborate seamlessly, and turn goals into achievements.
                  </p>
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <img
                      src="https://readymadeui.com/google-logo.svg"
                      className="w-28 mx-auto"
                      alt="google-logo"
                    />
                    <img
                      src="https://readymadeui.com/facebook-logo.svg"
                      className="w-28 mx-auto"
                      alt="facebook-logo"
                    />
                    <img
                      src="https://readymadeui.com/linkedin-logo.svg"
                      className="w-28 mx-auto"
                      alt="linkedin-logo"
                    />
                    <img
                      src="https://readymadeui.com/pinterest-logo.svg"
                      className="w-28 mx-auto"
                      alt="pinterest-logo"
                    />
                  </div>
                </div>
                <div className="max-md:mt-12 h-full">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/006/317/447/non_2x/task-manager-flat-design-effective-time-management-save-time-teamwork-planning-training-activities-organization-working-time-flat-illustration-free-vector.jpg"
                    alt="banner img"
                    className="w-full h-full object-cover no-repeat"
                  />
                </div>
              </div>
            </div>

            <div id="features" className="mt-28 bg-gray-50 px-4 sm:px-10 py-12">
              <div className="max-w-7xl mx-auto">
                <div className="md:text-center max-w-2xl mx-auto">
                  <h2 className="md:text-4xl text-3xl font-bold mb-6">
                    Discover Our Exclusive Features
                  </h2>
                  <p>
                    Unlock a world of possibilities with our powerful features.
                    See how TaskHorizon can transform your workflow and empower
                    you to achieve more.
                  </p>
                </div>
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 mt-14">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 32 32"
                    >
                      <path
                        d="M28.068 12h-.128a.934.934 0 0 1-.864-.6.924.924 0 0 1 .2-1.01l.091-.091a2.938 2.938 0 0 0 0-4.147l-1.511-1.51a2.935 2.935 0 0 0-4.146 0l-.091.091A.956.956 0 0 1 20 4.061v-.129A2.935 2.935 0 0 0 17.068 1h-2.136A2.935 2.935 0 0 0 12 3.932v.129a.956.956 0 0 1-1.614.668l-.086-.091a2.935 2.935 0 0 0-4.146 0l-1.516 1.51a2.938 2.938 0 0 0 0 4.147l.091.091a.935.935 0 0 1 .185 1.035.924.924 0 0 1-.854.579h-.128A2.935 2.935 0 0 0 1 14.932v2.136A2.935 2.935 0 0 0 3.932 20h.128a.934.934 0 0 1 .864.6.924.924 0 0 1-.2 1.01l-.091.091a2.938 2.938 0 0 0 0 4.147l1.51 1.509a2.934 2.934 0 0 0 4.147 0l.091-.091a.936.936 0 0 1 1.035-.185.922.922 0 0 1 .579.853v.129A2.935 2.935 0 0 0 14.932 31h2.136A2.935 2.935 0 0 0 20 28.068v-.129a.956.956 0 0 1 1.614-.668l.091.091a2.935 2.935 0 0 0 4.146 0l1.511-1.509a2.938 2.938 0 0 0 0-4.147l-.091-.091a.935.935 0 0 1-.185-1.035.924.924 0 0 1 .854-.58h.128A2.935 2.935 0 0 0 31 17.068v-2.136A2.935 2.935 0 0 0 28.068 12ZM29 17.068a.933.933 0 0 1-.932.932h-.128a2.956 2.956 0 0 0-2.083 5.028l.09.091a.934.934 0 0 1 0 1.319l-1.511 1.509a.932.932 0 0 1-1.318 0l-.09-.091A2.957 2.957 0 0 0 18 27.939v.129a.933.933 0 0 1-.932.932h-2.136a.933.933 0 0 1-.932-.932v-.129a2.951 2.951 0 0 0-5.028-2.082l-.091.091a.934.934 0 0 1-1.318 0l-1.51-1.509a.934.934 0 0 1 0-1.319l.091-.091A2.956 2.956 0 0 0 4.06 18h-.128A.933.933 0 0 1 3 17.068v-2.136A.933.933 0 0 1 3.932 14h.128a2.956 2.956 0 0 0 2.083-5.028l-.09-.091a.933.933 0 0 1 0-1.318l1.51-1.511a.932.932 0 0 1 1.318 0l.09.091A2.957 2.957 0 0 0 14 4.061v-.129A.933.933 0 0 1 14.932 3h2.136a.933.933 0 0 1 .932.932v.129a2.956 2.956 0 0 0 5.028 2.082l.091-.091a.932.932 0 0 1 1.318 0l1.51 1.511a.933.933 0 0 1 0 1.318l-.091.091A2.956 2.956 0 0 0 27.94 14h.128a.933.933 0 0 1 .932.932Z"
                        data-original="#000000"
                      />
                      <path
                        d="M16 9a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7Zm0 12a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"
                        data-original="#000000"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      Customization
                    </h3>
                    <p>
                      Make TaskHorizon work for you with custom task views,
                      smart notifications, and flexible workflows
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path d="M0 512h512V0H0Z" data-original="#000000" />
                        </clipPath>
                      </defs>
                      <g
                        fill="none"
                        className="stroke-yellow-600"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="40"
                        clipPath="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          d="M256 492 60 410.623v-98.925C60 183.674 137.469 68.38 256 20c118.53 48.38 196 163.674 196 291.698v98.925z"
                          data-original="#000000"
                        />
                        <path
                          d="M178 271.894 233.894 216 334 316.105"
                          data-original="#000000"
                        />
                      </g>
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Security</h3>
                    <p>
                      Stay protected with advanced security features that keep
                      your data safe at all times.
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 24 24"
                    >
                      <g fillRule="evenodd" clipRule="evenodd">
                        <path
                          d="M17.03 8.97a.75.75 0 0 1 0 1.06l-4.2 4.2a.75.75 0 0 1-1.154-.114l-1.093-1.639L8.03 15.03a.75.75 0 0 1-1.06-1.06l3.2-3.2a.75.75 0 0 1 1.154.114l1.093 1.639L15.97 8.97a.75.75 0 0 1 1.06 0z"
                          data-original="#000000"
                        />
                        <path
                          d="M13.75 9.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-1.25H14.5a.75.75 0 0 1-.75-.75z"
                          data-original="#000000"
                        />
                        <path
                          d="M3.095 3.095C4.429 1.76 6.426 1.25 9 1.25h6c2.574 0 4.57.51 5.905 1.845C22.24 4.429 22.75 6.426 22.75 9v6c0 2.574-.51 4.57-1.845 5.905C19.571 22.24 17.574 22.75 15 22.75H9c-2.574 0-4.57-.51-5.905-1.845C1.76 19.571 1.25 17.574 1.25 15V9c0-2.574.51-4.57 1.845-5.905zm1.06 1.06C3.24 5.071 2.75 6.574 2.75 9v6c0 2.426.49 3.93 1.405 4.845.916.915 2.419 1.405 4.845 1.405h6c2.426 0 3.93-.49 4.845-1.405.915-.916 1.405-2.419 1.405-4.845V9c0-2.426-.49-3.93-1.405-4.845C18.929 3.24 17.426 2.75 15 2.75H9c-2.426 0-3.93.49-4.845 1.405z"
                          data-original="#000000"
                        />
                      </g>
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      Lightning-Fast Performance
                    </h3>
                    <p>
                      Work without delays speed, efficiency, and smooth
                      navigation at your fingertips.
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 504.69 504.69"
                    >
                      <path
                        d="M252.343 262.673c-49.32 0-89.447-40.127-89.447-89.447s40.127-89.447 89.447-89.447 89.447 40.127 89.447 89.447-40.121 89.447-89.447 89.447zm0-158.235c-37.926 0-68.787 30.861-68.787 68.787s30.861 68.787 68.787 68.787 68.787-30.861 68.787-68.787-30.855-68.787-68.787-68.787z"
                        data-original="#000000"
                      />
                      <path
                        d="M391.787 405.309c-5.645 0-10.253-4.54-10.325-10.201-.883-70.306-58.819-127.503-129.15-127.503-49.264 0-93.543 27.405-115.561 71.52-8.724 17.473-13.269 36.31-13.517 55.988-.072 5.702-4.757 10.273-10.459 10.201s-10.273-4.757-10.201-10.459c.289-22.814 5.568-44.667 15.691-64.955 25.541-51.164 76.907-82.95 134.047-82.95 81.581 0 148.788 66.349 149.81 147.905.072 5.702-4.494 10.392-10.201 10.459-.046-.005-.087-.005-.134-.005z"
                        data-original="#000000"
                      />
                      <path
                        d="M252.343 463.751c-116.569 0-211.408-94.834-211.408-211.408 0-116.569 94.839-211.408 211.408-211.408 116.574 0 211.408 94.839 211.408 211.408 0 116.574-94.834 211.408-211.408 211.408zm0-402.156c-105.18 0-190.748 85.568-190.748 190.748s85.568 190.748 190.748 190.748 190.748-85.568 190.748-190.748S357.523 61.595 252.343 61.595zM71.827 90.07 14.356 32.599c-4.034-4.034-4.034-10.573 0-14.607 4.029-4.034 10.573-4.034 14.607 0l57.466 57.471c4.034 4.034 3.951 10.49 0 14.607-3.792 3.951-11.039 3.698-14.602 0z"
                        data-original="#000000"
                      />
                      <path
                        d="M14.717 92.254a10.332 10.332 0 0 1-10.299-9.653L.023 15.751a10.317 10.317 0 0 1 2.929-7.908 10.2 10.2 0 0 1 7.851-3.089L77.56 7.796c5.697.258 10.108 5.093 9.85 10.79s-5.041 10.154-10.79 9.85l-55.224-2.521 3.641 55.327c.377 5.692-3.936 10.614-9.628 10.986a7.745 7.745 0 0 1-.692.026zm403.541-2.184c-4.256-3.796-4.034-10.573 0-14.607l58.116-58.116c4.034-4.034 10.573-4.034 14.607 0s4.034 10.573 0 14.607L432.864 90.07c-4.085 3.951-9.338 4.7-14.606 0z"
                        data-original="#000000"
                      />
                      <path
                        d="M489.974 92.254a9.85 9.85 0 0 1-.687-.021c-5.697-.372-10.01-5.294-9.633-10.986l3.641-55.327-55.224 2.515c-5.511.238-10.526-4.147-10.79-9.85-.258-5.702 4.153-10.531 9.85-10.79l66.757-3.042c2.934-.134 5.79.992 7.851 3.089s3.12 4.974 2.929 7.908l-4.401 66.85c-.361 5.465-4.896 9.654-10.293 9.654zM11.711 489.339c-3.791-4.266-4.034-10.573 0-14.607l60.115-60.11c4.029-4.034 10.578-4.034 14.607 0 4.034 4.034 4.034 10.573 0 14.607l-60.115 60.11c-3.827 3.884-11.156 3.884-14.607 0z"
                        data-original="#000000"
                      />
                      <path
                        d="M10.327 499.947a10.33 10.33 0 0 1-7.376-3.104 10.312 10.312 0 0 1-2.929-7.902l4.401-66.85c.372-5.697 5.191-10.036 10.986-9.633 5.692.377 10.005 5.294 9.628 10.986l-3.641 55.332 55.224-2.515c5.645-.191 10.531 4.153 10.79 9.85.258 5.697-4.153 10.526-9.85 10.79l-66.763 3.037c-.155.004-.31.009-.47.009zm465.639-13.01-57.708-57.708c-4.034-4.034-4.034-10.573 0-14.607s10.573-4.034 14.607 0l57.708 57.708c4.034 4.034 3.962 10.5 0 14.607-3.817 3.951-10.062 3.951-14.607 0z"
                        data-original="#000000"
                      />
                      <path
                        d="M494.359 499.947c-.155 0-.315-.005-.47-.01l-66.757-3.042c-5.702-.263-10.108-5.088-9.85-10.79.263-5.702 5.113-9.984 10.79-9.85l55.219 2.515-3.641-55.332c-.372-5.692 3.941-10.609 9.633-10.986 5.625-.398 10.609 3.946 10.986 9.633l4.401 66.85a10.33 10.33 0 0 1-2.929 7.902 10.323 10.323 0 0 1-7.382 3.11z"
                        data-original="#000000"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      Work From Anywhere
                    </h3>
                    <p>
                      Stay productive no matter where you are with easy access
                      across all your devices.
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 512 512"
                    >
                      <path
                        d="M30 256C30 131.383 131.383 30 256 30c46.867 0 91.563 14.211 129.196 40.587h-29.074c-8.284 0-15 6.716-15 15s6.716 15 15 15h70.292c8.284 0 15-6.716 15-15V15.295c0-8.284-6.716-15-15-15s-15 6.716-15 15v37.339C366.987 18.499 312.91 0 256 0 187.62 0 123.333 26.629 74.98 74.98 26.629 123.333 0 187.62 0 256c0 44.921 11.871 89.182 34.33 127.998 2.78 4.806 7.818 7.49 12.997 7.49 2.55 0 5.134-.651 7.499-2.019 7.17-4.149 9.619-13.325 5.471-20.496C40.477 334.718 30 295.652 30 256zm447.67-127.998c-4.15-7.171-13.328-9.619-20.496-5.47-7.17 4.149-9.619 13.325-5.471 20.496C471.523 177.281 482 216.346 482 256c0 124.617-101.383 226-226 226-46.863 0-91.551-14.215-129.18-40.587h29.058c8.284 0 15-6.716 15-15s-6.716-15-15-15H85.587c-8.284 0-15 6.716-15 15v70.292c0 8.284 6.716 15 15 15s15-6.716 15-15v-37.376C145.013 493.475 199.083 512 256 512c68.38 0 132.667-26.629 181.02-74.98C485.371 388.667 512 324.38 512 256c0-44.923-11.871-89.184-34.33-127.998z"
                        data-original="#000000"
                      />
                      <path
                        d="M384.413 217.203a14.994 14.994 0 0 0-1.499-11.382l-20-34.641c-4.142-7.174-13.315-9.632-20.49-5.49l-13.602 7.853a108.886 108.886 0 0 0-37.821-21.856V136c0-8.284-6.716-15-15-15h-40c-8.284 0-15 6.716-15 15v15.686a108.89 108.89 0 0 0-37.822 21.856l-13.601-7.853c-7.174-4.144-16.349-1.685-20.49 5.49l-20 34.641c-4.142 7.174-1.684 16.348 5.49 20.49l13.598 7.851c-1.446 7.163-2.176 14.47-2.176 21.838s.729 14.676 2.176 21.838l-13.598 7.851c-7.174 4.142-9.632 13.316-5.49 20.49l20 34.641c4.142 7.175 13.315 9.633 20.49 5.49l13.601-7.853a108.865 108.865 0 0 0 37.822 21.856V376c0 8.284 6.716 15 15 15h40c8.284 0 15-6.716 15-15v-15.686a108.886 108.886 0 0 0 37.821-21.856l13.602 7.853c7.174 4.142 16.348 1.683 20.49-5.49l20-34.641a15.003 15.003 0 0 0 1.499-11.382 14.994 14.994 0 0 0-6.989-9.108l-13.599-7.852C365.271 270.676 366 263.369 366 256s-.729-14.676-2.175-21.838l13.599-7.852a14.995 14.995 0 0 0 6.989-9.107zM256 296c-22.091 0-40-17.909-40-40s17.909-40 40-40 40 17.909 40 40-17.909 40-40 40z"
                        data-original="#000000"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      Smart Integrations
                    </h3>
                    <p>
                      Connect your favorite tools and create a workflow that
                      works for you.
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 fill-yellow-600 mb-4 inline-block"
                      viewBox="0 0 32 32"
                    >
                      <path
                        d="M29 0H3C1.346 0 0 1.346 0 3v12.35a1 1 0 1 0 2 0V3c0-.552.449-1 1-1h26c.551 0 1 .448 1 1v26c0 .552-.449 1-1 1H16.65a1 1 0 1 0 0 2H29c1.654 0 3-1.346 3-3V3c0-1.654-1.346-3-3-3z"
                        data-original="#000000"
                      />
                      <path
                        d="M11 18H3c-1.654 0-3 1.346-3 3v8c0 1.654 1.346 3 3 3h8c1.654 0 3-1.346 3-3v-8c0-1.654-1.346-3-3-3zm1 11c0 .552-.449 1-1 1H3c-.551 0-1-.448-1-1v-8c0-.552.449-1 1-1h8c.551 0 1 .448 1 1zm4.707-12.293L23 10.414V12a1 1 0 1 0 2 0V8c0-.536-.456-1-1-1h-4a1 1 0 1 0 0 2h1.586l-6.293 6.293a1 1 0 0 0 0 1.414c.378.378 1.024.39 1.414 0z"
                        data-original="#000000"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">
                      Built to Scale
                    </h3>
                    <p>
                      From solo projects to large teams, TaskHorizon grows with
                      you.
                    </p>
                    <Link
                      to="javascript:void(0);"
                      className="text-yellow-600 font-semibold inline-block mt-2 hover:underline"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div id="resources" className="mt-28">
              <div className="md:text-center max-w-2xl mx-auto">
                <h2 className="md:text-4xl text-3xl font-bold mb-6">
                  Explore Our Unique Offerings
                </h2>
                <p>
                  Discover a range of exclusive features designed to elevate
                  your experience. Learn how our distinct offerings can redefine
                  your journey and empower you to accomplish more.
                </p>
              </div>
              <div className="mt-14">
                <div className="grid md:grid-cols-2 items-center gap-16">
                  <div>
                    <img
                      src="https://media.istockphoto.com/id/1400074029/vector/user-interface-customization-programming-concept-of-creating-setting-personal-pages-and.jpg?s=612x612&w=0&k=20&c=gtc_M3IvgvaUzRU3G156NphR98HeQ4vlIFodu7JgDC0="
                      className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                    />
                  </div>
                  <div className="max-w-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      🚀 Tailored Customization
                    </h3>
                    <p>
                      Experience unparalleled customization options tailored to
                      suit your unique needs. Our platform provides a wide array
                      of features, ensuring you have the flexibility to
                      personalize your journey.
                    </p>
                    <button
                      type="button"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                  <div className="max-md:order-1 max-w-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      💬 Seamless Collaboration
                    </h3>
                    <p>
                      Stay connected with real-time updates, effortless task
                      assignments, and smooth communication helping teams work
                      together efficiently.
                    </p>
                    <button
                      type="button"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                  <div>
                    <img
                      src="https://img.freepik.com/free-vector/illustration-brainstorming-teamwork_53876-18390.jpg?semt=ais_hybrid"
                      className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-14">
                <div className="grid md:grid-cols-2 items-center gap-16">
                  <div>
                    <img
                      src="https://readymadeui.com/image-1.webp"
                      className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                    />
                  </div>
                  <div className="max-w-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      📈 Actionable Insights
                    </h3>
                    <p>
                      Experience unparalleled customization with flexible task
                      views, smart filters, and personalized notifications
                      designed to adapt to your workflow..
                    </p>
                    <button
                      type="button"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                  <div className="max-md:order-1 max-w-lg">
                    <h3 className="text-xl font-semibold mb-4">
                      🔐Advanced Security
                    </h3>
                    <p>
                      Your data is always protected with cutting-edge security
                      features, ensuring privacy, encrypted access, and seamless
                      authentication.
                    </p>
                    <button
                      type="button"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-5 py-2.5 mt-8 transition-all"
                    >
                      Learn More
                    </button>
                  </div>
                  <div>
                    <img
                      src="https://readymadeui.com/contact.webp"
                      className="w-full object-contain rounded-md shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="stats" className="mt-28">
              <h2 className="md:text-4xl text-3xl font-bold text-center mb-14">
                Application Metrics
              </h2>
              <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6 max-lg:gap-12">
                <div className="text-center">
                  <h3 className="text-4xl font-semibold">
                    5.4<span className="text-yellow-600">M+</span>
                  </h3>
                  <p className="text-base font-semibold mt-4">Total Users</p>
                  <p className="mt-2">
                    The total number of registered users on the platform.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-semibold">
                    $80<span className="text-yellow-600">K</span>
                  </h3>
                  <p className="text-base font-semibold mt-4">Revenue</p>
                  <p className="mt-2">
                    The total revenue generated by the application.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-semibold">
                    100<span className="text-yellow-600">K</span>
                  </h3>
                  <p className="text-base font-semibold mt-4">Engagement</p>
                  <p className="mt-2">
                    The level of user engagement with the application's content
                    and features.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-semibold">
                    99.9<span className="text-yellow-600">%</span>
                  </h3>
                  <p className="text-base font-semibold mt-4">Server Uptime</p>
                  <p className="mt-2">
                    The percentage of time the server has been operational and
                    available.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="faq"
              className="mt-28 bg-gray-50 px-4 sm:px-10 py-12 space-y-6"
            >
              <div className="md:text-center max-w-2xl mx-auto mb-14">
                <h2 className="md:text-4xl text-3xl font-bold mb-6">
                  Frequently Asked Questions
                </h2>
                <p>
                  Explore common questions and find answers to help you make the
                  most out of our services. If you don't see your question here,
                  feel free to contact us for assistance.
                </p>
              </div>
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  index={index}
                  isOpen={selectedIndex === index}
                  setActiveIndex={() => handleSelect(index)}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
        </div>

        <footer className="bg-gray-50 px-4 sm:px-10 py-12 mt-28">
          <div className="md:max-w-[50%] mx-auto text-center">
            <form onSubmit={handleSubmit}>
              <div className="bg-[#fff] border flex px-2 py-1 rounded-full text-left mt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent pl-4"
                  value={userData.email}
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-5 py-2.5 transition-all"
                >
                  Subscribe
                </button>
              </div>
              {error && (
                <>
                  <p className="bg-transparent flex px-2 py-1 justify-center text-red-500 rounded-full text-center mt-4">
                    <span>{error}</span>
                  </p>
                </>
              )}
            </form>
          </div>
          <div className="grid max-sm:grid-cols-1 max-xl:grid-cols-2 xl:grid-cols-5 gap-8 border-t border-gray-300 mt-10 pt-8">
            <div className="xl:col-span-2">
              <Link to="hero">
                <img src="/logo/logo.png" alt="TaskHorizon" className="w-36" />
              </Link>
              <p className="mb-2">
                Stay organized, collaborate effortlessly, and achieve more.
                Simplify your workflow and take control of your tasks today!
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Services</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Task Management
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Project Collaboration
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Productivity Insights
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Workflow Automation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-6">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    User Guides
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Blog & Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">About Us</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Mission & Values
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    Meet the Team
                  </Link>
                </li>
                <li>
                  <Link
                    to="javascript:void(0)"
                    className="hover:text-yellow-600"
                  >
                    User Testimonials
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-10">
            © {year}
            <Linky to="/" target="_blank" className="hover:underline mx-1">
              TaskHorizon
            </Linky>
            All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
