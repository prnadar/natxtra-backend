import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EditAddressSchema } from "../../Utility/ValidationSchema/Validation";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  defaultBillingAddress,
  deleteAddress,
  getAddress,
  getDefaultBillingAddress,
  updateAddress,
} from "../../Thunks/Thunks";
import { add } from "date-fns";
import Loader from "../../Utility/Loader/Loader";

export default function ManageAddress() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(EditAddressSchema),
  });
  const dispatch = useDispatch();
  const billing_address = useSelector(
    (state) => state.auth.billing_address?.data
  );
  console.log("billing_address", billing_address);

  const [editingAddressId, setEditingAddressId] = useState(null);
  const loading = useSelector(
    (state) => state.auth.loading?.getAddress ?? false
  );
  console.log("loading", loading);
  const btnLoader = useSelector((state) =>
    editingAddressId
      ? state.auth.loading?.updateAddress ?? false
      : state.auth.loading?.addAddress ?? false
  );

  const deleteBtnLoader = useSelector(
    (state) => state.auth.loading?.deleteAddress ?? false
  );

  const [selectedBillingId, setSelectedBillingId] = useState(null); // Track selected billing address

  const getBillingAddress = async () => {
    await dispatch(getAddress()).unwrap();
  };

  useEffect(() => {
    getBillingAddress();
  }, []);

  const handleEdit = async (id) => {
    setEditingAddressId(id);
    const address = billing_address.find((address) => address._id === id);
    console.log("address", address);
    const data = {
      billing_id: address._id,
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      address_type: address.address_type || "",
    };
    reset(data);
  };

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);

    if (editingAddressId) {
      console.log("editingAddressId", editingAddressId);
      await dispatch(
        updateAddress({ data, buttonKey: "updateAddress" })
      ).unwrap();
      reset({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "shipping",
      });
      getBillingAddress();
      setEditingAddressId("");
      return;
    } else {
      await dispatch(addAddress({ data, buttonKey: "addAddress" })).unwrap();
      reset({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        address_type: "shipping",
      });
      getBillingAddress();
      setEditingAddressId("");
    }
  };

  const handleDelete = async (id) => {
    await dispatch(deleteAddress({ id, buttonKey: "deleteAddress" })).unwrap();
    if (selectedBillingId === id) {
      setSelectedBillingId(null); // Clear selection if deleted address was selected
    }
    getBillingAddress();
  };

  const handleCancel = () => {
    setEditingAddressId(null);
    reset({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      address_type: "shipping",
    });
  };

  const handleBillingSelect = async (id) => {
    if (selectedBillingId === id) return; // Prevent re-selection of the same address
    setSelectedBillingId(id);
    await dispatch(
      defaultBillingAddress({ id, buttonKey: "defaultBillingAddress" })
    ).unwrap();
    getBillingAddress();
  };

  const getDefaulBillingAddress = async () => {
    try {
      const response = await dispatch(getDefaultBillingAddress()).unwrap();
      if (response?.data?._id) {
        setSelectedBillingId(response.data._id); // Set default billing address if exists
      } else if (billing_address?.length > 0 && !selectedBillingId) {
        // Set first address as default if no default exists
        setSelectedBillingId(billing_address[0]._id);
        await dispatch(
          defaultBillingAddress({
            id: billing_address[0]._id,
            buttonKey: "defaultBillingAddress",
          })
        ).unwrap();
      }
    } catch (err) {
      console.error("Error fetching default billing address:", err);
    }
  };

  useEffect(() => {
    getDefaulBillingAddress();
  }, [billing_address]);

  return (
    <section>
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-neutral-800">
          Manage Addresses
        </h1>
        {/* Address Cards */}
        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {billing_address?.map((address) => (
              <div
                key={address._id}
                className="bg-white p-6 rounded-lg shadow border border-gray-200 relative"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-800">
                      {address.address_type === "shipping"
                        ? "Shipping Address"
                        : "Delivery Address"}
                    </h2>
                    <p className="text-sm text-neutral-600 mt-2">
                      {address?.name},
                      <br />
                      {address.address},
                      <br />
                      {address.city}, {address.state} {address.pincode}
                      <br />
                      Phone: {address.phone}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="billingAddress"
                        checked={selectedBillingId === address._id}
                        onChange={() => handleBillingSelect(address._id)}
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-neutral-700">
                        Set as Billing Address
                      </span>
                    </label>
                    <div className="flex space-x-2 justify-end">
                      <button
                        onClick={() => handleEdit(address._id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="text-sm text-neutral-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Add New Address Form */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800">
            {editingAddressId ? "Edit Address" : "Add New Address"}
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                placeholder="John Doe"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                placeholder="+919876543210"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Address*
              </label>
              <textarea
                id="address"
                {...register("address")}
                rows={3}
                placeholder="123 Luxury Lane"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                City*
              </label>
              <input
                type="text"
                id="city"
                {...register("city")}
                placeholder="Mumbai"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                State*
              </label>
              <input
                type="text"
                id="state"
                {...register("state")}
                placeholder="MH"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.state ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.state.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Pincode*
              </label>
              <input
                type="text"
                id="pincode"
                {...register("pincode")}
                placeholder="400001"
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              />
              {errors.pincode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pincode.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="address_type"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Address Type*
              </label>
              <select
                id="address_type"
                {...register("address_type")}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.address_type ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150`}
              >
                <option value="shipping">Shipping</option>
                <option value="delivery">Delivery</option>
              </select>
              {errors.address_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.address_type.message}
                </p>
              )}
            </div>
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                className={`mt-4 w-full py-2 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 focus:outline-none focus:ring-2 
    ${
      btnLoader
        ? "bg-red-400 text-white cursor-not-allowed opacity-60"
        : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    }`}
                disabled={btnLoader}
              >
                {btnLoader && <i className="fas fa-spinner fa-spin mr-2"></i>}
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
              {editingAddressId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-neutral-800 py-2 rounded-md font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </section>
  );
}
