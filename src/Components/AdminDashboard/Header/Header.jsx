import storeCart from "../../../assets/images/storecart.svg";
import storeCartGreen from "../../../assets/images/storecartgreen.svg";
import storecartBlack from "../../../assets/images/storecartBlack.svg";

const Header = () => {
  return (
    <div className="mt-8">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="w-[30%]">
          <p className="text-2xl font-medium">Ball Cntrl</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between w-full gap-5">
          {/* ------ card 1 ------- */}
          <div className="flex justify-between border border-gray-300 p-3 rounded-lg flex-shrink-0">
            <div className="flex flex-col">
              <p className="text-gray-800 mb-1">Total Booking</p>
              <p className="font-bold text-gray-900 text-lg">683</p>
              <p className="text-gray-800 text-sm">
                <span className="text-green-500">+1.70%</span> since last six
                months
              </p>
            </div>
            <div className="">
              <img src={storeCart} alt="" />
            </div>
          </div>
          {/* ------ card 2 ------- */}
          <div className="flex border justify-between border-gray-300 p-3 rounded-lg flex-shrink-0">
            <div className="flex flex-col">
              <p className="text-gray-800 mb-1">Active Bookings</p>
              <p className="font-bold text-gray-900 text-lg">300</p>
              <p className="text-gray-800 text-sm">
                <span className="text-green-500">+1.70%</span> since last six
                months
              </p>
            </div>
            <div className="">
              <img src={storeCartGreen} alt="" />
            </div>
          </div>
          {/* ------ card 3 ------- */}
          <div className="flex border justify-between border-gray-300 p-3 rounded-lg flex-shrink-0">
            <div className="flex flex-col">
              <p className="text-gray-800 mb-1">Completed Sessions</p>
              <p className="font-bold text-gray-900 text-lg">73</p>
              <p className="text-gray-800 text-sm">
                <span className="text-green-500">+1.70%</span> since last six
                months
              </p>
            </div>
            <div className="">
              <img src={storecartBlack} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
