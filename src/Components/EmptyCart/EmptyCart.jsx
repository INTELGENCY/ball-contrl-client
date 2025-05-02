import React from "react";
import { BsCartPlusFill } from "react-icons/bs";
const EmptyCart = () => {
  return (
    <div className=" mt-10">
      <div className="flex flex-col justify-center w-[100%] md:w-[70%] mx-auto ">
        <div className="flex items-center justify-center">
          <span className="flex items-center justify-center border-2 w-[115px] border-[#2fa2f3] h-[105px] rounded-full">
            <BsCartPlusFill color="#2fa2f3" size={70} />
          </span>
        </div>
        <h1 className="uppercase py-5 font-semibold text-[26px] text-center">
          Your cart is empty. let's change that!
        </h1>
        <p className="text-center">
          Browse our awesome store,{" "}
          <span className="text-[#2fa2f3]">start shopping now!</span> Checkout
          our <span className="text-[#2fa2f3]">best sellers</span>, catch the
          last of our
          <span className="text-[#2fa2f3]">
            {" "}
            final clearance products
          </span> and{" "}
          <span className="text-[#2fa2f3]">join our mailing list</span> to stay
          in the loop about new releases.
        </p>
      </div>
    </div>
  );
};

export default EmptyCart;
