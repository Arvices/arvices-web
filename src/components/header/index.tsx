import React, { useState } from "react";
import arvicesLogo from "../../assets/logo.svg";
import Hamburger from "hamburger-react";
import Overlay from "../overlay";
import { Link } from "react-router-dom";
import "./style.css";
import { useAuth } from "../../contexts/AuthContext";
import { Collapse } from "antd";
const { Panel } = Collapse;
import {
  ArrowUpRight,
  Bell,
  ChevronDown,
  Heart,
  MessageSquare,
  User,
  Briefcase,
  Clipboard,
  MessageCircle,
  Loader,
  CheckCircle,
  Users,
  Clock,
  Sun,
  UserCheck,
  CreditCard,
  FileText,
  LogOut,
  BarChart2,
} from "feather-icons-react";
import { Dropdown, Menu } from "antd";

let color = "#272727";

const Header: React.FC = () => {
  const auth = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  const JobsMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link to={""} className="w-[200px]">
              Manage Your Jobs
            </Link>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "2",
          label: (
            <Link to={"/provider/open-offers"}>
              <Clipboard size={16} className="inline mr-2" />
              Open Offers
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                3
              </span>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link to={"/provider/ongoing-negotiations"}>
              <MessageCircle size={16} className="inline mr-2" />
              Ongoing Negotiation
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                2
              </span>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to={"/provider/ongoing-jobs"}>
              <Loader size={16} className="inline mr-2" />
              Ongoing Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                1
              </span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to={"/provider/completed-jobs"}>
              <CheckCircle size={16} className="inline mr-2" />
              Completed Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                10
              </span>
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "6",
          label: (
            <span className="mb-3 inline-block">
              Customize Job Alert
              <ArrowUpRight className="inline ml-2" size={18} />
            </span>
          ),
        },
      ]}
    />
  );

  const HireSomeoneMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link to={"/"} className="w-[200px]">
              Hire Someone
            </Link>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "2",
          label: (
            <Link to={"/client/open-jobs"}>
              <Briefcase size={16} className="inline mr-2" />
              Open Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                3
              </span>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link to={"/client/pending-offers"}>
              <Clock size={16} className="inline mr-2" />
              Pending Offers
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                2
              </span>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to={"/client/ongoing-jobs"}>
              <Loader size={16} className="inline mr-2" />
              Ongoing Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                1
              </span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to={"/client-completed-jobs"}>
              <CheckCircle size={16} className="inline mr-2" />
              Completed Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                10
              </span>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link to={"/client/previous-hires"}>
              <Users size={16} className="inline mr-2" />
              Previous Hires
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                10
              </span>
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "7",
          label: (
            <Link
              className="mb-3 inline-block"
              to={"/client/favourite-service-providers"}
            >
              <Heart className="inline mr-2" size={18} />
              Favourite Service Providers
              <span className="rounded px-1 bg-gray-100 inline-block ml-2">
                10
              </span>
            </Link>
          ),
        },
      ]}
    />
  );

  const AccountMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div className="flex items-center gap-4 p-3 w-max">
              <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-700 bg-white">
                <User className="text-gray-700" size={32} />
              </div>
              <div>
                <h6 className="text-base font-semibold text-gray-900">
                  {auth.user?.fullName}
                </h6>
                <small className="text-sm text-gray-500">
                  {auth.user?.type}
                </small>
              </div>
            </div>
          ),
        },
        { type: "divider" },
        {
          key: "2",
          label: (
            <Link to="/myprofile" className="flex items-center gap-2">
              <UserCheck size={16} /> Profile
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                3
              </span>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link to="/" className="flex items-center gap-2">
              <Sun size={16} /> Customize
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                2
              </span>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to="/wallet" className="flex items-center gap-2">
              <CreditCard size={16} /> Wallet
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                1
              </span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to="/transaction-history" className="flex items-center gap-2">
              <FileText size={16} /> Transactions
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                10
              </span>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link to="/" className="flex items-center gap-2">
              <BarChart2 size={16} /> Reports
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                10
              </span>
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "7",
          label: (
            <Link
              onClick={auth.logout}
              to="/"
              className="flex items-center gap-2 text-red-500"
            >
              <LogOut size={16} /> Logout
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <header className="border-b border-gray-200 w-full fixed top-0 z-[100] bg-white dark:bg-zinc-900 px-5 sm:px-8 lg:px-10 xl:px-25 max-w-[1280px] mx-auto">
      <div className="flex items-center h-14">
        {/**Logo Container */}
        <div className="w-max">
          <Link to={"/"}>
            <img
              src={arvicesLogo}
              className="w-8 h-8 inline-block mr-1"
              alt="Arvices Logo"
              title="Arvices Logo"
            />
            <h1 className="inline relative top-0.5 text-[18px] font-semibold tracking-tighter primary-gradient-text dark:text-white">
              Arvices
              <span className="sr-only"> - Your Everyday Help Platform</span>
            </h1>
          </Link>
        </div>

        <div className="hidden md:block w-max ml-10 relative top-0.5 font-medium tracking-tight">
          {!auth.isAuthenticated && (
            <ul>
              <li className="inline-block px-2">
                <Link to={"/"}>Home</Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Link to={"/service-providers"}>
                  Browse Service Providers
                </Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Link to={"/activities"}>What's New</Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Link to={"/help-center"}>Help Center</Link>{" "}
              </li>
            </ul>
          )}

          {auth.isAuthenticated && auth.isClient && (
            <ul>
              <li className="inline-block px-2">
                <Link to={"/service-providers"}>
                  Browse Service Providers
                </Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Dropdown
                  overlay={HireSomeoneMenu}
                  overlayClassName="p-4"
                  className="cursor-pointer"
                  placement="bottom"
                  arrow
                >
                  <span className="font-medium border-none">
                    Manage Jobs <ChevronDown size={18} className="inline" />
                  </span>
                </Dropdown>
              </li>
              <li className="inline-block px-2">
                <Link to={"/client/new-job"}>Post Job</Link>{" "}
              </li>

              <li className="inline-block px-2">
                <Link to={"/activities"}>What's New</Link>{" "}
              </li>
            </ul>
          )}

          {auth.isAuthenticated && auth.isProvider && (
            <ul>
              <li className="inline-block px-2">
                <Link to={"/job-posting"}>Find Jobs</Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Dropdown
                  overlay={JobsMenu}
                  overlayClassName="p-4"
                  className="cursor-pointer"
                  placement="bottom"
                  arrow
                >
                  <span className="font-medium border-none">
                    My Jobs <ChevronDown size={18} className="inline" />
                  </span>
                </Dropdown>
              </li>
              <li className="inline-block px-2">
                <Link to={"/post-showcase"}>Post Update</Link>{" "}
              </li>
              <li className="inline-block px-2">
                <Link to={"/activities"}>What's New</Link>{" "}
              </li>
            </ul>
          )}
        </div>
        <div className="flex-1" />
        {auth.isAuthenticated && (
          <ul>
            <li className="inline-block ml-4">
              <Link to={"/notifications"}>
                <span className="h-7 w-7 flex items-center justify-center rounded-3xl">
                  <Bell className="inline" size={18} />
                </span>
              </Link>
            </li>
            <li className="inline-block ml-4">
              <Link to={"/messaging/conversations"}>
                <span className="h-7 w-7 flex items-center justify-center rounded-3xl">
                  <MessageSquare className="inline" size={18} />
                </span>
              </Link>
            </li>

            <li className="md:inline-block ml-4 hidden">
              {" "}
              <Dropdown
                overlay={AccountMenu}
                overlayClassName="p-4"
                className="cursor-pointer"
                placement="bottomRight"
                arrow
              >
                <span className="h-7 w-7 flex items-center justify-center rounded-3xl border">
                  <User className="inline" size={20} />
                </span>
              </Dropdown>
            </li>
          </ul>
        )}
        {!auth.isAuthenticated && (
          <div className="hidden md:block w-max">
            <div className="flex items-center gap-x-3">
              <div>
                <Link to={"/login"}>
                  <button className="cursor-pointer">Login</button>
                </Link>
              </div>
              <div>
                <Link to={"/signup"}>
                  <button className="py-2 px-5 rounded-4xl bg-royalblue-main text-white cursor-pointer">
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="w-max md:hidden">
          <Hamburger
            toggled={mobileOpen}
            size={18}
            toggle={toggleMobileOpen}
            color={color}
          />
          <Overlay isOpen={mobileOpen} toggle={toggleMobileOpen}>
            {auth.isAuthenticated ? (
              <div className="py-3"></div>
            ) : (
              <div className="py-12"></div>
            )}

            <div className="p-4">
              {auth.isAuthenticated && (
                <ul className=" text-gray-700 space-y-3">
                  {/* User Info */}
                  <li className="flex items-center gap-4 p-3">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-700 bg-white">
                      <User className="text-gray-700" size={32} />
                    </div>
                    <div>
                      <h6 className="text-base font-semibold text-gray-900">
                        {auth.user?.fullName}
                      </h6>
                      <small className="text-sm text-gray-500">
                        {auth.user?.type}
                      </small>
                    </div>
                  </li>
                  <div className="my-2 border-t border-gray-500" />
                </ul>
              )}

              {auth.isAuthenticated && auth.isClient && (
                <ul className=" text-gray-700 space-y-3">
                  {/* Account Actions */}
                  <li className="mb-5 mt-5">
                    <Link
                      to="/service-providers"
                      className="flex items-center gap-2"
                    >
                      <UserCheck size={16} /> Browse Service Providers
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        3
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Collapse ghost expandIconPosition="end">
                      <Panel
                        key="manage-jobs"
                        header={
                          <div className="flex text-[16px] items-center gap-2 w-full">
                            <Sun size={16} />
                            Manage Jobs
                            <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                              2
                            </span>
                          </div>
                        }
                      >
                        <ul className="text-sm text-gray-700 space-y-3">
                          <li>
                            <Link
                              to="/open-offers"
                              className="flex items-center gap-2"
                            >
                              <Clipboard size={14} /> Open Offers
                              <span className="ml-auto rounded px-1 bg-gray-100">
                                3
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/negotiation"
                              className="flex items-center gap-2"
                            >
                              <MessageCircle size={14} /> Ongoing Negotiation
                              <span className="ml-auto rounded px-1 bg-gray-100">
                                2
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/ongoing-jobs"
                              className="flex items-center gap-2"
                            >
                              <Loader size={14} /> Ongoing Jobs
                              <span className="ml-auto rounded px-1 bg-gray-100">
                                1
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/completed-jobs"
                              className="flex items-center gap-2"
                            >
                              <CheckCircle size={14} /> Completed Jobs
                              <span className="ml-auto rounded px-1 bg-gray-100">
                                10
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </Panel>
                    </Collapse>
                  </li>

                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <CreditCard size={16} /> Post A Job
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        1
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <FileText size={16} /> What's new
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        10
                      </span>
                    </Link>
                  </li>
                  <hr className="my-2" />
                </ul>
              )}

              {auth.isAuthenticated && auth.isProvider && (
                <ul className=" text-gray-700 space-y-3">
                  {/* Account Actions */}
                  <li className="mb-5 mt-5">
                    <Link to="/" className="flex items-center gap-2">
                      <UserCheck size={16} /> Find Jobs
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        3
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Collapse ghost expandIconPosition="end">
                      <Panel
                        header={
                          <div className="flex text-[16px] items-center gap-y-2">
                            <Sun size={16} className="inline mr-2" /> My Jobs
                            <span className="rounded bg-gray-100 inline-block ml-auto">
                              2
                            </span>
                          </div>
                        }
                        key="my-jobs"
                      >
                        <ul className="text-sm text-gray-700 ">
                          <li className="py-2">
                            <Link
                              to="/open-offers"
                              className="flex items-center gap-2"
                            >
                              <Clipboard size={14} /> Open Offers
                            </Link>
                          </li>
                          <li className="py-2">
                            <Link
                              to="/negotiations"
                              className="flex items-center gap-2"
                            >
                              <MessageCircle size={14} /> Ongoing Negotiation
                            </Link>
                          </li>
                          <li className="py-2">
                            <Link
                              to="/ongoing-jobs"
                              className="flex items-center gap-2"
                            >
                              <Loader size={14} /> Ongoing Jobs
                            </Link>
                          </li>
                          <li className="py-2">
                            <Link
                              to="/completed-jobs"
                              className="flex items-center gap-2"
                            >
                              <CheckCircle size={14} /> Completed Jobs
                            </Link>
                          </li>
                        </ul>
                      </Panel>
                    </Collapse>
                  </li>

                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <CreditCard size={16} /> Post An Update
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        1
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <FileText size={16} /> Whats New
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        10
                      </span>
                    </Link>
                  </li>

                  <hr className="my-2" />
                </ul>
              )}

              {auth.isAuthenticated && (
                <ul className=" text-gray-700 space-y-3">
                  {/* Account Actions */}
                  <li className="mb-5 mt-5">
                    <Link to="/" className="flex items-center gap-2">
                      <UserCheck size={16} /> Profile
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        3
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <Sun size={16} /> Customize
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        2
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <CreditCard size={16} /> Wallet
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        1
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <FileText size={16} /> Transactions
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        10
                      </span>
                    </Link>
                  </li>
                  <li className="mb-5">
                    <Link to="/" className="flex items-center gap-2">
                      <BarChart2 size={16} /> Reports
                      <span className="rounded px-1 bg-gray-100 inline-block ml-auto">
                        10
                      </span>
                    </Link>
                  </li>
                </ul>
              )}

              {auth.isAuthenticated && (
                <ul className="text-sm text-gray-700 space-y-3">
                  <hr className="my-2 " />

                  {/* Logout */}
                  <li className="mt-10">
                    <Link
                      onClick={auth.logout}
                      to="/"
                      className="flex items-center gap-2 text-red-500"
                    >
                      <LogOut size={16} /> Logout
                    </Link>
                  </li>
                </ul>
              )}

              {!auth.isAuthenticated && (
                <ul>
                  <li className="mb-8 text-gray-700">
                    <Link onClick={toggleMobileOpen} to={"/"}>
                      Home
                    </Link>
                  </li>

                  <li className="mb-8 text-gray-700">
                    <Link onClick={toggleMobileOpen} to={"/activities"}>
                      Activities
                    </Link>
                  </li>

                  <li className="mb-8 text-gray-700">
                    <Link onClick={toggleMobileOpen} to={"/service-providers"}>
                      Browse Service Providers
                    </Link>{" "}
                  </li>

                  <li className="mb-8 text-gray-700">
                    <Link onClick={toggleMobileOpen} to={"/help-center"}>
                      Help Center
                    </Link>
                  </li>
                </ul>
              )}

              {!auth.isAuthenticated && (
                <div>
                  <div className="py-4"></div>
                  <div className="mb-4 p-[1px] rounded bg-gradient-to-r from-[#0026BD] to-[#FF4489]">
                    <Link to={"/login"} onClick={toggleMobileOpen}>
                      <button className="bg-white login-btn block w-full p-3 rounded font-medium">
                        <span className="primary-gradient-text">Login</span>
                      </button>
                    </Link>
                  </div>

                  <div>
                    <Link onClick={toggleMobileOpen} to={"/signup"}>
                      <button className=" block border w-full p-3 rounded primary-gradient-bg text-white font-medium">
                        Get Started
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Overlay>
        </div>
      </div>
    </header>
  );
};

export default Header;
