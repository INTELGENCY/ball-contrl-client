import React from "react";

const ShippingDetails = ({ shippingDetails, handleInputChange }) => {
  return (
    <div className="">
      <h1 className="text-[20px] font-medium pb-[16px]">Shipping address</h1>
      <form className="flex flex-col gap-[15px] py-2">
        <input
          type="text"
          className="w-full border-[2px] border-gray-300 px-2 py-1"
          name="name"
          value={shippingDetails.name}
          placeholder="Full Name"
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="w-full border-[2px] border-gray-300 px-2 py-1"
          name="addressLine1"
          value={shippingDetails.address.line1}
          placeholder="Address Line 1"
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="w-full border-[2px] border-gray-300 px-2 py-1"
          name="addressLine2"
          value={shippingDetails.address.line2}
          placeholder="Address Line 2"
          onChange={handleInputChange}
        />
        <input
          type="text"
          className="w-full border-[2px] border-gray-300 px-2 py-1"
          name="city"
          value={shippingDetails.city}
          placeholder="City"
          onChange={handleInputChange}
        />
        <div className="flex justify-between gap-[24px]">
          <input
            type="text"
            className="w-[50%] border-[2px] border-gray-300 px-2 py-1"
            name="country"
            value={shippingDetails.country}
            placeholder="Country"
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="w-[50%] border-[2px] border-gray-300 px-2 py-1"
            name="state"
            value={shippingDetails.state}
            placeholder="State"
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-between gap-[24px]">
          <input
            type="text"
            className="w-[50%] border-[2px] border-gray-300 px-2 py-1"
            name="zip"
            value={shippingDetails.zip}
            placeholder="Postal Code"
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="w-[50%] border-[2px] border-gray-300 px-2 py-1"
            name="phone"
            value={shippingDetails.phone}
            placeholder="Phone"
            onChange={handleInputChange}
          />
        </div>
      </form>
    </div>
  );
};

export default ShippingDetails;
