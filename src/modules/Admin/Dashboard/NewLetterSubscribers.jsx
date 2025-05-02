import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const NewLetterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showTextAreaModal, setShowTextAreaModal] = useState(false); // Track text area modal state
  const [subscriberToDelete, setSubscriberToDelete] = useState(null);
  const [message, setMessage] = useState(""); // State for the message to send
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setFetchLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/newsletter/subscribers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch subscribers");
        }

        const data = await response.json();
        setSubscribers(data);
        setFetchLoading(false);
      } catch (error) {
        setFetchLoading(false);
        console.error("Error fetching subscribers:", error);
      }
    };

    fetchSubscribers();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_URL
        }/newsletter/subscribers/${subscriberToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Remove the deleted subscriber from the state
        setSubscribers((prevSubscribers) =>
          prevSubscribers.filter(
            (subscriber) => subscriber._id !== subscriberToDelete
          )
        );
      } else {
        console.error("Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
    } finally {
      // Close the modal
      setShowModal(false);
      setSubscriberToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSendUpdates = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/newsletter/sendUpdates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }), // Sending the message to the server
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send updates");
      }

      const data = await response.json();
      alert(data.message); // Show success message
      setShowTextAreaModal(false); // Close the modal
    } catch (error) {
      console.error("Error sending updates:", error);
    }
  };

  if (fetchLoading)
    return (
      <div className="w-full h-[600px] flex justify-center items-center">
        <ClipLoader color="#FEB7DC" size={45} />;
      </div>
    );

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between mb-4 flex-col sm:flex-row">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900 shrink-0">
          Newsletter Subscribers
        </h1>
        <button
          className={`bg-main-accent hover:bg-main-darker text-white px-4 py-2 rounded-md ${
            subscribers.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setShowTextAreaModal(true)}
          disabled={subscribers.length === 0}
        >
          Send Updates
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {subscribers.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right">
            <thead>
              <tr className="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-light">
                  #
                </th>
                {/* <th scope="row" className="px-6 py-4">
                  Name
                </th> */}
                <th scope="row" className="px-6 py-4">
                  Email
                </th>
                <th className="py-2 px-4 border-b">Subscribed On</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber._id} className="text-gray-900">
                  <td className="px-6 py-4 border-b">{index + 1}</td>
                  {/* <td className="px-6 py-4 border-b">{subscriber.name}</td> */}
                  <td className="px-6 py-4 border-b">{subscriber.email}</td>
                  <td className="px-6 py-4 border-b">
                    {formatDate(subscriber.createdAt)}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSubscriberToDelete(subscriber._id);
                      }}
                      className="text-red-300 hover:text-red-800 hover:scale-110 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="font-light text-sm p-5 shadow-none">
            No subscribers found!
          </p>
        )}
      </div>

      {/* Text Area Modal */}
      {showTextAreaModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50 backdrop-blur"
            onClick={() => setShowTextAreaModal(false)}
          ></div>
          <div className="bg-gray-100 rounded-lg shadow-lg p-8 z-10 w-11/12 max-w-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Send Updates
            </h2>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-md mb-4 bg-gray-100"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setShowTextAreaModal(false)} // Close button
                className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSendUpdates}
                className="px-4 py-2 bg-main-accent text-white rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-gray-200 rounded-md p-6 z-10 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this subscriber?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLetterSubscribers;
