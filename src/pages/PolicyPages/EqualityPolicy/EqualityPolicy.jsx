import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import equality_icon from "../../../assets/WebP/equality 1.webp";

const EqualityPolicy = () => {
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
        {loading ? <Skeleton height={200} /> : <img src={equality_icon} className="w-full" alt="equality_image" />}
        <h1 className="absolute bottom-10 left-36 text-[50px] text-white">{loading ? <Skeleton width={200} height={50} /> : "Equality Policy"}</h1>
      </div>
      <div className="w-[80%] mx-auto">
        {/* ---------- */}
        <div className="flex flex-col gap-[18px]">
          {loading ? (
            <>
              <Skeleton height={40} width={400} />
              <Skeleton count={4} height={20} />
              <Skeleton count={2} height={20} />
            </>
          ) : (
            <>
              <h1 className="text-[24px] cook pt-10 uppercase text-[#FD86C8] font-semibold">
                The aim of Ball Contrl Equality Policy is so that staff, coaches, players and other people engaged with the organisation are treated fairly and
                with respect.
              </h1>
              {/* ---------- */}
              <div className="cookies flex flex-col gap-[1px]">
                <p>Adhere to this policy and to the requirements of the Equality Act 2010.</p>
                <p>
                  By promoting inclusion and to confronting and eliminating discrimination in respect of the following ‘Protected Characteristics’ outlined
                  within the Equality Act 2010;
                </p>
              </div>
              {/* -------------- */}
              <div className="cookies">
                <li>Age</li>
                <li>Disability</li>
                <li>Sex</li>
                <li>Gender Reassignment</li>
                <li>Marriage and Civil Partnership</li>
                <li>Pregnancy and Maternity</li>
                <li>Race</li>
                <li>Religion or Belief</li>
                <li>Sexual Orientation</li>
              </div>
              {/* -------------- */}
              <p className="cookies">
                All staff, players, and other people engaged with the organisation’s activities can be assured of an environment in which their rights, dignity
                and individual worth are respected, and that they are able to engage with the organisation in an environment free from discrimination.
              </p>
              {/* ------------ */}
              <div className="cookies">
                <h1 className="text-[20px] font-semibold pb-2">Discriminatory Behaviour:</h1>
                <p>
                  All forms of discriminatory behaviour, including, but not limited to behaviour described in the 'Relevant legislation and forms of
                  unacceptable discrimination' (below) as unacceptable, and is concerned to ensure that individuals feel able to raise any genuine grievance or
                  complaint related to such behaviour without fear of being penalised for doing so and will be fully supported.
                </p>
              </div>
              {/* ------------- */}
              <p className="cookies">
                Should any person(s) believe they have been treated in a way which is thought to be in breach of this policy the incident should be reported
                directly to us.
              </p>
              {/* ------------------ */}
              <p className="cookies">
                Discriminatory behaviours and promoting equality and inclusion in football. We understand the importance of raising awareness, education,
                investigating concerns and complaints, widening diversity and opportunities for under-represented groups and individuals, as well as promoting
                diverse role models.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EqualityPolicy;
