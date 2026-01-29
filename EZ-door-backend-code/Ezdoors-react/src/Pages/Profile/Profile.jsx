import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProfile } from "../../Thunks/Thunks";
import Loader from "../../Utility/Loader/Loader";

export default function Profile() {
  const dispatch = useDispatch();
  const webData = useSelector((state) => state.auth?.web_data);
  const profile = useSelector((state) => state.auth.profile);
  console.log(profile);
  const profileLoading = useSelector(
    (state) => state?.apiStatus?.loading?.getProfile
  );
  const handleProfile = () => {
    dispatch(getProfile());
  };

  useEffect(() => {
    handleProfile();
  }, []);
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {profileLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex items-center space-x-6">
              <img
                src={webData?.mediaUrl + webData?.data?.logo || ""}
                alt="Profile Picture"
                className="rounded-full w-24 h-24 object-contain border border-gray-300"
              />
              <div>
                <h2 className="text-2xl font-bold">{profile?.user?.name}</h2>
                <p className="text-gray-600">{profile?.user?.email}</p>
                {/* <button class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Edit
                          Profile</button> */}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Personal Information
                </h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <strong>Full Name:</strong> {profile?.user?.name}
                  </li>
                  <li>
                    <strong>Phone:</strong> +91 {profile?.user?.phone}
                  </li>
                  {/* <li>
                    <strong>Address:</strong> 123 Luxury Lane, Mumbai, MH 400001
                  </li> */}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>
                    <Link
                      to="/change-password"
                      className="text-red-600 hover:underline"
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manage-address"
                      className="text-red-600 hover:underline"
                    >
                      Manage Addresses
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/manage-order"
                      className="text-red-600 hover:underline"
                    >
                      Order History
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => localStorage.clear()}
                      to="/"
                      className="text-red-600 hover:underline"
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
