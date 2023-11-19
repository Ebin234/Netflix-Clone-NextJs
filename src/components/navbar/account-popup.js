"use client";

import {NETFLIX_USER_ICON} from "@/utils/constants"

export default function AccountPopup({
  accounts,
  setLoggedInAccount,
  signOut,
  loggedInAccount,
  setPageLoader,
}) {

  return (
    <div className="px-8 py-8 fixed top-[50px] gap-3 flex flex-col items-start right-[45px] bg-black opacity-[0.85] z-[999]">
      <div className="flex flex-col gap-3">
        {accounts?.length>0
          ? accounts
              .filter((item) => item._id !== loggedInAccount._id)
              .map((account) => (
                <div
                  onClick={() => {
                    setLoggedInAccount(null);
                    sessionStorage.removeItem("loggedInAccount");
                  }}
                  key={account._id}
                  className="cursor-pointer flex gap-5"
                >
                  <img
                    src={NETFLIX_USER_ICON}
                    alt="Current Profile"
                    className="max-w-[30px] rounded min-w-[20px] max-h-[30px] min-h-20px object-cover w-[30px] h-[30px]"
                  />
                  <p className="mb-4">{account?.name}</p>
                </div>
              ))
          : null}
      </div>
      <div>
        <button
          onClick={() => {
            setPageLoader(true);
            signOut();
            setLoggedInAccount(null);
            sessionStorage.removeItem("loggedInAccount");
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
