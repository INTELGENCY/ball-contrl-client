// import React, { useEffect, useState } from "react";
// import { CiHeart } from "react-icons/ci";
// import { BsHeartFill } from "react-icons/bs";
//  import simple_heart from "../../assets/png/Heart.png"
// import red_heart  from "../../assets/png/HeartRed.png"

// const StoreItem = (props) => {
//   const handleAddToCart = () => {
//     const item = {
//       id: props.id,
//       image: props.image,
//       name: props.name,
//       new_price: props.new_price,
//       old_price: props.old_price,
//       category: props.category,
//     };
//     props.add(item);
//   };
  

//   const [propsData, setPropsData] = useState({
//     id: props.id,
//     image: props.image,
//     name: props.name,
//     new_price: props.new_price,
//     old_price: props.old_price,
//     category: props.category,
//   });

//   const [wishlistitem, setWishListItem] = useState({
//     id: "",
//     name: "",
//     image: "",
//     old_price: "",
//     new_price: "",
//     category:""
//   })

// // console.log("pros data state ",propsData);
//   console.log("props", props);
//   // --
  
//   const handleWishlist = async (id) => {
//     // if (!currentUser) {
//     //   toast.error("Kindly Login to your account");
//     //   return;
//     // }
    
//     if (props.id === id) {
//       setWishListItem(propsData);
//     }

//     console.log("wishlist item", wishlistitem);
//     console.log("this is wish id", id);
//     // const isInWishlist = wishlist.some((wishItem) => wishItem.id === item.id);

//     // if (isInWishlist) {
//     //   dispatch(removeFromWishlist(item.id));
//     //   await fetch("/api/wish/removewishlist", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify(propsData),
//     //   });
//     // } else {
//     //   dispatch(addToWishlist(item));
//     //   await fetch("/api/wish/createwishlist", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({}),
//     //   });
//     // }
//   };

//   return (
//     <div className="w-[250px] p-4 rounded-lg border-2 hover:border-[#6B6565] hover:scale-105 hover:transition-transform hover:ease-in-out hover:duration-500">
//       <div className="flex justify-end">
//         <button
//           onClick={
//            ()=> handleWishlist(props.id)
//           }
//         >
//           {props.isInWishlist ? <img src={red_heart} alt="red_heart" /> : <img src={ simple_heart} alt="simple_heart" />}
//         </button>
//       </div>
//       <img src={props.image} alt={props.name} />
//       <p className="my-[6px] mx-0">{props.name}</p>
//       <div className="flex gap-[20px]">
//         <p className="new-price text-[#374151] text-[18px] font-semibold">${props.new_price}</p>
//         {props.old_price && <p className="old-price text-[#8c8c8c] text-[18px] font-medium line-through">${props.old_price}</p>}
//       </div>
//       <div className="border-2 border-black mt-1 hover:border-black mx-auto rounded-md py-1 flex hover:bg-[#FD86C8] justify-center">
//         <button onClick={handleAddToCart}>Add to Cart</button>
//       </div>
//     </div>
//   );
// };

// export default StoreItem;







