"use client";

import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import CircleLoader from "../circle-loader";
import CreateAccountForm from "./createAccount-form";
import { TrashIcon } from "@heroicons/react/24/outline";
import PinContainer from "./pin-container";
import { usePathname, useRouter } from "next/navigation";
import {NETFLIX_USER_ICON} from "@/utils/constants"

const initialFormData = {
  name: "",
  pin: "",
};

export default function ManageAccounts() {
  const {
    accounts,
    setAccounts,
    pageLoader,
    setPageLoader,
    setLoggedInAccount,
  } = useContext(GlobalContext);
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  const [showForm, setShowForm] = useState(false);
  const [showRemoveIcon, setShowRemoveIcon] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [createAccountError, setCreateAccountError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPinContainer, setShowPinContainer] = useState({
    show: false,
    account: null,
  });

  async function getAllAccounts() {
    const res = await fetch(
      `/api/account/get-all-accounts?id=${session?.user?.uid}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
      setAccounts(data?.data);
      setPageLoader(false);
  }

  useEffect(() => {
    getAllAccounts();
  }, []);

  async function handleSave() {
    setCreateAccountError(false);
    const res = await fetch("/api/account/create-account", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        uid: session?.user?.uid,
      }),
    });

    const data = await res.json();

    if (data.success) {
      getAllAccounts();
      setFormData(initialFormData);
      setShowForm(false);
    } else {
      getAllAccounts();
      setCreateAccountError(true);
      setErrorMsg(data.message)
    }
  }

  async function handleRemoveAccount(account) {
    const res = await fetch(`/api/account/remove-account?id=${account._id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      getAllAccounts();
      setShowRemoveIcon(false);
    }
  }

  async function handlePinSubmit(value, index) {
    setPageLoader(true);
    const res = await fetch("/api/account/login-to-account", {
      method: "POST",
      headers: {
        "conent-Type": "application/json",
      },
      body: JSON.stringify({
        uid: session?.user?.uid,
        accountId: showPinContainer.account._id,
        pin: value,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setLoggedInAccount(showPinContainer.account);
      sessionStorage.setItem(
        "loggedInAccount",
        JSON.stringify(showPinContainer.account)
      );
      if (pathName.includes("my-list")) {
        router.push(
          `/my-list/${session?.user?.uid}/${showPinContainer.account?._id}`
        );
      }else{
      router.push(pathName);
      }
      setPageLoader(false);
    } else {
      setPageLoader(false);
      setPinError(true);
      setPin("");
    }
  }

  if (pageLoader) return <CircleLoader />;

  return (
    <div className="min-h-screen flex justify-center flex-col items-center relative">
      <div className="flex justify-center flex-col items-center">
        <h1 className=" text-white  font-bold text-[54px] my-[36px]">
          Who's Watching ?
        </h1>
        {createAccountError && <h3 className="text-red-600">{errorMsg}</h3>}
        <ul className="flex p-0 my-[25px]">
          {accounts?.length>0
            ? accounts.map((item) => (
                <li
                  className="max-w-[200px] w-[155px] cursor-pointer flex flex-col items-center gap-3 min-w-[200px]"
                  key={item.id}
                  onClick={
                    showRemoveIcon
                      ? null
                      : () => setShowPinContainer({ show: true, account: item })
                  }
                >
                  <div className="relative">
                    <img
                      src={NETFLIX_USER_ICON}
                      alt="Account"
                      className="max-w-[200px] rounded min-w-[84px] max-h-[200px] min-h-[84px] object-cover w-[155px] h-[155px]"
                    />
                    {showRemoveIcon && (
                      <div
                        onClick={() => handleRemoveAccount(item)}
                        className="absolute top-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-10 cursor-pointer"
                      >
                        <TrashIcon width={30} height={30} color="black" />
                      </div>
                    )}
                  </div>
                  <span className="mb-4">{item.name}</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-icon svg-icon-profile-lock ltr-0 e1mhci4z1"
                    data-name="Lock"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7 6C7 3.23858 9.23858 1 12 1C14.7614 1 17 3.23858 17 6V7H19C20.1046 7 21 7.89543 21 9V18.6529C21 19.6274 20.2885 20.4855 19.2814 20.6076C18.0287 20.7593 15.492 21 12 21C8.50801 21 5.97128 20.7593 4.71855 20.6076C3.71153 20.4855 3 19.6274 3 18.6529V9C3 7.89543 3.89543 7 5 7H7V6ZM15 6V7H9V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6ZM5 9V18.627C6.19927 18.7708 8.63769 19 12 19C15.3623 19 17.8007 18.7708 19 18.627V9H5ZM11 12V16H13V12H11Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </li>
              ))
            : null}
          {accounts?.length < 4 ? (
            <li
              className="border text-white bg-[#e5b109} font-bold text-lg border-black max-w-[200px] rounded min-w-[84px] max-h-[200px] min-h-[84px] w-[155px] h-[155px] cursor-pointer flex justify-center items-center"
              onClick={() => setShowForm(!showForm)}
            >
              Add Account
            </li>
          ) : null}
        </ul>
        <div className="text-center">
          <span
            className="border border-gray-100 cursor-pointer tracking-wide inline-flex text-sm px-[1.5em] py-[0.5em]"
            onClick={() => setShowRemoveIcon(!showRemoveIcon)}
          >
            Manage Profiles
          </span>
        </div>
      </div>
      <PinContainer
        pin={pin}
        setPin={setPin}
        pinError={pinError}
        setPinError={setPinError}
        showPinContainer={showPinContainer.show}
        setShowPinContainer={setShowPinContainer}
        handlePinSubmit={handlePinSubmit}
      />
      <CreateAccountForm
        formData={formData}
        setFormData={setFormData}
        showForm={showForm}
        handleSave={handleSave}
      />
    </div>
  );
}
