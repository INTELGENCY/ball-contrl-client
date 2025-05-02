import React from 'react'
import apple_pay from "../../assets/Store/pay_apple.png";
import visa_pay from "../../assets/Store/Visa_pay.png";
import mastercard_pay from "../../assets/Store/mastercard.png";
import discover_pay from "../../assets/Store/discover_pay.png";
import amex_pay from "../../assets/Store/amex_pay.png";
import paypal_pay from "../../assets/Store/paypal_pay.png";

const ExpressCheckout = () => {
  return (
    <div className='pb-[69px]'>
      <div>
        <h1 className="pb-4 text-[20px]">Express checkout</h1>
        <div className="flex items-center justify-start gap-[16px]">
          <div className=" flex items-center  justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={apple_pay} className="w-full" alt="" />
          </div>
          <div className="flex items-center justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={amex_pay} className="w-full" alt="" />
          </div>
          <div className="flex items-center  justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={paypal_pay} className="w-full" alt="" />
          </div>
          <div className="flex items-center  justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={mastercard_pay} className="w-full" alt="" />
          </div>
          <div className="flex items-center  justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={discover_pay} className="w-full" alt="" />
          </div>
          <div className="flex items-center  justify-center w-[94px] h-[52px] p-2 border-2">
            <img src={visa_pay} className="w-full" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpressCheckout