"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

function Profile() {
  const name = useAuthStore((state) => state.name);
  const department = useAuthStore((state) => state.department);
  const email = useAuthStore((state) => state.email);
  const phone = useAuthStore((state) => state.phone);
  const govId = useAuthStore((state) => state.govId);
  const lastLogin = useAuthStore((state) => state.last_login);

  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const logoutUser = () => {
    logout();
    router.push("/login");
  }

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                My Profile
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Manage your personal information and security settings.
              </p>
            </div>

            {/* Profile Box */}
            <div className="rounded-2xl border border-gray-200 p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="rounded-lg hover:bg-gray-500 px-4 py-2 text-sm font-medium text-white bg-black transition:bg-color duration-300 cursor-pointer transition-colors"
                >
                  Logout
                </button>
              </div>

              {/* Two column layout */}
              <div className="flex flex-wrap -mx-6">
                {/* Left column */}
                <div className="w-full md:w-1/2 px-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {name || "-"}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {email || "-"}
                    </p>
                  </div>

                  {/* Last Login */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Last Login
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {lastLogin instanceof Date ? lastLogin.toLocaleString() : lastLogin || "Not available"}
                    </p>

                  </div>
                </div>

                {/* Right column */}
                <div className="w-full md:w-1/2 px-6 space-y-6">
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Department
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {department || "-"}
                    </p>
                  </div>

                  {/* Gov ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Gov ID
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {govId || "-"}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <p className="mt-1 text-base text-gray-900 font-semibold">
                      {phone || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Security Section */}
            <div className="rounded-2xl border border-gray-200 p-10 mt-10">
              <h2 className="text-2xl font-semibold text-gray-900">Security</h2>
              <p className="mt-3 text-sm text-gray-600">
                Change your password to keep your account secure.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
