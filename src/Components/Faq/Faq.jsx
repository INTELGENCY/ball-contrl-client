import React, { useState } from "react";

const faqData = [
  {
    question:
      "Do I need a coaching qualification to coach with Ballcontrl; FA or UEFA?",
    answer: (
      <>
        Yes you need to be qualified to Join Ballcontrl. If you do not please
        click this link to obtain your qualification
        <a
          href="https://learn.englandfootball.com/ongoing-learning/Initiatives/female-coach-development"
          target="_blank"
          rel="noopener noreferrer"
          className="text-main-darker underline"
        >
          https://learn.englandfootball.com/ongoing-learning/Initiatives/female-coach-development
        </a>
        . Once you become qualified, come back to us and we will get you started
        to offer players your lessons.
      </>
    ),
  },
  {
    question: "What DBS level do I need to coach with BallContrl?",
    answer: "We require all coaches to have enhanced DBS.",
  },
  {
    question: "Commission",
    answer: (
      <>
        We take a nominal fee of 18%, this is a commission used to help promote
        the platform to new users via various online channels and keeps the
        platform and staff working hard to push womens' and girl's football.
      </>
    ),
  },
  {
    question: "Are there any additional fees on ballcontrl.com?",
    answer: (
      <>
        We have no other hidden costs for you to worry about. In order to keep
        the platform alive and provide players for you to coach. We take a
        nominal commission fee on each booking received. Please see commission
        structure on
        <a href="/" className="text-main-darker underline">
          commission page
        </a>
        .
      </>
    ),
  },
  {
    question: "Can I contact users before any booking?",
    answer: (
      <>
        We do not allow contact details of users to be shared until after a
        booking is accepted. This entails no phone numbers, email addresses, web
        or social media channels and other communication to be shared outside of
        this platform. This is in place to protect data of players, coaches and
        parents. If we suspect or see that details have been exchanged before a
        booking on your account, we will suspend your account and there will be
        an investigation which could lead to your account being terminated.
      </>
    ),
  },
  {
    question: "How do I sign up?",
    answer: "It is completely free to sign and list your services.",
  },
  {
    question: "How do I get paid?",
    answer: (
      <>
        Get paid by completing a coaching session, you will be able see your
        payments on your dashboard. Once you are paid and completed your
        training, payments are set up to arrive in your account the next day.
      </>
    ),
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-0 bg-light-blue md:max-w-6xl m-auto">
      <div className="flex justify-center items-start my-2 mx-8 2xl:mx-0">
        <div className="w-full my-1">
          <h2 className="text-3xl font-semibold my-5 text-center text-gray-900">
            Frequently <span className="text-main-dark">Asked</span> questions
          </h2>
          <ul className="flex flex-col">
            {faqData.map((faq, index) => (
              <li key={index} className="bg-white my-2 border border-gray-300">
                <h2
                  onClick={() => handleToggle(index)}
                  className={`flex flex-row justify-between items-center font-semibold p-3 cursor-pointer text-gray-900 ${
                    openIndex === index ? "bg-main-dark text-white" : ""
                  }`}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`fill-current text-main-darker h-6 w-6 transform transition-transform duration-500 ${
                      openIndex === index
                        ? "rotate-180 text-white"
                        : "text-main-darker"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                  </svg>
                </h2>
                <div
                  className={`border-l-2 border-main-dark overflow-hidden max-h-0 duration-500 transition-all ${
                    openIndex === index ? "max-h-screen" : ""
                  }`}
                >
                  <p className="p-3 text-gray-900">{faq.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
