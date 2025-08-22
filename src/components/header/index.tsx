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
  Sun,
  UserCheck,
  CreditCard,
  FileText,
  LogOut,
} from "feather-icons-react";
import { Dropdown, Menu } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Wallet } from "lucide-react";

let color = "#272727";

const Header: React.FC = () => {
  const auth = useAuth();

  const notifications = useSelector(
    (state: RootState) => state.notification.notifications,
  );

  const conversations = useSelector(
    (state: RootState) => state.message.conversations,
  );

  const unreadCount = (() => {
    const count = notifications.filter((n) => !n.read).length;
    return count > 10 ? "10+" : count.toString();
  })();

  const msgUnreadCount = ((): number => {
    return conversations.reduce((total, conv) => {
      return total + (conv.unreadCount || 0);
    }, 0);
  })();

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  {
    /* Provider context menu */
  }

  const JobsMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link to={"/provider/manage-jobs"} className="w-[200px]">
              Manage Your Jobs
            </Link>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "2",
          label: (
            <Link to={"/provider/manage-jobs#Pending"}>
              <Clipboard size={16} className="inline mr-2" />
              Pending Offers
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link to={"/provider/manage-jobs#Negotiating"}>
              <MessageCircle size={16} className="inline mr-2" />
              Ongoing Negotiation
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to={"/provider/manage-jobs#Ongoing"}>
              <Loader size={16} className="inline mr-2" />
              Ongoing Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to={"/provider/manage-jobs#Completed"}>
              <CheckCircle size={16} className="inline mr-2" />
              Completed Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        { type: "divider" },
        {
          key: "6",
          label: (
            <span className="mb-3 inline-block !hidden">
              Customize Job Alert
              <ArrowUpRight className="inline ml-2" size={18} />
            </span>
          ),
        },
      ]}
    />
  );

  {
    /* Client context menu */
  }
  const HireSomeoneMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <Link to={"/service-providers"} className="w-[200px]">
              Hire Someone
            </Link>
          ),
          disabled: true,
        },
        { type: "divider" },
        {
          key: "2",
          label: (
            <Link to={"/client/manage-jobs#Open"}>
              <Briefcase size={16} className="inline mr-2" />
              Open Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "3",
          label: (
            <Link to={"/client/manage-jobs#Negotiating"}>
              <MessageCircle size={16} className="inline mr-2" />
              Ongoing Negotiation
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "4",
          label: (
            <Link to={"/client/manage-jobs#Ongoing"}>
              <Loader size={16} className="inline mr-2" />
              Ongoing Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to={"/client/manage-jobs#Completed"}>
              <CheckCircle size={16} className="inline mr-2" />
              Completed Jobs
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <span>
              <Users size={16} className="inline mr-2" />
              Previous Hires
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </span>
          ),
        },
        { type: "divider" },
        {
          key: "7",
          label: (
            <span className="mb-3 inline-block !hidden">
              <Heart className="inline mr-2" size={18} />
              Favourite Service Providers
              <span className="rounded px-1 bg-gray-100 inline-block ml-2"></span>
            </span>
          ),
        },
      ]}
    />
  );

  {
    /* Account Context Menu */
  }

  const AccountMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <div className="flex items-center gap-4 p-3 w-max">
              <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-700 bg-white">
                <span className="h-16 w-16 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 bg-neutral-100">
                  {auth?.user?.picture ? (
                    <img
                      src={auth.user.picture}
                      alt="User avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="text-neutral-500" size={18} />
                  )}
                </span>
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
            <Link
              to={auth.isClient ? "/profile/edit" : "/myprofile"}
              className="flex items-center gap-2"
            >
              <UserCheck size={16} /> Profile
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
            </Link>
          ),
        },

        {
          key: "4",
          label: (
            <Link to="/wallet" className="flex items-center gap-2">
              <CreditCard size={16} /> Wallet
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
            </Link>
          ),
        },
        {
          key: "5",
          label: (
            <Link to="/transaction-history" className="flex items-center gap-2">
              <FileText size={16} /> Transactions
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
            </Link>
          ),
        },
        {
          key: "6",
          label: (
            <Link to="/bookings" className="flex items-center gap-2">
              <Clipboard size={16} /> Bookings & Orders
              <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
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
    <header className="border-b border-gray-200 w-full fixed top-0 z-[100] bg-white px-5 sm:px-8 lg:px-10 xl:px-25 ">
      <section className="max-w-[1280px] mx-auto">
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
          <div className="flex-1" />

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
                  <Link to={"/post-showcase"}>Post Showcase</Link>{" "}
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
                <Link to={"/notifications"} className="relative">
                  <span className="h-7 w-7 flex items-center justify-center rounded-3xl">
                    <Bell className="inline" size={18} />
                  </span>
                  {parseInt(unreadCount) > 0 && (
                    <span
                      className="absolute top-[-6px] right-[-3px] bg-gradient-main rounded-2xl 
             text-[10px] font-light text-white w-5 h-5
             flex items-center justify-center leading-0"
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="inline-block ml-4">
                <Link to={"/messaging/conversations"} className="relative">
                  <span className="h-7 w-7 flex items-center justify-center rounded-3xl">
                    <MessageSquare className="inline" size={18} />
                  </span>

                  {msgUnreadCount > 0 && (
                    <span
                      className="absolute top-[-6px] right-[-3px] bg-gradient-main rounded-2xl 
             text-[10px] font-light text-white w-5 h-5
             flex items-center justify-center leading-0"
                    >
                      {msgUnreadCount}
                    </span>
                  )}
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
                  <div className="flex item-center gap-2">
                    <span className="h-7 w-7 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 bg-neutral-100">
                      {auth?.user?.picture ? (
                        <img
                          src={auth.user.picture}
                          alt="User avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-neutral-500" size={18} />
                      )}
                    </span>{" "}
                    <span className="text-[14px] font-medium tracking-tight leading-7 text-royalblue-shade3">
                      Menu
                    </span>
                  </div>
                </Dropdown>
              </li>
            </ul>
          )}

          {!auth.isAuthenticated && (
            <div className="hidden md:block w-max">
              <div className="flex items-center gap-x-3">
                <div>
                  <Link to={"/login"}>
                    <button className="cursor-pointer font-medium tracking-tight">
                      Login
                    </button>
                  </Link>
                </div>
                <div>
                  <Link to={"/signup"}>
                    <button className="py-2 px-5 rounded-[8px] bg-gray-900 text-white cursor-pointer">
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
                      <div className="w-16 h-16 flex items-center justify-center rounded-full border border-gray-200 bg-white">
                        <span className="h-16 w-16 flex items-center justify-center rounded-full overflow-hidden border border-gray-200 bg-neutral-100">
                          {auth?.user?.picture ? (
                            <img
                              src={auth.user.picture}
                              alt="User avatar"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="text-neutral-500" size={18} />
                          )}
                        </span>
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
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
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
                              <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                            </div>
                          }
                        >
                          <ul className="space-y-1">
                            <li
                              onClick={toggleMobileOpen}
                              className="font-medium text-gray-900 py-2 text-sm rounded-md mb-2 w-full"
                            >
                              <Link to={"/service-providers"} className="block">
                                Hire Someone
                              </Link>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-2"></li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/client/manage-jobs#Open"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <Briefcase size={16} className="inline mr-2" />
                                Open Jobs
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/client/manage-jobs#Negotiating"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <MessageCircle
                                  size={16}
                                  className="inline mr-2"
                                />
                                Ongoing Negotiation
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/client/manage-jobs#Ongoing"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <Loader size={16} className="inline mr-2" />
                                Ongoing Jobs
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/client/manage-jobs#Completed"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <CheckCircle
                                  size={16}
                                  className="inline mr-2"
                                />
                                Completed Jobs
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <span className=" !hidden flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md">
                                <Users size={16} className="inline mr-2" />
                                Previous Hires
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </span>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-2"></li>
                            <li onClick={toggleMobileOpen}>
                              <span className=" !hidden flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md">
                                <Heart size={16} className="inline mr-2" />
                                Favourite Service Providers
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </span>
                            </li>
                          </ul>
                        </Panel>
                      </Collapse>
                    </li>

                    <li className="mb-5">
                      <Link
                        to="/client/new-job"
                        onClick={toggleMobileOpen}
                        className="flex items-center gap-2"
                      >
                        <CreditCard size={16} /> Post A Job
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                      </Link>
                    </li>

                    <hr className="my-2" />
                  </ul>
                )}

                {auth.isAuthenticated && auth.isProvider && (
                  <ul className=" text-gray-700 space-y-3">
                    {/* Account Actions */}
                    <li className="mb-5 mt-5">
                      <Link
                        onClick={toggleMobileOpen}
                        to="/job-posting"
                        className="flex items-center gap-2"
                      >
                        <UserCheck size={16} /> Find Jobs
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                      </Link>
                    </li>
                    <li className="mb-5">
                      <Collapse ghost expandIconPosition="end">
                        <Panel
                          header={
                            <div className="flex text-[16px] items-center gap-y-2">
                              <Sun size={16} className="inline mr-2" /> My Jobs
                              <span className="rounded bg-gray-100 inline-block ml-auto"></span>
                            </div>
                          }
                          key="my-jobs"
                        >
                          <ul className="space-y-1">
                            <li
                              onClick={toggleMobileOpen}
                              className="font-medium text-gray-900 py-2 text-sm rounded-md mb-2 w-full"
                            >
                              <Link
                                to={"/provider/manage-jobs"}
                                className="block"
                              >
                                Manage Your Jobs
                              </Link>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-2"></li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/provider/manage-jobs#Pending"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <Clipboard size={16} className="inline mr-2" />
                                Pending Offers
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/provider/manage-jobs#Negotiating"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <MessageCircle
                                  size={16}
                                  className="inline mr-2"
                                />
                                Ongoing Negotiation
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/provider/manage-jobs#Ongoing"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <Loader size={16} className="inline mr-2" />
                                Ongoing Jobs
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li onClick={toggleMobileOpen}>
                              <Link
                                to={"/provider/manage-jobs#Completed"}
                                className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                              >
                                <CheckCircle
                                  size={16}
                                  className="inline mr-2"
                                />
                                Completed Jobs
                                <span className="rounded px-1 bg-gray-100 dark:bg-gray-700 inline-block ml-2 text-xs"></span>
                              </Link>
                            </li>
                            <li className="border-t border-gray-200 dark:border-gray-700 my-2"></li>
                            <li onClick={toggleMobileOpen}>
                              <span className=" !hidden flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md">
                                Customize Job Alert
                                <ArrowUpRight
                                  className="inline ml-2"
                                  size={18}
                                />
                              </span>
                            </li>
                          </ul>
                        </Panel>
                      </Collapse>
                    </li>
                    <li className="mb-5">
                      <Link
                        onClick={toggleMobileOpen}
                        to="/"
                        className="flex items-center gap-2"
                      >
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
                      <Link
                        onClick={toggleMobileOpen}
                        to="/myprofile"
                        className="flex items-center gap-2"
                      >
                        <UserCheck size={16} /> Profile
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                      </Link>
                    </li>
                    <li className="mb-5">
                      <Link
                        onClick={toggleMobileOpen}
                        to="/wallet"
                        className="flex items-center gap-2"
                      >
                        <Wallet size={16} /> Wallet & Transactions
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                      </Link>
                    </li>
                    <li className="mb-5">
                      <Link
                        onClick={toggleMobileOpen}
                        to="/transactions"
                        className="flex items-center gap-2"
                      >
                        <CreditCard size={16} />
                        Transactions
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
                      </Link>
                    </li>
                    <li className="mb-5">
                      <Link
                        onClick={toggleMobileOpen}
                        to="/bookings"
                        className="flex items-center gap-2"
                      >
                        <Clipboard size={16} /> Bookings & Orders
                        <span className="rounded px-1 bg-gray-100 inline-block ml-auto"></span>
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
                        onClick={() => {
                          auth.logout();
                          toggleMobileOpen();
                        }}
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
                    {/*
  
                    <li className="mb-8 text-gray-700">
                      <Link onClick={toggleMobileOpen} to={"/activities"}>
                        Activities
                      </Link>
                    </li>
  */}

                    <li className="mb-8 text-gray-700">
                      <Link
                        onClick={toggleMobileOpen}
                        to={"/service-providers"}
                      >
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
      </section>
    </header>
  );
};

export default Header;
