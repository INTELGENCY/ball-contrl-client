import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import safeguard_icon from "../../../assets/WebP/safeguard 1.webp"

const SafeGuardPolicy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="relative">
        {loading ? <Skeleton height="70vh" /> : <img src={safeguard_icon} className="w-full h-[70vh]" alt="safeguard_image" />}
        <h1 className="absolute bottom-10 left-36 text-white text-[50px]">{loading ? <Skeleton width={200} height={50} /> : "SafeGuard Policy"}</h1>
      </div>
      {/* -------------- */}
      <div className="w-[80%] pt-4 mx-auto">
        <div>
          {loading ? (
            <>
              <Skeleton height={30} width={300} />
              <Skeleton count={3} height={20} />
              <Skeleton count={3} height={20} />
            </>
          ) : (
            <>
              <h1 className="text-[24px] cook pt-10 uppercase pb-7 text-[#FD86C8] font-semibold">
                Our entire team of staff and coaches are/will be committed to the safeguarding and welfare of the entire Girls community.
              </h1>
              <p className="py-3 cookies">
                Ball Contrl seek to ensure that children and young people are participating in safe and protected environments. It is priority of the coaches to
                safeguard the emotional and physical wellbeing of each individual that is coached under their supervision. This includes, but is not limited to,
                taking the right measures and procedures to ensure that:
              </p>
              <li className="py-2 cookies">
                The coaches will safeguard all children and young people taking part in coaching sessions from physical, sexual or emotional harm and they
                should be able to take part in an enjoyable and safe environment and be protected from poor practice and abuse;
              </li>
              <li className="py-2 cookies">
                all children and young people without exception are protected from abuse regardless of their age, gender, disability, race, ethnicity, sexual
                orientation, faith or beliefs;
              </li>
              <li className="py-2 cookies">
                reasonable steps are taken to ensure that through appropriate procedures and training, children participating in Organisation’s activities do so
                in a safe environment and welcoming environment, where children can have fun and develop their skills and confidence;
              </li>
            </>
          )}
        </div>
        {/* ------ under 18 --------- */}
        <div className="pt-14 cookies pb-4">
          {loading ? (
            <>
              <Skeleton height={30} width={150} />
              <Skeleton count={3} height={20} />
              <Skeleton count={1} height={20} width={200} />
            </>
          ) : (
            <>
              <h1 className="text-[#FD86C8] text-[29px]">Under 18?</h1>
              <p className="py-4">Childline offers free, confidential advice and support whatever your worry, whenever you need help - </p>
              <p className="py-4">0800 1111.</p>
              <p className="py-4">Please remember that if a child or young person is in immediate danger, ALWAYS call 999.</p>
              <div className="flex gap-2 py-4">
                <p>For any enquiries relating to DBS checks and verification, please contact </p>
                <p className="text-[#0068B2]">safeguarding@londonfa.com</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafeGuardPolicy;
